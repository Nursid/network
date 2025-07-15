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
    Chip,
    Avatar
} from '@mui/material';
import { 
    WhatsApp, 
    Phone, 
    Message, 
    Payment, 
    CheckCircle, 
    Info,
    Campaign,
    Support
} from '@mui/icons-material';

const WhatsAppForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {
    const [formData, setFormData] = useState({
        phone_number: customerData?.mobile || '',
        message_type: 'payment_reminder',
        message_content: '',
        template_used: ''
    });
    
    const [errors, setErrors] = useState({});

    const messageTemplates = {
        payment_reminder: `Dear ${customerData?.name || 'Customer'},

Your internet bill payment is due. Please make the payment to avoid service interruption.

Amount: ₹${customerData?.billing_amount || 'XXX'}
Due Date: ${new Date().toLocaleDateString()}

Thank you for choosing our service.`,
        
        payment_confirmation: `Dear ${customerData?.name || 'Customer'},

We have received your payment of ₹${customerData?.billing_amount || 'XXX'}.

Your service will continue uninterrupted. Thank you for your prompt payment.

For any queries, please contact us.`,
        
        service_update: `Dear ${customerData?.name || 'Customer'},

We would like to inform you about an important service update.

[Please update this message with specific service information]

Thank you for your understanding.`,
        
        promotional: `Dear ${customerData?.name || 'Customer'},

We have exciting new offers for you!

[Please update this message with promotional details]

Contact us to know more.`,
        
        support: `Dear ${customerData?.name || 'Customer'},

We are here to help you with any technical support you may need.

[Please update this message with support details]

Our support team is available 24/7.`
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Auto-populate message content when message type changes
        if (field === 'message_type' && messageTemplates[value]) {
            setFormData(prev => ({
                ...prev,
                message_content: messageTemplates[value]
            }));
        }
        
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
        
        if (!formData?.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData?.phone_number.trim())) {
            newErrors.phone_number = 'Please enter a valid 10-digit phone number';
        }
        
        if (!formData.message_content.trim()) {
            newErrors.message_content = 'Message content is required';
        } else if (formData.message_content.trim().length < 10) {
            newErrors.message_content = 'Message must be at least 10 characters long';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const submitData = {
            ...formData,
            sent_by: 1 // This should be the logged-in user ID
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            phone_number: customerData?.mobile || '',
            message_type: 'payment_reminder',
            message_content: '',
            template_used: ''
        });
        setErrors({});
        onClose();  
    };

    const getMessageTypeIcon = () => {
        switch (formData?.message_type) {
            case 'payment_reminder':
                return <Payment />;
            case 'payment_confirmation':
                return <CheckCircle />;
            case 'service_update':
                return <Info />;
            case 'promotional':
                return <Campaign />;
            case 'support':
                return <Support />;
            default:
                return <Message />;
        }
    };

    const getMessageTypeColor = () => {
        switch (formData?.message_type) {
            case 'payment_reminder':
                return 'warning';
            case 'payment_confirmation':
                return 'success';
            case 'service_update':
                return 'info';
            case 'promotional':
                return 'secondary';
            case 'support':
                return 'primary';
            default:
                return 'default';
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
                bgcolor: '#25d366', 
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <WhatsApp />
                Send WhatsApp Message
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                {customerData?.name && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#25d366' }}>
                                <WhatsApp />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Sending to: <strong>{customerData?.name}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Phone fontSize="small" sx={{ mr: 0.5 }} />
                                    {customerData?.mobile}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={formData?.phone_number}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                            error={!!errors.phone_number}
                            helperText={errors.phone_number}
                            required
                            placeholder="Enter 10-digit phone number"
                            InputProps={{
                                startAdornment: (
                                    <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                ),
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Message Type</InputLabel>
                            <Select
                                value={formData?.message_type}
                                label="Message Type"
                                onChange={(e) => handleChange('message_type', e.target.value)}
                            >
                                <MenuItem value="payment_reminder">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Payment fontSize="small" />
                                        Payment Reminder
                                    </Box>
                                </MenuItem>
                                <MenuItem value="payment_confirmation">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle fontSize="small" />
                                        Payment Confirmation
                                    </Box>
                                </MenuItem>
                                <MenuItem value="service_update">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Info fontSize="small" />
                                        Service Update
                                    </Box>
                                </MenuItem>
                                <MenuItem value="promotional">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Campaign fontSize="small" />
                                        Promotional
                                    </Box>
                                </MenuItem>
                                <MenuItem value="support">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Support fontSize="small" />
                                        Support
                                    </Box>
                                </MenuItem>
                                <MenuItem value="other">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Message fontSize="small" />
                                        Other
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Message Type:
                            </Typography>
                            <Chip 
                                icon={getMessageTypeIcon()}
                                label={formData?.message_type.replace('_', ' ').toUpperCase()} 
                                color={getMessageTypeColor()} 
                                size="small" 
                            />
                            <Button 
                                size="small" 
                                onClick={() => handleChange('message_content', messageTemplates[formData?.message_type] || '')}
                                variant="outlined"
                                sx={{ ml: 'auto' }}
                            >
                                Use Template
                            </Button>
                        </Box>
                        
                        <TextField
                            fullWidth
                            label="Message Content"
                            multiline
                            rows={8}
                            value={formData.message_content}
                            onChange={(e) => handleChange('message_content', e.target.value)}
                            error={!!errors.message_content}
                            helperText={errors.message_content || `Character count: ${formData.message_content.length}`}
                            required
                            placeholder="Enter your WhatsApp message here..."
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="body2">
                                <strong>Note:</strong> Messages will be sent via WhatsApp Business API. 
                                Please ensure the phone number is registered with WhatsApp.
                            </Typography>
                        </Alert>
                    </Grid>
                    
                    {Object.keys(errors).length > 0 && (
                        <Grid item xs={12}>
                            <Alert severity="error">
                                Please fix the errors above before sending.
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
                        bgcolor: '#25d366',
                        '&:hover': {
                            bgcolor: '#1da851'
                        }
                    }}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WhatsAppForm; 