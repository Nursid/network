import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';

const AllTransaction = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch account data from API
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/account-listing`); // Adjust API endpoint as needed
                if (response.data.status) {
                    setData(response.data.data);
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
            field: "cust_name", 
            headerName: isMobile ? "Name" : "Customer Name", 
            flex: isMobile ? 1 : 1, 
            minWidth: isMobile ? 120 : 150
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
        { 
            field: "balance", 
            headerName: "Balance", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 120,
            renderCell: (params) => (
                <span className={`fw-bold ${params.value > 0 ? 'text-danger' : 'text-success'}`}>
                    ₹{params.value || 0}
                </span>
            ),
            hide: isSmallMobile
        },
        { 
            field: "trans_id", 
            headerName: isMobile ? "Trans ID" : "Transaction ID", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 100 : 150,
            hide: isSmallMobile
        },
        { 
            field: "partner_emp_id", 
            headerName: isMobile ? "Partner" : "Partner/Emp. ID", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 80 : 140,
            hide: isSmallMobile
        },
        { 
            field: "auto_renew", 
            headerName: isMobile ? "Auto" : "Auto Renew", 
            flex: isMobile ? 0 : 1, 
            minWidth: isMobile ? 60 : 100,
            renderCell: (params) => params.value ? 'Yes' : 'No',
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
                  💰 All Transactions
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  View and manage all account transactions
                </p>
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

export default AllTransaction;
