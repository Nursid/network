const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../../model/index");
const CustomerModel = db.CustomerModel;
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const AccountModel = db.AccountModel
const PlanModel = db.PlanModel
const CustomerPlanHistory = db.CustomerPlanHistory
const generateCustomerID = require("../misc/customeridgenerator");
const generateVoucherNo = require("../misc/voucherGenerator");
require("dotenv").config;
const {isEmail, isMobileNumber, isOptValid} = require("../utils");


const SignupUser = async (req, res) => {
	const data = req.body;
	console.log('Received customer data:', data);

	// Handle file uploads
	if (req.files) {
		const files = req.files;
		data.photo = files.photo ? files.photo[0].path : '';
		data.aadhar_card = files.aadhar_card ? files.aadhar_card[0].path : '';
		data.pan_card = files.pan_card ? files.pan_card[0].path : '';
		// Legacy file fields for backward compatibility
		data.image = files.image ? files.image[0].path : '';
		data.frontAadharImage = files.frontAadharImage ? files.frontAadharImage[0].path : '';
		data.backAadharImage = files.backAadharImage ? files.backAadharImage[0].path : '';
		data.panImage = files.panImage ? files.panImage[0].path : '';
		data.otherIdImage = files.otherIdImage ? files.otherIdImage[0].path : '';
		data.signature = files.signature ? files.signature[0].path : '';
	}

	// Validate required fields from Step 1
	if (!data.name || !data.username || !data.mobile || !data.address) {
		return res.status(400).json({
			status: false,
			message: 'Required fields missing: name, username, mobile, and address are required'
		});
	}

	// Validate mobile number format
	if (!/^\d{10}$/.test(data.mobile)) {
		return res.status(400).json({
			status: false,
			message: 'Mobile number must be exactly 10 digits'
		});
	}

	// Validate WhatsApp number if provided
	if (data.whatsapp_no && !/^\d{10}$/.test(data.whatsapp_no)) {
		return res.status(400).json({
			status: false,
			message: 'WhatsApp number must be exactly 10 digits'
		});
	}

	// Validate alternate number if provided
	if (data.alternate_no && !/^\d{10}$/.test(data.alternate_no)) {
		return res.status(400).json({
			status: false,
			message: 'Alternate number must be exactly 10 digits'
		});
	}

	// Validate email if provided
	if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		return res.status(400).json({
			status: false,
			message: 'Invalid email format'
		});
	}

	// Validate PAN number if provided
	if (data.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_no.toUpperCase())) {
		return res.status(400).json({
			status: false,
			message: 'Invalid PAN format (e.g., ABCDE1234F)'
		});
	}

	// Validate Aadhar number if provided
	if (data.aadhar_no && !/^\d{12}$/.test(data.aadhar_no)) {
		return res.status(400).json({
			status: false,
			message: 'Aadhar number must be exactly 12 digits'
		});
	}

	const customerId = await generateCustomerID();

	// Calculate billing cycle and expiry date
	let planDuration = 0;
	let expiryDate = null;
	let billingCycle = data.billing_cycle || 1;

	if (data.selected_package) {
		try {
			const selectedPlan = await PlanModel.findByPk(data.selected_package);
			if (selectedPlan) {
				planDuration = selectedPlan.days || 0;
				const baseDate = new Date(data.start_date || new Date());
				baseDate.setDate(baseDate.getDate() + (planDuration * billingCycle));
				expiryDate = baseDate;
			}
		} catch (err) {
			console.error("Error fetching plan info:", err);
		}
	}

	// Calculate total amount
	let totalAmount = parseFloat(data.billing_amount) || 0;
	if (data.other_charges) {
		totalAmount += parseFloat(data.other_charges);
	}
	if (data.previous_dues) {
		totalAmount += parseFloat(data.previous_dues);
	}
	if (data.discount) {
		totalAmount -= parseFloat(data.discount);
	}

	const customer_data = {
		// Step 1: Basic Information
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
		
		// Step 2: Package Selection
		selected_package: data.selected_package ? parseInt(data.selected_package) : null,
		other_services: data.other_services || null,
		
		// Step 3: Inventory Items & KYC Records
		inventory_items: data.inventory_items || null,
		dob: data.dob || null,
		doa: data.doa || null,
		aadhar_card: data.aadhar_card || null,
		pan_card: data.pan_card || null,
		photo: data.photo || null,
		
		// Step 4: Billing Details
		billing_amount: data.billing_amount ? parseFloat(data.billing_amount) : null,
		billing_cycle: billingCycle,
		other_charges: data.other_charges ? parseFloat(data.other_charges) : null,
		previous_dues: data.previous_dues ? parseFloat(data.previous_dues) : null,
		start_date: data.start_date || null,
		end_date: data.end_date || null,
		received_amount: data.received_amount ? parseFloat(data.received_amount) : 0,
		received_date: data.received_date || null,
		discount: data.discount ? parseFloat(data.discount) : null,
		collected_by: data.collected_by || null,
		payment_method: data.payment_method || null,
		
		// Legacy fields for backward compatibility
		selectedPackage: data.selected_package ? parseInt(data.selected_package) : null,
		packageDetails: data.packageDetails || null,
		selectedItems: data.inventory_items || null,
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
		
		// System fields
		customer_id: customerId,
		status: 'active',
		customerType: 'individual',
		registrationDate: new Date(),
		expiry_date: expiryDate,
		balance: totalAmount,
		cash: data.payment_method === 'Cash' ? totalAmount : null,
		online: data.payment_method === 'Online' ? totalAmount : null,
	};

	try {
		// Check for existing mobile numbers
		const isServiceProvider = await ServiceProviderModel.findOne({ where: { mobile_no: data.mobile } });
		if (isServiceProvider) {
			return res.status(200).json({ status: false, message: 'Mobile number already registered as Service Provider!' });
		}

		const isSupervisor = await EmployeeModel.findOne({ where: { mobile_no: data.mobile } });
		if (isSupervisor) {
			return res.status(200).json({ status: false, message: 'Mobile number already registered as Employee!' });
		}

		const isCustomer = await CustomerModel.findOne({ where: { mobile: data.mobile } });
		if (isCustomer) {
			return res.status(200).json({ status: false, message: 'Mobile number already registered as Customer!' });
		}

		const customerRecord = await CustomerModel.create(customer_data);

		if (!customerRecord) {
			return res.status(200).json({ status: false, message: 'Failed to create customer details!' });
		}

		// Create Account Entry with Recharge Details
		if (data.billing_amount && parseFloat(data.billing_amount) > 0) {
			try {
				const voucherNo = await generateVoucherNo();
				const currentDate = new Date();

				const accountData = {
					date: currentDate,
					cust_id: customerId,
					cust_name: data.name,
					vc_no: voucherNo,
					address: data.address,
					amount: parseFloat(data.billing_amount),
					payment_mode: data.payment_method,
					balance: totalAmount,
					trans_id: null,
					partner_emp_id: null,
					auto_renew: false,
					recharge_status: 'completed',
					recharge_days: planDuration * billingCycle || null,
					valid_till: expiryDate || null
				};

				const accountRecord = await AccountModel.create(accountData);
				if (!accountRecord) {
					console.error('Failed to create account transaction');
				}

				await CustomerPlanHistory.create({
					customer_id: customerId,
					plan_id: data.selected_package,
					plan_name: data.selected_package ? parseInt(data.selected_package) : null,
					amount: parseFloat(data.billing_amount),
					recharge_date: new Date(),
					valid_from: new Date(data.start_date || new Date()),
					valid_till: expiryDate,
					recharge_days: planDuration * billingCycle,
				});
			} catch (accountError) {
				console.error('Error creating account transaction:', accountError);
			}
		}

		return res.status(200).json({
			status: true,
			data: {
				id: customerRecord.id,
				customer_id: customerId,
				name: data.name,
				username: data.username,
				mobile: data.mobile,
				email: data.email,
				gender: data.gender,
				address: data.address,
				installation_address: data.installation_address,
				area: data.area,
				block: data.block,
				apartment: data.apartment,
				whatsapp_no: data.whatsapp_no,
				alternate_no: data.alternate_no,
				dob: data.dob,
				doa: data.doa,
				selected_package: data.selected_package,
				other_services: data.other_services,
				inventory_items: data.inventory_items,
				billing_amount: data.billing_amount,
				billing_cycle: billingCycle,
				other_charges: data.other_charges,
				previous_dues: data.previous_dues,
				start_date: data.start_date,
				end_date: data.end_date,
				received_amount: data.received_amount,
				received_date: data.received_date,
				discount: data.discount,
				collected_by: data.collected_by,
				payment_method: data.payment_method,
				expiry_date: expiryDate
			},
			message: "Customer Added Successfully!"
		});

	} catch (error) {
		console.error('Error creating customer:', error);

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
				message: 'Username or mobile number already exists!'
			});
		}

		return res.status(500).json({
			status: false,
			message: 'Internal Server Error',
			error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
		});
	}
};



