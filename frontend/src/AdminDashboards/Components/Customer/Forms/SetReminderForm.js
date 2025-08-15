import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Button,
    Box,
    Typography,
    Avatar
} from '@mui/material';

import { Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import {
    Dialog,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { 
    Person
} from '@mui/icons-material';
const SetReminderForm = ({ open, onClose, onSubmit, loading = false, customerData, reminderLogs = [], customerId }) => {

    console.log("reminderLogs-",reminderLogs)

    const [formData, setFormData] = useState({
        reminder_type: '',
        reminder_date: null,
        reminder_time: null,
        note: ''
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
        
        if (!formData.reminder_type) {
            newErrors.reminder_type = 'Type is required';
        }
        
        if (!formData.reminder_date) {
            newErrors.reminder_date = 'Date is required';
        }
        
        if (!formData.reminder_time) {
            newErrors.reminder_time = 'Time is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        
        // Combine date and time into a single datetime
        const combinedDateTime = moment(formData.reminder_date)
            .hour(formData.reminder_time.hour())
            .minute(formData.reminder_time.minute());
        
        const submitData = {
            reminder_type: formData.reminder_type,
            reminder_date: combinedDateTime.toISOString(),
            note: formData.note,
            created_by: 1, // This should be the logged-in user ID
            customer_id: customerId || customerData?.id || 2 // Use customerId prop or extract from customerData
        };
        
        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({
            reminder_type: '',
            reminder_date: null,
            reminder_time: null,
            note: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Row>
                {/* Customer Details Section */}
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
                                            <strong>Name:</strong> {customerData?.name || ''}
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

                {/* Two Column Layout - Reminder Logs and Set Reminder Form */}
                <Col md={6}>
                    {/* Left Side - All Reminders Logs */}
                    <Card style={{ border: '1px solid #dee2e6', height: '500px' }}>
                        <CardHeader style={{ 
                            backgroundColor: '#f8f9fa', 
                            borderBottom: '1px solid #dee2e6',
                            padding: '12px 15px'
                        }}>
                            <Typography variant="subtitle1" style={{ 
                                color: '#1976d2', 
                                fontWeight: 600,
                                margin: 0,
                                fontSize: '1rem'
                            }}>
                                All Reminders Logs
                            </Typography>
                        </CardHeader>
                        <CardBody style={{ padding: '10px', height: 'calc(100% - 60px)', overflowY: 'auto' }}>
                            {reminderLogs && reminderLogs.length > 0 ? (
                                reminderLogs.map((log, index) => (
                                    <Box 
                                        key={index} 
                                        sx={{ 
                                            mb: 1, 
                                            p: 1.5, 
                                            bgcolor: '#f8f9fa', 
                                            borderRadius: 1,
                                            border: '1px solid #e9ecef'
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>
                                            {log.reminder_date} - {log.reminder_type}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <>
                                  
                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                        No Reminders Found
                                    </Box>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6}>
                    {/* Right Side - Set Reminder Form */}
                    <Card style={{ border: '1px solid #dee2e6', height: '500px' }}>
                        <CardHeader style={{ 
                            backgroundColor: '#e3f2fd', 
                            borderBottom: '1px solid #dee2e6',
                            padding: '12px 15px'
                        }}>
                            <Typography variant="subtitle1" style={{ 
                                color: '#1976d2', 
                                fontWeight: 600,
                                margin: 0,
                                fontSize: '1rem'
                            }}>
                                Set Reminder
                            </Typography>
                        </CardHeader>
                        <CardBody style={{ padding: '15px', height: 'calc(100% - 60px)', overflow: 'hidden' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ mb: 1, color: '#666', fontSize: '0.85rem' }}>
                                        Type
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                <Select
                                    value={formData.reminder_type}
                                    onChange={(e) => handleChange('reminder_type', e.target.value)}
                                            displayEmpty
                                            error={!!errors.reminder_type}
                                            sx={{
                                                borderRadius: 1.5,
                                                bgcolor: '#f8f9fa',
                                                fontSize: '0.9rem',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #e0e0e0'
                                                }
                                            }}
                                        >
                                            <MenuItem value="" disabled>Select Type</MenuItem>
                                            <MenuItem value="Payment Due">Payment Due</MenuItem>
                                    <MenuItem value="Follow Up">Follow Up</MenuItem>
                                            <MenuItem value="Plan Expiry">Plan Expiry</MenuItem>
                                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                                            <MenuItem value="Custom Reminder">Custom Reminder</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                                    {errors.reminder_type && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                            {errors.reminder_type}
                                        </Typography>
                                    )}
                        </Grid>
                        
                        <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ mb: 1, color: '#666', fontSize: '0.85rem' }}>
                                        Date
                                    </Typography>
                                    <DatePicker
                                value={formData.reminder_date}
                                onChange={(value) => handleChange('reminder_date', value)}
                                sx={{ width: '100%' }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        fullWidth 
                                                size="small"
                                                placeholder="dd-mm-yyyy"
                                        error={!!errors.reminder_date}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        bgcolor: '#f8f9fa',
                                                        fontSize: '0.9rem',
                                                        '& fieldset': {
                                                            border: '1px solid #e0e0e0'
                                                        }
                                                    }
                                                }}
                                    />
                                )}
                            />
                                    {errors.reminder_date && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                            {errors.reminder_date}
                                        </Typography>
                                    )}
                        </Grid>
                        
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ mb: 1, color: '#666', fontSize: '0.85rem' }}>
                                        Time
                                    </Typography>
                                    <TimePicker
                                        value={formData.reminder_time}
                                        onChange={(value) => handleChange('reminder_time', value)}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                fullWidth 
                                                size="small"
                                                placeholder="--:--"
                                                error={!!errors.reminder_time}
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1.5,
                                                        bgcolor: '#f8f9fa',
                                                        fontSize: '0.9rem',
                                                        '& fieldset': {
                                                            border: '1px solid #e0e0e0'
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.reminder_time && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                            {errors.reminder_time}
                                        </Typography>
                                    )}
                        </Grid>
                        
                            <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ mb: 1, color: '#666', fontSize: '0.85rem' }}>
                                        Note
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        value={formData.note}
                                        onChange={(e) => handleChange('note', e.target.value)}
                                        placeholder="Enter reminder note"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5,
                                                bgcolor: '#f8f9fa',
                                                fontSize: '0.9rem',
                                                '& fieldset': {
                                                    border: '1px solid #e0e0e0'
                                                }
                                            }
                                        }}
                                    />
                    </Grid>
                                
                                <Grid item xs={12}>
                    <Button 
                        onClick={handleSubmit}
                        variant="contained"
                                        fullWidth
                        disabled={loading}
                                                                sx={{ 
                                            py: 1,
                                            borderRadius: 1.5,
                                            bgcolor: '#2196f3',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            textTransform: 'none',
                                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                                            '&:hover': {
                                                bgcolor: '#1976d2',
                                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
                                            }
                                        }}
                    >
                                        {loading ? 'Setting Reminder...' : 'Set Reminder'}
                    </Button>
                                </Grid>
                            </Grid>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </LocalizationProvider>
    );
};

export default SetReminderForm; 