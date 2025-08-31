const jwt = require("jsonwebtoken");
const {
	Op
} = require("sequelize");
const db = require("../../model/index");
const CustomerModel = db.CustomerModel;
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const AccountModel = db.AccountModel
const PlanModel = db.PlanModel
const CustomerPlanHistory = db.CustomerPlanHistory
const CustomerReminderModel = db.CustomerReminderModel
const generateCustomerID = require("../misc/customeridgenerator");
const generateVoucherNo = require("../misc/voucherGenerator");
require("dotenv").config;
const {
	isEmail,
	isMobileNumber,
	isOptValid
} = require("../utils");
const sequelize = require('../../config/sequalize');
const cron = require('node-cron');

// const SignupUser = async (req, res) => {
// 	const data = req.body;
// 	console.log('Received customer data:', data);

// 	// Handle file uploads
// 	if (req.files) {
// 		const files = req.files;
// 		data.photo = files.photo ? files.photo[0].path : '';
// 		data.aadhar_card = files.aadhar_card ? files.aadhar_card[0].path : '';
// 		data.pan_card = files.pan_card ? files.pan_card[0].path : '';
// 		// Legacy file fields for backward compatibility
// 		data.image = files.image ? files.image[0].path : '';
// 		data.frontAadharImage = files.frontAadharImage ? files.frontAadharImage[0].path : '';
// 		data.backAadharImage = files.backAadharImage ? files.backAadharImage[0].path : '';
// 		data.panImage = files.panImage ? files.panImage[0].path : '';
// 		data.otherIdImage = files.otherIdImage ? files.otherIdImage[0].path : '';
// 		data.signature = files.signature ? files.signature[0].path : '';
// 	}

// 	// Validate required fields from Step 1
// 	if (!data.name || !data.username || !data.mobile || !data.address) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Required fields missing: name, username, mobile, and address are required'
// 		});
// 	}

// 	// Validate mobile number format
// 	if (!/^\d{10}$/.test(data.mobile)) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Mobile number must be exactly 10 digits'
// 		});
// 	}

// 	// Validate WhatsApp number if provided
// 	if (data.whatsapp_no && !/^\d{10}$/.test(data.whatsapp_no)) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'WhatsApp number must be exactly 10 digits'
// 		});
// 	}

// 	// Validate alternate number if provided
// 	if (data.alternate_no && !/^\d{10}$/.test(data.alternate_no)) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Alternate number must be exactly 10 digits'
// 		});
// 	}

// 	// Validate email if provided
// 	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Invalid email format'
// 		});
// 	}

// 	// Validate PAN number if provided
// 	if (data.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_no.toUpperCase())) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Invalid PAN format (e.g., ABCDE1234F)'
// 		});
// 	}

// 	// Validate Aadhar number if provided
// 	if (data.aadhar_no && !/^\d{12}$/.test(data.aadhar_no)) {
// 		return res.status(400).json({
// 			status: false,
// 			message: 'Aadhar number must be exactly 12 digits'
// 		});
// 	}

// 	const customerId = await generateCustomerID();

// 	// Calculate billing cycle and expiry date
// 	let planDuration = 0;
// 	let expiryDate = null;
// 	let billingCycle = data.billing_cycle || 1;

// 	if (data.selected_package) {
// 		try {
// 			const selectedPlan = await PlanModel.findByPk(data.selected_package);
// 			if (selectedPlan) {
// 				planDuration = selectedPlan.days || 0;
// 				const baseDate = new Date(data.start_date || new Date());
// 				baseDate.setDate(baseDate.getDate() + (planDuration * billingCycle));
// 				expiryDate = baseDate;
// 			}
// 		} catch (err) {
// 			console.error("Error fetching plan info:", err);
// 		}
// 	}

// 	// Calculate total amount
// 	let totalAmount = parseFloat(data.billing_amount) || 0;
// 	if (data.other_charges) {
// 		totalAmount += parseFloat(data.other_charges);
// 	}
// 	if (data.previous_dues) {
// 		totalAmount += parseFloat(data.previous_dues);
// 	}
// 	if (data.discount) {
// 		totalAmount -= parseFloat(data.discount);
// 	}

// 	const customer_data = {
// 		// Step 1: Basic Information
// 		name: data.name,
// 		username: data.username,
// 		gender: data.gender || null,
// 		address: data.address,
// 		installation_address: data.installation_address || null,
// 		mobile: data.mobile,
// 		whatsapp_no: data.whatsapp_no || null,
// 		alternate_no: data.alternate_no || null,
// 		area: data.area || null,
// 		block: data.block || null,
// 		apartment: data.apartment || null,
// 		email: data.email || null,

// 		// Step 2: Package Selection
// 		selected_package: data.selected_package ? parseInt(data.selected_package) : null,
// 		other_services: data.other_services || null,

// 		// Step 3: Inventory Items & KYC Records
// 		inventory_items: data.inventory_items || null,
// 		dob: data.dob || null,
// 		doa: data.doa || null,
// 		aadhar_card: data.aadhar_card || null,
// 		pan_card: data.pan_card || null,
// 		photo: data.photo || null,

// 		// Step 4: Billing Details
// 		billing_amount: data.billing_amount ? parseFloat(data.billing_amount) : null,
// 		billing_cycle: billingCycle,
// 		other_charges: data.other_charges ? parseFloat(data.other_charges) : null,
// 		previous_dues: data.previous_dues ? parseFloat(data.previous_dues) : null,
// 		start_date: data.start_date || null,
// 		end_date: data.end_date || null,
// 		received_amount: data.received_amount ? parseFloat(data.received_amount) : 0,
// 		received_date: data.received_date || null,
// 		discount: data.discount ? parseFloat(data.discount) : null,
// 		collected_by: data.collected_by || null,
// 		payment_method: data.payment_method || null,

