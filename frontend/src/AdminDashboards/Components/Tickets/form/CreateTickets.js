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
        { value: '09:00-12:00', label: '12:00-15:00' },
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
    const handleSubmit = () => {
        const data = {
            ...formData,
            ticketType: ticketType?.value,
            timeSlot: timeSlot?.value
        }
        console.log("data---",data)
        // setLoading(true);

        // const apiUrl = `${API_URL}/plan/add`;
        // axios
        //     .post(apiUrl, formData)
        //     .then((response) => {
        //         setLoading(false);
        //         ToggleMasterAddService();
        //         Swal.fire('Success', response.data.message, 'success');
        //         dispatch(GetAllServices());
        //     })
        //     .catch((error) => {
        //         setLoading(false);
        //         console.error('Error:', error);
        //         Swal.fire('Error', 'Something went wrong.', 'error');
        //     });
    };

    return (
        <>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label for="ticketType">Ticket Type</Label>
                        <SelectBox
                            setSelcted={setTicketType}
                            options={ticketTypeOptions}
                            initialValue={ticketType}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleChange(e, 50)}
                            placeholder="Enter title"
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => handleChange(e, 50)}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="timeSlot">Time Slot</Label>
                        <SelectBox
                        options={timeSlotTypeOptions}
                        setSelcted={setTimeSlot}
                        initialValue={timeSlot}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="mobileNo">Mobile Number</Label>
                        <Input
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={(e) => handleChange(e, 10)}
                            placeholder="Enter mobile number"
                        />
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
                            rows="4"
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