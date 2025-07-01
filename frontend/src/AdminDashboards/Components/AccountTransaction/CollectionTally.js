import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, GridToolbarQuickFilter } from '@mui/x-data-grid';
import AdminDataTable from '../../Elements/AdminDataTable';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config';
import AdminNavItems from '../../Elements/AdminNavItems';


const CollectionTally = () => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Fetch account data from API - filtered for collections
    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/account-listing`);
                if (response.data.status) {
                    // Filter for collection records (you can adjust this filter based on your business logic)
                    const collectionData = response.data.data.filter(item => 
                        item.payment_mode && item.amount > 0
                    );
                    setData(collectionData);
                } else {
                    setError('Failed to fetch collection data');
                }
            } catch (error) {
                console.error('Error fetching collection data:', error);
                setError('Error fetching collection data');
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, []);

    const all_columns = [
        { field: "id", headerName: "ID", flex: 1, minWidth: 80 },
        { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
        { field: "cust_id", headerName: "Customer ID", flex: 1, minWidth: 120 },
        { field: "cust_name", headerName: "Customer Name", flex: 1, minWidth: 150 },
        { field: "vc_no", headerName: "Voucher No.", flex: 1, minWidth: 120 },
        { field: "address", headerName: "Address", flex: 1, minWidth: 200 },
        { 
            field: "amount", 
            headerName: "Amount", 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => `₹${params.value || 0}`
        },
        { field: "payment_mode", headerName: "Payment Mode", flex: 1, minWidth: 120 },
        { 
            field: "balance", 
            headerName: "Balance", 
            flex: 1, 
            minWidth: 120,
            renderCell: (params) => `₹${params.value || 0}`
        },
        { field: "trans_id", headerName: "Transaction ID", flex: 1, minWidth: 150 },
        { field: "partner_emp_id", headerName: "Partner/Emp. ID", flex: 1, minWidth: 140 },
        { 
            field: "auto_renew", 
            headerName: "Auto Renew", 
            flex: 1, 
            minWidth: 100,
            renderCell: (params) => params.value ? 'Yes' : 'No'
        },
        { 
            field: "recharge_status", 
            headerName: "Recharge Status", 
            flex: 1, 
            minWidth: 130,
            renderCell: (params) => (
                <span 
                    className={`badge ${
                        params.value === 'Due' ? 'bg-danger' : 
                        params.value === 'Paid' ? 'bg-success' : 
                        'bg-warning'
                    }`}
                >
                    {params.value || 'Pending'}
                </span>
            )
        }
    ];

    const DataWithID = (data) => {
        const newData = [];
        if (data && Array.isArray(data)) {
            for (let item of data) {
                newData.push({
                    ...item,
                    _id: item.id || data.indexOf(item),
                    date: item.date ? moment(item.date).format("DD-MM-YYYY") : 'N/A',
                });
            }
        }
        return newData.reverse();
    }

    const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarQuickFilter />
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );

    const handleSidebarToggle = (isCollapsed) => {
        setSidebarCollapsed(isCollapsed);
    };

    return (
        <Fragment>
<div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
        {/* Left Sidebar - Dynamic width */}
        <AdminNavItems onSidebarToggle={handleSidebarToggle} />

        {/* Main Content - Dynamic width based on sidebar state */}
        <div
          className="main-content"
          style={{
            width: `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa',
            transition: 'width 0.3s ease, margin-left 0.3s ease'
          }}
        >
          {/* Header Section with Gradient Background */}
          <div 
            className="flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              margin: '10px',
              marginBottom: '20px'
            }}
          >
            <div className='d-flex align-items-center justify-content-between p-4'>
              <div>
                <h4 className='text-white mb-1' style={{ fontWeight: '600', fontSize: '1.5rem' }}>
                  📊 Collection Tally
                </h4>
                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
                  View collection summary and reports
                </p>
              </div>

              {/* <div className="d-flex gap-3">
                <div
                  className="btn btn-light d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                  style={{ 
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                  // onClick={() => customerTypeOpenFunction(!customerTypeOpen)}
                >
                  <span>📈</span>
                  Generate Report
                </div>
              </div> */}
            </div>
          </div>
          
          {/* Data Table Section */}
          <div className="flex-grow-1 px-4 pb-4 " style={{ overflow: 'hidden' }}>
              <AdminDataTable
                rows={DataWithID(data)}
                CustomToolbar={CustomToolbar}
                columns={all_columns}
              />
            </div>
        </div>
      </div>
        </Fragment>
    );
};

export default CollectionTally;
