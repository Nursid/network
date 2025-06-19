import React, {Fragment, useState, useEffect} from 'react'
import {
	Button,
	Col,
	FormGroup,
	Input,
	Label,
	Row,
} from 'reactstrap';
import SelectBox from '../../../Elements/SelectBox';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import axios from 'axios';
import {API_URL} from '../../../../config';
import Swal from 'sweetalert2';
import {useDispatch} from 'react-redux';
import { GetAllCustomers } from '../../../../Store/Actions/Dashboard/Customer/CustomerActions';

// Custom validation function
const validateForm = (values) => {
	const errors = {};

	// Name validation
	if (!values.name) {
		errors.name = 'Name is required';
	} else if (values.name.length > 200) {
		errors.name = 'Name must be less than 200 characters';
	} else if (!/^[a-zA-Z\s]+$/.test(values.name)) {
		errors.name = 'Name can only contain letters and spaces';
	}

	// Username validation
	if (!values.username) {
		errors.username = 'Username is required';
	} else if (values.username.length > 50) {
		errors.username = 'Username must be less than 50 characters';
	}

	// Address validation
	if (!values.address) {
		errors.address = 'Address is required';
	} else if (values.address.length > 200) {
		errors.address = 'Address must be less than 200 characters';
	}

	// Temporary address validation
	if (values.t_address) {
		if (values.t_address.length > 200) {
			errors.t_address = 'Temporary address must be less than 200 characters';
		}
	}

	// Mobile validation
	if (!values.mobile) {
		errors.mobile = 'Mobile number is required';
	} else if (!/^\d{10}$/.test(values.mobile)) {
		errors.mobile = 'Mobile number must be exactly 10 digits';
	}

	// WhatsApp number validation
	if (values.whatsapp_no && !/^\d{10}$/.test(values.whatsapp_no)) {
		errors.whatsapp_no = 'WhatsApp number must be exactly 10 digits';
	}

	// Alternate number validation
	if (values.alternate_no && !/^\d{10}$/.test(values.alternate_no)) {
		errors.alternate_no = 'Alternate number must be exactly 10 digits';
	}

	// Aadhar number validation
	if (values.aadhar_no) {
		if (!/^\d{12}$/.test(values.aadhar_no)) {
			errors.aadhar_no = 'Aadhar number must be exactly 12 digits';
		}
	}

	// PAN number validation
	if (values.pan_no) {
		if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pan_no.toUpperCase())) {
			errors.pan_no = 'Invalid PAN format (e.g., ABCDE1234F)';
		}
	}

	// Date of birth validation
	if (values.dob) {
		const today = new Date();
		const birthDate = new Date(values.dob);
		const age = today.getFullYear() - birthDate.getFullYear();
		
		if (birthDate > today) {
			errors.dob = 'Date of birth cannot be in the future';
		} else if (age < 18) {
			errors.dob = 'Customer must be at least 18 years old';
		} else if (age > 120) {
			errors.dob = 'Please enter a valid date of birth';
		}
	}

	// Date of anniversary validation
	if (values.doa) {
		const today = new Date();
		const anniversaryDate = new Date(values.doa);
		
		if (anniversaryDate > today) {
			errors.doa = 'Anniversary date cannot be in the future';
		}
	}

	// Bill date validation
	if (values.bill_date) {
		const billDate = new Date(values.bill_date);
		const day = billDate.getDate();
		
		if (day < 1 || day > 31) {
			errors.bill_date = 'Please select a valid bill date';
		}
	}

	// Email validation
	if (values.email) {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			errors.email = 'Invalid email format';
		} else if (values.email.length > 100) {
			errors.email = 'Email must be less than 100 characters';
		}
	}

	return errors;
};

