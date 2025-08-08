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

const RenewPlanForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {

    const [formData, setFormData] = useState({
        customer_id: customerData?.customer_id || '',
        amount: '',
        trans_id: '',
        payment_method: '',
    });
    
    const [errors, setErrors] = useState({});
    const [packages, setPackages] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    // Update customer_id when customerData changes
    useEffect(() => {
        if (customerData?.customer_id) {
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0];
            
            setFormData(prev => ({
                ...prev,
                customer_id: customerData.customer_id,
                renewalStartDate: currentDateString,
                renewalEndDate: ''
            }));
        }
    }, [customerData]);

    // Fetch packages on component mount
    useEffect(() => {
        fetchPackages();
    }, []);

    // Fetch payment history when customer data changes
    useEffect(() => {
        if (customerData?.customer_id) {
            fetchPaymentHistory();
        }
    }, [customerData?.customer_id]);

    const handleChange = (field, value) => {
        let updatedData = {
            ...formData,
            [field]: value
        };
        
        // Auto-calculate end date when start date changes and package is selected
        if (field === 'renewalStartDate' && formData.selectedPackage) {
            const startDate = new Date(value);
            const calculatedEndDate = new Date(startDate);
            calculatedEndDate.setDate(startDate.getDate() + parseInt(formData.selectedPackage.days));
            updatedData.renewalEndDate = calculatedEndDate.toISOString().split('T')[0];
        }
        
        setFormData(updatedData);
        
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

    const fetchPaymentHistory = async () => {
        setPaymentLoading(true);
        setPaymentError(null);
        
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
                // Transform the API data to match our payment history format
                const transformedHistory = result.data.slice(0, 5).map(payment => ({
                    date: new Date(payment.createdAt).toISOString().split('T')[0],
                    amount: payment.billing_amount,
                    validity: `${new Date(payment.start_date).toISOString().split('T')[0]} - ${new Date(payment.end_date).toISOString().split('T')[0]}`
                }));
                setPaymentHistory(transformedHistory);
            } else {
                setPaymentError(result.message || 'Failed to fetch payment history');
            }
        } catch (err) {
            console.error('Error fetching payment history:', err);
            setPaymentError('Failed to fetch payment history. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.customer_id) {
            newErrors.customer_id = 'Customer ID is required';
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
            plan_id: '',
            selectedPackage: null,
            renewalStartDate: '',
            renewalEndDate: '',
            renewalCycle: '',
        });
        setErrors({});
        setPaymentHistory([]);
        setPaymentError(null);
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
                Renew Plan
            </DialogTitle>
            
            <DialogContent sx={{ p: 2 }}>
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
                                                <strong>Username:</strong> {customerData?.username || 'johndoe123'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Contact:</strong> {customerData?.contact || '+91-9876543210'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Address:</strong> {customerData?.address || '123, Main Street, Mumbai, MH'}
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

                    {/* Service Details Card */}
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
                                    Service Details
                                </Typography>
                            </CardHeader>
                            <CardBody style={{ padding: '15px' }}>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Service Plan</InputLabel>
                                            <Select
                                                value={formData.plan_id || ''}
                                                label="Select Service Plan"
                                                onChange={(e) => {
                                                    const selectedPkg = packages.find(pkg => pkg.value === e.target.value);
                                                    
                                                    // Set current date as start date and calculate end date
                                                    let startDate = '';
                                                    let endDate = '';
                                                    
                                                    if (selectedPkg) {
                                                        // Set current date as start date
                                                        const currentDate = new Date();
                                                        startDate = currentDate.toISOString().split('T')[0];
                                                        
                                                        // Calculate end date by adding plan days to current date
                                                        const calculatedEndDate = new Date(currentDate);
                                                        calculatedEndDate.setDate(currentDate.getDate() + parseInt(selectedPkg.days));
                                                        endDate = calculatedEndDate.toISOString().split('T')[0];
                                                    }
                                                    
                                                    setFormData(prev => ({ 
                                                        ...prev, 
                                                        selectedPackage: selectedPkg,
                                                        amount: selectedPkg ? parseFloat(selectedPkg.finalPrice).toString() : '',
                                                        plan_id: selectedPkg ? selectedPkg.id : '',
                                                        renewalStartDate: startDate || prev.renewalStartDate,
                                                        renewalEndDate: endDate || prev.renewalEndDate
                                                    }));
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select a plan</em>
                                                </MenuItem>
                                                {packages.map(pkg => (
                                                    <MenuItem key={pkg.value} value={pkg.value}>
                                                        {pkg.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Col>
                                </Row>
                                {formData.selectedPackage && (
                                    <Row>
                                        <Col md={12} className="mb-3">
                                            <Box sx={{ 
                                                p: 2, 
                                                bgcolor: '#f8f9fa', 
                                                border: '1px solid #dee2e6', 
                                                borderRadius: 1 
                                            }}>
                                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                                                    Selected Plan Details
                                                </Typography>
                                                <Row>
                                                    <Col md={6}>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Plan:</strong> {formData.selectedPackage.plan}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Connection Type:</strong> {formData.selectedPackage.connectionType}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Plan Code:</strong> {formData.selectedPackage.code}
                                                        </Typography>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Base Price:</strong> ₹{formData.selectedPackage.basePrice}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Final Price:</strong> ₹{formData.selectedPackage.finalPrice}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            <strong>Validity:</strong> {formData.selectedPackage.days} days
                                                        </Typography>
                                                    </Col>
                                                </Row>
                                            </Box>
                                        </Col>
                                    </Row>
                                )}
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
                                    {/* Left Column - Payment History */}
                                    <Col md={6} className="pe-3">
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                            Last 5 Payments
                                        </Typography>
                                        <Box sx={{ 
                                            border: '1px solid #dee2e6', 
                                            borderRadius: 1, 
                                            p: 1.5, 
                                            bgcolor: '#f8f9fa'
                                        }}>
                                            {paymentLoading ? (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Loading payment history...
                                                    </Typography>
                                                </Box>
                                            ) : paymentError ? (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem' }}>
                                                        {paymentError}
                                                    </Typography>
                                                </Box>
                                            ) : paymentHistory.length === 0 ? (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        No payment history found
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                paymentHistory.map((payment, index) => (
                                                    <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: index < paymentHistory.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '0.8rem' }}>
                                                            {payment.date} ₹{payment.amount}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                                                            Validity: {payment.validity}
                                                        </Typography>
                                                    </Box>
                                                ))
                                            )}
                                        </Box>
                                    </Col>

                                    {/* Right Column - Payment Details */}
                                    <Col md={6} style={{ margin: '2.3rem 0 0 0' }}>
                                        <Row>
                                        <Col md={12}>
                                        <Row>
                                            <Col md={12} className="mb-3">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Renewal Start Date"
                                                    value={formData.renewalStartDate}
                                                    onChange={(e) => handleChange('renewalStartDate', e.target.value)}
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <CalendarToday fontSize="small" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Col>
                                            <Col md={12} className="mb-3">
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Renewal End Date"
                                                    value={formData.renewalEndDate}
                                                    onChange={(e) => handleChange('renewalEndDate', e.target.value)}
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <CalendarToday fontSize="small" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Renewal Cycle</InputLabel>
                                                    <Select
                                                        value={formData.renewalCycle}
                                                        label="Renewal Cycle"
                                                        onChange={(e) => handleChange('renewalCycle', e.target.value)}
                                                    >
                                                        <MenuItem value="1 Month">1 Month</MenuItem>
                                                        <MenuItem value="3 Months">3 Months</MenuItem>
                                                        <MenuItem value="6 Months">6 Months</MenuItem>
                                                        <MenuItem value="1 Year">1 Year</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                    </Col>
                                        </Row>

                                        {/* Action Buttons */}
                                        <Box sx={{ mt: 2 }}>
                                            <Row>
                                                <Col md={6} className="mb-2">
                                                    <Button 
                                                        variant="contained" 
                                                        size="small" 
                                                        fullWidth
                                                        sx={{ 
                                                            bgcolor: '#17a2b8',
                                                            '&:hover': { bgcolor: '#138496' },
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        Auto Renew
                                                    </Button>
                                                </Col>
                                                <Col md={6} className="mb-2">
                                                    <Button 
                                                        variant="contained" 
                                                        size="small" 
                                                        fullWidth
                                                        sx={{ 
                                                            bgcolor: '#6f42c1',
                                                            '&:hover': { bgcolor: '#5a3ba8' },
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        Recharge Logs
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Box>
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
                    disabled={loading || !formData.selectedPackage}
                >
                    {loading ? 'Processing...' : 'Renew Plan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenewPlanForm; 