const LoginUser = async (req, res) => {
	const {number, otp, otpid} = req.query;

	try {
		if (!number && !otp) {
			return res.status(400).json({error: true, message: "Invalid credentials"});
		}

		const isVerified = await isOptValid(otp, otpid);
		if (! isVerified) {
			return res.status(404).json({error: true, message: "Otp Invalid or expired"});
		}

			const User = await CustomerModel.findOne({
		where: {
			mobile: number
		}
	});

		if (!User) {
			return res.status(404).json({error: true, message: "No user found"});
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
			include: [
				{
					model: CustomerPlanHistory,
					attributes: ['plan_name', 'amount', 'recharge_date', 'valid_from', 'valid_till', 'recharge_days'],
					limit: 1,
					order: [['recharge_date', 'DESC']]
				},
				{
					model: AccountModel,
					attributes: ['date', 'amount', 'payment_mode', 'balance', 'trans_id', 'partner_emp_id', 'auto_renew', 'recharge_status', 'recharge_days', 'valid_till'],
					limit: 1,
					order: [['date', 'DESC']]
				}
			],
			order: [
				['id', 'ASC']
			]
		});

		if (customers.length === 0) 
			return res.status(404).json({error: true, message: "No user found"});

		// Transform the data to match your expected format
		const transformedCustomers = customers.map(customer => {
			const customerData = customer.toJSON();
			return {
				...customerData,
				customer_plan_history: customerData.customer_plan_histories && customerData.customer_plan_histories.length > 0 
					? customerData.customer_plan_histories[0] 
					: null,
				account: customerData.accounts && customerData.accounts.length > 0 
					? customerData.accounts[0] 
					: null,
				customer_plan_histories: undefined, // Remove the array
				accounts: undefined // Remove the array
			};
		});
		
		res.status(200).json({status: 200, data: transformedCustomers});
	} catch (error) {
		console.error('AllCustomer error:', error);
		res.status(500).json({error: true, message: error.message});
	}
};

