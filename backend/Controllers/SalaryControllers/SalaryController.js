const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
// const puppeteer = require('puppeteer'); // Uncomment after installing
// const moment = require('moment'); // Uncomment after installing

// Import models
const db = require('../../model/index');
const SalaryModel = db.SalaryModel;
const EmployeeModel = db.EmployeeModel;

// Create a new salary record
const createSalary = async (req, res) => {
    try {
        const { employee_id, month, year, amount, remarks } = req.body;

        // Validate required fields
        if (!employee_id || !month || !year || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID, month, year, and amount are required'
            });
        }

        // Check if employee exists
        const employee = await EmployeeModel.findByPk(employee_id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if salary record already exists for this month/year
        const existingSalary = await SalaryModel.findOne({
            where: {
                employee_id,
                month,
                year
            }
        });

        if (existingSalary) {
            return res.status(400).json({
                success: false,
                message: 'Salary record already exists for this employee in this month/year'
            });
        }

        // Create salary record
        const salary = await SalaryModel.create({
            employee_id,
            month,
            year,
            amount,
            remarks: remarks || null
        });

        res.status(201).json({
            success: true,
            message: 'Salary record created successfully',
            data: salary
        });

    } catch (error) {
        console.error('Error creating salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all salary records with pagination and filtering
const getAllSalaries = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            employee_id, 
            month, 
            year, 
            is_approved 
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        // Apply filters
        if (employee_id) whereClause.employee_id = employee_id;
        if (month) whereClause.month = month;
        if (year) whereClause.year = year;
        if (is_approved !== undefined) whereClause.is_approved = is_approved === 'true';

        const { count, rows } = await SalaryModel.findAndCountAll({
            where: whereClause,
            include: [{
                model: EmployeeModel,
                as: 'employee',
                attributes: ['id', 'name', 'emp_id', 'email', 'mobile_no']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                salaries: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get salary by ID
const getSalaryById = async (req, res) => {
    try {
        const { id } = req.params;

        const salary = await SalaryModel.findByPk(id, {
            include: [{
                model: EmployeeModel,
                as: 'employee',
                attributes: ['id', 'name', 'emp_id', 'email', 'mobile_no', 'department_id', 'designation_id']
            }]
        });

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: salary
        });

    } catch (error) {
        console.error('Error fetching salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update salary record (only if not approved)
const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, remarks } = req.body;

        const salary = await SalaryModel.findByPk(id);
        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        // Check if already approved
        if (salary.is_approved) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update approved salary record'
            });
        }

        // Update fields
        const updateData = {};
        if (amount !== undefined) updateData.amount = amount;
        if (remarks !== undefined) updateData.remarks = remarks;

        await salary.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Salary record updated successfully',
            data: salary
        });

    } catch (error) {
        console.error('Error updating salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Approve salary and generate PDF
const approveSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved_by } = req.body; // Admin ID who is approving

        const salary = await SalaryModel.findByPk(id, {
            include: [{
                model: EmployeeModel,
                as: 'employee',
                attributes: ['id', 'name', 'emp_id', 'email', 'mobile_no']
            }]
        });

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        if (salary.is_approved) {
            return res.status(400).json({
                success: false,
                message: 'Salary is already approved'
            });
        }

        // Update approval status
        await salary.update({
            is_approved: true,
            approved_by: approved_by || null,
            approved_at: new Date()
        });

        // Generate PDF
        try {
            const pdfPath = await generateSalarySlipPDF(salary);
            // Note: Since we removed pdf_generated and pdf_path fields, 
            // we'll just log the success for now
            console.log('PDF generated:', pdfPath);
        } catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
            // Continue with approval even if PDF generation fails
        }

        res.status(200).json({
            success: true,
            message: 'Salary approved successfully',
            data: salary
        });

    } catch (error) {
        console.error('Error approving salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Download salary slip PDF
const downloadSalarySlip = async (req, res) => {
    try {
        const { id } = req.params;

        const salary = await SalaryModel.findByPk(id);
        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        if (!salary.is_approved) {
            return res.status(400).json({
                success: false,
                message: 'Salary is not approved yet'
            });
        }

        // For now, generate PDF on demand since we removed pdf_path field
        try {
            const salary_with_employee = await SalaryModel.findByPk(id, {
                include: [{
                    model: EmployeeModel,
                    as: 'employee',
                    attributes: ['id', 'name', 'emp_id', 'email', 'mobile_no']
                }]
            });

            const pdfPath = await generateSalarySlipPDF(salary_with_employee);
            
            // For now, just return success message
            res.status(200).json({
                success: true,
                message: 'PDF generated successfully',
                pdfPath: pdfPath
            });

        } catch (pdfError) {
            console.error('Error generating PDF:', pdfError);
            res.status(500).json({
                success: false,
                message: 'Error generating PDF'
            });
        }

    } catch (error) {
        console.error('Error downloading salary slip:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete salary record (only if not approved)
const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;

        const salary = await SalaryModel.findByPk(id);
        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary record not found'
            });
        }

        if (salary.is_approved) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete approved salary record'
            });
        }

        await salary.destroy();

        res.status(200).json({
            success: true,
            message: 'Salary record deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting salary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get salary statistics
const getSalaryStatistics = async (req, res) => {
    try {
        const { year, month } = req.query;
        
        const whereClause = {};
        if (year) whereClause.year = year;
        if (month) whereClause.month = month;

        const totalSalaries = await SalaryModel.count({ where: whereClause });
        const approvedSalaries = await SalaryModel.count({ 
            where: { ...whereClause, is_approved: true } 
        });
        const pendingSalaries = await SalaryModel.count({ 
            where: { ...whereClause, is_approved: false } 
        });

        const totalAmount = await SalaryModel.sum('amount', { where: whereClause }) || 0;
        const approvedAmount = await SalaryModel.sum('amount', { 
            where: { ...whereClause, is_approved: true } 
        }) || 0;

        res.status(200).json({
            success: true,
            data: {
                totalSalaries,
                approvedSalaries,
                pendingSalaries,
                totalAmount,
                approvedAmount,
                pendingAmount: totalAmount - approvedAmount
            }
        });

    } catch (error) {
        console.error('Error fetching salary statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createSalary,
    getAllSalaries,
    getSalaryById,
    updateSalary,
    approveSalary,
    downloadSalarySlip,
    deleteSalary,
    getSalaryStatistics
}; 