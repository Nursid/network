import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable'
import { API_URL } from '../../../config';
import './ManageSalary.css';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';

const ManageSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch salaries with filters
    const fetchSalaries = async () => {
        setLoading(true);
        try {
            
            const response = await axios.get(API_URL + "/salary/getall");
            if (response.data.success) {
                setSalaries(response.data.data);
                console.log("salaries---->",response.data.data);
            }
        } catch (error) {
            console.log('Error fetching salaries:', error);     
        }
        setLoading(false);
    };

    // Fetch employees for dropdown
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(API_URL + "/employee/getall"); 
            setEmployees(response.data.data);
        } catch (error) {
            console.log('Error fetching employees:', error);
        }
    };


    console.log("employees---->",employees);

    
    // Approve salary
    const approveSalary = async (salaryId) => {
        if (window.confirm('Are you sure you want to approve this salary?')) {
            try {
                const response = await axios.put(`/salary/${salaryId}/approve`, {
                    approved_by: 1 // Replace with actual admin ID
                });
                if (response.data.success) {
                    fetchSalaries();
                }
            } catch (error) {
                console.log('Error approving salary:', error);
            }
        }
    };


    // Generate month options
    const monthOptions = [
        { value: '', label: 'All Months' },
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    // Generate year options
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
        yearOptions.push({ value: i, label: i });
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Get month name
    const getMonthName = (month) => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[month - 1];
    };

    useEffect(() => {
        fetchSalaries();
        fetchEmployees();
    }, []);

    const handleSidebarToggle = (collapsed) => {
        setSidebarCollapsed(collapsed)
    }

    const DataWithID = (data) => {
        const NewData = []
        if (data !== undefined) {
            for (let item of data) {
                NewData.push({ ...item, _id: data.indexOf(item)+1})
            }
        } else {    
            NewData.push({ id: 0 })
        }
        return NewData
    }

    const column = [
        { 
            field: "_id", 
            headerName: "Sr No", 
            minWidth: isMobile ? 50 : 80, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "employee_name", 
            headerName: "Employee", 
            minWidth: isMobile ? 120 : 150, 
            flex: isMobile ? 1 : undefined,
            editable: false,
            valueGetter: (params) => params.row.employee?.name || 'N/A'
        },
        { 
            field: "employee_id", 
            headerName: isMobile ? "ID" : "Employee ID", 
            minWidth: isMobile ? 80 : 120, 
            editable: false,
            hide: isSmallMobile,
            valueGetter: (params) => params.row.employee?.emp_id || 'N/A'
        },
        { 
            field: "month", 
            headerName: "Month", 
            minWidth: isMobile ? 80 : 100, 
            editable: false,
            hide: isSmallMobile,
            valueGetter: (params) => getMonthName(params.row.month)
        },
        { 
            field: "year", 
            headerName: "Year", 
            minWidth: isMobile ? 60 : 80, 
            editable: false,
            hide: isSmallMobile
        },
        { 
            field: "amount", 
            headerName: "Amount", 
            minWidth: isMobile ? 100 : 120, 
            editable: false,
            renderCell: (params) => (
                <span style={{ 
                    color: '#28a745', 
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}>
                    {formatCurrency(params.row.amount)}
                </span>
            )
        },
        { 
            field: "status", 
            headerName: "Status", 
            minWidth: isMobile ? 80 : 120, 
            editable: false,
            renderCell: (params) => (
                <span 
                    className={`badge ${params.row.is_approved ? 'bg-success' : 'bg-warning'}`}
                    style={{
                        fontSize: isMobile ? '0.7rem' : '0.75rem',
                        padding: isMobile ? '4px 6px' : '6px 8px'
                    }}
                >
                    {params.row.is_approved ? 'Approved' : 'Pending'}
                </span>
            )
        },
        { 
            field: "remarks", 
            headerName: "Remarks", 
            minWidth: 120, 
            editable: false,
            hide: isMobile,
            valueGetter: (params) => params.row.remarks || '-'
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: isMobile ? 80 : 200,
            flex: isMobile ? 0 : undefined,
            editable: false,
            sortable: false,
            renderCell: (params) => (
                <div className="d-flex gap-1">
                    {!params.row.is_approved && (
                        <button 
                            className="btn btn-sm btn-success"
                            onClick={() => approveSalary(params.row.id)}
                            title="Approve Salary"
                            style={{
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                padding: isMobile ? '4px 8px' : '6px 12px',
                                minWidth: isMobile ? '60px' : '80px'
                            }}
                        >
                            {isMobile ? 'Approve' : 'Approve'}
                        </button>
                    )}
                </div>
            )   
        }
    ]

    const [data, setData] = useState([
        {
            id: 1,
            employee_id: 1,
            employee: {
                name: "John Doe",
                emp_id: "EMP001"
            },
            month: 1,
            year: 2025,
            amount: 50000,
            is_approved: false,
            remarks: "Regular monthly salary"
        },
        {
            id: 2,
            employee_id: 2,
            employee: {
                name: "Jane Smith",
                emp_id: "EMP002"
            },
            month: 1,
            year: 2025,
            amount: 60000,
            is_approved: true,
            remarks: "Approved salary with bonus"
        }
    ])

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
                {!isMobile && (
                    <>
                        <GridToolbarColumnsButton />
                        <GridToolbarFilterButton />
                        <GridToolbarExport />
                        <GridToolbarDensitySelector />
                    </>
                )}
            </GridToolbarContainer>
        );
    };

    // Calculate dynamic widths based on screen size and sidebar state
    const getMainContentStyle = () => {
        if (isMobile) {
            return {
                width: '100%',
                marginLeft: 0,
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa',
                paddingTop: '60px' // Space for mobile menu button
            }
        }
        
        return {
            width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa',
            transition: 'width 0.3s ease, margin-left 0.3s ease'
        }
    };

    return (
        <Fragment>
            <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                {/* Left Sidebar - Hidden on mobile */}
                {!isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}
                {isMobile && <AdminNavItems onSidebarToggle={handleSidebarToggle} />}

                {/* Main Content - Dynamic width based on sidebar state */}
                <div
                    className="main-content"
                    style={getMainContentStyle()}
                >
                    {/* Header Section with Gradient Background */}
                    <div 
                        className="flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: isMobile ? '0 0 15px 15px' : '0 0 20px 20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            margin: isMobile ? '0' : '10px',
                            marginBottom: isMobile ? '10px' : '20px'
                        }}
                    >
                        <div className={`d-flex align-items-center ${isMobile ? 'flex-column' : 'justify-content-between'} p-${isMobile ? '3' : '4'}`}>
                            <div className={`${isMobile ? 'text-center mb-3' : ''}`}>
                                <h4 className='text-white mb-1' style={{ 
                                    fontWeight: '600', 
                                    fontSize: isMobile ? '1.2rem' : '1.5rem' 
                                }}>
                                    💰 Salary Management
                                </h4>
                                <p className='text-white-50 mb-0' style={{ 
                                    fontSize: isMobile ? '0.8rem' : '0.9rem' 
                                }}>
                                    Manage and track employee salaries
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className={`${isMobile ? 'px-2' : 'px-4'} mb-3`}>
                        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                            <div 
                                className="card-header bg-light border-bottom-0 d-flex justify-content-between align-items-center" 
                                style={{ 
                                    borderRadius: '15px 15px 0 0',
                                    cursor: isMobile ? 'pointer' : 'default'
                                }}
                                onClick={() => isMobile && setFiltersExpanded(!filtersExpanded)}
                            >
                                <h6 className="m-0 fw-bold text-primary" style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                                    <i className="fas fa-filter me-2"></i>
                                    Filters
                                </h6>
                                {isMobile && (
                                    <i className={`fas fa-chevron-${filtersExpanded ? 'up' : 'down'}`}></i>
                                )}
                            </div>
                            <div 
                                className={`card-body bg-white ${isMobile && !filtersExpanded ? 'd-none' : ''}`} 
                                style={{ borderRadius: '0 0 15px 15px' }}
                            >
                                <div className={`row ${isMobile ? 'g-2' : ''}`}>
                                    <div className={`${isMobile ? 'col-6' : 'col-md-3'} mb-3`}>
                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                            Employee:
                                        </label>
                                        <select 
                                            className="form-select border-1 shadow-sm"
                                            name="employee_id"
                                            style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                                            // value={filters.employee_id} 
                                            // onChange={handleFilterChange}
                                        >
                                            <option value="">All Employees</option>
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.name} ({emp.emp_id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className={`${isMobile ? 'col-6' : 'col-md-3'} mb-3`}>
                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                            Month:
                                        </label>
                                        <select 
                                            className="form-select border-1 shadow-sm"
                                            name="month"
                                            style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                                            // value={filters.month} 
                                            // onChange={handleFilterChange}
                                        >
                                            {monthOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className={`${isMobile ? 'col-6' : 'col-md-3'} mb-3`}>
                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                            Year:
                                        </label>
                                        <select 
                                            className="form-select border-1 shadow-sm"
                                            name="year"
                                            style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                                            // value={filters.year} 
                                            // onChange={handleFilterChange}
                                        >
                                            {yearOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className={`${isMobile ? 'col-6' : 'col-md-3'} mb-3`}>
                                        <label className="form-label fw-semibold text-dark" style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                                            Status:
                                        </label>
                                        <select 
                                            className="form-select border-1 shadow-sm"
                                            name="is_approved"
                                            style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}
                                            // value={filters.is_approved} 
                                            // onChange={handleFilterChange}
                                        >
                                            <option value="">All Status</option>
                                            <option value="true">Approved</option>
                                            <option value="false">Pending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Data Table Section */}
                    <div className={`flex-grow-1 ${isMobile ? 'px-2' : 'px-4'} pb-4`} style={{ overflow: 'hidden' }}>
                        <div style={{ 
                            height: '100%',
                            '& .MuiDataGrid-root': {
                                fontSize: isMobile ? '0.75rem' : '0.875rem'
                            }
                        }}>
                            <AdminDataTable 
                                rows={DataWithID(salaries.length > 0 ? salaries : data)} 
                                columns={column} 
                                CustomToolbar={CustomToolbar}
                                pageSize={isMobile ? 10 : 25}
                                rowsPerPageOptions={isMobile ? [10, 25] : [25, 50, 100]}
                                density={isMobile ? 'compact' : 'standard'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ManageSalary;