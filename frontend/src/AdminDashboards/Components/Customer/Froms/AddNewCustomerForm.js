import React, {Fragment, useEffect, useState} from 'react'
import {
	Button,
	Col,
	FormGroup,
	Input,
	Label,
	Row,
} from 'reactstrap';
import SelectBox from '../../../Elements/SelectBox';
import {Formik} from 'formik';
import * as ALlIcon from "react-icons/fa"
import {useDispatch, useSelector} from 'react-redux';
import SeviceAddReducer from '../../../../Store/Reducers/Dashboard/ServiceAddReducer';
import { GetAllCustomers } from '../../../../Store/Actions/Dashboard/Customer/CustomerActions';
import axios from 'axios';
import {API_URL} from '../../../../config';
import Swal from 'sweetalert2';
import ImageUploadReducer from '../../../../Store/Reducers/ImageUploadReducers';
import { ImageUploadAction } from '../../../../Store/Actions/ImageUploadAction';
import { BounceLoader } from 'react-spinners';
import zIndex from '@mui/material/styles/zIndex';
import { useAuth } from '../../../../Context/userAuthContext';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AddNewCustomerForm = ({prop, data}) => {

	const dispatch = useDispatch()
	const [inputValue, setInputValue] = useState([]);
    const [errors, setErrors]= useState([]);
    const [isLoading, SetIsLoading]= useState(false)
	const [image, setImage] = useState(null)
	const [frontAadharImage, setFrontAadharImage] = useState(null);
	const [backAadharImage, setBackAadharImage] = useState(null);
	const [panImage, setPanImage] = useState(null);
	const [otherIdImage, setOtherIdImage] = useState(null);
	const [signature, setSignature] = useState(null);
	const [gender, setGender] = useState(null)
	const [payment_method, setPaymentMethod] = useState('')
	const [appartment, setAppartment] = useState('')
	const [block, setBlock] = useState('')
	const [area, setArea] = useState('')

	const handleImageChange = (event, setImageFunction) => {
		const file = event.target.files[0];
		const allowedExtensions = ['.jpg', '.jpeg', '.png'];
		if (file) {
			const fileName = file.name;
			const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
			if (allowedExtensions.includes(fileExtension)) {
				setImageFunction(file);
			} else {
				alert("Please select a valid image file (JPG, JPEG, PNG).");
				event.target.value = null;
			}
		}
	};	

	const payment_options = [
		{
			label: "Cash",
			value: "Cash"
		}, 
		{
			label: "Online",
			value: "Online"
		}, 
		{
			label: "Both",
			value: "Both"
		}
	];

	const gender_option = [
		{
			value: 'Male',
			label: 'Male'
		}, {
			value: 'Female',
			label: 'Female'
		},
		{
			value: 'other',
			label: 'Other'
		},
	];

	const apartment_options = [
		{ value: "Shiv Shakti Apartment", label: "Shiv Shakti Apartment" },
		{ value: "Lottan Apartment", label: "Lottan Apartment" },
		{ value: "Sai Apartment", label: "Sai Apartment" },
		{ value: "Geetanjali Apartment", label: "Geetanjali Apartment" },
		{ value: "Ganga Apartment", label: "Ganga Apartment" },
		{ value: "Deepmala Apartment", label: "Deepmala Apartment" },
		{ value: "Yamuna Apartment", label: "Yamuna Apartment" },
		{ value: "Krishna Apartment", label: "Krishna Apartment" },
		{ value: "Ashirwad Apartment", label: "Ashirwad Apartment" },
		{ value: "Swagat Apartment", label: "Swagat Apartment" },
	];
	

	const area_option = [
		{ value: "Tigri", label: "Tigri" },
		{ value: "Tigri Village", label: "Tigri Village" },
		{ value: "Tigri Extn.", label: "Tigri Extn." },
		{ value: "Tigri Camp", label: "Tigri Camp" },
		{ value: "Karnal Farm Tigri", label: "Karnal Farm Tigri" },
		{ value: "DDA Flat Tigri", label: "DDA Flat Tigri" },
		{ value: "Khanpur", label: "Khanpur" },
		{ value: "Khanpur Extn.", label: "Khanpur Extn." },
		{ value: "Shiv Park", label: "Shiv Park" },
		{ value: "Duggal Colony", label: "Duggal Colony" },
		{ value: "Devli Road", label: "Devli Road" },
		{ value: "Devli Extension", label: "Devli Extension" },
		{ value: "Krishna Park", label: "Krishna Park" },
		{ value: "Jawahar Park", label: "Jawahar Park" },
		{ value: "Raju Park", label: "Raju Park" },
		{ value: "Durga Vihar", label: "Durga Vihar" },
		{ value: "Bandh Road Sangam Vihar", label: "Bandh Road Sangam Vihar" },
		{ value: "Sangam Vihar", label: "Sangam Vihar" },
		{ value: "Madangir", label: "Madangir" },
		{ value: "Dakshinpuri", label: "Dakshinpuri" },
		{ value: "BSF Campus", label: "BSF Campus" },
		{ value: "RPS Colony", label: "RPS Colony" },
	];
	
	const block_option = [
		{ value: "A", label: "A" },
		{ value: "B", label: "B" },
		{ value: "C", label: "C" },
		{ value: "D", label: "D" },
		{ value: "E", label: "E" },
		{ value: "F", label: "F" },
		{ value: "G", label: "G" },
		{ value: "H", label: "H" },
	];
	
	const createCustomer = (e) => {
		e.preventDefault();
        SetIsLoading(true)
        let errors = {};

        if (!inputValue.name) {
			errors.name = "Name is required";
		}
		
		if (!inputValue.address) {
			errors.address = "Address is required";
		}

		if (!inputValue.mobile) {
			errors.mobile = "Mobile number is required";
		} else if (!/^\d{10}$/.test(inputValue.mobile)) {
			errors.mobile = "Mobile number should be 10 digits";
		}
	
		if (errors && Object.keys(errors).length === 0) {
			console.log("Form submitted successfully!",);
		  } else {
			console.log("Validation Errors:", errors);
			setErrors(errors);
			SetIsLoading(false);
			return false;
		  }
		  
		  const data ={
			...inputValue,
			image: image,
			frontAadharImage: frontAadharImage,
			backAadharImage: backAadharImage,
			panImage: panImage,
			otherIdImage: otherIdImage,
			signature: signature,
			gender: gender?.value,
			block: block?.value,
			area: area?.value,
			apartment: appartment?.value,
			payment_method: payment_method?.value
		  }

		  const formData = new FormData();

		  for (const key in data) {
			  formData.append(key, data[key]);
		  }

		const apiUrl = `${API_URL}/customer/signup`;
		axios.post(apiUrl, formData)
			.then(response => {
				if (response.data.status === true) {
					prop();
					Swal.fire(
						'Successfully!',
						'Your Customer has been Added.',
						'success'
					)
					dispatch(GetAllCustomers())
				} else {
					Swal.fire({
						title: response.data.message,
						icon: "error",
					})
				}
			
			})
			.catch(error => {
				console.error('Error:', error);
			});
			SetIsLoading(false);
	};

	const handleKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        if (!/^[a-zA-Z\s]+$/.test(charStr)) {
            e.preventDefault();
            }
    };

	const handleChange = (e, maxLength) => {
		const { name, type, checked, value } = e.target;
			const newValue = type === 'checkbox' ? checked : value;
			if (value.length <= maxLength) {
			setInputValue((prevState) => ({
			...prevState,
			[name]: newValue
			})); 
		}
	};

	return (
		<Fragment>
			<Row>
			<Col md={6}>
					<FormGroup>
						<Label for="name">Name  <span style={{color: "red"}}>*</span></Label>
						<Input name='name'
							onChange={(e) => handleChange(e, 50)}
							value={inputValue?.name}
							placeholder='Name'
							onKeyPress={handleKeyPress}
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
					<Label for="gender">Gender </Label>
					<SelectBox options={gender_option} setSelcted={setGender} initialValue={gender}/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="address">Address</Label>
				<Input
					type="textarea"
					name="address"
					value={inputValue?.address}
					onChange={(e) => handleChange(e, 200)}
					placeholder="Enter Address"
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="t_address">Temporary Address</Label>
				<Input
					type="textarea"
					name="t_address"
					value={inputValue?.t_address}
					onChange={(e) => handleChange(e, 200)}
					placeholder="Enter Temporary Address"
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="mobile">Mobile No.</Label>
				<Input
					type="text"
					name="mobile"
					value={inputValue?.mobile}
					onChange={(e) => handleChange(e, 10)}
					placeholder="Enter Mobile No."
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="whatsapp_no">WhatsApp No.</Label>
				<Input
					type="text"
					name="whatsapp_no"
					value={inputValue?.whatsapp_no}
					onChange={(e) => handleChange(e, 10)}
					placeholder="Enter WhatsApp No."
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="alternate_no">Alternate No.</Label>
				<Input
					type="text"
					name="alternate_no"
					value={inputValue?.alternate_no}
					onChange={(e) => handleChange(e, 10)}
					placeholder="Enter Alternate No."
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="aadhar_no">Aadhar No.</Label>
				<Input
					type="text"
					name="aadhar_no"
					value={inputValue?.aadhar_no}
					onChange={(e) => handleChange(e, 12)}
					placeholder="Enter Aadhar No."
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="other_id">Other ID</Label>
				<Input
					type="text"
					name="other_id"
					value={inputValue?.other_id}
					onChange={(e) => handleChange(e, 50)}
					placeholder="Enter Other ID"
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="pan_no">PAN No.</Label>
				<Input
					type="text"
					name="pan_no"
					value={inputValue?.pan_no}
					onChange={(e) => handleChange(e, 10)}
					placeholder="Enter PAN No."
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="dob">Date of Birth</Label>
				<Input
					type="date"
					name="dob"
					value={inputValue?.dob}
					onChange={(e) => handleChange(e, 50)}
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="doa">Date of Anniversary</Label>
				<Input
					type="date"
					name="doa"
					value={inputValue?.doa}
					onChange={(e) => handleChange(e, 50)}
				/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="area">Area</Label>
				<SelectBox options={area_option} setSelcted={setArea} initialValue={area}/>
				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="block">Block</Label>
				
				<SelectBox options={block_option} setSelcted={setBlock} initialValue={block}/>

				</FormGroup>
			</Col>
			<Col md={6}>
				<FormGroup>
				<Label for="apartment">Apartment</Label>
				<SelectBox options={apartment_options} setSelcted={setAppartment} initialValue={appartment}/>
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="bill_date">Bill Date</Label>
				<Input
					type="date"
					name="bill_date"
					value={inputValue?.bill_date}
					onChange={(e) => handleChange(e, 50)}
				/>
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="image">Upload Image</Label>
				<Input type="file" name="image" onChange={(e) => handleImageChange(e, setImage)} />
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="front_aadhar_image">Front Aadhar Image</Label>
				<Input type="file" name="front_aadhar_image" onChange={(e) => handleImageChange(e, setFrontAadharImage)} />
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="back_aadhar_image">Back Aadhar Image</Label>
				<Input type="file" name="back_aadhar_image" onChange={(e) => handleImageChange(e, setBackAadharImage)} />
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="pan_image">PAN Image</Label>
				<Input type="file" name="pan_image" onChange={(e) => handleImageChange(e, setPanImage)} />
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="other_id_image">Other ID Image</Label>
				<Input type="file" name="other_id_image" onChange={(e) => handleImageChange(e, setOtherIdImage)} />
				</FormGroup>
			</Col>

			<Col md={6}>
				<FormGroup>
				<Label for="signature">Signature</Label>
				<Input type="file" name="signature" onChange={(e) => handleImageChange(e, setSignature)} />
				</FormGroup>
			</Col>

			{/* <Col md={6}>
				<FormGroup>
				<Label for="payment_method">Payment Method</Label>
				<SelectBox
					options={payment_options}
					setSelcted={setPaymentMethod}
					initialValue={payment_method}
				/>
				</FormGroup>
			</Col>

			{(payment_method?.value === "Both" || payment_method?.value === "Online") && 
				<Col md={6}>
					<FormGroup>
					<Label for="payment">Online Amount</Label>
					<Input
						type="text"
						name="online"
						value={inputValue?.online}
						onChange={(e) => handleChange(e, 10)}
						placeholder="Enter Payment Amount"
					/>
					</FormGroup>
				</Col>
				}
				
			{(payment_method?.value === "Both" || payment_method?.value === "Cash") && 
			<Col md={6}>
				<FormGroup>
				<Label for="payment">Cash Amount</Label>
				<Input
					type="text"
					name="cash"
					value={inputValue?.cash}
					onChange={(e) => handleChange(e, 10)}
					placeholder="Enter Payment Amount"
				/>
				</FormGroup>
			</Col>
			} */}
						
			<Button
				className="bg-primary h-fit text-blue"
				onClick={createCustomer}
				disabled={isLoading}
			>
				Submit
			</Button>
			</Row>
		</Fragment>
	)
}

export default AddNewCustomerForm
