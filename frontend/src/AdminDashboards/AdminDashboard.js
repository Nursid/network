import React, { Fragment, useState, useEffect } from "react";
import "./AdminDashboard.css";
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarQuickFilter,GridToolbarColumnsButton } from "@mui/x-data-grid";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";
import AdminDataTable from "./Elements/AdminDataTable";
import { useUserRoleContext } from "../Context/RolesContext";
import { useMediaQuery, Card, CardContent, Typography, Box, Button, Chip, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import AdminNavItems from "./Elements/AdminNavItems";
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
  Error,
  Visibility,
  CalendarToday,
  NetworkCheck,
  Monitor,
  AttachMoney,
  ConfirmationNumber
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

  // Mock data for expiry reports
  const [expiryReport, setExpiryReport] = useState([
    { date: '2025-07-21', connections: 1, daysLeft: 0 },
    { date: '2025-07-22', connections: 1, daysLeft: 1 },
    { date: '2025-07-23', connections: 2, daysLeft: 2 },
    { date: '2025-07-26', connections: 1, daysLeft: 5 },
    { date: '2025-07-30', connections: 3, daysLeft: 9 }
  ]);

  const [expiredReport, setExpiredReport] = useState([
    { date: '2025-07-20', connections: 1, daysPassed: -1 },
    { date: '2025-07-16', connections: 1, daysPassed: -5 },
    { date: '2025-07-15', connections: 3, daysPassed: -6 },
    { date: '2025-07-11', connections: 1, daysPassed: -10 },
    { date: '2025-07-05', connections: 3, daysPassed: -16 }
  ]);

  // Fetch customers and tickets data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customerResponse = await axios.get(`${API_URL}/customer/getall`);
        console.log(customerResponse);
        let customerData = [];
        if (customerResponse.data.status === 200) {
          customerData = customerResponse.data.data;
          console.log("customerData--",customerData);
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


  console.log("financialSummary--",financialSummary);




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
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            transition: 'width 0.3s ease, margin-left 0.3s ease',
            padding: isMobile ? '70px 10px 10px 10px' : '20px'
          }}
        >
          {/* Header Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: isMobile ? '20px 15px' : '24px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div className={`d-flex ${isMobile ? 'flex-column text-center' : 'justify-content-between align-items-center'}`}>
              <div className={isMobile ? 'mb-3' : ''}>
                <h4 className='text-white mb-1' style={{ 
                  fontWeight: '600', 
                  fontSize: isMobile ? '1.25rem' : '1.5rem' 
                }}>
                  Hi Laxdeep System, 
                </h4>
                <p className='text-white-50 mb-0' style={{ 
                  fontSize: isMobile ? '0.8rem' : '0.9rem' 
                }}>
                  Welcome to your service provider dashboard
                </p>
              </div>
              
              {/* Header Actions */}
              {!isMobile && (
                <div className="d-flex gap-2 align-items-center">
                  <select 
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                  <Button
                    variant="text"
                    sx={{ color: 'white', minWidth: 'auto' }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🔔</span>
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: 'white', minWidth: 'auto' }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>👤</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {/* Today's Due Amount Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      backgroundColor: '#1976d2', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px'
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>₹</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#333' }}>
                      ₹0.00
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                    25 Jul
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.875rem' }}>
                  Total Due Amount For Today
                </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                      Amount Collected
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.todayPayments}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#28a745', fontSize: '0.875rem' }}>
                      Online Collection
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.todayPayments}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '0.875rem' }}>
                      Offline Collection
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.todayPayments}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Monthly Due Amount Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      backgroundColor: '#1976d2', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px'
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>₹</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#333' }}>
                      {financialSummary.monthlyRevenue}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                    25 Jul
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '0.875rem' }}>
                  Total Due Amount For The Month
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                      Amount Collected
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.monthlyRevenue}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#28a745', fontSize: '0.875rem' }}>
                      Online Collection
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.monthlyRevenue}
                    </Typography>
                  </Box>  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontSize: '0.875rem' }}>
                      Offline Collection
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {financialSummary.monthlyRevenue}
                    </Typography> 
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>

     {/* Reports Section */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Expiry Report */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#1976d2' }}>
                  Expiry Report
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Expiry Date</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Connections</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Days Left</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expiryReport.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {moment(row.date).format('DD MMM YYYY')}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {row.connections}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {row.daysLeft}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="text"
                              size="small"
                              sx={{ color: '#1976d2', minWidth: 'auto' }}
                            >
                              <Visibility sx={{ fontSize: '1rem' }} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Expired Report */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#f44336' }}>
                  Expired Report
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Expiry Date</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Connections</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Days Passed</TableCell>
                        <TableCell sx={{ fontWeight: '600', fontSize: '0.75rem' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expiredReport.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {moment(row.date).format('DD MMM YYYY')}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {row.connections}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.75rem' }}>
                            {row.daysPassed}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="text"
                              size="small"
                              sx={{ color: '#1976d2', minWidth: 'auto' }}
                            >
                              <Visibility sx={{ fontSize: '1rem' }} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>

          {/* KPI Cards */}
                    <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '20px',
            width: '100%'
          }}>
            {/* Subscribers Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: '#1976d2', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #e0e0e0'
                  }}>
                    <People sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#1976d2', mb: 0.5 }}>
                      {financialSummary.totalCustomers}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: '500' }}>
                      Subscribers Added - Broadband
                    </Typography>
                  </Box>
                </Box>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-fill text-center border p-3  text-secondary">
                  <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#666' }}>{financialSummary.todayCustomers} </span>
                    <span style={{ color: '#666' }}>Today</span>
                    </div>
                  </div>
                  <div className="flex-fill text-center border p-3 text-secondary ">  
                      <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#28a745' }}>{financialSummary.currentMonthCustomers} </span>
                      <span style={{ color: '#28a745' }}>Current Month</span>
                    </div>
                  </div>  
                </div>

              </CardContent>
            </Card>

            {/* Total Connections Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: '#1976d2', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #e0e0e0'
                  }}>
                    <NetworkCheck sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#1976d2', mb: 0.5 }}>
                      {financialSummary.totalConnections}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: '500' }}>
                      Total Connections - Broadband
                    </Typography>
                  </Box>
                </Box>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-fill text-center border p-3  text-secondary">
                  <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#28a745' }}>{financialSummary.activeCustomers} </span>
                    <span style={{ color: '#666' }}>Active</span>
                    </div>
                  </div>
                  <div className="flex-fill text-center border p-3 text-secondary ">  
                      <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#28a745' }}>{financialSummary.inactiveCustomers} </span>
                      <span style={{ color: '#28a745' }}>Inactive</span>
                    </div>
                  </div>  
                </div>
              </CardContent>
            </Card>

            {/* Outstanding Payment Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: '#1976d2', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #e0e0e0'
                  }}>
                    <AttachMoney sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#1976d2', mb: 0.5 }}>
                      {financialSummary.outstandingBalance}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: '500' }}>
                      Current Outstanding & Advance Payment
                    </Typography>
                  </Box>
                </Box>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-fill text-center border p-3  text-secondary">
                  <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#666' }}>{financialSummary.outstandingBalance} </span>
                    <span style={{ color: '#666' }}>Outstanding Balance</span>
                    </div>
                  </div>
                  <div className="flex-fill text-center border p-3 text-secondary ">  
                      <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#28a745' }}>{financialSummary.advancePayment} </span>
                      <span style={{ color: '#28a745' }}>Advance Payment</span>
                    </div>
                  </div>  
                </div>
              </CardContent>
            </Card>

            {/* Today's Tickets Card */}
            <Card sx={{ 
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              width: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: '#1976d2', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #e0e0e0'
                  }}>
                    <ConfirmationNumber sx={{ color: 'white', fontSize: '1.5rem' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: '700', color: '#1976d2', mb: 0.5 }}>
                      0
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontWeight: '500' }}>
                      Total Today's Ticket
                    </Typography>
                  </Box>
                </Box>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-fill text-center border p-3  text-secondary">
                  <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#666' }}>{financialSummary.openTickets} </span>
                    <span style={{ color: '#666' }}>Open</span>
                    </div>
                  </div>
                  <div className="flex-fill text-center border p-3 text-secondary ">  
                      <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#28a745' }}>{financialSummary.closedTickets} </span>
                      <span style={{ color: '#28a745' }}>Closed</span>
                    </div>
                  </div>  
                  <div className="flex-fill text-center border p-3 text-secondary ">  
                      <div className="justify-content-center align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#28a745' }}>{financialSummary.canceledTickets} </span>
                      <span style={{ color: '#28a745' }}>Canceled</span>
                    </div>
                  </div>  
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Footer */}
          {/* <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '20px 0',
            borderTop: '1px solid #e0e0e0',
            marginTop: '20px'
          }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Proudly Made in INDIA
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Powered by <span style={{ color: '#1976d2', fontWeight: '600' }}>TELLYON</span>
            </Typography>
          </div> */}
        </div>
      </div>
    </Fragment>
  );
};

export default AdminDashboard;
