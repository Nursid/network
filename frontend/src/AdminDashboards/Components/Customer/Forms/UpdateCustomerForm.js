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

// Custom validation function for basic info (Step 1)
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

const UpdateCustomerForm = ({prop, updateData}) => {

	const dispatch = useDispatch()
    const [isLoading, SetIsLoading] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	
	// Form data state - initialize with existing data
	const [formData, setFormData] = useState({
		// Step 1: Basic Information
		name: updateData?.name || '',
		username: updateData?.username || '',
		gender: updateData?.gender ? { value: updateData.gender, label: updateData.gender } : null,
		address: updateData?.address || '',
		installation_address: updateData?.installation_address || updateData?.t_address || '',
		mobile: updateData?.mobileno || updateData?.mobile || '',
		whatsapp_no: updateData?.whatsapp_no || '',
		alternate_no: updateData?.alternate_no || '',
		area: updateData?.area ? { value: updateData.area, label: updateData.area } : null,
		block: updateData?.block ? { value: updateData.block, label: updateData.block } : null,
		apartment: updateData?.apartment || updateData?.appartment ? 
			{ value: updateData.apartment || updateData.appartment, label: updateData.apartment || updateData.appartment } : null,
		email: updateData?.email || '',
		
		// Step 2: Package Selection
		selected_package: updateData?.selectedPackage ? {
			value: updateData.selectedPackage,
			label: `Package ID: ${updateData.selectedPackage}`
		} : null,
		other_services: null,
		
		// Step 3: Inventory Items & KYC Records
		inventory_items: (() => {
			try {
				if (!updateData?.selectedItems && !updateData?.inventory_items) return [];
				const items = updateData?.selectedItems || updateData?.inventory_items;
				if (typeof items === 'string') {
					const parsed = JSON.parse(items);
					return Array.isArray(parsed) ? parsed : [];
				}
				return Array.isArray(items) ? items : [];
			} catch (error) {
				console.error('Error parsing inventory items:', error);
				return [];
			}
		})(),
		dob: updateData?.dob || '',
		doa: updateData?.doa || '',
		aadhar_card: null,
		pan_card: null,
		photo: null,
		
		// Step 4: Billing Details
		billing_amount: updateData?.billing_amount || '',
		billing_cycle: updateData?.billing_cycle || 1,
		other_charges: updateData?.other_charges || '',
		previous_dues: updateData?.previous_dues || '',
		start_date: updateData?.start_date || '',
		end_date: updateData?.end_date || '',
		received_amount: updateData?.received_amount || 0,
		received_date: updateData?.received_date || '',
		discount: updateData?.discount || '',
		collected_by: updateData?.collected_by ? {
			value: updateData.collected_by,
			label: updateData.collected_by
		} : null,
		payment_method: updateData?.payment_method ? {
			value: updateData.payment_method,
			label: updateData.payment_method
		} : null,
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
	
	// Selection states - initialize with existing data
	const [gender, setGender] = useState(
		updateData?.gender ? { value: updateData.gender, label: updateData.gender } : null
	);
	const [apartment, setApartment] = useState(
		updateData?.apartment || updateData?.appartment ? 
		{ value: updateData.apartment || updateData.appartment, label: updateData.apartment || updateData.appartment } : null
	);
	const [block, setBlock] = useState(
		updateData?.block ? { value: updateData.block, label: updateData.block } : null
	);
	const [area, setArea] = useState(
		updateData?.area ? { value: updateData.area, label: updateData.area } : null
	);
	const [otherServices, setOtherServices] = useState(null);
	const [collectedBy, setCollectedBy] = useState(
		updateData?.collected_by ? {
			value: updateData.collected_by,
			label: updateData.collected_by
		} : null
	);
	
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

			console.log("response---->", response);
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

	const updateCustomer = async (values) => {
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
			console.log('Updating customer data:', finalData);
			const apiUrl = `${API_URL}/customer/getupdate/${updateData.user_id || updateData.id}`;
			const response = await axios.put(apiUrl, formDataToSend);
			
			console.log('Response from server:', response.data);
			
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
				title: error.response?.data?.message || 'Error occurred while updating customer',
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
				installation_address: formData.installation_address,
				mobile: formData.mobile,
				whatsapp_no: formData.whatsapp_no,
				alternate_no: formData.alternate_no,
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
								<Label for="name">Customer Name <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									name="name"
									placeholder="Enter Customer Name"
									maxLength="200"
									onKeyPress={handleKeyPress}
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
								<Label for="address">Current Address <span style={{color: "red"}}>*</span></Label>
								<Field
									as={Input}
									type="textarea"
									name="address"
									placeholder="Enter Current Address"
								/>
								<ErrorMessage name="address" component="span" className="validationError" />
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
								/>
								<ErrorMessage name="installation_address" component="span" className="validationError" />
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
								setFormData(prev => ({ 
									...prev, 
									selected_package: value,
									billing_amount: value ? value.finalPrice : ''
								}));
							}} 
							initialValue={formData.selected_package}
						/>
					</FormGroup>
				</Col>
				<Col md={6}>
					<FormGroup>
						<Label for="other_services">Select Other Services</Label>
						<SelectBox 
							options={packages} 
							setSelcted={setOtherServices} 
							initialValue={otherServices}
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
			}}
			validate={(values) => {
				const errors = validateBilling(values);
				console.log('Validation errors:', errors);
				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				console.log('Form submitted with values:', values);
				console.log('Form errors:', validateBilling(values));
				updateCustomer(values);
				setSubmitting(false);
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
				<Form>
					<Row>
						<Col md={12}>
							<h5>Billing Details</h5>
							<p className="text-muted">Update payment information and billing details.</p>
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
								<Label for="billing_cycle">Billing Cycle</Label>
								<Field
									as={Input}
									type="number"
									name="billing_cycle"
									placeholder="By default 1"
									min="1"
									value={formData.billing_cycle}
									onChange={(e) => {
										setFieldValue('billing_cycle', e.target.value);
										setFormData(prev => ({ ...prev, billing_cycle: parseInt(e.target.value) || 1 }));
									}}
								/>
								<ErrorMessage name="billing_cycle" component="span" className="validationError" />
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
						<Col md={6}>
							<FormGroup>
								<Label for="collected_by">Collected By</Label>
								<SelectBox 
									options={employees} 
									setSelcted={setCollectedBy} 
									initialValue={collectedBy}
								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="payment_method">Payment Method</Label>
								<SelectBox 
									options={payment_method_options} 
									setSelcted={(value) => setFormData(prev => ({ ...prev, payment_method: value }))} 
									initialValue={formData.payment_method}
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

export default UpdateCustomerForm
