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
import { gender_option, apartment_options, area_option, block_option, payment_method_options } from '../../../../Components/utils';


const checkCustomer = async (key, value) => {
	const response = await axios.post(`${API_URL}/customer/check-customer`, {
		[key]: value,
	});
	return response.data;
};

// Custom validation function for basic info (Step 1)
const validateBasicInfo = async (values) => {
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

	// Installation address validation
	if (values.installation_address) {
		if (values.installation_address.length > 200) {
			errors.installation_address = 'Installation address must be less than 200 characters';
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

// Function to validate individual fields on blur
const validateFieldOnBlur = async (fieldName, value, setFieldError) => {
	if (!value) return;

	let isValid = true;
	let errorMessage = '';

	switch (fieldName) {
		case 'username':
			if (value.length >= 3) { // Only check if username is at least 3 characters
				try {
					const response = await checkCustomer("username", value);
					if (response.isCustomer) {
						isValid = false;
						errorMessage = response.message;
					}
				} catch (error) {
					console.error('Error checking username on blur:', error);
				}
			}
			break;

		case 'mobile':
			if (value.length === 10) { // Only check if mobile is exactly 10 digits
				try {
					const response = await checkCustomer("mobile", value);
					if (response.isCustomer) {
						isValid = false;
						errorMessage = response.message;
					}
				} catch (error) {
					console.error('Error checking mobile on blur:', error);
				}
			}
			break;

		case 'email':
			if (value.includes('@') && value.includes('.')) { // Only check if email format is complete
				try {
					const response = await checkCustomer("email", value);
					if (response.isCustomer) {
						isValid = false;
						errorMessage = response.message;
					}
				} catch (error) {
					console.error('Error checking email on blur:', error);
				}
			}
			break;

		default:
			return;
	}

	if (!isValid) {
		setFieldError(fieldName, errorMessage);
	} else {
		setFieldError(fieldName, '');
	}
};

// Billing validation function (Step 4)
const validateBilling = (values) => {
	const errors = {};

	// Billing cycle validation
	if (values.billing_cycle) {
		const cycle = parseInt(values.billing_cycle);
		if (isNaN(cycle)) {
			errors.billing_cycle = 'Billing cycle must be a number';
		} else if (cycle <= 0) {
			errors.billing_cycle = 'Billing cycle must be greater than 0';
		}
	}

	// Other charges validation
	if (values.other_charges) {
		const charges = parseFloat(values.other_charges);
		if (isNaN(charges)) {
			errors.other_charges = 'Please enter a valid amount';
		} else if (charges < 0) {
			errors.other_charges = 'Other charges cannot be negative';
		}
	}

	// Previous dues validation
	if (values.previous_dues) {
		const dues = parseFloat(values.previous_dues);
		if (isNaN(dues)) {
			errors.previous_dues = 'Please enter a valid amount';
		} else if (dues < 0) {
			errors.previous_dues = 'Previous dues cannot be negative';
		}
	}

	// Received amount validation
	if (values.received_amount) {
		const received = parseFloat(values.received_amount);
		if (isNaN(received)) {
			errors.received_amount = 'Please enter a valid amount';
		} else if (received < 0) {
			errors.received_amount = 'Received amount cannot be negative';
		}
	}

	// Discount validation
	if (values.discount) {
		const discount = parseFloat(values.discount);
		if (isNaN(discount)) {
			errors.discount = 'Please enter a valid amount';
		} else if (discount < 0) {
			errors.discount = 'Discount cannot be negative';
		}
	}

	return errors;
};

const AddNewCustomerForm = ({prop, data}) => {

	const dispatch = useDispatch()
    const [isLoading, SetIsLoading] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	
	// Form data state
	const [formData, setFormData] = useState({
		// Step 1: Basic Information
		name: '',
		username: '',
		gender: null,
		address: '',
		installation_address: '',
		mobile: '',
		whatsapp_no: '',
		alternate_no: '',
		area: null,
		block: null,
		apartment: null,
		email: '',
		payar_name: '',
		payar_number: '',
		// Step 2: Package Selection
		selected_package: null,
		other_services: null,
		// Step 3: Inventory Items & KYC Records
		inventory_items: [],
		dob: '',
		doa: '',
		aadhar_card: null,
		pan_card: null,
		photo: null,
		
		// Step 4: Billing Details
		billing_amount: '',
		billing_cycle: 1,
		other_charges: '',
		previous_dues: '',
		start_date: '',
		end_date: '',
		received_amount: 0,
		received_date: '',
		discount: '',
		collected_by: null,
		payment_method: null,
		activation_date: '',
	});

	// File uploads state
	const [photo, setPhoto] = useState(null);
	const [aadharCard, setAadharCard] = useState(null);
	const [panCard, setPanCard] = useState(null);
	// Legacy file states for backward compatibility
	const [image, setImage] = useState(null);
	const [frontAadharImage, setFrontAadharImage] = useState(null);
	const [backAadharImage, setBackAadharImage] = useState(null);
	const [panImage, setPanImage] = useState(null);
	const [otherIdImage, setOtherIdImage] = useState(null);
	const [signature, setSignature] = useState(null);
	
	// Helper function to calculate end date
	const calculateEndDate = (startDate, billingCycle) => {
		if (!startDate || !billingCycle) return '';
		
		const start = new Date(startDate);
		if (isNaN(start.getTime())) return '';
		
		// Calculate end date by adding billing cycle days to start date
		const endDate = new Date(start);
		endDate.setDate(endDate.getDate() + (30 * billingCycle));
		// Format as YYYY-MM-DD for date input
		return endDate.toISOString().split('T')[0];
	};

	// Selection states
	const [gender, setGender] = useState(null);
	const [apartment, setApartment] = useState(null);
	const [block, setBlock] = useState(null);
	const [area, setArea] = useState(null);
	const [otherServices, setOtherServices] = useState(null);
	const [collectedBy, setCollectedBy] = useState(null);
	
	// KYC toggle state
	const [showKYC, setShowKYC] = useState(false);

	// Data states
	const [packages, setPackages] = useState([]);
	const [inventoryItems, setInventoryItems] = useState([]);
	const [employees, setEmployees] = useState([]);

	// Fetch packages and inventory on component mount
	useEffect(() => {
		fetchPackages();
		fetchInventoryItems();
		fetchEmployees();
	}, []);

	// Effect to calculate end date when dependencies change
	useEffect(() => {
		if (formData.start_date && formData.billing_cycle) {
			const newEndDate = calculateEndDate(
				formData.start_date,
				formData.billing_cycle
			);
			
			if (newEndDate && newEndDate !== formData.end_date) {
				setFormData(prev => ({ ...prev, end_date: newEndDate }));
			}
		}
	}, [formData.start_date, formData.billing_cycle]);

	const fetchPackages = async () => {
		try {
			const response = await axios.get(`${API_URL}/plan/getall`);
			if (response.data.status === 200) {
				const packageOptions = response.data.data.map(pkg => ({
					value: pkg.id,
					label: `${pkg.plan} - ₹${pkg.finalPrice} - ${pkg.days} Days`,
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

	const fetchEmployees = async () => {
		try {
			const response = await axios.get(`${API_URL}/employee/getall`);
			if (response.status === 200) {
				const employeeOptions = response.data.data.map(emp => ({
					value: emp.id,
					label: `${emp.name} (${emp.mobile_no})`
				}));
				setEmployees(employeeOptions);
			}
		} catch (error) {
			console.error('Error fetching employees:', error);
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
			inventory_items: [...prev.inventory_items, { item: null, quantity: 1 }]
		}));
	};

	const handleInventoryItemRemove = (index) => {
		setFormData(prev => ({
			...prev,
			inventory_items: prev.inventory_items.filter((_, i) => i !== index)
		}));
	};

	const handleInventoryItemChange = (index, field, value) => {
		setFormData(prev => ({
			...prev,
			inventory_items: prev.inventory_items.map((item, i) => {
				if (i === index) {
					if (field === 'quantity') {
						// Get the available quantity for the selected item
						const availableQty = item.item ? item.item.qty : 0;
						// Ensure quantity doesn't exceed available stock
						const validatedQuantity = Math.min(Math.max(1, parseInt(value) || 1), availableQty);
						return { ...item, [field]: validatedQuantity };
					}
					return { ...item, [field]: value };
				}
				return item;
			})
		}));
	};

	const createCustomer = async (values) => {
        SetIsLoading(true);
		
		// Update formData with the latest values from Step 4
		const updatedFormData = {
			...formData,
			...values
		};
		  
		const finalData = {
			...updatedFormData,
			photo: photo,
			aadhar_card: aadharCard,
			pan_card: panCard,
			// Legacy file fields for backward compatibility
			image: image,
			frontAadharImage: frontAadharImage,
			backAadharImage: backAadharImage,
			panImage: panImage,
			otherIdImage: otherIdImage,
			signature: signature,
			gender: gender?.value || null,
			block: block?.value || null,
			area: area?.value || null,
			apartment: apartment?.value || null,
			other_services: otherServices?.value || null,
			collected_by: collectedBy?.value || null,
			payment_method: formData.payment_method?.value || null,
			selected_package: formData.selected_package?.value || null,
			inventory_items: JSON.stringify(formData.inventory_items)
		};

		const formDataToSend = new FormData();

		for (const key in finalData) {
			if (finalData[key] !== null && finalData[key] !== undefined && finalData[key] !== '') {
				formDataToSend.append(key, finalData[key]);
			}
		}

		try {
			console.log('Submitting customer data:', finalData);
			const apiUrl = `${API_URL}/customer/signup`;
			const response = await axios.post(apiUrl, formDataToSend);
			
			console.log('Response from server:', response.data);
			
			if (response.data.status === true) {
				// Reset form and state
				setFormData({
					name: '', username: '', gender: null, address: '', installation_address: '', mobile: '',
					whatsapp_no: '', alternate_no: '', area: null, block: null, apartment: null, email: '',
					selected_package: null, other_services: null, inventory_items: [], dob: '', doa: '',
					aadhar_card: null, pan_card: null, photo: null, billing_amount: '', billing_cycle: 1,
					other_charges: '', previous_dues: '', start_date: '', end_date: '', received_amount: 0,
					received_date: '', discount: '', collected_by: null, payment_method: null,
					
				});
				setPhoto(null);
				setAadharCard(null);
				setPanCard(null);
				setImage(null);
				setFrontAadharImage(null);
				setBackAadharImage(null);
				setPanImage(null);
				setOtherIdImage(null);
				setSignature(null);
				setGender(null);
				setBlock(null);
				setArea(null);
				setApartment(null);
				setOtherServices(null);
				setCollectedBy(null);
				setCurrentStep(1);
				
				prop();
				Swal.fire('Successfully!', 'Your Customer has been Added.', 'success');
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
				title: error.response.data.message,
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
			case 1: return 'Basic Information';
			case 2: return 'Package Selection';
			case 3: return 'Inventory Items';
			case 4: return 'Billing & KYC Details';
			default: return 'Customer Registration';
		}
	};

	const renderProgressBar = () => {
		const progress = (currentStep / 4) * 100;
		return (
			<div className="mb-4">
				<div className="d-flex justify-content-between mb-2">
					<span className="small">Step {currentStep} of 4</span>
					{/* <span className="small">{Math.round(progress)}% Complete</span> */}
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
				installation_address: formData.installation_address,
				mobile: formData.mobile,
				whatsapp_no: formData.whatsapp_no,
				alternate_no: formData.alternate_no,
				email: formData.email,
			}}
			validate={validateBasicInfo}
			onSubmit={handleNext}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldError }) => (
				<Form>
					<Row>
						<Col md={6}>
							<FormGroup>
								<Label for="name">Customer Name <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									name="name"
									placeholder="Enter Customer Name"
									maxLength="200"
									onKeyPress={handleKeyPress}
									onChange={(e) => {
										handleChange(e);
										// Basic validation for name field
										if (e.target.value && e.target.value.length > 200) {
											setFieldError('name', 'Name must be less than 200 characters');
										} else if (e.target.value && !/^[a-zA-Z\s]+$/.test(e.target.value)) {
											setFieldError('name', 'Name can only contain letters and spaces');
										} else {
											setFieldError('name', '');
										}
									}}
									onBlur={handleBlur}
									isValid={!errors.name}
									invalid={errors.name}
								/>
								<ErrorMessage name="name" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="username">Username / ID <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									name="username"
									placeholder="Enter Username"
									maxLength="50"
									onChange={(e) => {
										handleChange(e);
										// Basic validation only - no API calls
										if (e.target.value && e.target.value.length > 50) {
											setFieldError('username', 'Username must be less than 50 characters');
										} else {
											setFieldError('username', '');
										}
									}}
									onBlur={(e) => {
										handleBlur(e);
										validateFieldOnBlur('username', e.target.value, setFieldError);
									}}
									isValid={!errors.username}
									invalid={errors.username}
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
								<Label for="email">Email</Label>
								<Field
									as={Input}
									type="email"
									name="email"
									placeholder="Enter Email"
									onChange={(e) => {
										handleChange(e);
										// Basic validation for email format
										if (e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
											setFieldError('email', 'Invalid email format');
										} else if (e.target.value && e.target.value.length > 100) {
											setFieldError('email', 'Email must be less than 100 characters');
										} else {
											setFieldError('email', '');
										}
									}}
									onBlur={(e) => {
										handleBlur(e);
										validateFieldOnBlur('email', e.target.value, setFieldError);
									}}
									isValid={!errors.email}
									invalid={errors.email}
								/>
								<ErrorMessage name="email" component="span" className="validationError" />
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
									onChange={(e) => {
										handleChange(e);
										// Basic validation for mobile number
										if (e.target.value && !/^\d{10}$/.test(e.target.value)) {
											setFieldError('mobile', 'Mobile number must be exactly 10 digits');
										} else {
											setFieldError('mobile', '');
										}
									}}
									onBlur={(e) => {
										handleBlur(e);
										validateFieldOnBlur('mobile', e.target.value, setFieldError);
									}}
									isValid={!errors.mobile}
									invalid={errors.mobile}
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
									onChange={(e) => {
										handleChange(e);
										// Basic validation for whatsapp number
										if (e.target.value && !/^\d{10}$/.test(e.target.value)) {
											setFieldError('whatsapp_no', 'WhatsApp number must be exactly 10 digits');
										} else {
											setFieldError('whatsapp_no', '');
										}
									}}
									onBlur={handleBlur}
									isValid={!errors.whatsapp_no}
									invalid={errors.whatsapp_no}
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
									onChange={(e) => {
										handleChange(e);
										// Basic validation for alternate number
										if (e.target.value && !/^\d{10}$/.test(e.target.value)) {
											setFieldError('alternate_no', 'Alternate number must be exactly 10 digits');
										} else {
											setFieldError('alternate_no', '');
										}
									}}
									onBlur={handleBlur}
									isValid={!errors.alternate_no}
									invalid={errors.alternate_no}
								/>
								<ErrorMessage name="alternate_no" component="span" className="validationError" />
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
								<SelectBox options={apartment_options} setSelcted={setApartment} initialValue={apartment}/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="installation_address">Installation's Address</Label>
								<Field
									as={Input}
									type="textarea"
									name="installation_address"
									placeholder="Enter Installation Address"
									onChange={(e) => {
										handleChange(e);
										// Basic validation for installation address field
										if (e.target.value && e.target.value.length > 200) {
											setFieldError('installation_address', 'Installation address must be less than 200 characters');
										} else {
											setFieldError('installation_address', '');
										}
									}}
									onBlur={handleBlur}
									isValid={!errors.installation_address}
									invalid={errors.installation_address}
								/>
								<ErrorMessage name="installation_address" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="address">Current Address <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									type="textarea"
									name="address"
									placeholder="Enter Current Address"
									onChange={(e) => {
										handleChange(e);
										// Basic validation for address field
										if (e.target.value && e.target.value.length > 200) {
											setFieldError('address', 'Address must be less than 200 characters');
										} else {
											setFieldError('address', '');
										}
									}}
									onBlur={handleBlur}
									isValid={!errors.address}
									invalid={errors.address}
								/>
								<ErrorMessage name="address" component="span" className="validationError" />
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
				<Col md={6}>
					<FormGroup>
						<Label for="selected_package">Select Package</Label>
						<SelectBox 
							options={packages} 
							setSelcted={(value) => {
								console.log('Package selected:', value);
								const newEndDate = calculateEndDate(
									formData.start_date,
									formData.billing_cycle
								);
								
								setFormData(prev => ({ 
									...prev, 
									selected_package: value,
									billing_amount: value ? value.finalPrice : '',
									end_date: newEndDate
								}));
							}} 
							initialValue={formData.selected_package}
						/>
					</FormGroup>
				</Col>
				{formData.selected_package && (
					<Col md={12}>
						<Card>
							<CardHeader>
								<h5>Package Details</h5>
							</CardHeader>
							<CardBody>
								<p><strong>Plan:</strong> {formData.selected_package.plan}</p>
								<p><strong>Connection Type:</strong> {formData.selected_package.connectionType}</p>
								<p><strong>Days:</strong> {formData.selected_package.days}</p>
								<p><strong>Price:</strong> ₹{formData.selected_package.finalPrice}</p>
							</CardBody>
						</Card>
					</Col>
				)}
			</Row>
			<div className="d-flex justify-content-between">
				<Button color="secondary" onClick={handlePrevious}>
					<ALlIcon.FaArrowLeft className="mr-2" /> Previous
				</Button>
				<Button 
					color="primary" 
					onClick={() => handleNext({})}
				>
					Next <ALlIcon.FaArrowRight className="ml-2" />
				</Button>
			</div>	
		</div>
	);

	// Step 3: Inventory Items & KYC Records
	const renderInventoryKYCStep = () => (
		<Formik
			initialValues={{
				dob: formData.dob,
				doa: formData.doa,
			}}
			onSubmit={handleNext}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
				<Form>
					<Row>
						<Col md={12}>
							<h5>Inventory Items</h5>
							<p className="text-muted">Assign required hardware or inventory items (e.g., router, modem).</p>
							<div className="d-flex justify-content-between align-items-center mb-3">
								<Button color="success" size="sm" onClick={handleInventoryItemAdd}>
									<ALlIcon.FaPlus className="mr-2" /> Add Item
								</Button>
							</div>
						</Col>
					</Row>
					{formData.inventory_items.map((item, index) => (
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
										max={item.item ? item.item.qty : 1}
										value={item.quantity}
										onChange={(e) => handleInventoryItemChange(index, 'quantity', parseInt(e.target.value))}
										invalid={item.item && item.quantity > item.item.qty}
									/>
									{item.item && item.quantity > item.item.qty && (
										<div className="invalid-feedback d-block">
											Quantity cannot exceed available stock ({item.item.qty})
										</div>
									)}
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
					{formData.inventory_items.length === 0 && (
						<Row>
							<Col md={12}>
								<div className="text-center p-4 border rounded bg-light">
									<p className="mb-0">No inventory items selected. Click "Add Item" to add items.</p>
								</div>
							</Col>
						</Row>
					)}
					
					<Row className="mt-4">
						<Col md={12}>
							<div className="d-flex justify-content-between align-items-center mb-3">
								<div>
									<h5>KYC Records</h5>
									<p className="text-muted">Customer verification documents and details.</p>
								</div>
								<Button 
									color={showKYC ? "secondary" : "primary"}
									size="sm"
									onClick={() => setShowKYC(!showKYC)}
								>
									{showKYC ? (
										<>
											<ALlIcon.FaEyeSlash className="mr-2" />
											Hide KYC
										</>
									) : (
										<>
											<ALlIcon.FaEye className="mr-2" />
											Show KYC
										</>
									)}
								</Button>
							</div>
						</Col>
					</Row>
					
					{showKYC && (
						<Row className="mt-3">
							<Col md={6}>
								<FormGroup>
									<Label for="dob">Date of Birth</Label>
									<Field
										as={Input}
										type="date"
										name="dob"
									/>
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
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="aadhar_card">Aadhar Card</Label>
									<Input 
										type="file" 
										name="aadhar_card" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setAadharCard)} 
									/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="pan_card">PAN Card</Label>
									<Input 
										type="file" 
										name="pan_card" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setPanCard)} 
									/>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="photo">Photo</Label>
									<Input 
										type="file" 
										name="photo" 
										accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
										onChange={(e) => handleImageChange(e, setPhoto)} 
									/>
								</FormGroup>
							</Col>
						</Row>
					)}
					<div className="d-flex justify-content-between mt-4">
						<Button color="secondary" onClick={handlePrevious}>
							<ALlIcon.FaArrowLeft className="mr-2" /> Previous
						</Button>
						<Button 
							color="primary" 
							onClick={() => handleNext(values)}
							disabled={formData.inventory_items.some(item => item.item && item.quantity > item.item.qty)}
						>
							Next <ALlIcon.FaArrowRight className="ml-2" />
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);

	// Step 4: Billing Details
	const renderBillingStep = () => (
		<Formik
			initialValues={{
				billing_amount: formData.billing_amount,
				billing_cycle: formData.billing_cycle,
				other_charges: formData.other_charges,
				previous_dues: formData.previous_dues,
				start_date: formData.start_date,
				end_date: formData.end_date,
				received_amount: formData.received_amount,
				received_date: formData.received_date,
				discount: formData.discount,
				activation_date: formData.activation_date,
				collected_by: formData.collected_by,
				payment_method: formData.payment_method,
				other_services: formData.other_services,
				payar_name: formData.payar_name,
				payar_number: formData.payar_number,
			}}
			validate={(values) => {
				const errors = validateBilling(values);
				console.log('Validation errors:', errors);
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				console.log('Form submitted with values:', values);
				console.log('Form errors:', validateBilling(values));
				createCustomer(values);
				setSubmitting(false);
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
				<Form>
					<Row>
						<Col md={12}>
							<h5>Billing Details</h5>
							<p className="text-muted">Collect payment and optionally KYC documentation.</p>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="billing_amount">Billing Amount <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									type="number"
									name="billing_amount"
									placeholder="Auto-filled based on selected plan"
									min="0"
									step="0.01"
									value={formData.billing_amount || ''}
									onChange={(e) => {
										setFieldValue('billing_amount', e.target.value);
										setFormData(prev => ({ ...prev, billing_amount: e.target.value }));
									}}
								/>
								<ErrorMessage name="billing_amount" component="span" className="validationError" />
								{formData.selected_package && (
									<small className="text-muted">
										Auto-filled from selected plan: {formData.selected_package.plan}
									</small>
								)}
							</FormGroup>
						</Col>
						<Col md={4}>
					<FormGroup>
						<Label for="other_services">Select Other Services</Label>
						<SelectBox 
							options={packages} 
							setSelcted={setOtherServices} 
							initialValue={otherServices}
						/>
					</FormGroup>
				</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="other_charges">Other Charges If Any</Label>
								<Field
									as={Input}
									type="number"
									name="other_charges"
									placeholder="Installation and inventory charges"
									min="0"
									step="0.01"
								/>
								<ErrorMessage name="other_charges" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="previous_dues">Previous Dues</Label>
								<Field
									as={Input}
									type="number"
									name="previous_dues"
									placeholder="Field to Update Previous Dues"
									min="0"
									step="0.01"
								/>
								<ErrorMessage name="previous_dues" component="span" className="validationError" />
							</FormGroup>
						</Col>
						
						<Col md={4}>
							<FormGroup>
								<Label for="received_amount">Received Amount</Label>
								<Field
									as={Input}
									type="number"
									name="received_amount"
									placeholder="By default, 0 if not received"
									min="0"
									step="0.01"
								/>
								<ErrorMessage name="received_amount" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="discount">Discount</Label>
								<Field
									as={Input}
									type="number"
									name="discount"
									placeholder="Should deduct from total billing"
									min="0"
									step="0.01"
								/>
								<ErrorMessage name="discount" component="span" className="validationError" />
							</FormGroup>
						</Col>

						<Col md={4}>
							<FormGroup>
								<Label for="billing_cycle">Billing Cycle</Label>
								<Field
									as={Input}
									type="number"
									name="billing_cycle"
									placeholder="By default 1"
									min="1"
									value={formData.billing_cycle}
									onChange={(e) => {
										const newBillingCycle = parseInt(e.target.value) || 1;
										setFieldValue('billing_cycle', e.target.value);
										
										const newEndDate = calculateEndDate(
											formData.start_date,
											newBillingCycle
										);
										
										if (newEndDate) {
											setFieldValue('end_date', newEndDate);
										}
										
										setFormData(prev => ({ 
											...prev, 
											billing_cycle: newBillingCycle,
											end_date: newEndDate
										}));
									}}
								/>
								<ErrorMessage name="billing_cycle" component="span" className="validationError" />
							</FormGroup>
						</Col>

						<Col md={4}>
							<FormGroup>
								<Label for="start_date">Start Date</Label>
								<Field
									as={Input}
									type="date"
									name="start_date"
									placeholder="By default, today's date"
									value={formData.start_date}
									onChange={(e) => {
										const newStartDate = e.target.value;
										console.log("newStartDate---",newStartDate);
										setFieldValue('start_date', newStartDate);
										
										const newEndDate = calculateEndDate(
											newStartDate,
											formData.billing_cycle
										);
										
										if (newEndDate) {
											setFieldValue('end_date', newEndDate);
										}
										
										setFormData(prev => ({ 
											...prev, 
											start_date: newStartDate,
											end_date: newEndDate
										}));
									}}
								/>
								<ErrorMessage name="start_date" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="end_date">End Date</Label>
								<Field
									as={Input}	
									type="date"
									name="end_date"
									placeholder="Automatically calculated"
									value={formData.end_date}
									readOnly
								/>
								<ErrorMessage name="end_date" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="activation_date">Activation Date</Label>
								<Field
									as={Input}	
									type="date"
									name="activation_date"
									placeholder="By default, today's date"	
								/>
								<ErrorMessage name="activation_date" component="span" className="validationError" />
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="collected_by">Collected By</Label>
								<SelectBox 
									options={employees} 
									setSelcted={setCollectedBy} 
									initialValue={collectedBy}
								/>
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
						<Col md={4}>
							<FormGroup>
								<Label for="payar_name">Payar Name</Label>
								<Field
									as={Input}
									type="text"
									name="payar_name"
									placeholder="Enter Payar Name"
									value={formData.payar_name}
								/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label for="payar_number">Payar Number</Label>
								<Field
									as={Input}
									type="text"
									name="payar_number"
									placeholder="Enter Payar Number"
									value={formData.payar_number}
								/>
							</FormGroup>
						</Col>
					</Row>
					<div className="d-flex justify-content-between">
						<Button color="secondary" onClick={handlePrevious}>
							<ALlIcon.FaArrowLeft className="mr-2" /> Previous
						</Button>
						<Button
							type="submit"
							color="success"
							disabled={isLoading || isSubmitting}
							onClick={() => {
								console.log('Submit button clicked');
								console.log('Form errors:', errors);
								console.log('Form touched:', touched);
							}}
						>
							{isLoading && <BounceLoader size={20} color="#fff" className="mr-2" />}
							Submit <ALlIcon.FaCheck className="ml-2" />
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
			case 3: return renderInventoryKYCStep();
			case 4: return renderBillingStep();
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

export default AddNewCustomerForm