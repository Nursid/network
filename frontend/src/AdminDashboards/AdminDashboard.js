import React, { Fragment, useState } from "react";
import "./AdminDashboard.css";
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter,GridToolbarColumnsButton } from "@mui/x-data-grid";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import AdminNavItems from "./Elements/AdminNavItems";
import AdminDataTable from "./Elements/AdminDataTable";
import { useUserRoleContext } from "../Context/RolesContext";
import { useMediaQuery } from '@mui/material';

const AdminDashboard = () => {
  // Mobile responsiveness hooks
  const isMobile = useMediaQuery('(max-width:768px)');
  const isSmallMobile = useMediaQuery('(max-width:480px)');

  const { userRole } = useUserRoleContext();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const orders = [
    {
      id: 1,
      cust_name: "John Doe",
      vc_no: "1234567890",
      address: "1234567890",
      mobileno: "1234567890",
    },
    {
      id: 2,
      cust_name: "John Doe",
      vc_no: "1234567890",
      address: "1234567890",
      mobileno: "1234567890",
    },
  ];

  const DataWithID = (data) => {
    const NewData = [];
    if (data !== undefined) {
      for (let item of data) {
        NewData.push({
          ...item,
          _id: data.indexOf(item),
        });
      }
    } else {
      NewData.push({ id: 0 });
    }
    return NewData;
  }; 

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

  const columns = [
    { 
      field: "_id", 
      headerName: "ID",
      minWidth: isSmallMobile ? 40 : 150,
      hide: isSmallMobile,
      editable: false 
    },
    { 
      field: "cust_name", 
      headerName: isMobile ? "Customer" : "Customer Name",
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 1 : 0,
      editable: false 
    },
    { 
      field: "vc_no", 
      headerName: isMobile ? "Voucher" : "Voucher No", 
      minWidth: isMobile ? 100 : 120,
      editable: false,
      hide: isSmallMobile
    },
    { 
      field: "address", 
      headerName: "Address", 
      minWidth: isMobile ? 100 : 120,
      editable: false,
      hide: isMobile
    },
    { 
      field: "mobileno", 
      headerName: isMobile ? "Mobile" : "Mobile No",
      minWidth: isMobile ? 100 : 150,
      editable: false,
      renderCell: (params) => (
        <span style={{ 
          color: '#007bff', 
          fontWeight: '500',
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          {params.value}
        </span>
      )
    },
  ];

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
            width: isMobile ? '100%' : `calc(100% - ${sidebarCollapsed ? '80px' : '280px'})`,
            marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px'),
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa',
            transition: 'width 0.3s ease, margin-left 0.3s ease',
            padding: isMobile ? '70px 10px 10px 10px' : '0'
          }}
        >
          {/* Header Section with Gradient Background */}
          <div 
            className="flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0 0 20px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              margin: isMobile ? '0' : '10px',
              marginBottom: '20px'
            }}
          >
            <div className={`d-flex align-items-center ${isMobile ? 'flex-column text-center' : 'justify-content-between'}`} style={{ padding: isMobile ? '20px 15px' : '24px' }}>
              <div className={isMobile ? 'mb-3' : ''}>
                <h4 className='text-white mb-1' style={{ 
                  fontWeight: '600', 
                  fontSize: isMobile ? '1.25rem' : '1.5rem' 
                }}>
                  📊 All Order List
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  Manage and track all customer orders
                </p>
              </div>

              <div className="d-flex gap-3">
                <div
                  className="btn btn-light d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                  style={{ 
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    fontSize: isMobile ? '0.8rem' : '1rem'
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
                  <span>➕</span>
                  {isMobile ? 'Add Order' : 'Add New Order'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Table Section */}
          <div className="flex-grow-1" style={{ 
            padding: isMobile ? '0 5px 10px 5px' : '0 16px 16px 16px',
            overflow: 'hidden' 
          }}>
            <AdminDataTable
              rows={DataWithID(orders)}
              CustomToolbar={CustomToolbar}
              columns={columns}
              pageSize={isMobile ? 10 : 25}
              density={isMobile ? 'compact' : 'standard'}
              sx={{
                '& .MuiDataGrid-root': {
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                },
                '& .MuiDataGrid-cell': {
                  padding: isMobile ? '4px 8px' : '8px 16px',
                },
                '& .MuiDataGrid-columnHeader': {
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: '600',
                  padding: isMobile ? '4px 8px' : '8px 16px',
                }
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminDashboard;