const GetCustomer = async (req, res) => {
	try {
		const id = req.params.id;
			const isUser = await CustomerModel.findOne({
		where:{
			id:id
		}
	});
		if (!isUser){ 
			return res.status(404).json({error: true, message: "No user found"});
		}
		res.status(200).json({error: false, data: isUser});
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
			return res.status(400).json({error: true, message: "No data found with this id"});
		}
		
		res.status(200).json({error: false, message: "Deleted successfully"});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({error: true, message: "Internal server error"});
	}
};

const GetUpdateTheCustomer = async (req, res) => {
	
	try {
		const {user_id} = req.params;
		const data = req.body;

		// Handle multiple file uploads
		// Accept either a new uploaded file or a string (existing image URL/filename) for each field
		const fileFields = {
			image: null,
			frontAadharImage: null,
			backAadharImage: null,
			panImage: null,
			otherIdImage: null,
			signature: null
		};

		Object.keys(fileFields).forEach(fieldName => {
			// If a new file is uploaded, use its filename
			if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
				fileFields[fieldName] = req.files[fieldName][0].filename;
			}
			// If not, but a string is provided in the body (existing image url/filename), use it
			else if (typeof req.body[fieldName] === 'string' && req.body[fieldName].trim() !== '') {
				fileFields[fieldName] = req.body[fieldName].trim();
			}
			// Otherwise, leave as null (will not update)
		});

		// Validate required fields
		if (!data.name || data.name.trim() === '') {
			return res.status(400).json({status: false, message: 'Name is required'});
		}

		if (!data.username || data.username.trim() === '') {
			return res.status(400).json({status: false, message: 'Username is required'});
		}

		if (!data.mobile || !/^\d{10}$/.test(data.mobile)) {
			return res.status(400).json({status: false, message: 'Valid 10-digit mobile number is required'});
		}

		if (!data.address || data.address.trim() === '') {
			return res.status(400).json({status: false, message: 'Address is required'});
		}

		// Validate email format if provided
		if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
			return res.status(400).json({status: false, message: 'Valid email format is required'});
		}

		// Validate phone numbers if provided
		if (data.whatsapp_no && !/^\d{10}$/.test(data.whatsapp_no)) {
			return res.status(400).json({status: false, message: 'WhatsApp number must be 10 digits'});
		}

		if (data.alternate_no && !/^\d{10}$/.test(data.alternate_no)) {
			return res.status(400).json({status: false, message: 'Alternate number must be 10 digits'});
		}

		// Validate Aadhar number if provided
		if (data.aadhar_no && !/^\d{12}$/.test(data.aadhar_no)) {
			return res.status(400).json({status: false, message: 'Aadhar number must be 12 digits'});
		}

		// Validate PAN number if provided
		if (data.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan_no)) {
			return res.status(400).json({status: false, message: 'Invalid PAN format'});
		}

		// Check for existing users with same mobile (excluding current user)
		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isServiceProvider) {
			return res.status(400).json({status: false, message: 'Mobile number already exists as Service Provider!'});
		}

		const isSupervisor = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isSupervisor) {
			return res.status(400).json({status: false, message: 'Mobile number already exists as Supervisor!'});
		}

		// Check for duplicate username (excluding current user)
		const existingCustomer = await CustomerModel.findOne({
			where: {
				username: data.username,
				id: { [Op.ne]: user_id } // Exclude current user
			}
		});

		if (existingCustomer) {
			return res.status(400).json({status: false, message: 'Username already exists!'});
		}

		// Prepare data for CustomerModel (all customer details in one model)
		const customer_data = {
			name: data.name?.trim() || '',
			username: data.username?.trim() || '',
			email: data.email?.trim() || '',
			mobile: data.mobile?.trim() || '',
			address: data.address?.trim() || '',
			t_address: data.t_address?.trim() || '',
			whatsapp_no: data.whatsapp_no?.trim() || '',
			alternate_no: data.alternate_no?.trim() || '',
			aadhar_no: data.aadhar_no?.trim() || '',
			other_id: data.other_id?.trim() || '',
			pan_no: data.pan_no?.trim()?.toUpperCase() || '',
			dob: data.dob || null,
			doa: data.doa || null,
			bill_date: data.bill_date || null,
			billing_amount: data.billing_amount || null,
			gender: data.gender || null,
			block: data.block || null,
			area: data.area || null,
			apartment: data.apartment || null,
			payment_method: data.payment_method || null,
			online: data.online || null,
			cash: data.cash || null,
			// Package and inventory fields
			selectedPackage: data.selectedPackage || null,
			packageDetails: data.packageDetails?.trim() || '',
			selectedItems: data.selectedItems || null,
			...fileFields // Add file fields
		};

		// Remove empty string values and replace with null
		Object.keys(customer_data).forEach(key => {
			if (customer_data[key] === '') {
				customer_data[key] = null;
			}
		});

		console.log('Customer data to update:', customer_data);

		// Update customer record
		const updatedRows = await CustomerModel.update(customer_data, {
			where: {
				id: user_id
			}
		});

		console.log('Updated Rows:', updatedRows);

		if (!updatedRows || updatedRows[0] === 0) {
			return res.status(404).json({status: false, message: "Customer not updated!"});
		}

		return res.status(200).json({
			status: true, 
			message: "Customer updated successfully",
			data: {
				user_id,
				updatedFields: Object.keys(customer_data)
			}
		});

	} catch (error) {
		console.error('Update customer error:', error);
		return res.status(500).json({
			status: false, 
			message: "Internal Server Error: " + error.message
		});
	}
};

 const GetupdateBlockStatus = async (req, res) => {

	const {id} = req.params;
	const {is_block} = req.body;

	try {
			const record = await CustomerModel.findOne({
		where: {
			id: id
		}
	});

		if (! record) {
			return res.status(404).json({error: 'Record not found'});
		}

		await record.update({is_block: is_block});

		return res.status(200).json({message: 'Block status updated successfully'});
	} catch (error) {
		res.status(500).json({error});
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
			res.status(200).json({error: false, message: data})
		}
	} catch (error) {
		res.status(200).json({error: false, message: "Blocked Successfully"});
	}
}

