import React, { useState } from 'react';
import { Label, FormGroup, Input, Button, Row, Col } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { GetAllPlan } from '../../../../Store/Actions/Dashboard/PlanAction';
import { API_URL } from '../../../../config';

const AddPlans = ({ ToggleMasterAddService, data }) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);

    // Initialize formData based on `data`
    const [formData, setFormData] = useState({
        connectionType: data?.connectionType || '',
        plan: data?.plan || '',
        code: data?.code || '',
        basePrice: data?.basePrice || '',
        finalPrice: data?.finalPrice || '',
        provider: data?.provider || '',
        days: data?.days || '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit the form
    const handleSubmit = async () => {
        setLoading(true)

        let apiUrl = `${API_URL}/plan/add`;
        if(data?.id){
            apiUrl = `${API_URL}/plan/update/${data?.id}`;
        }
        await axios
            .post(apiUrl, formData)
            .then((response) => {
                setLoading(false);
                ToggleMasterAddService();
                Swal.fire('Success', response.data.message, 'success');
                dispatch(GetAllPlan());
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error:', error);
                Swal.fire('Error', 'Something went wrong.', 'error');
            });
    };

    return (
        <>
            <Row>
                <Col md={6}>
            
                    <FormGroup>
                        <Label for="connectionType">Connection Type</Label>
                        <Input
                            type="text"
                            name="connectionType"
                            value={formData.connectionType}
                            onChange={handleChange}
                            placeholder="Enter connection type"
                        />
                    </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="plan">Plan</Label>
                <Input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    placeholder="Enter plan"
                />
            </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="code">Code</Label>
                <Input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter code"
                />
            </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="basePrice">Base Price</Label>
                <Input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    placeholder="Enter base price"
                />
            </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="finalPrice">Final Price</Label>
                <Input
                    type="number"
                    name="finalPrice"
                    value={formData.finalPrice}
                    onChange={handleChange}
                    placeholder="Enter final price"
                />
            </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="provider">Provider</Label>
                <Input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    placeholder="Enter provider"
                />
            </FormGroup>
            </Col>
            <Col md={6}>
            
            <FormGroup>
                <Label for="days">Days</Label>
                <Input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleChange}
                    placeholder="Enter days"
                />
            </FormGroup>
            </Col>
            {/* Submit Button */}
            <Button type="button" onClick={handleSubmit}>
                {data?.id ? 'Update' : 'Submit'}
            </Button>
            </Row>
        </>
    );
};

export default AddPlans;
