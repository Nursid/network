import React, {Fragment, useEffect, useState} from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Row,
	Col,
	Input,
	Label,
	FormGroup
} from "reactstrap";
import { UseStateManager } from "../Context/StateManageContext";
import {GetCustomerLogIn} from "../Store/Actions/LandingPage/AuthAction";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {MenuItem, Select} from "@mui/material";
import {GetAllServices} from "../Store/Actions/Dashboard/servicesAction";
import {ClockLoader} from "react-spinners";
import {useAuth} from "../Context/userAuthContext";
import {API_URL} from "../config";
import axios from "axios";
import {GetAllInventry} from "../Store/Actions/Dashboard/InventryAction";
import {GetAllPlan} from "../Store/Actions/Dashboard/PlanAction";
import SelectBox from "../AdminDashboards/Elements/SelectBox";
import moment from "moment";



export const LoginModal = () => {
	const [mobileNo, setMobileNo] = useState("");
	const [otp, setOpt] = useState("");
	// const [otpId, setOptId] = useState("");
	const [loader, setLoader] = useState(false);
	const dispatch = useDispatch();

	const users = {
		Admin: "Admin",
		vendor: "vendor",
		Office: "Office",
		Customer: "Customer"
	};
	const {LoginOpen, setLoginOpen} = UseStateManager();
	const [loginPerson, setLoginPerson] = useState(users.Customer);
	const LoginResult = useSelector((pre) => pre.GetLogInReducers);
	const [isTimerComplete, setIsTimerComplete] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(60);
	const {sendOtp, otpid, setOtpId} = useAuth();

	const loginForm = {
		email: "",
		password: ""
	};

	const handleOtpSend = async (otp) => {
		setLoader(true);
		await sendOtp(otp);
		setTimeRemaining(60);
		setLoader(false);
	};

	const handleSubmit = async (number, otp, otpid) => {
		setLoader(true);
		await dispatch(GetCustomerLogIn(number, otp, otpid)).then(() => {
			setLoader(false);
		});
	};

	useEffect(() => {
		let timer;

		// Start the timer when the component mounts
		timer = setInterval(() => {
			setTimeRemaining((prevTime) => {
				if (prevTime === 1) {
					setIsTimerComplete(true);
					clearInterval(timer);
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);
		// Update the time remaining every 1 second (1000 milliseconds)

		// Clean up the timer when the component unmounts
		return() => {
			clearInterval(timer);
		};
	}, []);

	const HandleResendBtn = async (number) => {
		await handleOtpSend(number);
		setTimeRemaining(60);
	};

	return (
		<Modal className="modal-dialog-centered "
			isOpen={LoginOpen}
			toggle={
				() => setLoginOpen(!LoginOpen)
		}>
			<ModalHeader className="modal_header"
				toggle={
					() => setLoginOpen(!LoginOpen)
			}>
				{" "}
				Login
			</ModalHeader>
			<ModalBody className="LoginBgMain relative">
				{
				otpid && <h6 className="absolute top-2 right-2">
					{timeRemaining}</h6>
			}
				<div className="w-100 d-flex loginmain">
					<div className="text-center rounded">
						<img src={''}
							alt="MainLogo"/>
						<div className="text-center">
							<h4 className="text-blue fw-bold">Welcome To Laxdeep Network Services</h4>
							<p className="py-2 text-secondary">
								Please Enter your details to Login
							</p>
						</div>

						<form>
							<FormGroup className="d-flex flex-column  align-items-start ">
								<Label for="mobileNo">Enter Mobile Number :</Label>
								<Input type="tel" name="mobileNo" id="mobileNo"
									value={mobileNo}
									disabled={
										otpid !== null
									}
									placeholder="992XXXXXXX"
									onChange={
										(e) => setMobileNo(e.target.value)
									}/>
							</FormGroup>
							{
							otpid ? (
								<FormGroup className="d-flex align-items-center gap-2 ">
									<Label for="mobileNo text-nowrap w-25">Enter Otp :</Label>
									<Input type="text" name="mobileNo" id="mobileNo"
										maxLength={4}
										value={otp}
										placeholder="XXXX"
										className="w-25"
										onChange={
											(e) => setOpt(e.target.value)
										}/>
								</FormGroup>
							) : null
						}
							<Button type="button" className="ml-3 bg-blue w-25">
								Cancel
							</Button>
							{
							otpid ? (
								<>
									<Button type="button" className="ml-3 bg-blue w-25"
										onClick={
											() => handleSubmit(mobileNo, otp, otpid)
									}>
										Login
										<ClockLoader size={16}
											className="ml-2 "
											color="#fff"
											loading={loader}/>
									</Button>
									<Button type="button"
										disabled={
											timeRemaining >= 5
										}
										className="ml-3 bg-blue w-25"
										onClick={
											() => HandleResendBtn(mobileNo)
									}>
										Resend
										<ClockLoader size={16}
											className="ml-2 "
											color="#fff"
											loading={loader}/>
									</Button>
								</>
							) : (
								<Button type="button" className="ml-3 bg-blue w-25"
									onClick={
										() => handleOtpSend(mobileNo)
								}>
									Verify
									<ClockLoader size={16}
										className="ml-2 "
										color="#fff"
										loading={loader}/>
								</Button>
							)
						} </form>

						{/* <Formik
              initialValues={loginForm}
              onSubmit={(values, { resetForm }) => {
                dispatch(GetLogIn(values, loginPerson));
                resetForm();
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form className="p-2" onSubmit={handleSubmit} method="post">
                  <div className="form-group">
                    <label for="email">Email:</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label for="email">Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Enter your password."
                      required
                    />
                  </div>
                  <div className="form-group text-right">
                    <Button type="submit">Log In </Button>
                  </div>
                </form>
              )}
            </Formik> */} </div>
				</div>
			</ModalBody>
		</Modal>
	);
};
export const SingupModal = () => {
	const {SingUp, setSingUp} = UseStateManager();
	return (
		<Modal className="modal-dialog-centered"
			isOpen={SingUp}
			toggle={
				() => setSingUp(!SingUp)
		}>
			<ModalHeader toggle={
				() => setSingUp(!SingUp)
			}>
				Sign Up</ModalHeader>
			<ModalBody>
				<div className="text-center bgColour rounded">
					<img src={''}
						alt="MainLogo"/>
					<div className="text-center">
						<h4>Welcome To Laxdeep Network Services</h4>
						<p className="py-2">Please Enter your details to Sign Up</p>
						<Button style={
								{background: "#142572"}
							}
							active={true}
							outline>
							Customer
						</Button>
						<Button outline className="ml-2">
							Vendor
						</Button>
					</div>
					<form className="p-2" action="#" method="post">
						<div className="form-group">
							<label for="name">Full Name:</label>
							<input type="text" id="name" name="name" placeholder="Enter Your Full Name" required/>
						</div>
						<div className="form-group">
							<label for="email">Email:</label>
							<input type="email" id="email" name="email" placeholder="Enter Your Email" required/>
						</div>
						<div className="form-group">
							<label for="email">Password :</label>
							<input type="email" id="email" name="email" placeholder="Enter your password." required/>
						</div>
						<div className="form-group">
							<label for="email">Confirm Password :</label>
							<input type="email" id="email" name="email" placeholder="Confirm your password." required/>
						</div>
						<div className="form-group text-right">
							<input onClick={
									() => setSingUp(!SingUp)
								}
								type="submit"
								value="Register"/>
						</div>
					</form>
				</div>
			</ModalBody>
		</Modal>
	);
};


export const AllotItemModal = ({allotItemModalOpen, allotItemModalfunction, inventryData}) => {

	const [allotedTo, SetallotedTo] = useState('');
	const [date, setDate] = useState('');
	const [qty, setQty] = useState('')
	const [remark, SetRemark] = useState('');
	const [selectedItem, setSelectedItem] = useState('');
	const dispatch = useDispatch();
	const { data: inventoryData } = useSelector(state => state.GetAllInventryReducers || []);

	// Transform inventory data for SelectBox
	const inventoryOptions = inventoryData ? inventoryData.map(item => ({
		label: item.item,
		value: item.item
	})) : [];

	// Load inventory data when modal opens
	useEffect(() => {
		if (allotItemModalOpen) {
			dispatch(GetAllInventry());
		}
	}, [allotItemModalOpen, dispatch]);

	// Set initial selected item if inventryData is provided
	useEffect(() => {
		if (inventryData?.item && inventoryOptions.length > 0) {
			const initialItem = inventoryOptions.find(option => option.value === inventryData.item);
			if (initialItem) {
				setSelectedItem(initialItem);
			}
		}
	}, [inventryData, inventoryOptions]);

	const handleSubmit = () => {
		// Form validation
		if (!selectedItem?.value && !inventryData?.item) {
			Swal.fire({title: 'Please select an item', icon: "error"});
			return;
		}
		if (!allotedTo.trim()) {
			Swal.fire({title: 'Please enter who to allot to', icon: "error"});
			return;
		}
		if (!date) {
			Swal.fire({title: 'Please select a date', icon: "error"});
			return;
		}
		if (!qty || qty <= 0) {
			Swal.fire({title: 'Please enter a valid quantity', icon: "error"});
			return;
		}

		const formData = {
			spname: allotedTo,
			allotdate: moment(date).format("DD-MM-YYYY"),
			aqty: qty,
			item: selectedItem?.value || inventryData?.item,
			remark: remark
		}
		const apiUrl = `${API_URL}/inventry/allot`;
		// Make a POST request using Axios
		axios.post(apiUrl, formData).then(response => {
			if (response.status === 200) {
				allotItemModalfunction();
				Swal.fire('Successfully!', response.data.message, 'success');
				// Reset form
				SetallotedTo('');
				setDate('');
				setQty('');
				setSelectedItem('');
				SetRemark('');
			} else {
				Swal.fire({title: 'failed to add try again', icon: "error"})
			}
			// dispatch(GetAllOrders());
		}).catch(error => {
			console.error('Error:', error);
			Swal.fire({title: 'An error occurred', icon: "error"});
		});
	};

	return (
		<Modal className="modal-dialog-centered modal-lg"
			isOpen={allotItemModalOpen}
			toggle={allotItemModalfunction}>
			<ModalHeader toggle={allotItemModalfunction}>
				Allot Items
			</ModalHeader>
			<ModalBody>
				<Fragment>
					<Row>
						<Col md={6}>
							<FormGroup>
								<Label>Select Item <span style={{color: "red"}}>*</span></Label>
								<SelectBox
									options={inventoryOptions}
									setSelcted={setSelectedItem}
									initialValue={selectedItem}
									placeholder="Select an item"
								/>
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>Allot To <span style={{color: "red"}}>*</span></Label>
								<Input onChange={
										(e) => SetallotedTo(e.target.value)
									}
									value={allotedTo}
									placeholder='Allot To'/>
							</FormGroup>
						</Col>
						<Col md={4}>
							<FormGroup>
								<Label>Date <span style={{color: "red"}}>*</span></Label>
								<Input onChange={
										(e) => setDate(e.target.value)
									}
									type="date"
									value={date}
									placeholder='Date'/>
							</FormGroup>
						</Col>

						<Col md={4}>
							<FormGroup>
								<Label>Quantity <span style={{color: "red"}}>*</span></Label>
								<Input onChange={
										(e) => setQty(e.target.value)
									}
									value={qty}
									type="number"
									min="1"
									placeholder='Quantity'/>
							</FormGroup>
						</Col>

						<Col xs={12}>
							<div className="form-outline mb-2">
								<label className="form-label" htmlFor="serviceRemark">
									Remark
								</label>
								<Input type="textarea"
									onChange={
										(e) => SetRemark(e.target.value)
									}
									className="w-100"
									rows="6"
									cols="50"
									placeholder="Allot Remark"
									value={remark}/>
							</div>
							<div className="d-flex justify-content-end ">
								<Button color="success"
									onClick={handleSubmit}
									style={
										{marginRight: '10px'}
								}>
									Save
								</Button>
								<Button color="danger"
									onClick={allotItemModalfunction}>
									Close
								</Button>
							</div>
						</Col>
					</Row>
				</Fragment>
			</ModalBody>
		</Modal>
	);
};


export const AddInventryModal = ({AddInventryModalOpen, AddInventryModalOpenFunction, data, GetAllInventry}) => {

	const dispatch = useDispatch();
	const [item, setItem] = useState('');
	const [qty, setQty] = useState('');
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// Set initial values when data changes (for update mode)
	useEffect(() => {
		if (data) {
			setItem(data.item || '');
			setQty(data.qty || '');
		} else {
			// Reset form for add mode
			setItem('');
			setQty('');
		}
		setErrors({});
	}, [data, AddInventryModalOpen]);

	const validateForm = () => {
		let newErrors = {};

		if (!item.trim()) {
			newErrors.item = "Item name is required";
		}

		if (!qty || qty <= 0) {
			newErrors.qty = "Quantity must be greater than 0";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		
		const formData = {
			item: item.trim(),
			qty: parseInt(qty)
		};

		let apiUrl = '';
		let method = 'POST';
		
		if (data?.id) {
			// Update mode
			apiUrl = `${API_URL}/inventry/update/${data.id}`;
			method = 'POST'; // Use PUT for updates if your backend supports it
		} else {
			// Add mode
			apiUrl = `${API_URL}/inventry/add`;
			method = 'POST';
		}

		try {
			const response = await axios({
				method: method,
				url: apiUrl,
				data: formData
			});

			if (response.status === 200) {
				AddInventryModalOpenFunction();
				Swal.fire('Successfully!', response.data.message, 'success');
				
				// Reset form only in add mode
				if (!data?.id) {
					setItem('');
					setQty('');
				}
				
				dispatch(GetAllInventry());
			} else {
				Swal.fire({title: 'Failed to save, try again', icon: "error"});
			}
		} catch (error) {
			console.error('Error:', error);
			const errorMessage = error.response?.data?.message || 'An error occurred while saving';
			Swal.fire({title: errorMessage, icon: "error"});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		// Reset form when closing
		setItem('');
		setQty('');
		setErrors({});
		AddInventryModalOpenFunction();
	};

	return (
		<Modal className="modal-dialog-centered modal-lg"
			isOpen={AddInventryModalOpen}
			toggle={handleClose}>
			<ModalHeader toggle={handleClose}>
				{!data?.id ? "Add Item" : "Update Item"}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col md={6}>
						<FormGroup>
							<Label>Item Name <span style={{color: "red"}}>*</span></Label>
							<Input 
								onChange={(e) => setItem(e.target.value)}
								value={item}
								type='text'
								placeholder='Enter item name'
								invalid={!!errors.item}
							/>
							{errors.item && (
								<span className='validationError' style={{color: "red", fontSize: "12px"}}>
									{errors.item}
								</span>
							)}
						</FormGroup>
					</Col>

					<Col md={6}>
						<FormGroup>
							<Label>Quantity <span style={{color: "red"}}>*</span></Label>
							<Input 
								onChange={(e) => setQty(e.target.value)}
								value={qty}
								type='number'
								min="1"
								placeholder='Enter quantity'
								invalid={!!errors.qty}
							/>
							{errors.qty && (
								<span className='validationError' style={{color: "red", fontSize: "12px"}}>
									{errors.qty}
								</span>
							)}
						</FormGroup>
					</Col>

					<Col md={12}>
						<div className="d-flex justify-content-end">
							<Button 
								color="success"
								onClick={handleSubmit}
								disabled={isLoading}
								style={{marginRight: '10px'}}
							>
								{isLoading ? (
									<>
										<ClockLoader size={16} className="mr-2" color="#fff" />
										{!data?.id ? "Saving..." : "Updating..."}
									</>
								) : (
									!data?.id ? "Save" : "Update"
								)}
							</Button>
							<Button 
								color="danger"
								onClick={handleClose}
								disabled={isLoading}
							>
								Close
							</Button>
						</div>
					</Col>
				</Row>
			</ModalBody>
		</Modal>
	);
};

export const ForgetPasswordModal = ({ForgetPasswordModalOpen, ForgetPasswordModalOpenFunction}) => {

	const [otp, setOpt] = useState('');
	
	const [otpid, setOtpid] = useState(false);
	const [isPasswordOpen, setIsPasswordOpen] = useState(true);
	const [email, setEmail] = useState('');
	const [loader, setLoader] = useState(false);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	
	const handleSubmit = () => {
		const formData = {
			otp: otp,
			otpid: otp+email
		}
		axios.post(API_URL+"/admin/password-verify", formData).then(response => {
			if (response.data.status === true) {
				// ForgetPasswordModalOpenFunction();
				setIsPasswordOpen(false)
				// Swal.fire('Successfully!', response.data.message, 'success')
			} else {
				// Swal.fire({title: 'failed to add try again', icon: "error"})
			}
			
		}).catch(error => {
			console.error('Error:', error);
		});
	};


	const handleOtpSend = (email) =>{
		setLoader(true)
		axios.post(API_URL+"/admin/forget", {
			email: email
		}).then(response => {
			if(response.data.status ===true){
				setOtpid(true)
				setLoader(false)
			}
		}).catch(error => {
			console.error('Error:', error);
		});
	}

	const onsubmitPassword = () => {
		setLoader(true);
	
		// Check if password and confirmPassword are provided
		if (!password || !confirmPassword) {
			Swal.fire({title: 'Please enter both password and confirm password', icon: "error"});
			setLoader(false);
			return;
		}
	
		// Check if password and confirmPassword match
		if (password !== confirmPassword) {
			Swal.fire({title: 'Password and Confirm password should be the same', icon: "error"});
			setLoader(false);
			return;
		}
	
		const formData = {
			email: email, // Correcting the email field
			password: password
		};
	
		axios.post(`${API_URL}/admin/password-reset`, formData)
			.then(response => {
				setLoader(false);

				if (response.data.status === true) {
					setIsPasswordOpen(true)
					setEmail('')
					setOpt(false);
					setOpt('');
					ForgetPasswordModalOpenFunction()
					Swal.fire({title: 'Password reset successfully', icon: "success"});
				} else {
					Swal.fire({title: 'Failed to reset password', icon: "error"});
				}
			})
			.catch(error => {
				console.error('Error:', error);
				Swal.fire({title: 'An error occurred while resetting the password', icon: "error"});
				setLoader(false);
			});
	};


	return (
		<Modal className="modal-dialog-centered modal-lg"
			isOpen={ForgetPasswordModalOpen}
			toggle={ForgetPasswordModalOpenFunction}>
			<ModalHeader toggle={ForgetPasswordModalOpenFunction}>
				Forget Password
				</ModalHeader>
			<ModalBody>
				<div className="w-100 d-flex loginmain">
					<div className="text-center rounded">
						<img src={''}
							alt="MainLogo"/>
						<div className="text-center">
							<h4 className="text-blue fw-bold">Welcome To Laxdeep Network Services</h4>
							<p className="py-2 text-secondary">
								Please Enter your details to Login
							</p>
						</div>

						<form>

							{isPasswordOpen ? ( <>
							<FormGroup className="d-flex flex-column  align-items-start ">
								<Label for="mobileNo"> Email <span style={{color: "red"}}> * </span> </Label>
								<Input type="tel" name="mobileNo" id="mobileNo"
									value={email}
									// disabled={otpid !== null}
									placeholder="Email"
									onChange={
										(e) => setEmail(e.target.value)
									}/>
							</FormGroup>
							{
							otpid ? (
								<FormGroup className="d-flex align-items-center gap-2 ">
									<Label for="mobileNo text-nowrap w-25">Enter Otp :</Label>
									<Input type="number" name="otp" id="otp"
										maxLength={6}
										value={otp}
										placeholder="XXXX"
										className="w-25"
										onChange={
											(e) => setOpt(e.target.value)
										}/>
								</FormGroup>
							) : null
						}
							<Button type="button" className="ml-3 bg-blue w-25">
								Cancel
							</Button>
							{
							otp ? (
								<>
									<Button type="button" className="ml-3 bg-blue w-25"
										onClick={handleSubmit}>
										Login
										<ClockLoader size={16}
											className="ml-2 "
											color="#fff"
											loading={loader}/>
									</Button>
									<Button type="button"
										// disabled={
										// 	timeRemaining >= 5
										// }
										className="ml-3 bg-blue w-25"
									// 	onClick={
									// 		() => HandleResendBtn(mobileNo)
									// }
									>
										Resend
										<ClockLoader size={16}
											className="ml-2 "
											color="#fff"
											loading={loader}/>
									</Button>
								</>
							) : (
								<Button type="button" className="ml-3 bg-blue w-25"
									onClick={
										() => handleOtpSend(email)
								}
								>
									Verify
									<ClockLoader size={16}
										className="ml-2 "
										color="#fff"
										loading={loader}/>
								</Button>
							)
						} 
					</> ) : 
					
					<>
					<FormGroup className="d-flex flex-column  align-items-start ">
								<Label for="mobileNo"> Password <span style={{color: "red"}}> * </span> </Label>
								<Input type="password" name="mobileNo" id="mobileNo"
									value={password}
									placeholder="password"
									onChange={
										(e) => setPassword(e.target.value)
									}/>
							</FormGroup>

							<FormGroup className="d-flex flex-column  align-items-start ">
								<Label for="mobileNo"> Confirm Password <span style={{color: "red"}}> * </span> </Label>
								<Input type="password" name="mobileNo" id="mobileNo"
									value={confirmPassword}
									placeholder="Confirm password"
									onChange={
										(e) => setConfirmPassword(e.target.value)
									}/>
							</FormGroup>

					<Button type="button" className="ml-3 bg-blue w-25"
									onClick={onsubmitPassword}
								>
									Change Password
									<ClockLoader size={16}
										className="ml-2 "
										color="#fff"
										loading={loader}/>
								</Button>
					</>
					
					}
						</form>
			</div>
				</div>
			</ModalBody>
		</Modal>
	);
};
