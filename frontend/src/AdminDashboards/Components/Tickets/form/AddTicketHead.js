import React, { useState } from 'react';
import { Label, FormGroup, Input, Button, Row, Col } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import { GetAllServices } from '../../../../Store/Actions/Dashboard/servicesAction';
import { API_URL } from '../../../../config';
import SelectBox from '../../../Elements/SelectBox';

const AddTicketHead = ({ ToggleMasterAddService, GetAllTicketHead, editData }) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [errors, setErrors]= useState([]);
    const [connectionType, setConnectionType] = useState(editData?.connectionType || '')
    const [Type, setType] = useState(editData?.Type || '')
    const [formData, setFormData] = useState({
        name: editData?.name || '',
        shortCode: editData?.shortCode || '',
        connectionType: editData?.connectionType || '',
        Type: editData?.Type || '',
        TAT: editData?.TAT || '',
    });

    const connectionTypeOptions = [
        { value: 'Broadband', label: 'Broadband' },
    ];

    const TypeOptions = [
        { value: 'Complaint', label: 'Complaint' },
        { value: 'Collection', label: 'Collection' },
        { value: 'otherRequest', label: 'Other Request' },
    ];

    // Handle input changes
    const handleChange = (e, maxLength) => {
        const { name, type, checked, value } = e.target;
			const newValue = type === 'checkbox' ? checked : value;
			if (value.length <= maxLength) {
			setFormData((prevState) => ({
			...prevState,
			[name]: newValue
			})); 
		}
    };

    // Submit the form
    const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
        let errors = {};

        if (!formData.name) {
			errors.name = "Name is required";
		}
		
		if (!formData.shortCode) {
			errors.shortCode = "ShortCode is required";
		}
		
		
		if (!connectionType?.value) {
			errors.connectionType = "connectionType is required";
		}
		
		
		if (!Type.value) {
			errors.Type = "Type is required";
		}
		
		if (!formData.TAT) {
			errors.TAT = "TAT is required";
		}
		
	
		if (errors && Object.keys(errors).length === 0) {
			console.log("Form submitted successfully!",);
		  } else {
			console.log("Validation Errors:", errors);
			setErrors(errors);
            setLoading(false);
			return false;
		  }

          const data = {
            ...formData,
            connectionType: connectionType.value,
            Type: Type?.value
          }
      
        let apiUrl;  
          if(editData.id){
            apiUrl = `${API_URL}/api/ticket-head/update/${editData.id}`
          }else{
              apiUrl = `${API_URL}/api/ticket-head/create`;
          }
        axios
            .post(apiUrl, data)
            .then((response) => {
                setLoading(false);
                ToggleMasterAddService();
                Swal.fire('Success', response.data.message, 'success');
                dispatch(GetAllTicketHead());
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
                        <Label for="name">Name <span style={{color: "red"}}>*</span></Label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange(e, 50)}
                            placeholder="Enter name"
                        />
                        {errors?.name && (
						<span className='validationError'>
							{errors?.name}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="date">ShortCode <span style={{color: "red"}}>*</span></Label>
                        <Input
                            type="text"
                            name="shortCode"
                            value={formData.shortCode}
                            onChange={(e) => handleChange(e, 50)}
                        />
                        {errors?.shortCode && (
						<span className='validationError'>
							{errors?.shortCode}
						</span>
					)}
                    </FormGroup>
                </Col>
               
                <Col md={6}>
                    <FormGroup>
                        <Label for="connectionType">connectionType <span style={{color: "red"}}>*</span></Label>
                        <SelectBox
                            setSelcted={setConnectionType}
                            options={connectionTypeOptions}
                            initialValue={connectionType}
                        />                       
                        {errors?.connectionType && (
						<span className='validationError'>
							{errors?.connectionType}
						</span>
					)}
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <Label for="connectionType">Type <span style={{color: "red"}}>*</span></Label>
                        <SelectBox
                            setSelcted={setType}
                            options={TypeOptions}
                            initialValue={Type}
                        />                       
                        {errors?.Type && (
						<span className='validationError'>
							{errors?.Type}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="TAT">TAT</Label>
                        <Input
                            type="text"
                            name="TAT"
                            value={formData.TAT}
                            onChange={(e) => handleChange(e, 200)}
                            placeholder="Enter TAT"
                            rows="1"
                        />
                    </FormGroup>
                </Col>
                <Col md={12}>
                    <Button type="button" onClick={handleSubmit} color="primary" disabled={Loading}>
                        {Loading ? <BounceLoader size={20} color="#fff" /> :  editData?.id ? 'Update' : 'Submit'}
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default AddTicketHead;