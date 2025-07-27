require("dotenv").config();
const db = require("../../model/index");
const EmployeeModel = db.EmployeeModel;
const DepartmentModel = db.DepartmentsModel
const DesignationModel = db.DesignationModel
const Empservices = db.Empservices
const ServiceProviderModel = db.ServiceProviderModel
const CustomerModel = db.CustomerModel
const jwt = require("jsonwebtoken");
const {isEmail, isMobileNumber, isOptValid} = require("../utils");
const SupervisorAvailability = db.SupervisorAvailability;

// Add the Service Provider
const AddEmployee = async (req, res) => {
	
	try {
		const data = req.body;

		
		if(req.files){
		const {pan_image, adhar_image, image} = req.files;
		data.pan_image = pan_image ? pan_image[0].filename : null;
		data.adhar_image = adhar_image ? adhar_image[0].filename : null;
		data.image = image ? image[0].filename : null;
		}
		
		console.log(data.mobile_no);
		// Check if user with the provided mobile number already exists
		const isUser = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile_no
			}
		});

		if (isUser) {
			return res.status(202).json({status: 202, message: "Employee Already Registered with this Mobile No."});
		}

		const isServiceProvider = await ServiceProviderModel.findOne({
			where:{
				mobile_no: data.mobile_no
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Service Provider!'});
		}

		const isCustomer = await CustomerModel.findOne({
			where:{
				mobile: data.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
		}


		// Find the last employee to generate the next employee ID
		const lastEmp = await EmployeeModel.findOne({
			order: [
				['id', 'DESC']
			]
		});

		let nextEmpId;
		if (lastEmp) {
		const lastEmpId = parseInt(lastEmp.emp_id.replace("EMP", ""), 10); // Convert to an integer
		nextEmpId = "EMP" + String(lastEmpId + 1).padStart(4, '0'); // Pad the number with leading zeros
		} else { // If no employee found in the database, start with EMP0001
		nextEmpId = "EMP0001";
		}
		data.emp_id = nextEmpId;

		// Create the new employee
		const empData = await EmployeeModel.create(data);

		if (! empData) { // If employee creation failed
			return res.status(400).json({status: 400, error: true, message: "Failed to register employee. Please try again."});
		}


		return res.status(200).json({status: true, message: "Employee Added Successfully!"});
	} catch (error) { // If an unexpected error occurs
		return res.status(500).json({
			status: false,
			error: true,
			message: "Internal server error." + error.message
		});
	}
};

const roles = {
	admin: "Admin",
	office: "Back Office",
	supervisor: "Superviser"
};

const LoginEmployee = async (req, res) => {
	const {number, otp, otpid} = req.query;
	const {logger} = req.params;
	try {
		// Validate input parameters
		if (!number || !otp || !otpid) {
			return res.status(400).json({error: true, message: "Missing required parameters: number, otp, or otpid"});
		}

		if (!logger) {
			return res.status(400).json({error: true, message: "Logger parameter is required"});
		}

		const isVerified = await isOptValid(otp, otpid);
		if (!isVerified) {
			return res.status(400).json({error: true, message: "Otp Expired or Invalid"});
		}
		
		// Find the user with proper error handling
		const isUser = await EmployeeModel.findOne({
			include: [
				{
					model: DesignationModel,
					required: true // Ensure designation exists
				},
				{
					model: DepartmentModel,
					required: false
				}
			],
			where: {
				mobile_no: number,
				is_block: false // Only allow non-blocked users
			}
		});

		if (!isUser) {
			return res.status(404).json({error: true, message: "No user found with this mobile number"});
		}

		// Check if designation exists
		if (!isUser.designation) {
			return res.status(400).json({error: true, message: "User designation not found"});
		}

		// Validate user role
		if (isUser.designation.name !== roles[logger]) {
			return res.status(403).json({error: true, message: `Please login as ${roles[logger]}. Your role is ${isUser.designation.name}`});
		}

		// Prepare user data without sensitive information
		const userData = {
			id: isUser.id,
			emp_id: isUser.emp_id,
			name: isUser.name,
			mobile_no: isUser.mobile_no,
			email: isUser.email,
			image: isUser.image,
			designation: isUser.designation,
			department: isUser.department,
			address: isUser.address,
			doj: isUser.doj,
			salary: isUser.salary,
			week_off: isUser.week_off,
			duty_hours: isUser.duty_hours,
			gender: isUser.gender,
			about: isUser.about
		};

		res.status(200).json(userData);
	} catch (error) {
		console.error('LoginEmployee Error:', error);
		res.status(500).json({
			error: true,
			message: "Internal server error",
			details: error.message
		});
	}
};


// delete the data by id
const DeleteTheEmployeeData = async (req, res) => {
	const id = req.params.id;

	try {
		const isDeleted = await EmployeeModel.destroy({
			where: {
				emp_id: id
			}
		});
		if (! isDeleted) 
			return res.status(400).json({error: true, message: "Not deleted try Again"});
		


		res.status(200).json({status: 200, message: "Deleted Successfully"});
	} catch (error) {
		res.status(500).json({error});
	}
};

// Delete all
const DeleteAllEmployeeData = async (req, res) => {
	try {
		const isDeleted = await EmployeeModel.deleteMany({});
		if (isDeleted) {
			res.status(200).json({error: false, message: "Deleted Successfully"});
		} else {
			res.status(400).json({error: true, message: "Not deleted"});
		}
	} catch (error) {
		res.status(500).json({error});
	}
};

// get all the service provider

const GetAllEmployeeData = async (req, res) => {

	try {
		const result = await EmployeeModel.findAll({
			order: [
				['id', 'DESC']
			]
		});

		if (!result) {
			return res.status(200).json({error: false, data: []});
			}		

		return res.status(200).json({error: false, data: result});

	} catch (error) {
		return res.status(500).json({error});
	}
};

// get data by id
const GetEmployeeById = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await EmployeeModel.findById(id);
		if (! result) 
			return res.status(404).json({error: true, message: "No User Found"});
		


		res.status(200).json({error: false, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};

const UpdateTheEmployeeData = async (req, res) => {
    const emp_id = req.params.id;
    const data = req.body;

    try {
        // Check if employee exists
        const isEmployee = await EmployeeModel.findOne({
            where: {
                id: emp_id
            }
        });

        if (!isEmployee) {
            return res.status(200).json({ status: false, message: "Employee not found!" });
        }

		const isServiceProvider = await ServiceProviderModel.findOne({
			where:{
				mobile_no: data.mobile_no
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Service Provider!'});
		}

		const isCustomer = await CustomerModel.findOne({
			where:{
				mobile: data.mobile_no
			}
		});

		if (isCustomer) {
			return res.status(200).json({status:false, message: 'Mobile No. Already Exists in Customer!'});
		}

        // Handle file uploads if present
        if (req.files) {
            const { pan_image, adhar_image, image } = req.files;

            if (pan_image && pan_image[0]?.filename) {
                data.pan_image = pan_image[0].filename;
            }

            if (adhar_image && adhar_image[0]?.filename) {
                data.adhar_image = adhar_image[0].filename;
            }

            if (image && image[0]?.filename) {
                data.image = image[0].filename;
            }
        }

        // Update employee data
        const updateResult = await EmployeeModel.update(data, {
            where: {
                id: emp_id
            }
        });

        if (!updateResult || updateResult[0] === 0) {
            return res.status(400).json({ status: false, message: "Employee data not updated!" });
        }

        // Delete existing services
        const existingServices = await Empservices.findAll({
            where: {
                mobile_no: data.mobile_no // Assuming mobile_no is a unique identifier for services
            }
        });

        if (existingServices.length > 0) {
            await Empservices.destroy({
                where: {
                    mobile_no: data.mobile_no
                }
            });
        }

        // Add new services
        if (data.multiServices) {
            const empServiceData = JSON.parse(data.multiServices);
            const addService = await Promise.all(empServiceData.map(async (service) => {
                return Empservices.create({
                    service_name: service,
                    mobile_no: data.mobile_no
                });
            }));
        }

        return res.status(200).json({ status: true, message: "Employee data updated successfully!" });
    } catch (error) {
        return res.status(500).json({ error: true, message: `Internal Server Error: ${error.message}` });
    }
};


// UpdateEmployeeStatus

const UpdateEmployeeStatus = async (req, res) => {
	const user_id = req.params.id
	try {
		const is_block = req.body;

		const isEmployee = await EmployeeModel.findOne({
			where: {
				id: user_id
			}
		});

		if (! isEmployee) {
			res.status(200).json({status: false, message: "User Not Found!"})
		}

		const data = await EmployeeModel.update(is_block, {
			where: {
				id: user_id
			}
		});
		if (data) {
			res.status(200).json({status: true, message: "Block Successfully"})
		}
	} catch (error) {
		res.status(500).json("Internal Server error" + error);
	}
}

const GetAllSupervisor = async (req, res) => {
	try {
		const result = await EmployeeModel.findAll({
			include: [
				{
					model: DepartmentModel

				}, {
					model: DesignationModel
				},
			],
			order: [
				['id', 'DESC']
			],
			where: {
				designation_id: 2,
				is_block: false
			}
		});
		if (! result) 
			return res.status(400).json({error: true, message: "No Data Found"});
		


		res.status(200).json({status: 200, data: result});
	} catch (error) {
		res.status(500).json({error});
	}
};


module.exports = {
	AddEmployee,
	LoginEmployee,
	UpdateTheEmployeeData,
	DeleteTheEmployeeData,
	DeleteAllEmployeeData,
	GetAllEmployeeData,
	GetEmployeeById,
	UpdateEmployeeStatus,
	GetAllSupervisor
};