const FilterCustomers = async (req, res) => {
	try {
		const { status, locality, block, area, apartment, name, custId, endDate, startDate, alphabet } = req.body;

		console.log({ status, locality, block, area, apartment, name, custId, endDate, startDate })
		
		// Build dynamic where clause
		let whereClause = {};
		
		// Status filter
		if (status && status !== 'all') {
			whereClause.status = status;
		}
		
		// Locality filter (searching in area, block, apartment, address fields)
		if (locality && locality !== 'all' && locality !== '' && locality.value !== '') {
			whereClause[Op.or] = [
				{ area: { [Op.like]: `%${locality}%` } },
				{ block: { [Op.like]: `%${locality}%` } },
				{ apartment: { [Op.like]: `%${locality}%` } },
				{ address: { [Op.like]: `%${locality}%` } },
				{ t_address: { [Op.like]: `%${locality}%` } }
			];
		}
		
		// Company filter (if you have a company field)
		if (block && block !== 'all' && block !== '' && block.value !== '') {
			whereClause.block = { [Op.like]: `%${block}%` };
		}
		
		// Broadband filter (assuming this is package related)
		if (apartment && apartment !== 'all' && apartment !== '' && apartment.value !== '') {
			whereClause.apartment = apartment;
		}
		if (area && area !== 'all' && area !== '' && area.value !== '') {
			whereClause.area = area;
		}

		if (name && name !== 'all' && name !== '' && name.value !== '') {
			whereClause.name = { [Op.like]: `%${name}%` };
		}
		
		if (custId && custId !== 'all' && custId !== '' && custId.value !== '') {
			whereClause[Op.or] = [
				{ customer_id: { [Op.like]: `%${custId}%` } },
				{ id: custId }
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
			whereClause.name = { [Op.like]: `${alphabet}%` };
		}

		console.log("=---",JSON.stringify(whereClause))
		
		const customers = await CustomerModel.findAll({
			where: whereClause,
			order: [['id', 'DESC']]
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
                whereClause.name = { [Op.like]: `${searchTerm}%` };
            } else {
                // Global search across multiple fields
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${searchTerm}%` } },
                    { mobile: { [Op.like]: `%${searchTerm}%` } },
                    { email: { [Op.like]: `%${searchTerm}%` } },
                    { address: { [Op.like]: `%${searchTerm}%` } },
                    { area: { [Op.like]: `%${searchTerm}%` } },
                    { block: { [Op.like]: `%${searchTerm}%` } },
                    { apartment: { [Op.like]: `%${searchTerm}%` } },
					{ username: { [Op.like]: `%${searchTerm}%` } },
					{ customer_id: { [Op.like]: `%${searchTerm}%` } }
                ];
            }
        } 
        
        const customers = await CustomerModel.findAll({
            where: whereClause,
            order: [['id', 'DESC']]
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
		payment_mode,
		trans_id,
		plan_id,
		selectedPackage
	} = req.body;

	try {
		// Validate required fields
		if (!customer_id || !amount || !payment_mode || !plan_id) {
			return res.status(400).json({
				status: false,
				message: "Missing required fields: customer_id, amount, or payment_mode"
			});
		}

		const isCustomer = await CustomerModel.findOne({
			where: {
				customer_id: customer_id
			}
		});

		if (!isCustomer) {
			return res.status(400).json({
				status: false,
				message: "Customer not found"
			});
		}
		

		const selectedPlan = await PlanModel.findOne({
			where: {
				id: plan_id
			}
		});

		// Calculate dates
		const billDate = new Date();
		const expiryDate = new Date(billDate.setDate(billDate.getDate() + parseInt(selectedPlan.days || 0)));

		// Create account entry
		const account = await AccountModel.create({
			cust_id: customer_id,
			amount,
			payment_mode,
			trans_id,
			recharge_status: 'active',
			recharge_days: selectedPlan.days,
			valid_till: expiryDate,
			cust_name: isCustomer.name,
			date: new Date(),
			address: isCustomer.address,
			vc_no: isCustomer.vc_no,
			balance: 0,
			partner_emp_id: isCustomer.partner_emp_id,
			auto_renew: isCustomer.auto_renew,
			recharge_days: selectedPlan.days
		});

		// Optional: Add to plan history
		if (plan_id && selectedPlan.days) {
			const selectedPlan = await PlanModel.findByPk(plan_id);

			await CustomerPlanHistory.create({
				customer_id,
				plan_id,
				plan_name: selectedPlan?.plan || null,
				amount,
				recharge_date: new Date(),
				valid_from: new Date(),
				valid_till: expiryDate,
				recharge_days: selectedPlan.days,
				remarks: 'Recharge via API'
			});
		}

		// Update customer details
		await CustomerModel.update(
			{
				bill_date: new Date(),         // Last recharge date
				billing_amount: amount,                // Current recharge amount
				valid_till: expiryDate,        // Expiry after recharge
				plan_id: plan_id || null,       // Optional: Update plan
				selected_package: selectedPackage || null
			},
			{ where: { customer_id: customer_id } }
		);

		return res.status(200).json({
			status: true,
			message: "Recharge recorded and customer updated",
			data: account
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
			order: [['recharge_date', 'DESC']]
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
	const { customers } = req.body;
  
	if (!Array.isArray(customers) || customers.length === 0) {
	  return res.status(400).json({ message: 'No customer data found' });
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
	importBulkCustomers
};
