import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Box,
    InputAdornment,
    Avatar,
    Chip
} from '@mui/material';
import { 
    CurrencyRupee, 
    Payment, 
    AccountBalance, 
    Person,
    CalendarToday
} from '@mui/icons-material';
import { Row, Col, Card, CardBody, CardHeader, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '../../../../config';
import SelectBox from '../../../Elements/SelectBox';

const RePaymentForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {

    const [formData, setFormData] = useState({
        customer_id: customerData?.customer_id || '',
        balance: customerData?.balance || 0,
        code: customerData?.selected_package || '',
        amount: customerData?.balance || 0,
        trans_id: '',
        payment_method: '',
        payar_name: customerData?.payar_name || '',
        payar_number: customerData?.payar_number || '',
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const amountInputRef = useRef(null);
   

    const handleChange = (field, value) => {
        let updatedData = {
            ...formData,
            [field]: value
        };
        
        
        setFormData(updatedData);
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

  
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.customer_id) {
            newErrors.customer_id = 'Customer ID is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }
        
        if (!formData.payment_method) {
            newErrors.payment_method = 'Payment method is required';
        }
        
        if (formData.payment_method && formData.payment_method !== 'cash' && formData.payment_method !== 'cheque' && !formData.trans_id) {
            newErrors.trans_id = 'Transaction ID is required for this payment method';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || isSubmitting) return;
        
        setIsSubmitting(true);
        
        const submitData = {
            ...formData,
            customer_id: parseInt(formData.customer_id),
            amount: parseFloat(formData.amount),
        };
        try {
            await onSubmit(submitData);
            // Reset form after successful submission
            resetForm();
        } catch (error) {
            console.error('Payment submission error:', error);
            // Don't reset form on error so user can retry
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            customer_id: customerData?.customer_id || '',
            amount: customerData?.balance || 0,
            trans_id: '',
            payment_method: '',
        });
        setErrors({});
        setIsSubmitting(false);
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            amount: customerData?.balance || 0,
        }));
    }, [customerData]);

    // Handle focus management and form reset when dialog opens
    useEffect(() => {
        if (open) {
            // Reset form when dialog opens to ensure clean state
            resetForm();
            // Focus management
            if (amountInputRef.current) {
                const timer = setTimeout(() => {
                    amountInputRef.current?.focus();
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [open, customerData]);

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getTransactionTypeIcon = () => {
        return <AccountBalance />;
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            disableRestoreFocus
            disableEnforceFocus={false}
            aria-labelledby="payment-dialog-title"
            aria-describedby="payment-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }}
        >
            <DialogTitle 
                id="payment-dialog-title"
                sx={{ 
                bgcolor: 'success.main', 
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
                }}
            >
                {getTransactionTypeIcon()}
                Make Payment
            </DialogTitle>
            
            <DialogContent sx={{ p: 2 }}>
                <Typography 
                    id="payment-dialog-description" 
                    variant="body2" 
                    sx={{ 
                        position: 'absolute', 
                        left: '-10000px',
                        top: 'auto',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden'
                    }}
                >
                    Make payment for customer dues and outstanding balance
                </Typography>
                <Row>
                    {/* Customer Details Card */}
                    <Col md={12} className="mb-3">
                        <Card style={{ border: '1px solid #dee2e6' }}>
                            <CardHeader style={{ 
                                backgroundColor: '#e3f2fd', 
                                borderBottom: '1px solid #dee2e6',
                                padding: '10px 15px'
                            }}>
                                <Typography variant="subtitle1" style={{ 
                                    color: '#1976d2', 
                                    fontWeight: 600,
                                    margin: 0
                                }}>
                                    Customer Details
                                </Typography>
                            </CardHeader>
                            <CardBody style={{ padding: '15px' }}>
                                <Row>
                                    <Col md={8}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography variant="body2">
                                                <strong>Name:</strong> {customerData?.name || 'John Doe'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Username:</strong> {customerData?.username || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Contact:</strong> {customerData?.contact || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Address:</strong> {customerData?.address || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Status:</strong> 
                                                <Chip 
                                                    label={customerData?.status || 'Active'} 
                                                    size="small" 
                                                    color="success" 
                                                    sx={{ ml: 1, fontSize: '0.75rem' }}
                                                />
                                            </Typography>
                                        </Box>
                                    </Col>
                                    <Col md={4}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%'
                                        }}>
                                            <Avatar 
                                                sx={{ 
                                                    width: 60, 
                                                    height: 60, 
                                                    bgcolor: '#1976d2', 
                                                    mb: 1 
                                                }}
                                            >
                                                <Person sx={{ fontSize: 30 }} />
                                            </Avatar>
                                            <Typography variant="caption" color="textSecondary">
                                                Customer Photo
                                            </Typography>
                                        </Box>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>


                    {/* Billing Details Card */}
                    <Col md={12}>
                        <Card style={{ border: '1px solid #dee2e6' }}>
                            <CardHeader style={{ 
                                backgroundColor: '#e3f2fd', 
                                borderBottom: '1px solid #dee2e6',
                                padding: '10px 15px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography variant="subtitle1" style={{ 
                                    color: '#1976d2', 
                                    fontWeight: 600,
                                    margin: 0,
                                    textAlign: 'center',
                                    width: '100%'
                                }}>
                                    Billing Details
                                </Typography>
                            </CardHeader>
                            <CardBody style={{ padding: '15px' }}>
                                <Row>
                                    {/* Left Column - Dues Information */}
                                    <Col md={6} className="pe-3">
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                            Outstanding Dues
                                        </Typography>
                                        <Box sx={{ 
                                            border: '1px solid #dee2e6', 
                                            borderRadius: 1, 
                                            p: 2, 
                                            bgcolor: '#f8f9fa',
                                            mb: 2
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Current Balance:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                                                    ₹{customerData?.balance || 0}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Previous Dues:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                                                    ₹{customerData?.previous_dues || 0}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #dee2e6' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                                    Total Amount Due:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1.1rem' }}>
                                                    ₹{(parseFloat(parseFloat(customerData?.previous_dues || 0) + parseFloat(customerData?.balance || 0))).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        
                                        {/* Payment Status */}
                                        <Box sx={{ 
                                            border: '1px solid #dee2e6', 
                                            borderRadius: 1, 
                                            p: 2, 
                                            bgcolor: customerData?.payment_status ? '#e8f5e8' : '#fff3e0'
                                        }}>
                                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                                                Payment Status:
                                            </Typography>
                                            <Chip 
                                                label={customerData?.payment_status ? 'Paid' : 'Pending'} 
                                                size="small" 
                                                color={customerData?.payment_status ? 'success' : 'warning'}
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        </Box>
                                    </Col>

                                    {/* Right Column - Payment Form */}
                                    <Col md={6} className="ps-3">
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                            Make Payment
                                        </Typography>
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <TextField
                                                    ref={amountInputRef}
                                                    fullWidth
                                                    size="small"
                                                    label="Amount"
                                                    value={formData.amount}
                                                    onChange={(e) => handleChange('amount', e.target.value)}
                                                    type="number"
                                                    error={!!errors.amount}
                                                    helperText={errors.amount}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CurrencyRupee fontSize="small" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Col>
                                            <Col md={12} className="mb-3">
                                                <FormControl fullWidth size="small" error={!!errors.payment_method}>
                                                    <InputLabel>Payment Method</InputLabel>
                                                    <Select
                                                        value={formData.payment_method}
                                                        label="Payment Method"
                                                        onChange={(e) => handleChange('payment_method', e.target.value)}
                                                    >
                                                        <MenuItem value="cash">Cash</MenuItem>
                                                        <MenuItem value="upi">UPI</MenuItem>
                                                        <MenuItem value="cheque">Cheque</MenuItem>
                                                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                                    </Select>
                                                    {errors.payment_method && (
                                                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                            {errors.payment_method}
                                                        </Typography>
                                                    )}
                                                </FormControl>
                                            </Col>
                                            {formData.payment_method && formData.payment_method !== 'cash' && formData.payment_method !== 'cheque' && (
                                                <Col md={12} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label="Transaction Note&Id"
                                                        value={formData.trans_id}
                                                        onChange={(e) => handleChange('trans_id', e.target.value)}
                                                        error={!!errors.trans_id}
                                                        helperText={errors.trans_id}
                                                        placeholder="Enter transaction/reference Note&Id"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Payment fontSize="small" />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </Col>
                                            )}

                                                <Col md={12} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label="Payar Name"
                                                        value={formData.payar_name}
                                                        onChange={(e) => handleChange('payar_name', e.target.value)}
                                                    />
                                                </Col>
                                            <Col md={12} className="mb-3">
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label="Payar Number"
                                                        value={formData.payar_number}
                                                        onChange={(e) => handleChange('payar_number', e.target.value)}
                                                    />
                                                </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, borderTop: '1px solid #dee2e6' }}>
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                    sx={{ mr: 1 }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading || isSubmitting || !formData.amount || !formData.payment_method}
                >
                    {(loading || isSubmitting) ? 'Processing...' : 'Submit Payment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RePaymentForm; 