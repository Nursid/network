import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import * as FaIcons from "react-icons/fa";
import moment from 'moment';
import classnames from 'classnames';
import { API_URL } from '../../../../../config';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  Receipt, 
  Payment, 
  CalendarToday,
  CheckCircle, 
  AccessTime
} from '@mui/icons-material';

const RechargeLog = ({ data }) => {

  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch billing details when dialog opens
  useEffect(() => {
      if (data?.customer_id) {
          fetchBillingDetails();
      }
  }, [data?.customer_id]);

  const fetchBillingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch(`${API_URL}/customer/get-billing-details`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  customer_id: data?.customer_id
              })
          });

          const result = await response.json();
          
          if (result.status) {
              setBillingData(result.data);
          } else {
              setError(result.message || 'Failed to fetch billing details');
          }
      } catch (err) {
          console.error('Error fetching billing details:', err);
          setError('Failed to fetch billing details. Please try again.');
      } finally {
          setLoading(false);
      }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
};



  return (
    <Card className="shadow-sm mb-4" style={{ border: '1px solid #28a745',  }}>
      <CardHeader className="bg-light justify-content-between align-items-center">
        <h5 className="mb-0 text-center w-100">Recharge Log</h5>
      </CardHeader>
      <CardBody className="p-0">
      {!loading && !error && billingData.length > 0 && (
                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell><strong>Recharge ID</strong></TableCell>
                                    <TableCell><strong>Billing Amount</strong></TableCell>
                                    <TableCell><strong>Paid Amount</strong></TableCell>
                                    <TableCell><strong>Due Amount</strong></TableCell>
                                    <TableCell><strong>Recharge Date</strong></TableCell>
                                    <TableCell><strong>Start Date</strong></TableCell>
                                    <TableCell><strong>End Date</strong></TableCell>
                                    <TableCell><strong>Recharge Method</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billingData.map((billing, index) => (
                                    <TableRow key={billing.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Payment fontSize="small" color="primary" />
                                                <Typography variant="body2" fontWeight="medium">
                                                    Recharge {billing.recharge_id}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                                {formatAmount(billing.recharge_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                {formatAmount(billing.recharge_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="error.main">
                                                {formatAmount(billing.recharge_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="warning.main">
                                                {formatAmount(billing.recharge_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarToday fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(billing.recharge_date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(billing.recharge_date)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={billing.recharge_method}
                                                color={billing.payment_method === 'Online' ? 'success' : 'primary'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={billing.status}
                                                color={billing.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                                icon={billing.status === 'active' ? <CheckCircle /> : undefined}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* No Data State */}
                {!loading && !error && billingData.length === 0 && (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                        <Receipt sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No billing details found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This customer doesn't have any billing history yet.
                        </Typography>
                                    </Box>
                )}
      </CardBody>
    </Card>
  );
};

export default RechargeLog;