// 		// Legacy fields for backward compatibility
// 		selectedPackage: data.selected_package ? parseInt(data.selected_package) : null,
// 		packageDetails: data.packageDetails || null,
// 		selectedItems: data.inventory_items || null,
// 		bill_date: new Date(),
// 		aadhar_no: data.aadhar_no || null,
// 		other_id: data.other_id || null,
// 		pan_no: data.pan_no ? data.pan_no.toUpperCase() : null,
// 		image: data.image || null,
// 		frontAadharImage: data.frontAadharImage || null,
// 		backAadharImage: data.backAadharImage || null,
// 		panImage: data.panImage || null,
// 		otherIdImage: data.otherIdImage || null,
// 		signature: data.signature || null,

// 		// System fields
// 		customer_id: customerId,
// 		status: 'active',
// 		customerType: 'individual',
// 		registrationDate: new Date(),
// 		expiry_date: expiryDate,
// 		balance: totalAmount,
// 		cash: data.payment_method === 'Cash' ? totalAmount : null,
// 		online: data.payment_method === 'Online' ? totalAmount : null,
// 	};

// 	try {
// 		// Check for existing mobile numbers
// 		const isServiceProvider = await ServiceProviderModel.findOne({ where: { mobile_no: data.mobile } });
// 		if (isServiceProvider) {
// 			return res.status(200).json({ status: false, message: 'Mobile number already registered as Service Provider!' });
// 		}

// 		const isSupervisor = await EmployeeModel.findOne({ where: { mobile_no: data.mobile } });
// 		if (isSupervisor) {
// 			return res.status(200).json({ status: false, message: 'Mobile number already registered as Employee!' });
// 		}

// 		const isCustomer = await CustomerModel.findOne({ where: { mobile: data.mobile } });
// 		if (isCustomer) {
// 			return res.status(200).json({ status: false, message: 'Mobile number already registered as Customer!' });
// 		}

// 		const customerRecord = await CustomerModel.create(customer_data);

// 		if (!customerRecord) {
// 			return res.status(200).json({ status: false, message: 'Failed to create customer details!' });
// 		}

// 		// Create Account Entry with Recharge Details
// 		if (data.billing_amount && parseFloat(data.billing_amount) > 0) {
// 			try {
// 				const voucherNo = await generateVoucherNo();
// 				const currentDate = new Date();

// 				const accountData = {
// 					date: currentDate,
// 					cust_id: customerId,
// 					cust_name: data.name,
// 					vc_no: voucherNo,
// 					address: data.address,
// 					amount: parseFloat(data.billing_amount),
// 					payment_mode: data.payment_method,
// 					balance: totalAmount,
// 					trans_id: null,
// 					partner_emp_id: null,
// 					auto_renew: false,
// 					recharge_status: 'completed',
// 					recharge_days: planDuration * billingCycle || null,
// 					valid_till: expiryDate || null
// 				};

// 				const accountRecord = await AccountModel.create(accountData);
// 				if (!accountRecord) {
// 					console.error('Failed to create account transaction');
// 				}

// 				await CustomerPlanHistory.create({
// 					customer_id: customerId,
// 					plan_id: data.selected_package,
// 					plan_name: data.selected_package ? parseInt(data.selected_package) : null,
// 					amount: parseFloat(data.billing_amount),
// 					recharge_date: new Date(),
// 					valid_from: new Date(data.start_date || new Date()),
// 					valid_till: expiryDate,
// 					recharge_days: planDuration * billingCycle,
// 				});
// 			} catch (accountError) {
// 				console.error('Error creating account transaction:', accountError);
// 			}
// 		}

// 		return res.status(200).json({
// 			status: true,
// 			data: {
// 				id: customerRecord.id,
// 				customer_id: customerId,
// 				name: data.name,
// 				username: data.username,
// 				mobile: data.mobile,
// 				email: data.email,
// 				gender: data.gender,
// 				address: data.address,
// 				installation_address: data.installation_address,
// 				area: data.area,
// 				block: data.block,
// 				apartment: data.apartment,
// 				whatsapp_no: data.whatsapp_no,
// 				alternate_no: data.alternate_no,
// 				dob: data.dob,
// 				doa: data.doa,
// 				selected_package: data.selected_package,
// 				other_services: data.other_services,
// 				inventory_items: data.inventory_items,
// 				billing_amount: data.billing_amount,
// 				billing_cycle: billingCycle,
// 				other_charges: data.other_charges,
// 				previous_dues: data.previous_dues,
// 				start_date: data.start_date,
// 				end_date: data.end_date,
// 				received_amount: data.received_amount,
// 				received_date: data.received_date,
// 				discount: data.discount,
// 				collected_by: data.collected_by,
// 				payment_method: data.payment_method,
// 				expiry_date: expiryDate
// 			},
// 			message: "Customer Added Successfully!"
// 		});

// 	} catch (error) {
// 		console.error('Error creating customer:', error);

// 		if (error.name === 'SequelizeValidationError') {
// 			const validationErrors = error.errors.map(err => err.message);
// 			return res.status(400).json({
// 				status: false,
// 				message: 'Validation Error',
// 				errors: validationErrors
// 			});
// 		}

// 		if (error.name === 'SequelizeUniqueConstraintError') {
// 			return res.status(400).json({
// 				status: false,
// 				message: 'Username or mobile number already exists!'
// 			});
// 		}

// 		return res.status(500).json({
// 			status: false,
// 			message: 'Internal Server Error',
// 			error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
// 		});
// 	}
// };

