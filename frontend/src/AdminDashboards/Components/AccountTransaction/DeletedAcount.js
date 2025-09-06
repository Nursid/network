import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';
import { FormControl, Select, MenuItem, InputLabel, Box, Button, TextField } from '@mui/material';

const DeletedAcount = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filter states
    const [filters, setFilters] = useState({
        collectedBy: '',
        paymentType: '',
        paymentMethod: '',
        dateFrom: '',
        dateTo: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        collectedBy: [],
        paymentType: [],
        paymentMethod: []
    });

    // Fetch account data from API
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/account-inactive`); // Adjust API endpoint as needed
                if (response.data.status) {
                    setData(response.data.data);
                    // Extract unique values for filter options
                    extractFilterOptions(response.data.data);
                } else {
                    setError('Failed to fetch account data');
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
                setError('Error fetching account data');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, []);

    // Extract unique values for filter dropdowns
    const extractFilterOptions = (data) => {
        const collectedBy = [...new Set(data.map(item => {
            // Use employee name and ID from the direct collectedByEmployee relationship
            if (item.collectedByEmployee?.name && item.collectedByEmployee?.id) {
                return {
                    id: item.collectedByEmployee.id,
                    name: item.collectedByEmployee.name
                };
            }
            return null;
        }).filter(Boolean))];
        
        // Remove duplicates based on ID and sort by name
        const uniqueEmployees = collectedBy.filter((employee, index, self) => 
            index === self.findIndex(e => e.id === employee.id)
        ).sort((a, b) => a.name.localeCompare(b.name));
        
        const paymentTypes = [...new Set(data.map(item => item.payment_mode).filter(Boolean))].sort();
        
        setFilterOptions({
            collectedBy: uniqueEmployees,
            paymentType: paymentTypes,
            paymentMethod: paymentTypes // Using same as payment type for now
        });
    };

    // Apply filters
    const applyFilters = async () => {
        try {
            setLoading(true);
            
            // Validate date range
            if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
                setError('From date cannot be greater than To date');
                setLoading(false);
                return;
            }
            
            // Find the employee ID if collectedBy is selected
            let collectedByValue = filters.collectedBy;
            if (filters.collectedBy && typeof filters.collectedBy === 'object') {
                collectedByValue = filters.collectedBy.id;
            }
            
            const filterData = {
                collectedBy: collectedByValue,
                paymentType: filters.paymentType,
                paymentMethod: filters.paymentMethod,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            };
            
            const response = await axios.post(`${API_URL}/api/filter-transactions`, filterData);
            if (response.data.status) {
                setData(response.data.data);
                setError(null); // Clear any previous errors
            } else {
                setError(response.data.message || 'Failed to filter data');
            }
        } catch (error) {
            console.error('Error filtering data:', error);
            setError('Error filtering data');
        } finally {
            setLoading(false);
        }
    };

    // Reset filters
    const resetFilters = async () => {
        setFilters({
            collectedBy: '',
            paymentType: '',
            paymentMethod: '',
            dateFrom: '',
            dateTo: ''
        });
        
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/account-listing`);
            if (response.data.status) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error resetting filters:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const all_columns = [
        { 
            field: "id", 
            headerName: "ID", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 60 : 80,
            hide: isSmallMobile
        },
        { 
            field: "date", 
            headerName: "Date", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 100 : 120
        },
        { 
            field: "cust_id", 
            headerName: isMobile ? "Cust ID" : "Customer ID", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120
        },
        { 
            field: "customer_name", 
            headerName: isMobile ? "Name" : "Customer Name", 
            flex: isMobile ? 1 : 1, 
            minWidth: isMobile ? 120 : 150,
            renderCell: (params) => {
                // Display customer name from associated data if available, otherwise use cust_name
                return params.row.customer?.name || params.row.cust_name || 'N/A';
            }
        },
        { 
            field: "vc_no", 
            headerName: isMobile ? "Voucher" : "Voucher No.", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            hide: isSmallMobile
        },
        { 
            field: "address", 
            headerName: "Address", 
            flex: 1, 
            minWidth: isMobile ? 150 : 200,
            hide: isSmallMobile
        },
        { 
            field: "amount", 
            headerName: "Amount", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            renderCell: (params) => (
                <span className="fw-bold text-success">
                    ₹{params.value || 0}
                </span>
            )
        },
        { 
            field: "payment_mode", 
            headerName: isMobile ? "Mode" : "Payment Mode", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            hide: isSmallMobile
        },
        // { 
        //     field: "balance", 
        //     headerName: "Balance", 
        //     flex: isMobile ? 0 : 1, 
        //     minWidth: isMobile ? 80 : 120,
        //     renderCell: (params) => (
        //         <span className={`fw-bold ${params.value > 0 ? 'text-danger' : 'text-success'}`}>
        //             ₹{params.value || 0}
        //         </span>
        //     ),
        //     hide: isSmallMobile
        // },
        { 
            field: "trans_id", 
            headerName: isMobile ? "Trans ID" : "Transaction ID", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 100 : 150,
            hide: isSmallMobile
        },
        { 
            field: "collected_by", 
            headerName: isMobile ? "Collected By" : "Collected By", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 100 : 150,
            renderCell: (params) => {
                // Display employee name from the direct collectedByEmployee relationship
                return params.row.collectedByEmployee?.name || 'N/A';
            },
            hide: isSmallMobile
        },
        { 
            field: "recharge_status", 
            headerName: "Status", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 130,
            renderCell: (params) => (
                <span 
                    className={`badge ${
                        params.value === 'Due' ? 'bg-danger' : 
                        params.value === 'Paid' ? 'bg-success' : 
                        'bg-warning'
                    }`}
                    style={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                >
                    {params.value || 'Pending'}
                </span>
            )
        },
    ];

    const DataWithID = (data) => {
        const newData = [];
        if (data && Array.isArray(data)) {
            for (let item of data) {
                newData.push({
                    ...item,
                    _id: item.id || data.indexOf(item),
                    date: item.date ? moment(item.date).format(isMobile ? "DD/MM/YY" : "DD-MM-YYYY") : 'N/A',
                    // Ensure associated data is properly accessible
                    customer: item.customer || {},
                    // Use the direct employee relationship
                    collectedByEmployee: item.collectedByEmployee || {}
                });
            }
        }
        return newData.reverse();
    }

    const CustomToolbar = () => (
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

    const handleSidebarToggle = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
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
            <div className={`d-flex align-items-center justify-content-between p-${isMobile ? '3' : '4'}`}>
              <div>
                <h4 className='text-white mb-1' style={{ 
                  fontWeight: '600', 
                  fontSize: isMobile ? '1.2rem' : '1.5rem' 
                }}>
                  💰 Deleted Account
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  View and manage all deleted account
                </p>
              </div>
            </div>
          </div>
          
          {/* Filter Section */}
          <div className={`${isMobile ? 'px-2' : 'px-4'} mb-3`}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: isMobile ? '15px' : '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0" style={{ fontWeight: '600', color: '#333' }}>
                  🔍 Filter Transactions
                </h6>
                <div>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={resetFilters}
                    style={{ marginRight: '10px' }}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={applyFilters}
                    disabled={loading}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    {loading ? 'Applying...' : 'Apply Filters'}
                  </Button>
                </div>
              </div>
              
              {/* Error Display */}
              {error && (
                <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.875rem' }}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {/* Results Count */}
              <div className="mb-3">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Found {data.length} transaction{data.length !== 1 ? 's' : ''}
                </small>
              </div>
              
              <div className={`${isMobile ? 'row g-2' : 'row g-3'}`}>
                                 {/* Collected By Filter */}
                 <div className={`${isMobile ? 'col-6' : 'col-md-3'}`}>
                   <FormControl fullWidth size="small">
                     <InputLabel>Collected By</InputLabel>
                     <Select
                       value={filters.collectedBy || ""}
                       label="Collected By"
                       onChange={(e) => handleFilterChange('collectedBy', e.target.value)}
                       renderValue={(selected) => {
                         if (!selected) return "All";
                         if (typeof selected === 'object' && selected.name) {
                           return selected.name;
                         }
                         return "All";
                       }}
                     >
                       <MenuItem value="">All</MenuItem>
                       {filterOptions.collectedBy.map((option) => (
                         <MenuItem key={option.id} value={option}>
                           {option.name}
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
                 </div>

                {/* Payment Type Filter */}
                <div className={`${isMobile ? 'col-6' : 'col-md-3'}`}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                      value={filters.paymentType}
                      label="Payment Type"
                      onChange={(e) => handleFilterChange('paymentType', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {filterOptions.paymentType.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Payment Method Filter */}
                <div className={`${isMobile ? 'col-6' : 'col-md-3'}`}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={filters.paymentMethod}
                      label="Payment Method"
                      onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {filterOptions.paymentMethod.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Date Range Filters */}
                <div className={`${isMobile ? 'col-6' : 'col-md-3'}`}>
                  <TextField
                    fullWidth
                    size="small"
                    label="From Date"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className={`${isMobile ? 'col-6' : 'col-md-3'}`}>
                  <TextField
                    fullWidth
                    size="small"
                    label="To Date"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
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
                rows={DataWithID(data)}
                CustomToolbar={CustomToolbar}
                columns={all_columns}
                loading={loading}
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

export default DeletedAcount;
