import React, { Fragment, useState, useEffect } from "react";
import "./AdminDashboard.css";
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter,GridToolbarColumnsButton } from "@mui/x-data-grid";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import AdminNavItems from "./Elements/AdminNavItems";
import AdminDataTable from "./Elements/AdminDataTable";
import { useUserRoleContext } from "../Context/RolesContext";
import { useMediaQuery, Card, CardContent, Typography, Box, Button, Chip, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';
import moment from 'moment';
import { 
  People, 
  AccountBalance, 
  TrendingUp, 
  Payment, 
  Add, 
  Search, 
  Receipt, 
  WhatsApp,
  Support,
  Assignment,
  Schedule,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

const AdminDashboard = () => {
  // Mobile responsiveness hooks
  const isMobile = useMediaQuery('(max-width:768px)');
  const isSmallMobile = useMediaQuery('(max-width:480px)');

  const { userRole } = useUserRoleContext();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [financialSummary, setFinancialSummary] = useState({
    totalCustomers: 0,
    totalAmount: 0,
    activeCustomers: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
    bankBalance: 0,
    inactiveCustomers: 0,
    todayPayments: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0
  });

  // Fetch customers and tickets data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customerResponse = await axios.get(`${API_URL}/customer/all`);
        let customerData = [];
        if (customerResponse.data.status === 200) {
          customerData = customerResponse.data.data;
          setCustomers(customerData);
        }

        // Fetch tickets
        const ticketResponse = await axios.get(`${API_URL}/api/ticket/getall`);
        let ticketData = [];
        if (ticketResponse.data.success) {
          ticketData = ticketResponse.data.data;
          setTickets(ticketData);
        }
        
        // Calculate financial summary
        const summary = calculateFinancialSummary(customerData, ticketData);
        setFinancialSummary(summary);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateFinancialSummary = (customerData, ticketData) => {
    let totalAmount = 0;
    let activeCustomers = 0;
    let inactiveCustomers = 0;
    let pendingPayments = 0;
    let monthlyRevenue = 0;
    let bankBalance = 0;
    let todayPayments = 0;

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    customerData.forEach(customer => {
      // Calculate total amount from billing
      if (customer.billing_amount) {
        totalAmount += parseFloat(customer.billing_amount);
      }

      // Count active/inactive customers
      if (customer.status === 'active') {
        activeCustomers++;
      } else {
        inactiveCustomers++;
      }

      // Calculate pending payments (customers with balance > 0)
      if (customer.balance && parseFloat(customer.balance) > 0) {
        pendingPayments += parseFloat(customer.balance);
      }

      // Calculate monthly revenue (payments in current month)
      if (customer.account && customer.account.amount) {
        const paymentDate = new Date(customer.account.date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
          monthlyRevenue += parseFloat(customer.account.amount);
        }

        // Calculate today's payments
        if (customer.account.date === todayString) {
          todayPayments += parseFloat(customer.account.amount);
        }
      }

      // Add to bank balance if payment is completed
      if (customer.account && customer.account.recharge_status === 'completed') {
        bankBalance += parseFloat(customer.account.amount || 0);
      }
    });

    // Calculate ticket statistics
    let totalTickets = ticketData.length;
    let openTickets = 0;
    let resolvedTickets = 0;
    let pendingTickets = 0;

    ticketData.forEach(ticket => {
      if (ticket.status === 'open' || ticket.status === 'pending') {
        openTickets++;
      } else if (ticket.status === 'resolved' || ticket.status === 'closed') {
        resolvedTickets++;
      } else {
        pendingTickets++;
      }
    });

    return {
      totalCustomers: customerData.length,
      totalAmount,
      activeCustomers,
      inactiveCustomers,
      pendingPayments,
      monthlyRevenue,
      bankBalance,
      todayPayments,
      totalTickets,
      openTickets,
      resolvedTickets,
      pendingTickets
    };
  };

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

  const customerColumns = [
    { 
      field: "_id", 
      headerName: "ID",
      minWidth: isSmallMobile ? 40 : 150,
      hide: isSmallMobile,
      editable: false 
    },
    { 
      field: "customer_id", 
      headerName: isMobile ? "Cust ID" : "Customer ID",
      minWidth: isMobile ? 80 : 120,
      flex: isMobile ? 0 : 0,
      editable: false,
      renderCell: (params) => (
        <span style={{ 
          color: '#1976d2', 
          fontWeight: '600',
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          {params.value || `ID-${params.row.id}`}
        </span>
      )
    },
    { 
      field: "name", 
      headerName: isMobile ? "Customer" : "Customer Name",
      minWidth: isMobile ? 120 : 150,
      flex: isMobile ? 1 : 0,
      editable: false 
    },
    { 
      field: "mobile", 
      headerName: isMobile ? "Mobile" : "Mobile No",
      minWidth: isMobile ? 100 : 120,
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
    { 
      field: "billing_amount", 
      headerName: isMobile ? "Amount" : "Billing Amount", 
      minWidth: isMobile ? 80 : 120,
      editable: false,
      hide: isSmallMobile,
      renderCell: (params) => (
        <span style={{ 
          color: '#28a745', 
          fontWeight: '600',
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          ₹{params.value || 0}
        </span>
      )
    },
    { 
      field: "balance", 
      headerName: isMobile ? "Balance" : "Account Balance", 
      minWidth: isMobile ? 80 : 120,
      editable: false,
      hide: isSmallMobile,
      renderCell: (params) => (
        <span style={{ 
          color: params.value > 0 ? '#dc3545' : '#28a745', 
          fontWeight: '600',
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          ₹{params.value || 0}
        </span>
      )
    },
    { 
      field: "account", 
      headerName: isMobile ? "Last Pay" : "Last Payment", 
      minWidth: isMobile ? 100 : 120,
      editable: false,
      hide: isMobile,
      renderCell: (params) => {
        const account = params.row.account;
        return (
          <div style={{ fontSize: '0.75rem' }}>
            {account ? (
              <>
                <div style={{ fontWeight: '500', color: '#28a745' }}>
                  ₹{account.amount || 0}
                </div>
                <div style={{ color: '#666', fontSize: '0.7rem' }}>
                  {account.date ? moment(account.date).format("DD-MM-YYYY") : ''}
                </div>
              </>
            ) : (
              <span style={{ color: '#999' }}>No payment</span>
            )}
          </div>
        );
      }
    },
    { 
      field: "payment_method", 
      headerName: isMobile ? "Method" : "Payment Method",
      minWidth: isMobile ? 80 : 120,
      editable: false,
      hide: isSmallMobile,
      renderCell: (params) => (
        <span style={{ 
          backgroundColor: params.value === 'Online' ? '#28a745' : 
                         params.value === 'Cash' ? '#ffc107' : '#6c757d',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {params.value || 'N/A'}
        </span>
      )
    },
    { 
      field: "status", 
      headerName: "Status",
      minWidth: isMobile ? 80 : 100,
      editable: false,
      renderCell: (params) => (
        <span style={{ 
          backgroundColor: params.value === 'active' ? '#28a745' : '#dc3545',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {params.value || 'inactive'}
        </span>
      )
    },
    { 
      field: "address", 
      headerName: "Address", 
      minWidth: isMobile ? 100 : 200,
      editable: false,
      hide: isMobile,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: "pre-line",
          fontSize: isMobile ? '0.7rem' : '0.8rem',
          lineHeight: '1.3',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {params.row.address}
          {params.row.area && <span>, {params.row.area}</span>}
          {params.row.block && <span>, Block {params.row.block}</span>}
        </div>
      )
    },
  ];

  const ticketColumns = [
    { 
      field: "_id", 
      headerName: "ID",
      minWidth: isSmallMobile ? 40 : 80,
      hide: isSmallMobile,
      editable: false 
    },
    { 
      field: "title", 
      headerName: "Ticket Title",
      minWidth: isMobile ? 120 : 200,
      flex: isMobile ? 1 : 0,
      editable: false,
      renderCell: (params) => (
        <div style={{ 
          fontWeight: '600',
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          color: '#1976d2'
        }}>
          {params.value}
        </div>
      )
    },
    { 
      field: "ticketType", 
      headerName: isMobile ? "Type" : "Ticket Type",
      minWidth: isMobile ? 80 : 120,
      editable: false,
      renderCell: (params) => (
        <span style={{ 
          backgroundColor: params.value === 'complaint' ? '#f44336' : 
                         params.value === 'collection' ? '#2196f3' : '#ff9800',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {params.value}
        </span>
      )
    },
    { 
      field: "customer", 
      headerName: "Customer",
      minWidth: isMobile ? 100 : 150,
      editable: false,
      renderCell: (params) => (
        <div style={{ fontSize: '0.75rem' }}>
          <div style={{ fontWeight: '500' }}>
            {params.row.customer?.name || 'N/A'}
          </div>
          <div style={{ color: '#666', fontSize: '0.7rem' }}>
            {params.row.mobileNo}
          </div>
        </div>
      )
    },
    { 
      field: "date", 
      headerName: isMobile ? "Date" : "Created Date",
      minWidth: isMobile ? 80 : 120,
      editable: false,
      hide: isSmallMobile,
      renderCell: (params) => (
        <span style={{ fontSize: '0.75rem' }}>
          {params.value ? moment(params.value).format("DD-MM-YYYY") : ''}
        </span>
      )
    },
    { 
      field: "status", 
      headerName: "Status",
      minWidth: isMobile ? 80 : 100,
      editable: false,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'open': return '#2196f3';
            case 'pending': return '#ff9800';
            case 'resolved': return '#4caf50';
            case 'closed': return '#9e9e9e';
            default: return '#6c757d';
          }
        };
        
        return (
          <span style={{ 
            backgroundColor: getStatusColor(params.value),
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}>
            {params.value || 'pending'}
          </span>
        );
      }
    },
    { 
      field: "technician", 
      headerName: isMobile ? "Tech" : "Technician",
      minWidth: isMobile ? 80 : 120,
      editable: false,
      hide: isSmallMobile,
      renderCell: (params) => (
        <span style={{ 
          color: params.value ? '#28a745' : '#999',
          fontWeight: params.value ? '500' : 'normal',
          fontSize: '0.75rem'
        }}>
          {params.value ? params.row.service_provider?.name || 'Assigned' : 'Unassigned'}
        </span>
      )
    },
    { 
      field: "details", 
      headerName: "Details",
      minWidth: isMobile ? 100 : 200,
      editable: false,
      hide: isMobile,
      renderCell: (params) => (
        <div style={{ 
          fontSize: '0.75rem',
          maxWidth: '180px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {params.value}
        </div>
      )
    },
  ];

  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
                  💰 Customer, Account & Ticket Management
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  Manage customers, track payments, monitor tickets and financial data
                </p>
              </div>
              
              {/* Quick Action Buttons */}
              {!isMobile && (
                <div className="d-flex gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Add Customer
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Support />}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Create Ticket
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div style={{ 
            padding: isMobile ? '0 10px 10px 10px' : '0 16px 16px 16px',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <People sx={{ mr: 1, fontSize: '1.5rem' }} />
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    {financialSummary.totalCustomers}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Customers
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <AccountBalance sx={{ mr: 1, fontSize: '1.5rem' }} />
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    ₹{financialSummary.bankBalance.toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Bank Balance
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Support sx={{ mr: 1, fontSize: '1.5rem' }} />
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    {financialSummary.totalTickets}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Tickets
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
            }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <Warning sx={{ mr: 1, fontSize: '1.5rem' }} />
                  <Typography variant="h4" sx={{ fontWeight: '700' }}>
                    {financialSummary.openTickets}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Open Tickets
                </Typography>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <div style={{ 
            padding: isMobile ? '0 10px 10px 10px' : '0 16px 16px 16px',
            marginBottom: '16px'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People sx={{ fontSize: '1rem' }} />
                    <span>Customers</span>
                  </Box>
                } 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: '500'
                }}
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Support sx={{ fontSize: '1rem' }} />
                    <span>Tickets</span>
                  </Box>
                } 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: '500'
                }}
              />
            </Tabs>
          </div>
          
          {/* Data Table Section */}
          <div className="flex-grow-1" style={{ 
            padding: isMobile ? '0 5px 10px 5px' : '0 16px 16px 16px',
            overflow: 'hidden' 
          }}>
            {activeTab === 0 ? (
              <AdminDataTable
                rows={DataWithID(customers)}
                CustomToolbar={CustomToolbar}
                columns={customerColumns}
                pageSize={isMobile ? 10 : 25}
                density={isMobile ? 'compact' : 'standard'}
                loading={loading}
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
            ) : (
              <AdminDataTable
                rows={DataWithID(tickets)}
                CustomToolbar={CustomToolbar}
                columns={ticketColumns}
                pageSize={isMobile ? 10 : 25}
                density={isMobile ? 'compact' : 'standard'}
                loading={loading}
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
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminDashboard;
