const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../../model/index");
const CustomerModel = db.CustomerModel;
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
const AccountModel = db.AccountModel
const generateCustomerID = require("../misc/customeridgenerator");
const generateVoucherNo = require("../misc/voucherGenerator");
require("dotenv").config;
const {isEmail, isMobileNumber, isOptValid} = require("../utils");

const SignupUser = async (req, res) => {
	const data = req.body;
	console.log('Received customer data:', data);

	// Handle file uploads
	if(req.files){
		const files = req.files;
		data.image = files.image ? files.image[0].path : '';
		data.frontAadharImage = files.frontAadharImage ? files.frontAadharImage[0].path : '';
		data.backAadharImage = files.backAadharImage ? files.backAadharImage[0].path : '';
		data.panImage = files.panImage ? files.panImage[0].path : '';
		data.otherIdImage = files.otherIdImage ? files.otherIdImage[0].path : '';
		data.signature = files.signature ? files.signature[0].path : '';
	}

	// Validate required fields
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


	// Generate customer ID first
	const customerId = await generateCustomerID();

	// Prepare data for CustomerModel (detailed customer info)
	const customer_data = {
		// Basic Information
		name: data.name,
		username: data.username,
		email: data.email || null,
		gender: data.gender || null,
		customer_id: customerId, // Add generated customer ID
		
		// Address Information
		address: data.address,
		t_address: data.t_address || null,
		area: data.area || null,
		block: data.block || null,
		apartment: data.apartment || null,
		
		// Contact Information
		mobile: data.mobile,
		whatsapp_no: data.whatsapp_no || null,
		alternate_no: data.alternate_no || null,
		
		// Personal Information
		dob: data.dob || null,
		doa: data.doa || null,
		
		// KYC Information
		aadhar_no: data.aadhar_no || null,
		other_id: data.other_id || null,
		pan_no: data.pan_no ? data.pan_no.toUpperCase() : null,
		
		// Package Information
		selectedPackage: data.selectedPackage ? parseInt(data.selectedPackage) : null,
		packageDetails: data.packageDetails || null,
		
		// Inventory Items (will be stored as JSON string)
		selectedItems: data.selectedItems || null,
		
		// Billing Information
		bill_date: data.bill_date || null,
		billing_amount: data.billing_amount ? parseFloat(data.billing_amount) : null,
		payment_method: data.payment_method || null,
		balance: data.billing_amount ? parseFloat(data.billing_amount) : 0,
		
		// Legacy billing fields (for backward compatibility)
		cash: data.cash ? parseFloat(data.cash) : null,
		online: data.online ? parseFloat(data.online) : null,
		
		// Image/Document Fields
		image: data.image || null,
		frontAadharImage: data.frontAadharImage || null,
		backAadharImage: data.backAadharImage || null,
		panImage: data.panImage || null,
		otherIdImage: data.otherIdImage || null,
		signature: data.signature || null,
		
		// Status fields
		status: 'active',
		customerType: 'individual',
		registrationDate: new Date()
	};

	try {
		// Check if user already exists as Service Provider
		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({
				status: false, 
				message: 'Mobile number already registered as Service Provider!'
			});
		}

		// Check if user already exists as Employee/Supervisor
		const isSupervisor = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isSupervisor) {
			return res.status(200).json({
				status: false, 
				message: 'Mobile number already registered as Employee!'
			});
		}

		// Check if customer already exists
		const isCustomer = await CustomerModel.findOne({
			where: {
				mobile: data.mobile
			}
		});

		if (isCustomer) {
			return res.status(200).json({
				status: false, 
				message: 'Mobile number already registered as Customer!'
			});
		}

		// Create detailed customer record
		const customerRecord = await CustomerModel.create(customer_data);

		if (!customerRecord) {
			return res.status(200).json({
				status: false, 
				message: 'Failed to create customer details!'
			});
		}

		// Create account transaction if billing amount is provided
		if (data.billing_amount && parseFloat(data.billing_amount) > 0) {
			try {
				const voucherNo = await generateVoucherNo();
				const currentDate = new Date();
				
				// Create account transaction
				const accountData = {
					date: currentDate,
					cust_id: customerId,
					cust_name: data.name,
					vc_no: voucherNo,
					address: data.address,
					amount: parseFloat(data.billing_amount),
					payment_mode: data.payment_method,
					balance: parseFloat(data.billing_amount),
					trans_id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
					partner_emp_id: null,
					auto_renew: false,
					recharge_status: 'completed'
				};

				const accountRecord = await AccountModel.create(accountData);
				
				if (!accountRecord) {
					console.error('Failed to create account transaction');
				}
			} catch (accountError) {
				console.error('Error creating account transaction:', accountError);
				// Continue with customer creation even if account transaction fails
			}
		}

		// Return success response with customer details
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
				t_address: data.t_address,
				area: data.area,
				block: data.block,
				apartment: data.apartment,
				whatsapp_no: data.whatsapp_no,
				alternate_no: data.alternate_no,
				dob: data.dob,
				doa: data.doa,
				aadhar_no: data.aadhar_no,
				other_id: data.other_id,
				pan_no: data.pan_no,
				selectedPackage: data.selectedPackage,
				packageDetails: data.packageDetails,
			}, 
			message: "Customer Added Successfully!"
		});

	} catch (error) {
		console.error('Error creating customer:', error);
		
		// Handle specific database errors
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
			order: [
				['id', 'ASC']
			]
		});

		if (customers.length === 0) 
			return res.status(404).json({error: true, message: "No user found"});
		
		res.status(200).json({status: 200, data: customers});
	} catch (error) {
		res.status(500).json(error);
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
};
