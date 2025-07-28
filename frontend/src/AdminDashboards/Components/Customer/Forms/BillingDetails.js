import React, { useState, useEffect } from 'react';
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
    Phone, 
    Person, 
    Payment, 
    CalendarToday,
    CheckCircle, 
    AccessTime
} from '@mui/icons-material';
import { API_URL } from '../../../../config';

const BillingDetails = ({ open, onClose, customerData = {} }) => {
    const [billingData, setBillingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch billing details when dialog opens
    useEffect(() => {
        if (open && customerData?.customer_id) {
            fetchBillingDetails();
        }
    }, [open, customerData?.customer_id]);

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
                    customer_id: customerData?.customer_id
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

    const handleClose = () => {
        setBillingData([]);
        setError(null);
        onClose();  
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
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#1976d2', 
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <Receipt />
                Customer Billing Details
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                {/* Customer Info Header */}
                {customerData?.name && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#1976d2' }}>
                                <Person />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" color="text.primary">
                                    {customerData?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                    {customerData?.mobile}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Customer ID: <strong>{customerData?.customer_id}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
                
                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            Loading billing details...
                        </Typography>
                    </Box>
                )}

                {/* Error State */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Billing Details Table */}
                {!loading && !error && billingData.length > 0 && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell><strong>Plan ID</strong></TableCell>
                                    <TableCell><strong>Billing Amount</strong></TableCell>
                                    <TableCell><strong>Paid Amount</strong></TableCell>
                                    <TableCell><strong>Due Amount</strong></TableCell>
                                    <TableCell><strong>Discount</strong></TableCell>
                                    <TableCell><strong>Start Date</strong></TableCell>
                                    <TableCell><strong>End Date</strong></TableCell>
                                    <TableCell><strong>Payment Method</strong></TableCell>
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
                                                    Plan {billing.plan_id}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                                {formatAmount(billing.billing_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                {formatAmount(billing.paid_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="error.main">
                                                {formatAmount(billing.due_amount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="warning.main">
                                                {formatAmount(billing.discount)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarToday fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {formatDate(billing.start_date)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(billing.end_date)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={billing.payment_method}
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

                {/* Summary */}
                {!loading && !error && billingData.length > 0 && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                            Billing Summary
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Records
                                </Typography>
                                <Typography variant="h6" color="text.primary">
                                    {billingData.length}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Billing
                                </Typography>
                                <Typography variant="h6" color="success.main">
                                    {formatAmount(billingData.reduce((sum, item) => sum + parseFloat(item.billing_amount), 0))}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Paid
                                </Typography>
                                <Typography variant="h6" color="primary.main">
                                    {formatAmount(billingData.reduce((sum, item) => sum + parseFloat(item.paid_amount), 0))}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Due
                                </Typography>
                                <Typography variant="h6" color="error.main">
                                    {formatAmount(billingData.reduce((sum, item) => sum + parseFloat(item.due_amount), 0))}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Latest Plan
                                </Typography>
                                <Typography variant="h6" color="text.primary">
                                    Plan {billingData[0]?.plan_id || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Current Status
                                </Typography>
                                <Chip 
                                    label={billingData[0]?.status || 'N/A'}
                                    color={billingData[0]?.status === 'active' ? 'success' : 'default'}
                                    size="small" 
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ mr: 1 }}
                >
                    Close
                </Button>
                <Button 
                    onClick={fetchBillingDetails}
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillingDetails; 