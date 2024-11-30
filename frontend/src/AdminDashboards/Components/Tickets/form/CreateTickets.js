import React, { useState } from 'react';
import { Label, FormGroup, Input, Button, Row, Col } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import { GetAllServices } from '../../../../Store/Actions/Dashboard/servicesAction';
import { API_URL } from '../../../../config';
import SelectBox from '../../../Elements/SelectBox';

const CreateTickets = ({ ToggleMasterAddService }) => {
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(false);
    const [ticketType, setTicketType] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [errors, setErrors]= useState([]);
    const [formData, setFormData] = useState({
        ticketType: '',
        title: '',
        date: '',
        details: '',
        timeSlot: '',
        mobileNo: ''
    });

    const ticketTypeOptions = [
        { value: 'complaint', label: 'Complaint' },
        { value: 'collection', label: 'Collection' },
        { value: 'other_request', label: 'Other Request' }
    ];

    const timeSlotTypeOptions = [
        { value: '09:00-12:00', label: '09:00-12:00' },
        { value: '12:00-15:00', label: '12:00-15:00' },
        { value: '15:00-18:00', label: '15:00-18:00' },
        { value: '18:00-21:00', label: '18:00-21:00' }
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

        if (!formData.title) {
			errors.title = "Title is required";
		}
		
		if (!formData.date) {
			errors.date = "date is required";
		}
		if (!ticketType.value) {
			errors.ticketType = "ticketType is required";
		}
		if (!timeSlot?.value) {
			errors.timeSlot = "timeSlot is required";
		}

		if (!formData.mobileNo) {
			errors.mobileNo = "Mobile number is required";
		} else if (!/^\d{10}$/.test(formData.mobileNo)) {
			errors.mobileNo = "Mobile number should be 10 digits";
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
            ticketType: ticketType?.value,
            timeSlot: timeSlot?.value
        }
      
        const apiUrl = `${API_URL}/api/ticket/create`;
        axios
            .post(apiUrl, data)
            .then((response) => {
                setLoading(false);
                ToggleMasterAddService();
                Swal.fire('Success', response.data.message, 'success');
                dispatch(GetAllServices());
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
                        <Label for="ticketType">Ticket Type <span style={{color: "red"}}>*</span></Label>
                        <SelectBox
                            setSelcted={setTicketType}
                            options={ticketTypeOptions}
                            initialValue={ticketType}
                        />
                        {errors?.ticketType && (
						<span className='validationError'>
							{errors?.ticketType}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="title">Title <span style={{color: "red"}}>*</span></Label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleChange(e, 50)}
                            placeholder="Enter title"
                        />
                        {errors?.title && (
						<span className='validationError'>
							{errors?.title}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="date">Date <span style={{color: "red"}}>*</span></Label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => handleChange(e, 50)}
                        />
                        {errors?.date && (
						<span className='validationError'>
							{errors?.date}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="timeSlot">Time Slot <span style={{color: "red"}}>*</span></Label>
                        <SelectBox
                        options={timeSlotTypeOptions}
                        setSelcted={setTimeSlot}
                        initialValue={timeSlot}
                        />
                        {errors?.timeSlot && (
						<span className='validationError'>
							{errors?.timeSlot}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="mobileNo">Mobile Number <span style={{color: "red"}}>*</span></Label>
                        <Input
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={(e) => handleChange(e, 10)}
                            placeholder="Enter mobile number"
                        />
                        {errors?.mobileNo && (
						<span className='validationError'>
							{errors?.mobileNo}
						</span>
					)}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="details">Details</Label>
                        <Input
                            type="textarea"
                            name="details"
                            value={formData.details}
                            onChange={(e) => handleChange(e, 200)}
                            placeholder="Enter details"
                            rows="1"
                        />
                    </FormGroup>
                </Col>
                <Col md={12}>
                    <Button type="button" onClick={handleSubmit} color="primary" disabled={Loading}>
                        {Loading ? <BounceLoader size={20} color="#fff" /> : 'Submit'}
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default CreateTickets;