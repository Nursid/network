import React, { useState, useEffect } from 'react';
import { Button } from "reactstrap";
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from "@mui/x-data-grid";
import { Fragment } from "react";
import AdminDataTable from "../../Elements/AdminDataTable";
import AdminNavItems from '../../Elements/AdminNavItems';
import { useMediaQuery, useTheme } from '@mui/material';
import { MdAdd, MdEdit, MdDelete, MdPhone, MdEmail } from 'react-icons/md';
import { FaPeopleCarry } from 'react-icons/fa';
import moment from "moment";

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Mock data for now
      setLeads([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+91 9876543210',
          company: 'Tech Solutions Ltd',
          source: 'Website',
          status: 'new',
          assignedTo: 'Sales Team',
          createdAt: '2024-01-10'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+91 9876543211',
          company: 'Digital Marketing Co',
          source: 'Referral',
          status: 'contacted',
          assignedTo: 'Marketing Team',
          createdAt: '2024-01-08'
        }
      ]);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  const getStatusBadge = (status) => {
    const variants = {
      new: 'primary',
      contacted: 'info',
      qualified: 'warning',
      converted: 'success',
      lost: 'danger'
    };
    return <span className={`badge bg-${variants[status] || 'secondary'}`}>{status.toUpperCase()}</span>;
  };

  const leadsColumns = [
    { 
      field: "_id", 
      headerName: "Sr No.", 
      minWidth: isMobile ? 60 : 200,
      flex: isMobile ? 0 : undefined,
      editable: false,
      hide: isSmallMobile
    },
    { 
      field: "name", 
      headerName: "Name", 
      minWidth: isMobile ? 120 : 200,
      flex: isMobile ? 1 : undefined,
      editable: false 
    },
    { 
      field: "email", 
      headerName: "Email", 
      minWidth: isMobile ? 150 : 250,
      flex: isMobile ? 1 : undefined,
      editable: false,
      renderCell: (params) => (
        <div className="d-flex align-items-center">
          <MdEmail size={16} className="me-1" />
          {params.value}
        </div>
      )
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 0 : undefined,
      editable: false,
      renderCell: (params) => (
        <div className="d-flex align-items-center">
          <MdPhone size={16} className="me-1" />
          {params.value}
        </div>
      )
    },
    { 
      field: "company", 
      headerName: "Company", 
      minWidth: isMobile ? 120 : 200,
      flex: isMobile ? 1 : undefined,
      editable: false 
    },
    { 
      field: "source", 
      headerName: "Source", 
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 0 : undefined,
      editable: false 
    },
    { 
      field: "status", 
      headerName: "Status", 
      minWidth: isMobile ? 100 : 120,
      flex: isMobile ? 0 : undefined,
      editable: false,
      renderCell: (params) => getStatusBadge(params.value)
    },
    { 
      field: "assignedTo", 
      headerName: "Assigned To", 
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 0 : undefined,
      editable: false 
    },
    { 
      field: "createdAt", 
      headerName: "Created Date", 
      minWidth: isMobile ? 100 : 150,
      flex: isMobile ? 0 : undefined,
      editable: false,
      renderCell: (params) => moment(params.value).format("DD-MM-YYYY")
    },
    { 
      field: "action", 
      headerName: "Action", 
      minWidth: isMobile ? 80 : 220,
      flex: isMobile ? 0 : undefined,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <div className={`d-flex ${isMobile ? 'justify-content-center' : 'gap-2'}`}>
          <Button 
            variant="contained" 
            color="primary" 
            size="sm"
            style={{
              minWidth: isMobile ? "32px" : "auto",
              maxWidth: isMobile ? "32px" : "auto",
              minHeight: isMobile ? "32px" : "auto",
              maxHeight: isMobile ? "32px" : "auto",
              padding: isMobile ? "4px" : "6px 12px"
            }}
          >
            <MdEdit fontSize={isMobile ? "small" : "medium"} />
          </Button>
          <Button 
            variant="contained" 
            color="danger" 
            size="sm"
            style={{
              minWidth: isMobile ? "32px" : "auto",
              maxWidth: isMobile ? "32px" : "auto",
              minHeight: isMobile ? "32px" : "auto",
              maxHeight: isMobile ? "32px" : "auto",
              padding: isMobile ? "4px" : "6px 12px"
            }}
          >
            <MdDelete fontSize={isMobile ? "small" : "medium"} />
          </Button>
        </div>  
      )
    }
  ];

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

  const DataWithID = (data) => {
    const NewData = []
    if (data !== undefined) {
      for (let item of data) {
        NewData.push({ ...item, _id: data.indexOf(item) + 1 })
      }
    } else {
      NewData.push({ id: 0 })
    }
    return NewData
  }

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
                  👥 Leads Management
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  Manage and track all potential leads and prospects
                </p>
              </div>

              <div className="d-flex gap-2">
                <div
                  className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                  style={{ 
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    fontSize: isMobile ? '0.85rem' : '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <span>➕</span>
                  {isMobile ? 'Add Lead' : 'Add New Lead'}
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
                rows={DataWithID(leads)} 
                CustomToolbar={CustomToolbar} 
                columns={leadsColumns} 
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

export default LeadsManagement; 