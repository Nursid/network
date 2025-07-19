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
    Chip
} from '@mui/material';
import { 
    ReportProblem, 
    BugReport, 
    Receipt, 
    Build, 
    Wifi, 
    Hardware 
} from '@mui/icons-material';

const ComplaintForm = ({ open, onClose, onSubmit, loading = false, customerData = {} }) => {

    console.log("customerData2--",customerData)
    const [formData, setFormData] = useState({
        customer_id: customerData?.customer_id,
        subject: '',
        description: ''
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
        
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        if(customerData?.customer_id){
            formData.customer_id = customerData?.customer_id;
            console.log("formData3--",formData)
            onSubmit(formData);
        } 
    };

    const handleClose = () => {
        setFormData({
            customer_id: customerData?.customer_id,
            subject: '',
            description: ''
        });
        setErrors({});
        onClose();
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
                bgcolor: 'error.main', 
                color: 'white',
                fontWeight: 600,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <ReportProblem />
                Register Customer Complaint
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
                {customerData?.name && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Customer: <strong>{customerData?.name}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Mobile: <strong>{customerData?.mobile}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Address: <strong>{customerData?.address}</strong>
                        </Typography>
                    </Box>
                )}
                
                <Grid container spacing={3}>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Complaint Title"
                            value={formData?.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                            error={!!errors.subject}
                            helperText={errors.subject}
                            required
                            placeholder="Enter a brief title for the complaint"
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Detailed Description"
                            multiline
                            rows={5}
                            value={formData?.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description || 'Please provide detailed information about the issue'}
                            required
                            placeholder="Describe the issue in detail. Include any error messages, when it started, and steps to reproduce..."
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
                        bgcolor: 'error.main',
                        '&:hover': {
                            bgcolor: 'error.dark'
                        }
                    }}
                >
                    {loading ? 'Registering...' : 'Register Complaint'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ComplaintForm; 