const SignupUser = async (req, res) => {
	const data = req.body;
	console.log('Received customer data:', data);

	// Handle file uploads
	if (req.files) {
		const files = req.files;
		data.photo = files.photo ? files.photo[0].path : '';
		data.aadhar_card = files.aadhar_card ? files.aadhar_card[0].path : '';
		data.pan_card = files.pan_card ? files.pan_card[0].path : '';
		data.image = files.image ? files.image[0].path : '';
		data.frontAadharImage = files.frontAadharImage ? files.frontAadharImage[0].path : '';
		data.backAadharImage = files.backAadharImage ? files.backAadharImage[0].path : '';
		data.panImage = files.panImage ? files.panImage[0].path : '';
		data.otherIdImage = files.otherIdImage ? files.otherIdImage[0].path : '';
		data.signature = files.signature ? files.signature[0].path : '';
	}

	// Basic validations
	if (!data.name || !data.username || !data.mobile || !data.address) {
		return res.status(400).json({
			status: false,
			message: 'Required fields missing: name, username, mobile, and address are required'
		});
	}

	if (!/^\d{10}$/.test(data.mobile)) {
		return res.status(400).json({
			status: false,
			message: 'Mobile number must be exactly 10 digits'
		});
	}
	if (data.whatsapp_no && !/^\d{10}$/.test(data.whatsapp_no)) {
		return res.status(400).json({
			status: false,
			message: 'WhatsApp number must be exactly 10 digits'
		});
	}
	if (data.alternate_no && !/^\d{10}$/.test(data.alternate_no)) {
		return res.status(400).json({
			status: false,
			message: 'Alternate number must be exactly 10 digits'
		});
	}
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		return res.status(400).json({
			status: false,
			message: 'Invalid email format'
		});
	}
	if (data.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_no.toUpperCase())) {
		return res.status(400).json({
			status: false,
			message: 'Invalid PAN format (e.g., ABCDE1234F)'
		});
	}
	if (data.aadhar_no && !/^\d{12}$/.test(data.aadhar_no)) {
		return res.status(400).json({
			status: false,
			message: 'Aadhar number must be exactly 12 digits'
		});
	}

	const customerId = await generateCustomerID();

	// Plan & Billing calculations
	let planDuration = 0;
	let expiryDate = null;
	let billingCycle = parseInt(data.billing_cycle || 1);

	if (data.selected_package) {
		const selectedPlan = await PlanModel.findByPk(data.selected_package);
		if (selectedPlan) {
			planDuration = selectedPlan.days || 0;
		}
	}

	const startDate = new Date(data.start_date || new Date());
	expiryDate = new Date(startDate);
	expiryDate.setDate(expiryDate.getDate() + (planDuration * billingCycle));

	const billingAmount = parseFloat(data.billing_amount) || 0;
	const otherCharges = parseFloat(data.other_charges || 0);
	const previousDues = parseFloat(data.previous_dues || 0);
	const discount = parseFloat(data.discount || 0);
	const receivedAmount = parseFloat(data.received_amount || 0);

	const totalAmount = billingAmount + otherCharges + previousDues - discount;
	const balanceAmount = totalAmount - receivedAmount;

	// Customer creation object
	const customer_data = {
		name: data.name,
		username: data.username,
		gender: data.gender || null,
		address: data.address,
		installation_address: data.installation_address || null,
		mobile: data.mobile,
		whatsapp_no: data.whatsapp_no || null,
		alternate_no: data.alternate_no || null,
		area: data.area || null,
		block: data.block || null,
		apartment: data.apartment || null,
		email: data.email || null,

		selected_package: data.selected_package ? parseInt(data.selected_package) : null,
		other_services: data.other_services || null,

		inventory_items: data.inventory_items ? JSON.stringify(data.inventory_items) : null,
		dob: data.dob || null,
		doa: data.doa || null,
		aadhar_card: data.aadhar_card || null,
		pan_card: data.pan_card || null,
		photo: data.photo || null,

		billing_amount: billingAmount,
		billing_cycle: billingCycle,
		other_charges: otherCharges,
		previous_dues: previousDues,
		start_date: startDate,
		end_date: expiryDate,
		received_amount: receivedAmount,
		received_date: data.received_date || null,
		discount: discount,
		collected_by: data.collected_by || null,
		payment_method: data.payment_method || null,

		selectedPackage: data.selected_package ? parseInt(data.selected_package) : null,
		packageDetails: data.packageDetails || null,
		selectedItems: data.inventory_items ? JSON.stringify(data.inventory_items) : null,
		bill_date: new Date(),
		aadhar_no: data.aadhar_no || null,
		other_id: data.other_id || null,
		pan_no: data.pan_no ? data.pan_no.toUpperCase() : null,
		image: data.image || null,
		frontAadharImage: data.frontAadharImage || null,
		backAadharImage: data.backAadharImage || null,
		panImage: data.panImage || null,
		otherIdImage: data.otherIdImage || null,
		signature: data.signature || null,

		customer_id: customerId,
		status: 'active',
		customerType: 'individual',
		registrationDate: new Date(),
		expiry_date: expiryDate,
		balance: balanceAmount,
		cash: data.payment_method === 'Cash' ? receivedAmount : null,
		online: data.payment_method === 'Online' ? receivedAmount : null,
	};

	// Start database transaction
	const transaction = await sequelize.transaction();

	try {
		// Check for duplicate mobile
		const [serviceProvider, employee, customer] = await Promise.all([
			ServiceProviderModel.findOne({
				where: {
					mobile_no: data.mobile
				}
			}),
			EmployeeModel.findOne({
				where: {
					mobile_no: data.mobile
				}
			}),
			CustomerModel.findOne({
				where: {
					mobile: data.mobile
				}
			})
		]);

		if (serviceProvider) {
			await transaction.rollback();
			return res.status(200).json({
				status: false,
				message: 'Mobile number already registered in Service Provider!'
			});
		}
		if (employee) {
			await transaction.rollback();
			return res.status(200).json({
				status: false,
				message: 'Mobile number already registered in Employee!'
			});
		}
		if (customer) {
			await transaction.rollback();
			return res.status(200).json({
				status: false,
				message: 'Mobile number already registered in Customer!'
			});
		}

		// Create customer
		const customerRecord = await CustomerModel.create(customer_data, {
			transaction
		});
		if (!customerRecord) {
			await transaction.rollback();
			return res.status(500).json({
				status: false,
				message: 'Failed to create customer record'
			});
		}

		// Create account entry
		if (billingAmount > 0) {
			const voucherNo = await generateVoucherNo();
			await AccountModel.create({
				date: new Date(),
				cust_id: customerId,
				cust_name: data.name,
				vc_no: voucherNo,
				address: data.address,
				amount: billingAmount,
				payment_mode: data.payment_method,
				balance: balanceAmount,
				trans_id: null,
				partner_emp_id: null,
				auto_renew: false,
				recharge_status: 'completed',
				recharge_days: planDuration * billingCycle,
				valid_till: expiryDate,
				collected_by: data.collected_by || null
			}, {
				transaction
			});
		}

		// Expire previous plans
		await CustomerPlanHistory.update({
			status: 'expired'
		}, {
			where: {
				customer_id: customerId,
				status: 'active'
			},
			transaction
		});

		// Create plan history
		await CustomerPlanHistory.create({
			customer_id: customerId,
			plan_id: data.selected_package,
			start_date: startDate,
			end_date: expiryDate,
			billing_amount: billingAmount,
			discount: discount,
			paid_amount: receivedAmount,
			due_amount: balanceAmount,
			payment_method: data.payment_method,
			status: 'active'
		}, {
			transaction
		});

		// Commit transaction
		await transaction.commit();

		return res.status(200).json({
			status: true,
			message: "Customer Added Successfully!",
			data: {
				id: customerRecord.id,
				customer_id: customerId,
				expiry_date: expiryDate,
				mobile: data.mobile,
				username: data.username,
				billing_amount: billingAmount,
				paid: receivedAmount,
				due: balanceAmount
			}
		});
	} catch (error) {
		// Rollback transaction on any error
		await transaction.rollback();
		console.error('Signup error:', error);

		if (error.name === 'SequelizeValidationError') {
			const validationErrors = error.errors.map(err => err.message);
			return res.status(400).json({
				status: false,
				message: 'Validation Error',
				errors: validationErrors
			});
		}

		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(400).json({
				status: false,
				message: 'Username number already exists!'
			});
		}

		return res.status(500).json({
			status: false,
			message: 'Internal Server Error'
		});
	}
};



