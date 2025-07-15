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
    Box,
    Typography,
    Grid,
    Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

const SetReminderForm = ({ open, onClose, onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        reminder_type: 'payment',
        title: '',
        description: '',
        reminder_date: moment(),
        due_date: null,
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
        
        if (!formData.reminder_date) {
            newErrors.reminder_date = 'Reminder date is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        const submitData = {
            ...formData,
            reminder_date: formData.reminder_date.toISOString(),
            due_date: formData.due_date ? formData.due_date.toISOString() : null,
            created_by: 1 // This should be the logged-in user ID
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            reminder_type: 'payment',
            title: '',
            description: '',
            reminder_date: moment(),
            due_date: null,
            priority: 'medium',
            assigned_to: null
        });
        setErrors({});
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
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
                    bgcolor: 'primary.main', 
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.2rem'
                }}>
                    Set Customer Reminder
                </DialogTitle>
                
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Reminder Type</InputLabel>
                                <Select
                                    value={formData.reminder_type}
                                    label="Reminder Type"
                                    onChange={(e) => handleChange('reminder_type', e.target.value)}
                                >
                                    <MenuItem value="payment">Payment</MenuItem>
                                    <MenuItem value="follow_up">Follow Up</MenuItem>
                                    <MenuItem value="renewal">Renewal</MenuItem>
                                    <MenuItem value="maintenance">Maintenance</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={formData.priority}
                                    label="Priority"
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="urgent">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
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
                                placeholder="Enter detailed description..."
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="Reminder Date & Time"
                                value={formData.reminder_date}
                                onChange={(value) => handleChange('reminder_date', value)}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        fullWidth 
                                        required
                                        error={!!errors.reminder_date}
                                        helperText={errors.reminder_date}
                                    />
                                )}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="Due Date (Optional)"
                                value={formData.due_date}
                                onChange={(value) => handleChange('due_date', value)}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth />
                                )}
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
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        {loading ? 'Setting...' : 'Set Reminder'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default SetReminderForm; 