const UpdateCustomerForm = ({prop, updateData}) => {
	const dispatch = useDispatch();

	// Initial form values with existing data
	const initialValues = {
		name: updateData?.name || '',
		username: updateData?.username || '',
		address: updateData?.address || '',
		t_address: updateData?.t_address || '',
		mobile: updateData?.mobileno || updateData?.mobile || '',
		whatsapp_no: updateData?.whatsapp_no || '',
		alternate_no: updateData?.alternate_no || '',
		aadhar_no: updateData?.aadhar_no || '',
		other_id: updateData?.other_id || '',
		pan_no: updateData?.pan_no || '',
		dob: updateData?.dob || '',
		doa: updateData?.doa || '',
		bill_date: updateData?.bill_date || '',
		email: updateData?.email || '',
		online: updateData?.online || '',
		cash: updateData?.cash || ''
	};

	const [isLoading, SetIsLoading] = useState(false);
	
	// Initialize SelectBox states with proper object structure
	const [gender, setGender] = useState(
		updateData?.gender ? { value: updateData.gender, label: updateData.gender } : null
	);
	const [area, setArea] = useState(
		updateData?.area ? { value: updateData.area, label: updateData.area } : null
	);
	const [block, setBlock] = useState(
		updateData?.block ? { value: updateData.block, label: updateData.block } : null
	);
	const [appartment, setAppartment] = useState(
		updateData?.apartment || updateData?.appartment ? 
		{ value: updateData.apartment || updateData.appartment, label: updateData.apartment || updateData.appartment } : null
	);
	const [paymentMethod, setPaymentMethod] = useState(
		updateData?.payment_method ? { value: updateData.payment_method, label: updateData.payment_method } : null
	);
	
	const [image, setImage] = useState(null);
	const [frontAadharImage, setFrontAadharImage] = useState(null);
	const [backAadharImage, setBackAadharImage] = useState(null);
	const [panImage, setPanImage] = useState(null);
	const [otherIdImage, setOtherIdImage] = useState(null);
	const [signature, setSignature] = useState(null);

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
			label: "both",
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

	const UpdateCustomer = (values, { setSubmitting, setErrors }) => {
        SetIsLoading(true);

		const data = {
			...values,
			image: image,
			frontAadharImage: frontAadharImage,
			backAadharImage: backAadharImage,
			panImage: panImage,
			otherIdImage: otherIdImage,
			signature: signature,
			gender: gender?.value || null,
			block: block?.value || null,
			area: area?.value || null,
			apartment: appartment?.value || null,
			payment_method: paymentMethod?.value || null
		};

		const formData = new FormData();

		for (const key in data) {
			// Only append non-null and non-undefined values
			if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
				formData.append(key, data[key]);
			}
		}

		// Debug: Log the data being sent
		console.log('Update data being sent:', data);
		console.log('FormData entries:');
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		const apiUrl = `${API_URL}/customer/getupdate/${updateData.user_id}`;
		axios.put(apiUrl, formData, { 'Content-Type': 'multipart/form-data'})
			.then(response => {
				if (response.data.status === true) {
					prop();
					Swal.fire(
						'Updated!',
						response.data.message,
						'success'
					);
					dispatch(GetAllCustomers());
				} else {
					Swal.fire({
						title: response.data.message,
						icon: "error",
					});
				}
			})
			.catch(error => {
				console.error('Error:', error);
				if (error.response?.data?.errors) {
					setErrors(error.response.data.errors);
				}
			})
			.finally(() => {
				SetIsLoading(false);
				setSubmitting(false);
			});
	};

	const handleKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        if (!/^[a-zA-Z\s]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

	const handleNumericKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        // Allow only numeric characters
        if (!/^[0-9]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

	const handlePanKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        // Allow alphanumeric characters for PAN
        if (!/^[a-zA-Z0-9]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

	const handlePanChange = (e, setFieldValue) => {
        const value = e.target.value.toUpperCase();
        setFieldValue('pan_no', value);
    };

	return (
		<Fragment>
			<Formik
				initialValues={initialValues}
				validate={validateForm}
				onSubmit={UpdateCustomer}
				enableReinitialize={true}
			>
				{({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
					<Form>
						<Row>
							<Col md={6}>
								<FormGroup>
									<Label for="name">Name <span style={{color: "red"}}>*</span></Label>
									<Field
										as={Input}
										name="name"
										placeholder="Name"
										maxLength="50"
										onKeyPress={handleKeyPress}
									/>
									<ErrorMessage name="name" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="username">Username <span style={{color: "red"}}>*</span></Label>
									<Field
										as={Input}
										name="username"
										placeholder="Username"
										maxLength="50"
									/>
									<ErrorMessage name="username" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="gender">Gender</Label>
									<SelectBox options={gender_option} setSelcted={setGender} initialValue={gender} key={`gender-${updateData?.user_id}`}/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="address">Address <span style={{color: "red"}}>*</span></Label>
									<Field
										as={Input}
										type="textarea"
										name="address"
										placeholder="Enter Address"
									/>
									<ErrorMessage name="address" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="t_address">Temporary Address</Label>
									<Field
										as={Input}
										type="textarea"
										name="t_address"
										placeholder="Enter Temporary Address"
									/>
									<ErrorMessage name="t_address" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="mobile">Mobile No. <span style={{color: "red"}}>*</span></Label>
									<Field
										as={Input}
										type="tel"
										name="mobile"
										placeholder="Enter Mobile No."
										maxLength="10"
										onKeyPress={handleNumericKeyPress}
									/>
									<ErrorMessage name="mobile" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="whatsapp_no">WhatsApp No.</Label>
									<Field
										as={Input}
										type="tel"
										name="whatsapp_no"
										placeholder="Enter WhatsApp No."
										maxLength="10"
										onKeyPress={handleNumericKeyPress}
									/>
									<ErrorMessage name="whatsapp_no" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="alternate_no">Alternate No.</Label>
									<Field
										as={Input}
										type="tel"
										name="alternate_no"
										placeholder="Enter Alternate No."
										maxLength="10"
										onKeyPress={handleNumericKeyPress}
									/>
									<ErrorMessage name="alternate_no" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="aadhar_no">Aadhar No.</Label>
									<Field
										as={Input}
										type="text"
										name="aadhar_no"
										placeholder="Enter Aadhar No."
										maxLength="12"
										onKeyPress={handleNumericKeyPress}
									/>
									<ErrorMessage name="aadhar_no" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="other_id">Other ID</Label>
									<Field
										as={Input}
										type="text"
										name="other_id"
										placeholder="Enter Other ID"
									/>
									<ErrorMessage name="other_id" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="pan_no">PAN No.</Label>
									<Field
										as={Input}
										type="text"
										name="pan_no"
										placeholder="Enter PAN No. (e.g., ABCDE1234F)"
										maxLength="10"
										onKeyPress={handlePanKeyPress}
										onChange={(e) => handlePanChange(e, setFieldValue)}
										style={{ textTransform: 'uppercase' }}
									/>
									<ErrorMessage name="pan_no" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="dob">Date of Birth</Label>
									<Field
										as={Input}
										type="date"
										name="dob"
									/>
									<ErrorMessage name="dob" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="doa">Date of Anniversary</Label>
									<Field
										as={Input}
										type="date"
										name="doa"
									/>
									<ErrorMessage name="doa" component="span" className="validationError" />
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="area">Area</Label>
									<SelectBox options={area_option} setSelcted={setArea} initialValue={area} key={`area-${updateData?.user_id}`}/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="block">Block</Label>
									<SelectBox options={block_option} setSelcted={setBlock} initialValue={block} key={`block-${updateData?.user_id}`}/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="apartment">Apartment</Label>
									<SelectBox options={apartment_options} setSelcted={setAppartment} initialValue={appartment} key={`apartment-${updateData?.user_id}`}/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="bill_date">Bill Date</Label>
									<Field
										as={Input}
										type="date"
										name="bill_date"
									/>
									<ErrorMessage name="bill_date" component="span" className="validationError" />
								</FormGroup>
							</Col>

							<Col md={6}>
								<FormGroup>
									<Label for="email">Email</Label>
									<Field
										as={Input}
										type="email"
										name="email"
										placeholder="Enter Email"
									/>
									<ErrorMessage name="email" component="span" className="validationError" />
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

							<Col md={6}>
								<FormGroup>
									<Label for="payment_method">Payment Method</Label>
									<SelectBox
										options={payment_options}
										setSelcted={setPaymentMethod}
										initialValue={paymentMethod}
										key={`payment-${updateData?.user_id}`}
									/>
								</FormGroup>
							</Col>

							{(paymentMethod?.value === "Both" || paymentMethod?.value === "Online") && 
								<Col md={6}>
									<FormGroup>
										<Label for="online">Online Amount</Label>
										<Field
											as={Input}
											type="text"
											name="online"
											placeholder="Enter Online Payment Amount"
										/>
									</FormGroup>
								</Col>
							}

							{(paymentMethod?.value === "Both" || paymentMethod?.value === "Cash") && 
								<Col md={6}>
									<FormGroup>
										<Label for="cash">Cash Amount</Label>
										<Field
											as={Input}
											type="text"
											name="cash"
											placeholder="Enter Cash Payment Amount"
										/>
									</FormGroup>
								</Col>
							}

							<Col md={12}>
								<Button
									type="submit"
									className="bg-primary h-fit text-blue"
									disabled={isLoading || isSubmitting}
								>
									Update
								</Button>
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Fragment>
	)
}

export default UpdateCustomerForm
