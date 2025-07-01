import React, { Fragment, useState } from "react";
import "./AdminDashboard.css";
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter,GridToolbarColumnsButton } from "@mui/x-data-grid";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import AdminNavItems from "./Elements/AdminNavItems";
import AdminDataTable from "./Elements/AdminDataTable";
import { useUserRoleContext } from "../Context/RolesContext";




const AdminDashboard = () => {

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
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  };

  
  const columns = [
    { field: "_id", headerName: "ID",minWidth: 150,  editable: false },
    { field: "cust_name", headerName: "Customer Name",minWidth: 150,  editable: false },
    { field: "vc_no", headerName: "Voucher No", minWidth: 120,  editable: false,  },
    { field: "address", headerName: "Address", minWidth: 120,  editable: false },
    { field: "mobileno", headerName: "Mobile",minWidth: 150,  editable: false },
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
                  📊 All Order List
                </h4>
                <p className='text-white-50 mb-0' style={{ fontSize: '0.9rem' }}>
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
                  <span>➕</span>
                  Add New Order
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Table Section */}
          <div className="flex-grow-1 px-4 pb-4 " style={{ overflow: 'hidden' }}>
              <AdminDataTable
                rows={DataWithID(orders)}
                CustomToolbar={CustomToolbar}
                columns={columns}
              />
            </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminDashboard;
