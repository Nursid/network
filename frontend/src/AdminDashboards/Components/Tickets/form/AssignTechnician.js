import React, {useState, useEffect} from 'react';
import {
	Label,
	FormGroup,
	Input,
	Button,
	Row,
	Col
} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useDispatch} from 'react-redux';
import {BounceLoader} from 'react-spinners';
import {API_URL} from '../../../../config';
import SelectBox from '../../../Elements/SelectBox';

const AssignTechnician = ({ticketId, ToggleAssingTickets, GetAllTicket}) => {
	const dispatch = useDispatch();
	const [technicianId, setTechnicianId] = useState('');
    const [errors, setErrors]= useState([]);
    const [Loading, setLoading] = useState(false);
    const [GetAllServiceProvider, setGetAllServiceProvider] = useState([]);
	const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
        let errors = {};

        if (!technicianId.value) {
			errors.technicianId = "technicianId is required";
		}
        if (errors && Object.keys(errors).length === 0) {
			console.log("Form submitted successfully!",);
		  } else {
			console.log("Validation Errors:", errors);
			setErrors(errors);
            setLoading(false);
			return false;
		  }

		const apiUrl = `${API_URL}/api/ticket/update/${ticketId}`;
		// Make a POST request using Axios
		axios.post(apiUrl, {technician: technicianId.value}).then(response => {
			if (response.status === 200) { //
                ToggleAssingTickets();
				Swal.fire('Successfully!', response.data.message, 'success')
				dispatch(GetAllTicket());
			} else {
				Swal.fire({title: response.data.message, icon: "error"})
			}
		}).catch(error => {
			console.error('Error:', error);
		});
	};



    const getAllServicesProvider = async () => {
        try {
        const response = await axios.get(`${API_URL}/service-provider/getall`);
        if (response.status === 200) {
            const transformedData = response.data.data.map(item => ({ label: item.name, value: item.id }));
            setGetAllServiceProvider(transformedData);
        }
        } catch (error) {
        console.error("Error fetching service providers:", error);
        }
    }

    useEffect(()=>{
        getAllServicesProvider()
    }, [])

	return (
		<>
			<Row>
				<Col xs={12}>
					<FormGroup>
						<label className="form-label" htmlFor="serviceRemark">
							Select Technician
						</label>
						<SelectBox options={GetAllServiceProvider}
							setSelcted={setTechnicianId}
							initialValue={technicianId}/>
                            {errors?.technicianId && (
							<span className='validationError'>
								{errors?.technicianId}
							</span>
						)}
					</FormGroup>
				</Col>
				<Col md={12}>
					<Button type="button"
						onClick={handleSubmit}
						color="primary"
						disabled={Loading}>
						{
						Loading ? <BounceLoader size={20}
							color="#fff"/> : 'Submit'
					} </Button>
				</Col>

			</Row>


		</>
	)


}


export default AssignTechnician;