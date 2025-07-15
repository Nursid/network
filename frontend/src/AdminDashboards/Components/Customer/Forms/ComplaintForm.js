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
    const [formData, setFormData] = useState({
        complaint_type: 'technical',
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: null
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
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
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
        
        const submitData = {
            ...formData,
            created_by: 1 // This should be the logged-in user ID
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            complaint_type: 'technical',
            title: '',
            description: '',
            priority: 'medium',
            assigned_to: null
        });
        setErrors({});
        onClose();
    };

    const getComplaintTypeIcon = () => {
        switch (formData.complaint_type) {
            case 'technical':
                return <BugReport />;
            case 'billing':
                return <Receipt />;
            case 'service':
                return <Build />;
            case 'connectivity':
                return <Wifi />;
            case 'hardware':
                return <Hardware />;
            default:
                return <ReportProblem />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'error';
            case 'urgent':
                return 'error';
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
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Complaint Type</InputLabel>
                            <Select
                                value={formData?.complaint_type}
                                label="Complaint Type"
                                onChange={(e) => handleChange('complaint_type', e.target.value)}
                            >
                                <MenuItem value="technical">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BugReport fontSize="small" />
                                        Technical Issue
                                    </Box>
                                </MenuItem>
                                <MenuItem value="billing">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Receipt fontSize="small" />
                                        Billing Issue
                                    </Box>
                                </MenuItem>
                                <MenuItem value="service">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Build fontSize="small" />
                                        Service Issue
                                    </Box>
                                </MenuItem>
                                <MenuItem value="connectivity">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Wifi fontSize="small" />
                                        Connectivity Issue
                                    </Box>
                                </MenuItem>
                                <MenuItem value="hardware">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Hardware fontSize="small" />
                                        Hardware Issue
                                    </Box>
                                </MenuItem>
                                <MenuItem value="other">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ReportProblem fontSize="small" />
                                        Other
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={formData?.priority}
                                label="Priority"
                                onChange={(e) => handleChange('priority', e.target.value)}
                            >
                                <MenuItem value="low">
                                    <Chip label="Low" color="success" size="small" sx={{ mr: 1 }} />
                                    Low Priority
                                </MenuItem>
                                <MenuItem value="medium">
                                    <Chip label="Medium" color="warning" size="small" sx={{ mr: 1 }} />
                                    Medium Priority
                                </MenuItem>
                                <MenuItem value="high">
                                    <Chip label="High" color="error" size="small" sx={{ mr: 1 }} />
                                    High Priority
                                </MenuItem>
                                <MenuItem value="urgent">
                                    <Chip label="Urgent" color="error" size="small" sx={{ mr: 1 }} />
                                    Urgent Priority
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Complaint Title"
                            value={formData?.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
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
                    
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Selected Type:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getComplaintTypeIcon()}
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {formData?.complaint_type}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Priority:
                            </Typography>
                            <Chip 
                                label={formData?.priority.toUpperCase()} 
                                color={getPriorityColor(formData?.priority)} 
                                size="small" 
                            />
                        </Box>
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