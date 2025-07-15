import React, {Fragment, useEffect, useState} from 'react'
import {
	Button,
	Col,
	FormGroup,
	Input,
	Label,
	Row,
	Card,
	CardBody,
	CardHeader,
	Progress,
} from 'reactstrap';
import SelectBox from '../../../Elements/SelectBox';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as ALlIcon from "react-icons/fa"
import {useDispatch, useSelector} from 'react-redux';
import { GetAllCustomers } from '../../../../Store/Actions/Dashboard/Customer/CustomerActions';
import axios from 'axios';
import {API_URL} from '../../../../config';
import Swal from 'sweetalert2';
import { BounceLoader } from 'react-spinners';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// Custom validation function for basic info
const validateBasicInfo = (values) => {
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

// Billing and KYC validation function
const validateBillingKYC = (values, showKYC) => {
	const errors = {};

	// Billing amount validation
	if (values.billing_amount) {
		if (!/^\d+(\.\d{1,2})?$/.test(values.billing_amount)) {
			errors.billing_amount = 'Please enter a valid amount (e.g., 100 or 100.50)';
		} else if (parseFloat(values.billing_amount) <= 0) {
			errors.billing_amount = 'Billing amount must be greater than 0';
		} else if (parseFloat(values.billing_amount) > 999999.99) {
			errors.billing_amount = 'Billing amount cannot exceed 999999.99';
		}
	}

	// KYC validations (only if KYC section is enabled)
	if (showKYC) {
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
	}

	return errors;
};

const UpdateCustomerForm = ({prop, updateData}) => {

	const dispatch = useDispatch()
    const [isLoading, SetIsLoading] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	
	// Form data state - initialize with existing data
	const [formData, setFormData] = useState({
		// Basic Info
		name: updateData?.name || '',
		username: updateData?.username || '',
		address: updateData?.address || '',
		t_address: updateData?.t_address || '',
		mobile: updateData?.mobileno || updateData?.mobile || '',
		whatsapp_no: updateData?.whatsapp_no || '',
		alternate_no: updateData?.alternate_no || '',
		dob: updateData?.dob || '',
		doa: updateData?.doa || '',
		email: updateData?.email || '',
		// Package Info
		selectedPackage: updateData?.selectedPackage ? {
			value: updateData.selectedPackage,
			label: `Package ID: ${updateData.selectedPackage}`
		} : null,
		packageDetails: updateData?.packageDetails || '',
		// Inventory Items
		selectedItems: updateData?.selectedItems ? 
			(typeof updateData.selectedItems === 'string' ? 
				JSON.parse(updateData.selectedItems) : updateData.selectedItems) : [],
		// Billing Info
		bill_date: updateData?.bill_date || '',
		billing_amount: updateData?.billing_amount || '',
		payment_method: updateData?.payment_method ? {
			value: updateData.payment_method,
			label: updateData.payment_method
		} : null,
		// KYC Info
		aadhar_no: updateData?.aadhar_no || '',
		other_id: updateData?.other_id || '',
		pan_no: updateData?.pan_no || '',
	});

	// File uploads state
	const [image, setImage] = useState(null)
	const [frontAadharImage, setFrontAadharImage] = useState(null);
	const [backAadharImage, setBackAadharImage] = useState(null);
	const [panImage, setPanImage] = useState(null);
	const [otherIdImage, setOtherIdImage] = useState(null);
	const [signature, setSignature] = useState(null);
	
	// Selection states - initialize with existing data
	const [gender, setGender] = useState(
		updateData?.gender ? { value: updateData.gender, label: updateData.gender } : null
	)
	const [appartment, setAppartment] = useState(
		updateData?.apartment || updateData?.appartment ? 
		{ value: updateData.apartment || updateData.appartment, label: updateData.apartment || updateData.appartment } : null
	)
	const [block, setBlock] = useState(
		updateData?.block ? { value: updateData.block, label: updateData.block } : null
	)
	const [area, setArea] = useState(
		updateData?.area ? { value: updateData.area, label: updateData.area } : null
	)
	const [showKYC, setShowKYC] = useState(
		!!(updateData?.aadhar_no || updateData?.pan_no || updateData?.other_id)
	);

	// Data states
	const [packages, setPackages] = useState([]);
	const [inventoryItems, setInventoryItems] = useState([]);

	// Fetch packages and inventory on component mount
	useEffect(() => {
		fetchPackages();
		fetchInventoryItems();
	}, []);

	const fetchPackages = async () => {
		try {
			const response = await axios.get(`${API_URL}/plan/getall`);
			if (response.data.status === 200) {
				const packageOptions = response.data.data.map(pkg => ({
					value: pkg.id,
					label: `${pkg.plan} - ₹${pkg.finalPrice}`,
					...pkg
				}));
				setPackages(packageOptions);
			}
		} catch (error) {
			console.error('Error fetching packages:', error);
		}
	};

	const fetchInventoryItems = async () => {
		try {
			const response = await axios.get(`${API_URL}/inventry/getall`);
			if (response.status === 200) {
				const itemOptions = response.data.map(item => ({
					value: item.id,
					label: `${item.item} (Available: ${item.qty})`,
					...item
				}));
				setInventoryItems(itemOptions);
			}
		} catch (error) {
			console.error('Error fetching inventory:', error);
		}
	};

	const handleImageChange = (event, setImageFunction) => {
		const file = event.target.files[0];
		const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
		const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
		const maxFileSize = 5 * 1024 * 1024; // 5MB

		if (file) {
			// Check file size
			if (file.size > maxFileSize) {
				Swal.fire({
					title: 'File Too Large',
					text: 'Please select an image file smaller than 5MB.',
					icon: 'error'
				});
				event.target.value = null;
				return;
			}

			// Check file extension
			const fileName = file.name;
			const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
			
			// Check MIME type
			const fileMimeType = file.type.toLowerCase();
			
			if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimeType)) {
				setImageFunction(file);
			} else {
				Swal.fire({
					title: 'Invalid File Type',
					text: 'Please select a valid image file (JPG, JPEG, PNG, GIF, BMP, WEBP).',
					icon: 'error'
				});
				event.target.value = null;
			}
		}
	};	

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

	const payment_method_options = [
		{ value: "Cash", label: "Cash" },
		{ value: "Online", label: "Online" },
		{ value: "Cheque", label: "Cheque" },
		{ value: "UPI", label: "UPI" },
	];

	const handleNext = (values) => {
		setFormData(prev => ({ ...prev, ...values }));
		setCurrentStep(prev => prev + 1);
	};

	const handlePrevious = () => {
		setCurrentStep(prev => prev - 1);
	};

	const handleInventoryItemAdd = () => {
		setFormData(prev => ({
			...prev,
			selectedItems: [...prev.selectedItems, { item: null, quantity: 1 }]
		}));
	};

	const handleInventoryItemRemove = (index) => {
		setFormData(prev => ({
			...prev,
			selectedItems: prev.selectedItems.filter((_, i) => i !== index)
		}));
	};

	const handleInventoryItemChange = (index, field, value) => {
		setFormData(prev => ({
			...prev,
			selectedItems: prev.selectedItems.map((item, i) => 
				i === index ? { ...item, [field]: value } : item
			)
		}));
	};

	const updateCustomer = async (values) => {
        SetIsLoading(true);
		  
		const finalData = {
			...formData,
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
			payment_method: formData.payment_method?.value || null,
			selectedPackage: formData.selectedPackage?.value || null,
			selectedItems: JSON.stringify(formData.selectedItems)
		};

		const formDataToSend = new FormData();

		for (const key in finalData) {
			if (finalData[key] !== null && finalData[key] !== undefined && finalData[key] !== '') {
				formDataToSend.append(key, finalData[key]);
			}
		}

		try {
			const apiUrl = `${API_URL}/customer/getupdate/${updateData.user_id || updateData.id}`;
			const response = await axios.put(apiUrl, formDataToSend);
			
			if (response.data.status === true) {
				prop();
				Swal.fire('Successfully!', 'Customer has been updated.', 'success');
				dispatch(GetAllCustomers());
			} else {
				Swal.fire({
					title: response.data.message,
					icon: "error",
				});
			}
		} catch (error) {
			console.error('Error:', error);
			Swal.fire({
				title: 'Error occurred while updating customer',
				icon: "error",
			});
		} finally {
			SetIsLoading(false);
		}
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
        if (!/^[0-9]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

	const handlePanKeyPress = (e) => {
        const charCode = e.which || e.keyCode;
        const charStr = String.fromCharCode(charCode);
        if (!/^[a-zA-Z0-9]+$/.test(charStr)) {
            e.preventDefault();
        }
    };

	const handlePanChange = (e, setFieldValue) => {
        const value = e.target.value.toUpperCase();
        setFieldValue('pan_no', value);
    };

	const getStepTitle = () => {
		switch(currentStep) {
			case 1: return 'Update Basic Information';
			case 2: return 'Update Package Selection';
			case 3: return 'Update Inventory Items';
			case 4: return 'Update Billing & KYC Details';
			default: return 'Update Customer';
		}
	};

	const renderProgressBar = () => {
		const progress = (currentStep / 4) * 100;
		return (
			<div className="mb-4">
				<div className="d-flex justify-content-between mb-2">
					<span className="small">Step {currentStep} of 4</span>
					<span className="small">{Math.round(progress)}% Complete</span>
				</div>
				<Progress value={progress} color="primary" />
			</div>
		);
	};

	// Step 1: Basic Information
	const renderBasicInfoStep = () => (
		<Formik
			initialValues={{
				name: formData.name,
				username: formData.username,
				address: formData.address,
				t_address: formData.t_address,
				mobile: formData.mobile,
				whatsapp_no: formData.whatsapp_no,
				alternate_no: formData.alternate_no,
				dob: formData.dob,
				doa: formData.doa,
				email: formData.email,
			}}
			validate={validateBasicInfo}
			onSubmit={handleNext}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
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
								<SelectBox options={gender_option} setSelcted={setGender} initialValue={gender}/>
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
								<Input 
								type="file" 
								name="image" 
								accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
								onChange={(e) => handleImageChange(e, setImage)} 
							/>
								{updateData?.image && (
									<small className="text-muted">Current: {updateData.image}</small>
								)}
							</FormGroup>
						</Col>
					</Row>
					<div className="d-flex justify-content-end">
						<Button type="submit" color="primary">
							Next <ALlIcon.FaArrowRight className="ml-2" />
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);

	// Step 2: Package Selection
	const renderPackageStep = () => (
		<div>
			<Row>
				<Col md={12}>
					<FormGroup>
						<Label for="package">Select Package</Label>
						<SelectBox 
							options={packages} 
							setSelcted={(value) => setFormData(prev => ({ ...prev, selectedPackage: value }))} 
							initialValue={formData.selectedPackage}
						/>
					</FormGroup>
				</Col>
				{formData.selectedPackage && (
					<Col md={12}>
						<Card>
							<CardHeader>
								<h5>Package Details</h5>
							</CardHeader>
							<CardBody>
								<p><strong>Plan:</strong> {formData.selectedPackage.plan}</p>
								<p><strong>Connection Type:</strong> {formData.selectedPackage.connectionType}</p>
								<p><strong>Code:</strong> {formData.selectedPackage.code}</p>
								<p><strong>Base Price:</strong> ₹{formData.selectedPackage.basePrice}</p>
								<p><strong>Final Price:</strong> ₹{formData.selectedPackage.finalPrice}</p>
								<p><strong>Duration:</strong> {formData.selectedPackage.days ? 'Daily' : 'Monthly'}</p>
							</CardBody>
						</Card>
					</Col>
				)}
				<Col md={12}>
					<FormGroup>
						<Label for="packageDetails">Package Details/Notes</Label>
						<Input
							type="textarea"
							value={formData.packageDetails}
							onChange={(e) => setFormData(prev => ({ ...prev, packageDetails: e.target.value }))}
							placeholder="Enter any additional package details or notes"
						/>
					</FormGroup>
				</Col>
			</Row>
			<div className="d-flex justify-content-between">
				<Button color="secondary" onClick={handlePrevious}>
					<ALlIcon.FaArrowLeft className="mr-2" /> Previous
				</Button>
				<Button color="primary" onClick={() => handleNext({})}>
					Next <ALlIcon.FaArrowRight className="ml-2" />
				</Button>
			</div>
		</div>
	);

	// Step 3: Inventory Items
	const renderInventoryStep = () => (
		<div>
			<Row>
				<Col md={12}>
					<div className="d-flex justify-content-between align-items-center mb-3">
						<h5>Select Inventory Items</h5>
						<Button color="success" size="sm" onClick={handleInventoryItemAdd}>
							<ALlIcon.FaPlus className="mr-2" /> Add Item
						</Button>
					</div>
				</Col>
			</Row>
			{formData.selectedItems.map((item, index) => (
				<Row key={index} className="mb-3 p-3 border rounded">
					<Col md={5}>
						<FormGroup>
							<Label>Item</Label>
							<SelectBox 
								options={inventoryItems}
								setSelcted={(value) => handleInventoryItemChange(index, 'item', value)}
								initialValue={item.item}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<Label>Quantity</Label>
							<Input
								type="number"
								min="1"
								value={item.quantity}
								onChange={(e) => handleInventoryItemChange(index, 'quantity', parseInt(e.target.value))}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<Label>Available</Label>
							<Input
								type="text"
								value={item.item ? item.item.qty : ''}
								disabled
							/>
						</FormGroup>
					</Col>
					<Col md={1}>
						<FormGroup>
							<Label>&nbsp;</Label>
							<Button 
								color="danger" 
								size="sm" 
								onClick={() => handleInventoryItemRemove(index)}
								className="d-block"
							>
								<ALlIcon.FaTrash />
							</Button>
						</FormGroup>
					</Col>
				</Row>
			))}
			{formData.selectedItems.length === 0 && (
				<Row>
					<Col md={12}>
						<div className="text-center p-4 border rounded bg-light">
							<p className="mb-0">No inventory items selected. Click "Add Item" to add items.</p>
						</div>
					</Col>
				</Row>
			)}
			<div className="d-flex justify-content-between mt-4">
				<Button color="secondary" onClick={handlePrevious}>
					<ALlIcon.FaArrowLeft className="mr-2" /> Previous
				</Button>
				<Button color="primary" onClick={() => handleNext({})}>
					Next <ALlIcon.FaArrowRight className="ml-2" />
				</Button>
			</div>
		</div>
	);

	// Step 4: Billing & KYC Details
	const renderBillingKYCStep = () => (
		<Formik
			initialValues={{
				bill_date: formData.bill_date,
				billing_amount: formData.billing_amount,
				aadhar_no: formData.aadhar_no,
				other_id: formData.other_id,
				pan_no: formData.pan_no,
			}}
			validate={(values) => validateBillingKYC(values, showKYC)}
			onSubmit={updateCustomer}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
				<Form>
					<Row>
						<Col md={12}>
							<h5>Billing Details</h5>
							<hr />
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="bill_date">Bill Date</Label>
								<Field
									as={Input}
									type="date"
									name="bill_date"
								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="billing_amount">Billing Amount</Label>
								<Field
									as={Input}
									type="number"
									name="billing_amount"
									placeholder="Enter billing amount"
									min="0"
									step="0.01"
									onKeyPress={(e) => {
										// Allow numbers, decimal point, and backspace
										const charCode = e.which || e.keyCode;
										const charStr = String.fromCharCode(charCode);
										if (!/^[0-9.]$/.test(charStr) && charCode !== 8) {
											e.preventDefault();
										}
									}}
								/>
								<ErrorMessage name="billing_amount" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="payment_method">Payment Method</Label>
								<SelectBox 
									options={payment_method_options} 
									setSelcted={(value) => setFormData(prev => ({ ...prev, payment_method: value }))} 
									initialValue={formData.payment_method}
								/>
							</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={showKYC}
											onChange={(e) => setShowKYC(e.target.checked)}
											color="primary"
										/>
									}
									label="Update KYC Details (Aadhar, PAN, etc.)"
								/>
							</FormGroup>
						</Col>
						{showKYC && (
							<>
								<Col md={12}>
									<h5>KYC Details</h5>
									<hr />
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
										<Label for="front_aadhar_image">Front Aadhar Image</Label>
										<Input 
										type="file" 
										name="front_aadhar_image" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setFrontAadharImage)} 
									/>
										{updateData?.frontAadharImage && (
											<small className="text-muted">Current: {updateData.frontAadharImage}</small>
										)}
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="back_aadhar_image">Back Aadhar Image</Label>
										<Input 
										type="file" 
										name="back_aadhar_image" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setBackAadharImage)} 
									/>
										{updateData?.backAadharImage && (
											<small className="text-muted">Current: {updateData.backAadharImage}</small>
										)}
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="pan_image">PAN Image</Label>
										<Input 
										type="file" 
										name="pan_image" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setPanImage)} 
									/>
										{updateData?.panImage && (
											<small className="text-muted">Current: {updateData.panImage}</small>
										)}
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="other_id_image">Other ID Image</Label>
										<Input 
										type="file" 
										name="other_id_image" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setOtherIdImage)} 
									/>
										{updateData?.otherIdImage && (
											<small className="text-muted">Current: {updateData.otherIdImage}</small>
										)}
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="signature">Signature</Label>
										<Input 
										type="file" 
										name="signature" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setSignature)} 
									/>
										{updateData?.signature && (
											<small className="text-muted">Current: {updateData.signature}</small>
										)}
									</FormGroup>
								</Col>
							</>
						)}
					</Row>
					<div className="d-flex justify-content-between">
						<Button color="secondary" onClick={handlePrevious}>
							<ALlIcon.FaArrowLeft className="mr-2" /> Previous
						</Button>
						<Button
							type="submit"
							color="success"
							disabled={isLoading || isSubmitting}
						>
							{isLoading && <BounceLoader size={20} color="#fff" className="mr-2" />}
							Update <ALlIcon.FaCheck className="ml-2" />
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);

	const renderCurrentStep = () => {
		switch(currentStep) {
			case 1: return renderBasicInfoStep();
			case 2: return renderPackageStep();
			case 3: return renderInventoryStep();
			case 4: return renderBillingKYCStep();
			default: return renderBasicInfoStep();
		}
	};

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h4>{getStepTitle()}</h4>
					{renderProgressBar()}
				</CardHeader>
				<CardBody>
					{renderCurrentStep()}
				</CardBody>
			</Card>
		</Fragment>
	)
}

export default UpdateCustomerForm
