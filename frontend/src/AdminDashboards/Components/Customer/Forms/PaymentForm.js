import React, { useState, useEffect } from 'react';
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
    Alert,
    Typography,
    Box,
    InputAdornment
} from '@mui/material';
import { CurrencyRupee, Payment, AccountBalance } from '@mui/icons-material';
import { Row, Col, Card, CardBody, CardHeader, FormGroup, Label } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '../../../../config';
import SelectBox from '../../../Elements/SelectBox';

const PaymentForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {

    console.log("customerData-", customerData);
    const [formData, setFormData] = useState({
        customer_id: customerData?.customer_id || '',
        amount: '',
        payment_method: '',
        trans_id: '',
        plan_id: '',
        selectedPackage: null,
        balance: customerData?.balance || 0
    });
    
    const [errors, setErrors] = useState({});
    const [packages, setPackages] = useState([]);

    // Update customer_id when customerData changes
    useEffect(() => {
        if (customerData?.customer_id) {
            setFormData(prev => ({
                ...prev,
                customer_id: customerData.customer_id,
                balance: customerData?.balance || 0
            }));
        }
    }, [customerData]);

    // Fetch packages on component mount
    useEffect(() => {
        fetchPackages();
    }, []);

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

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${API_URL}/plan/getall`);
            if (response.data.status === 200) {
                const packageOptions = response.data.data.map(pkg => ({
                    value: pkg.id,
                    label: `${pkg.plan} - ₹${pkg.finalPrice} - ${pkg.days} Days`,
                    ...pkg
                }));
                setPackages(packageOptions);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
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
            newErrors.payment_method = 'Payment mode is required';
        }
        
        if (formData.payment_method && formData.payment_method !== 'cash' && formData.payment_method !== 'cheque' && !formData.trans_id) {
            newErrors.trans_id = 'Transaction ID is required for this payment mode';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const submitData = {
            ...formData,
            customer_id: parseInt(formData.customer_id),
            amount: parseFloat(formData.amount),
            plan_id: formData.plan_id ? parseInt(formData.plan_id) : null,
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            customer_id: customerData?.customer_id || '',
            amount: '',
            payment_method: '',
            trans_id: '',
            plan_id: '',
            selectedPackage: null,
            balance: customerData?.balance || 0
        });
        setErrors({});
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
                Customer Recharge Processing
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="package">Select Package <span style={{color: "red"}}>*</span></Label>
                            <SelectBox 
                                options={packages} 
                                setSelcted={(value) => {
                                    setFormData(prev => ({ 
                                        ...prev, 
                                        selectedPackage: value,
                                        amount: value ? (parseFloat(value.finalPrice) + parseFloat(prev.balance || 0)).toString() : '',
                                        plan_id: value ? value.id : '',
                                    }));
                                }} 
                                initialValue={formData.selectedPackage}
                            />
                        </FormGroup>
                    </Col>
                    {formData.selectedPackage && (
                        <Col md={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Package Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <p><strong>Plan:</strong> {formData.selectedPackage.plan}</p>
                                    <p><strong>Connection Type:</strong> {formData.selectedPackage.connectionType}</p>
                                    <p><strong>Days:</strong> {formData.selectedPackage.days}</p>
                                    <p><strong>Price:</strong> ₹{formData.selectedPackage.finalPrice}</p>
                                </CardBody>
                            </Card>
                        </Col>
                    )}
                </Row>
                
                <Row className="mt-3">
                    <Col xs={12} md={6} className='mb-3'>
                        <TextField
                            fullWidth
                            label="Previous Due"
                            type="number"
                            value={formData?.balance}
                            onChange={(e) => handleChange('balance', e.target.value)}
                            error={!!errors.balance}
                            helperText={errors.balance}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CurrencyRupee fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    </Col>
                    <Col xs={12} md={6}>
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
                    </Col>
                    
                    <Col xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Payment Mode</InputLabel>
                            <Select
                                value={formData?.payment_method}
                                label="Payment Mode"
                                onChange={(e) => handleChange('payment_method', e.target.value)}
                                error={!!errors.payment_method}
                                required
                            >
                                <MenuItem value="cash">Cash</MenuItem>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="upi">UPI</MenuItem>
                                <MenuItem value="cheque">Cheque</MenuItem>
                            </Select>
                        </FormControl>
                    </Col>
                {formData.payment_method && formData.payment_method !== 'cash' && formData.payment_method !== 'cheque' && (
                        <Col xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Transaction ID"
                                value={formData?.trans_id}
                                onChange={(e) => handleChange('trans_id', e.target.value)}
                                error={!!errors.trans_id}
                                helperText={errors.trans_id || 'Required for this payment mode'}
                                placeholder="Enter transaction/reference ID"
                            />
                        </Col>
                    )}
                </Row>
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
                    {loading ? 'Processing...' : 'Process Recharge'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentForm; 