const LoginUser = async (req, res) => {
	const {
		number,
		otp,
		otpid
	} = req.query;

	try {
		if (!number && !otp) {
			return res.status(400).json({
				error: true,
				message: "Invalid credentials"
			});
		}

		const isVerified = await isOptValid(otp, otpid);
		if (!isVerified) {
			return res.status(404).json({
				error: true,
				message: "Otp Invalid or expired"
			});
		}

		const User = await CustomerModel.findOne({
			where: {
				mobile: number
			}
		});

		if (!User) {
			return res.status(404).json({
				error: true,
				message: "No user found"
			});
		}

		res.status(200).json(User);
	} catch (error) {
		res.status(500).json(error);
	}
};

const DeleteUsers = (req, res) => {
	try {
		CustomerModel.deleteMany({}).then(() => {
			res.status(200).json("All User Deleted ");
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

const AllCustomer = async (req, res) => {
	try {
		const customers = await CustomerModel.findAll({
			include: [{
					model: CustomerPlanHistory,
					limit: 1,
					order: [
						['start_date', 'DESC']
					]
				},
				{
					model: AccountModel,
					limit: 1,
					order: [
						['date', 'DESC']
					]
				},
				{
					model: PlanModel,
					as: 'plan'
				}
			],
			order: [
				['id', 'ASC']
			]
		});

		if (customers.length === 0)
			return res.status(404).json({
				error: true,
				message: "No user found"
			});

		// Transform the data to match your expected format
		const transformedCustomers = customers.map(customer => {
			const customerData = customer.toJSON();
			return {
				...customerData,
				customer_plan_history: customerData.customer_plan_histories && customerData.customer_plan_histories.length > 0 ?
					customerData.customer_plan_histories[0] :
					null,
				account: customerData.accounts && customerData.accounts.length > 0 ?
					customerData.accounts[0] :
					null,
				plan: customerData.plan || null,
				customer_plan_histories: undefined, // Remove the array
				accounts: undefined // Remove the array
			};
		});

		res.status(200).json({
			status: 200,
			data: transformedCustomers
		});
	} catch (error) {
		console.error('AllCustomer error:', error);
		res.status(500).json({
			error: true,
			message: error.message
		});
	}
};

const GetCustomer = async (req, res) => {
	try {
		const id = req.params.id;
		const isUser = await CustomerModel.findOne({

			include: [{
					model: CustomerPlanHistory,
					limit: 1,
					order: [
						['start_date', 'DESC']
					]
				},
				{
					model: AccountModel,
					limit: 1,
					order: [
						['date', 'DESC']
					]
				},
				{
					model: PlanModel,
					as: 'plan'
				}
			],
			where: {
				customer_id: id
			}
		});
		if (!isUser) {
			return res.status(404).json({
				error: true,
				message: "No user found"
			});
		}
		res.status(200).json({
			error: false,
			data: isUser
		});
	} catch (error) {
		res.status(500).json(error);
	}
};

const GetDeleteCustomerById = async (req, res) => {
	const user_id = req.params.id;
	try {
		const rowsDeleted = await CustomerModel.destroy({
			where: {
				id: user_id
			}
		});

		if (rowsDeleted === 0) {
			return res.status(400).json({
				error: true,
				message: "No data found with this id"
			});
		}

		res.status(200).json({
			error: false,
			message: "Deleted successfully"
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			error: true,
			message: "Internal server error"
		});
	}
};

const GetUpdateTheCustomer = async (req, res) => {

	try {
		const {
			customer_id
		} = req.params;
		const data = req.body;

		console.log("data", data)

		const customer = await CustomerModel.findOne({
			where: {
				customer_id: customer_id,
			}
		});

		if (!customer) {
			return res.status(404).json({
				status: false,
				message: "Customer not found!"
			});
		}



		// 🔹 Handle file uploads
		const fileFields = {};
		const uploadFields = ["image", "frontAadharImage", "backAadharImage", "panImage", "otherIdImage", "signature"];

		uploadFields.forEach((fieldName) => {
			if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
				fileFields[fieldName] = req.files[fieldName][0].filename;
			} else if (typeof data[fieldName] === "string" && data[fieldName].trim() !== "") {
				fileFields[fieldName] = data[fieldName].trim();
			}
		});

		// 🔹 Prepare update object only from provided fields
		const customer_data = {};
		Object.keys(data).forEach((key) => {
			if (data[key] !== undefined) {
				customer_data[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
			}
		});

		// Add file fields if provided
		Object.assign(customer_data, fileFields);

		// 🔹 Username duplicate check (only if changed)
		if (customer_data.username && customer_data.username !== customer.username) {
			const existingCustomer = await CustomerModel.findOne({
				where: {
					username: customer_data.username,
					customer_id: {
						[Op.ne]: customer_id
					}, // exclude current user
				},
			});
			if (existingCustomer) {
				return res.status(400).json({
					status: false,
					message: "Username already exists!"
				});
			}
		}

		// 🔹 Mobile number duplicate check (only if changed)
		if (customer_data.mobile && customer_data.mobile !== customer.mobile) {
			const isServiceProvider = await ServiceProviderModel.findOne({
				where: {
					mobile_no: customer_data.mobile
				},
			});
			if (isServiceProvider) {
				return res.status(400).json({
					status: false,
					message: "Mobile number already exists as Service Provider!"
				});
			}

			const isSupervisor = await EmployeeModel.findOne({
				where: {
					mobile_no: customer_data.mobile
				},
			});
			if (isSupervisor) {
				return res.status(400).json({
					status: false,
					message: "Mobile number already exists as Supervisor!"
				});
			}

			const existingCustomer = await CustomerModel.findOne({
				where: {
					mobile: customer_data.mobile,
					customer_id: {
						[Op.ne]: customer_id
					},
				},
			});
			if (existingCustomer) {
				return res.status(400).json({
					status: false,
					message: "Mobile number already exists as Customer!"
				});
			}
		}

		// 🔹 Balance calculation (only if billing_amount & received_amount provided)
		if (customer_data.billing_amount !== undefined && customer_data.received_amount !== undefined) {
			customer_data.balance = customer_data.billing_amount - customer_data.received_amount;
		}

		// 🔹 Update only provided fields
		await customer.update(customer_data);

		return res.status(200).json({
			status: true,
			message: "Customer updated successfully",
			updatedFields: Object.keys(customer_data),
		});
	} catch (error) {
		console.error("Update customer error:", error);
		return res.status(500).json({
			status: false,
			message: "Internal Server Error: " + error.message,
		});
	}
};

const GetupdateBlockStatus = async (req, res) => {

	const {
		id
	} = req.params;
	const {
		is_block
	} = req.body;

	try {
		const record = await CustomerModel.findOne({
			where: {
				id: id
			}
		});

		if (!record) {
			return res.status(404).json({
				error: 'Record not found'
			});
		}

		await record.update({
			is_block: is_block
		});

		return res.status(200).json({
			message: 'Block status updated successfully'
		});
	} catch (error) {
		res.status(500).json({
			error
		});
	}
}

const UpdateStatus = async (req, res) => {
	const user_id = req.params.id
	try {
		const is_block = req.body;
		const data = await CustomerModel.update(is_block, {
			where: {
				id: user_id
			}
		});
		if (data) {
			res.status(200).json({
				error: false,
				message: data
			})
		}
	} catch (error) {
		res.status(200).json({
			error: false,
			message: "Blocked Successfully"
		});
	}
}

const FilterCustomers = async (req, res) => {
	try {
		const {
			status,
			locality,
			block,
			area,
			apartment,
			name,
			custId,
			endDate,
			startDate,
			alphabet
		} = req.body;

		// Build dynamic where clause
		let whereClause = {};

		// Status filter
		if (status && status !== 'all') {
			whereClause.status = status;
		}

		// Locality filter (searching in area, block, apartment, address fields)
		if (locality && locality !== 'all' && locality !== '' && locality.value !== '') {
			whereClause[Op.or] = [{
					area: {
						[Op.like]: `%${locality}%`
					}
				},
				{
					block: {
						[Op.like]: `%${locality}%`
					}
				},
				{
					apartment: {
						[Op.like]: `%${locality}%`
					}
				},
				{
					address: {
						[Op.like]: `%${locality}%`
					}
				},
				{
					t_address: {
						[Op.like]: `%${locality}%`
					}
				}
			];
		}

		// Company filter (if you have a company field)
		if (block && block !== 'all' && block !== '' && block.value !== '') {
			whereClause.block = {
				[Op.like]: `%${block}%`
			};
		}

		// Broadband filter (assuming this is package related)
		if (apartment && apartment !== 'all' && apartment !== '' && apartment.value !== '') {
			whereClause.apartment = apartment;
		}
		if (area && area !== 'all' && area !== '' && area.value !== '') {
			whereClause.area = area;
		}

		if (name && name !== 'all' && name !== '' && name.value !== '') {
			whereClause.name = {
				[Op.like]: `%${name}%`
			};
		}

		if (custId && custId !== 'all' && custId !== '' && custId.value !== '') {
			whereClause[Op.or] = [{
					customer_id: {
						[Op.like]: `%${custId}%`
					}
				},
				{
					id: custId
				}
			];
		}

		// Date range filter
		if (startDate && endDate) {
			whereClause.createdAt = {
				[Op.between]: [new Date(startDate), new Date(endDate)]
			};
		} else if (endDate) {
			whereClause.createdAt = {
				[Op.lte]: new Date(endDate)
			};
		} else if (startDate) {
			whereClause.createdAt = {
				[Op.gte]: new Date(startDate)
			};
		}

		if (alphabet && alphabet !== 'all' && alphabet !== '' && alphabet !== 'ALL') {
			whereClause.name = {
				[Op.like]: `${alphabet}%`
			};
		}

		console.log("=---", JSON.stringify(whereClause))

		const customers = await CustomerModel.findAll({
			where: whereClause,
			order: [
				['id', 'DESC']
			]
		});

		if (customers.length === 0) {
			return res.status(200).json({
				status: 200,
				data: [],
				message: "No customers found matching the filter criteria"
			});
		}

		res.status(200).json({
			status: 200,
			data: customers,
			count: customers.length
		});

	} catch (error) {
		console.error('Filter customers error:', error);
		res.status(500).json({
			error: true,
			message: "Internal Server Error: " + error.message
		});
	}
}


const AllCustomerFilterByFlow = async (req, res) => {
	try {

		// Get all customers
		const allCustomers = await CustomerModel.findAll({
			order: [
				['id', 'ASC']
			]
		});

		if (allCustomers.length === 0) {
			return res.status(200).json({
				status: 200,
				data: [],
				message: "No customers found that are not assigned to any flow"
			});
		}

		res.status(200).json({
			status: 200,
			data: allCustomers,
			message: `Found ${allCustomers.length} customers not assigned to any flow`
		});
	} catch (error) {
		console.error('AllCustomerFilterByFlow error:', error);
		res.status(500).json({
			error: true,
			message: "Internal Server Error: " + error.message
		});
	}
};


const GetCustomerFilter = async (req, res) => {
	try {
		const {
			globalSearch
		} = req.body;

		// Build dynamic where clause
		let whereClause = {};

		// Handle global search first (if present, it overrides other filters except date range)
		if (globalSearch && globalSearch !== '') {
			const searchTerm = globalSearch.trim();

			// Check if it's a single letter for alphabetical search
			if (searchTerm.length === 1 && /^[A-Za-z]$/.test(searchTerm)) {
				whereClause.name = {
					[Op.like]: `${searchTerm}%`
				};
			} else {
				// Global search across multiple fields
				whereClause[Op.or] = [{
						name: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						mobile: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						email: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						address: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						area: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						block: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						apartment: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						username: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						customer_id: {
							[Op.like]: `%${searchTerm}%`
						}
					}
				];
			}
		}

		const customers = await CustomerModel.findAll({
			where: whereClause,
			order: [
				['id', 'DESC']
			]
		});

		if (customers.length === 0) {
			return res.status(200).json({
				status: 200,
				data: [],
				message: "No customers found matching the filter criteria"
			});
		}

		res.status(200).json({
			status: 200,
			data: customers,
			count: customers.length,
			message: `Found ${customers.length} customers matching the filter criteria`
		});

	} catch (error) {
		console.error('GetCustomerFilter error:', error);
		res.status(500).json({
			error: true,
			message: "Internal Server Error: " + error.message
		});
	}
}


const AddRePayment = async (req, res) => {
	const {
		customer_id,
		amount,
		payment_method,
		trans_id,
	} = req.body;

	try {
		// 1. Validate
		if (!customer_id || !amount || !payment_method) {
			return res.status(400).json({
				status: false,
				message: "Missing required fields: customer_id, amount, or payment_mode"
			});
		}

		// 2. Get Customer
		const customer = await CustomerModel.findOne({
			where: {
				customer_id
			}
		});
		if (!customer) {
			return res.status(404).json({
				status: false,
				message: "Customer not found"
			});
		}

		// 3. Use plan info from selectedPackage or DB fallback
		const planData = await PlanModel.findOne({
			where: {
				id: customer.selected_package
			}
		});

		if (!planData || !planData.days) {
			return res.status(404).json({
				status: false,
				message: "Plan not found or invalid"
			});
		}

		// 4. Expire customer's previous active plan (if any)
		await CustomerPlanHistory.update({
			status: 'expired'
		}, {
			where: {
				customer_id,
				status: 'active'
			}
		});

		// 5. Calculate dates & billing
		const today = new Date();
		const expiry = new Date(today);
		expiry.setDate(today.getDate() + planData.days);

		const previousDues = parseFloat(customer.balance || 0);
		const rechargeAmount = parseFloat(amount);
		const remainingBalance = Math.max(0, previousDues - rechargeAmount);

		// 6. Create Account Entry
		const account = await AccountModel.create({
			cust_id: customer_id,
			amount: rechargeAmount,
			payment_method,
			trans_id,
			recharge_status: 'completed',
			recharge_days: planData.days,
			valid_till: expiry,
			cust_name: customer.name,
			date: today,
			address: customer.address,
			vc_no: await generateVoucherNo(),
			balance: remainingBalance,
			partner_emp_id: customer.partner_emp_id,
			auto_renew: false,
			collected_by: req.user?.id || null // Fix undefined collected_by
		});

		// 7. Create Plan History
		await CustomerPlanHistory.create({
			customer_id,
			plan_id: customer.selected_package,
			start_date: today,
			end_date: expiry,
			billing_amount: rechargeAmount,
			discount: 0,
			paid_amount: rechargeAmount,
			due_amount: remainingBalance,
			payment_method,
			status: 'active'
		});

		// 8. Update CustomerModel
		await CustomerModel.update({
			bill_date: today,
			balance: remainingBalance, // Updated balance after payment
			expiry_date: expiry,
			status: 'active',
			payment_status: remainingBalance === 0 ? true : false // Mark as paid if balance is zero
		}, {
			where: {
				customer_id
			}
		});

		// 9. Done
		return res.status(200).json({
			status: true,
			message: remainingBalance === 0 ? "Payment completed successfully" : "Partial payment recorded successfully",
			data: {
				account,
				valid_till: expiry,
				paid_amount: rechargeAmount,
				previous_balance: previousDues,
				remaining_balance: remainingBalance,
				payment_status: remainingBalance === 0 ? 'Completed' : 'Partial',
				customer_id: customer_id
			}
		});
	} catch (error) {
		console.error("AddRePayment error:", error);
		return res.status(500).json({
			status: false,
			message: "Internal Server Error: " + error.message
		});
	}
};

const GetBillingDetails = async (req, res) => {

	const {
		customer_id
	} = req.body;

	try {
		const isCustomer = await CustomerPlanHistory.findAll({
			where: {
				customer_id: customer_id
			},
			order: [
				['end_date', 'DESC']
			]
		});

		if (!isCustomer) {
			return res.status(400).json({
				status: false,
				message: "Customer not found"
			});
		}

		return res.status(200).json({
			status: true,
			message: "Billing details found",
			data: isCustomer
		});
	} catch (error) {
		console.error("GetBillingDetails error:", error);
		return res.status(500).json({
			status: false,
			message: "Internal Server Error: " + error.message
		});
	}
}

const importBulkCustomers = async (req, res) => {
	const {
		customers
	} = req.body;

	if (!Array.isArray(customers) || customers.length === 0) {
		return res.status(400).json({
			message: 'No customer data found'
		});
	}

	try {
		// Process each customer to generate customer_id and set default values
		const processedCustomers = [];

		// Get the starting customer ID for bulk import
		let currentCustomerId = await generateCustomerID();

		for (const customer of customers) {
			// Set default values and process the customer data
			const processedCustomer = {
				...customer,
				customer_id: currentCustomerId,
				status: customer.status || 'active',
				customerType: customer.customerType || 'individual',
				registrationDate: new Date(),
				bill_date: customer.bill_date ? new Date(customer.bill_date) : new Date(),
				billing_amount: customer.billing_amount ? parseFloat(customer.billing_amount) : 0,
				balance: customer.billing_amount ? parseFloat(customer.billing_amount) : 0,
				mobile: customer.mobile || customer.mobile_no || '',
				name: customer.name || customer.customer_name || '',
				address: customer.address || '',
				area: customer.area || '',
				block: customer.block || '',
				apartment: customer.apartment || '',
				email: customer.email || null,
				gender: customer.gender || null,
				whatsapp_no: customer.whatsapp_no || null,
				alternate_no: customer.alternate_no || null,
				dob: customer.dob || null,
				doa: customer.doa || null,
				aadhar_no: customer.aadhar_no || null,
				other_id: customer.other_id || null,
				pan_no: customer.pan_no ? customer.pan_no.toUpperCase() : null,
				selectedPackage: customer.selectedPackage ? parseInt(customer.selectedPackage) : null,
				packageDetails: customer.packageDetails || null,
				selectedItems: customer.selectedItems || null,
				payment_method: customer.payment_method || null,
				cash: customer.cash ? parseFloat(customer.cash) : null,
				online: customer.online ? parseFloat(customer.online) : null,
				image: customer.image || null,
				frontAadharImage: customer.frontAadharImage || null,
				backAadharImage: customer.backAadharImage || null,
				panImage: customer.panImage || null,
				otherIdImage: customer.otherIdImage || null,
				signature: customer.signature || null,
				username: customer.username || customer.mobile || customer.mobile_no || '',
				t_address: customer.t_address || null,
				expiry_date: customer.expiry_date ? new Date(customer.expiry_date) : null
			};

			processedCustomers.push(processedCustomer);

			// Increment customer ID for next customer
			currentCustomerId++;
		}

		console.log(processedCustomers)

		// Use bulk insert with processed customers
		const inserted = await CustomerModel.bulkCreate(processedCustomers);
		res.status(200).json({
			status: true,
			message: 'Customers imported successfully',
			inserted: inserted.length
		});
	} catch (error) {
		console.error('Import error:', error);
		res.status(500).json({
			status: false,
			message: 'Failed to import customers',
			error: error.message
		});
	}
};

const expireOldPlans = async () => {
	try {
		const result = await CustomerPlanHistory.update({
			status: 'expired'
		}, {
			where: {
				status: 'active',
				end_date: {
					[Op.lt]: new Date() // expire plans whose end_date < today
				}
			}
		});
		const result2 = await CustomerModel.update({
			status: 'expired'
		}, {
			where: {
				status: 'active',
				expiry_date: {
					[Op.lt]: new Date() // expire plans whose end_date < today
				}
			}
		});
		console.log(`✅ Expired ${result[0]} old plans`);
	} catch (err) {
		console.error("❌ Error auto-expiring plans:", err);
	}
};


const RenewPlan = async (req, res) => {
	const {
		customer_id,
		plan_id,
		renewalStartDate,
		renewalEndDate,
		renewalCycle,
		selectedPackage
	} = req.body;

	try {
		// Validate customer exists
		const customer = await CustomerModel.findOne({
			where: {
				customer_id
			}
		});
		if (!customer) {
			return res.status(404).json({
				status: false,
				message: "Customer not found"
			});
		}

		// Validate plan exists
		const plan = await PlanModel.findOne({
			where: {
				id: plan_id
			}
		});
		if (!plan) {
			return res.status(404).json({
				status: false,
				message: "Plan not found"
			});
		}

		// Get plan data from selectedPackage or database
		const planData = selectedPackage?.days ? {
			days: parseInt(selectedPackage.days),
			finalPrice: parseFloat(selectedPackage.finalPrice),
			plan: selectedPackage.plan,
			connectionType: selectedPackage.connectionType,
			code: selectedPackage.code
		} : plan;

		if (!planData || !planData.days) {
			return res.status(400).json({
				status: false,
				message: "Invalid plan data"
			});
		}

		// Calculate dates
		const startDate = renewalStartDate ? new Date(renewalStartDate) : new Date();
		const endDate = renewalEndDate ? new Date(renewalEndDate) : new Date(startDate.getTime() + (planData.days * 24 * 60 * 60 * 1000));

		// Calculate billing amount
		const billingAmount = parseFloat(planData.finalPrice);
		const previousBalance = parseFloat(customer.balance || 0);
		const totalAmount = billingAmount + previousBalance;

		// Update customer with new plan details and set payment as pending
		const updateData = {
			bill_date: startDate,
			balance: totalAmount, // Total amount to be paid
			expiry_date: endDate,
			payment_status: false, // Payment pending
			selected_package: plan_id, // Store plan ID as integer (foreign key)
		};
		console.log("updateData-", updateData)

		await CustomerModel.update(updateData, {
			where: {
				customer_id
			}
		});

		// Return success response with renewal details
		res.status(200).json({
			status: true,
			message: "Plan renewed successfully with pending payment",
			data: {
				customer_id,
				plan: planData.plan,
				billing_amount: billingAmount,
				total_amount: totalAmount,
				start_date: startDate,
				end_date: endDate,
				payment_status: "Pending",
				renewal_cycle: renewalCycle || '1 Month'
			}
		});

	} catch (error) {
		console.error('Error in RenewPlan:', error);
		res.status(500).json({
			status: false,
			message: "Internal Server Error",
			error: error.message
		});
	}
};

const SetReminder = async (req, res) => {
	const {
		reminder_type,
		reminder_date,
		note,
		created_by,
		customer_id
	} = req.body;

	try {
		// Validate required fields
		if (!reminder_type || !reminder_date || !customer_id || !created_by) {
			return res.status(400).json({
				status: false,
				message: "Missing required fields: reminder_type, reminder_date, customer_id, and created_by are required"
			});
		}

		// Prepare data for database insertion
		const reminderData = {
			reminder_type,
			reminder_date,
			note: note || '', // Note can be optional
			created_by: created_by.toString(), // Convert to string as per model
			customer_id
		};

		const reminder = await CustomerReminderModel.create(reminderData);
		res.status(200).json({
			status: true,
			message: "Reminder set successfully",
			data: reminder
		});
	} catch (error) {
		console.error('Error in SetReminder:', error);
		res.status(500).json({
			status: false,
			message: "Internal Server Error",
			error: error.message
		});
	}
};

// Complete Payment for Renewed Plan
const CompleteRenewalPayment = async (req, res) => {
	const {
		customer_id,
		payment_method,
		trans_id,
		received_amount
	} = req.body;

	try {
		// Validate customer exists
		const customer = await CustomerModel.findOne({
			where: {
				customer_id
			}
		});
		if (!customer) {
			return res.status(404).json({
				status: false,
				message: "Customer not found"
			});
		}

		// Check if there's a pending payment
		if (customer.payment_status === true) {
			return res.status(400).json({
				status: false,
				message: "No pending payment found"
			});
		}

		const amountReceived = parseFloat(received_amount);
		const remainingBalance = parseFloat(customer.balance) - amountReceived;

		// Update payment status
		const updateData = {
			payment_status: true, // Mark as paid
			received_amount: amountReceived,
			balance: remainingBalance > 0 ? remainingBalance : 0,
			payment_method: payment_method,
			transaction_id: trans_id,
			payment_date: new Date()
		};

		await CustomerModel.update(updateData, {
			where: {
				customer_id
			}
		});

		res.status(200).json({
			status: true,
			message: "Payment completed successfully",
			data: {
				customer_id,
				received_amount: amountReceived,
				remaining_balance: remainingBalance,
				payment_status: "Completed"
			}
		});

	} catch (error) {
		console.error('Error in CompleteRenewalPayment:', error);
		res.status(500).json({
			status: false,
			message: "Internal Server Error",
			error: error.message
		});
	}
};

const GetAllReminder = async (req, res) => {
	try {
		const reminder = await CustomerReminderModel.findAll({
			order: [
				['id', 'DESC']
			]
		});
		res.status(200).json({
			status: true,
			message: "successfully",
			data: reminder
		});
	} catch (error) {
		console.error('Error in GetAllReminder:', error);
		res.status(500).json({
			status: false,
			message: "Internal Server Error",
			error: error.message
		});
	}
};


const GetReminderByID = async (req, res) => {
	const {
		customer_id
	} = req.params;
	try {
		const reminder = await CustomerReminderModel.findAll({
			where: {
				customer_id
			}
		});
		res.status(200).json({
			status: true,
			message: "Reminder successfully",
			data: reminder
		});
	} catch (error) {
		console.error('Error in GetReminder:', error);
		res.status(500).json({
			status: false,
			message: "Internal Server Error",
			error: error.message
		});
	}
};


cron.schedule('0 0 * * *', () => {
	console.log("🔁 Running auto-expiry for outdated plans...");
	expireOldPlans();
});


module.exports = {
	SignupUser,
	LoginUser,
	DeleteUsers,
	AllCustomer,
	GetCustomer,
	GetDeleteCustomerById,
	GetUpdateTheCustomer,
	UpdateStatus,
	GetupdateBlockStatus,
	FilterCustomers,
	AllCustomerFilterByFlow,
	GetCustomerFilter,
	AddRePayment,
	GetBillingDetails,
	importBulkCustomers,
	RenewPlan,
	CompleteRenewalPayment,
	SetReminder,
	GetAllReminder,
	GetReminderByID
};