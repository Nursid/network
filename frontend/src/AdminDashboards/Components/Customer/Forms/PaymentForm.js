import React, { useState } from 'react';
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
    Grid,
    Alert,
    Typography,
    Box,
    InputAdornment
} from '@mui/material';
import { CurrencyRupee, Payment, AccountBalance } from '@mui/icons-material';

const PaymentForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {
    const [formData, setFormData] = useState({
        transaction_type: 'payment',
        amount: '',
        payment_method: 'cash',
        transaction_id: '',
        reference_id: '',
        description: '',
        bill_period_start: '',
        bill_period_end: '',
        due_date: ''
    });
    
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
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
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }
        
        if (!formData.payment_method) {
            newErrors.payment_method = 'Payment method is required';
        }
        
        if (formData.payment_method === 'online' && !formData.transaction_id) {
            newErrors.transaction_id = 'Transaction ID is required for online payments';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const submitData = {
            ...formData,
            amount: parseFloat(formData.amount),
            processed_by: 1 // This should be the logged-in user ID
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            transaction_type: 'payment',
            amount: '',
            payment_method: 'cash',
            transaction_id: '',
            reference_id: '',
            description: '',
            bill_period_start: '',
            bill_period_end: '',
            due_date: ''
        });
        setErrors({});
        onClose();
    };

    const getTransactionTypeIcon = () => {
        switch (formData.transaction_type) {
            case 'payment':
                return <Payment />;
            case 'recharge':
                return <AccountBalance />;
            default:
                return <CurrencyRupee />;
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'success.main', 
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                {getTransactionTypeIcon()}
                Payment & Recharge Processing
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                {customerData?.name && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Customer: <strong>{customerData?.name}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Current Balance: <strong style={{ color: customerData?.balance > 0 ? 'red' : 'green' }}>
                                ₹{customerData?.balance || 0}
                            </strong>
                        </Typography>
                    </Box>
                )}
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                                value={formData?.transaction_type}
                                label="Transaction Type"
                                onChange={(e) => handleChange('transaction_type', e.target.value)}
                            >
                                <MenuItem value="payment">Payment</MenuItem>
                                <MenuItem value="recharge">Recharge</MenuItem>
                                <MenuItem value="refund">Refund</MenuItem>
                                <MenuItem value="adjustment">Adjustment</MenuItem>
                                <MenuItem value="penalty">Penalty</MenuItem>
                                <MenuItem value="discount">Discount</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Amount"
                            type="number"
                            value={formData?.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyRupee fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={formData?.payment_method}
                                label="Payment Method"
                                onChange={(e) => handleChange('payment_method', e.target.value)}
                                error={!!errors.payment_method}
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="upi">UPI</MenuItem>
                                <MenuItem value="card">Card</MenuItem>
                                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                <MenuItem value="cheque">Cheque</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Transaction ID"
                            value={formData?.transaction_id}
                            onChange={(e) => handleChange('transaction_id', e.target.value)}
                            error={!!errors.transaction_id}
                            helperText={errors.transaction_id || 'Required for online payments'}
                            placeholder="Enter transaction/reference ID"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Reference ID"
                            value={formData?.reference_id}
                            onChange={(e) => handleChange('reference_id', e.target.value)}
                            placeholder="Internal reference (optional)"
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Bill Period Start"
                            type="date"
                            value={formData?.bill_period_start}
                            onChange={(e) => handleChange('bill_period_start', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Bill Period End"
                            type="date"
                            value={formData?.bill_period_end}
                            onChange={(e) => handleChange('bill_period_end', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Due Date"
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => handleChange('due_date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Enter payment details or notes..."
                        />
                    </Grid>
                    
                    {Object.keys(errors).length > 0 && (
                        <Grid item xs={12}>
                            <Alert severity="error">
                                Please fix the errors above before submitting.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
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
                    disabled={loading}
                    sx={{ 
                        minWidth: 120,
                        bgcolor: 'success.main',
                        '&:hover': {
                            bgcolor: 'success.dark'
                        }
                    }}
                >
                    {loading ? 'Processing...' : `Process ${formData.transaction_type}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentForm; 