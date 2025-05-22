import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../config';
import axios from 'axios';
import { Card, CardBody, CardHeader, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const AddFlow = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        olt_name: '',
        port: '',
        status: true,
        data: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Create data object to match the FlowModel schema
            const flowData = {
                name: formData.name,
                olt_name: formData.olt_name,
                port: parseInt(formData.port),
                status: formData.status,
                data: formData.data || JSON.stringify({ type: formData.name }) // Store the type (EPON/GPON) in data field
            };

            const response = await axios.post(`${API_URL}/api/flow/add`, flowData);
            if (response.data.status) {
                setSuccessMessage(response.data.message || 'Flow added successfully!');
                // Reset form after successful submission
                setFormData({
                    name: '',
                    olt_name: '',
                    port: '',
                    status: true,
                    data: ''
                });
                // Navigate to flow list after a brief delay
                setTimeout(() => {
                    navigate('/admin/flow');
                }, 2000);
            } else {
                setErrorMessage(response.data.message || 'Failed to add flow');
            }
        } catch (error) {
            console.error('Error adding flow:', error);
            setErrorMessage(error.response?.data?.message || 'An error occurred while adding the flow');
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel button
    const handleCancel = () => {
        navigate('/admin/flow');
    };

    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <Card className="shadow">
                        <CardHeader className="bg-primary text-white">
                            <h4 className="mb-0">Add New Flow</h4>
                        </CardHeader>
                        <CardBody>
                            {errorMessage && (
                                <Alert color="danger">{errorMessage}</Alert>
                            )}
                            {successMessage && (
                                <Alert color="success">{successMessage}</Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="name">Connection Type</Label>
                                    <Input
                                        type="select"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Connection Type</option>
                                        <option value="EPON">EPON</option>
                                        <option value="GPON">GPON</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="olt_name">OLT Name</Label>
                                    <Input
                                        type="text"
                                        name="olt_name"
                                        id="olt_name"
                                        placeholder="Enter OLT Name"
                                        value={formData.olt_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="port">Port</Label>
                                    <Input
                                        type="number"
                                        name="port"
                                        id="port"
                                        placeholder="Enter Port Number"
                                        value={formData.port}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup check className="mb-3">
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleChange}
                                        />{' '}
                                        Active
                                    </Label>
                                </FormGroup>
                                <div className="d-flex justify-content-end">
                                    <Button 
                                        type="button" 
                                        color="secondary" 
                                        className="me-2" 
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        color="primary" 
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Flow'}
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddFlow; 