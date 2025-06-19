const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../../model/index");
const CustomerModel = db.CustomerModel;
const NewCustomerModel = db.NewCustomerModel
const ServiceProviderModel = db.ServiceProviderModel
const EmployeeModel = db.EmployeeModel
require("dotenv").config;
const {isEmail, isMobileNumber, isOptValid} = require("../utils");

const SignupUser = async (req, res) => {
	const data = req.body;

	if(req.files){
		const files = req.files;
		data.image = files.image ? files.image[0].path : '';
		data.frontAadharImage = files.frontAadharImage ? files.frontAadharImage[0].path : '';
		data.backAadharImage = files.backAadharImage ? files.backAadharImage[0].path : '';
		data.panImage = files.panImage ? files.panImage[0].path : '';
		data.otherIdImage = files.otherIdImage ? files.otherIdImage[0].path : '';
		data.signature = files.signature ? files.signature[0].path : '';
	}

	const newCustomer_data = {
		"name": data.name,
		"email": data.email,
		"password": data.name,
		"mobileno": data.mobile,
		"username": data.username
	}
	const {
		email,
		name,
		...customer_data
	} = data;

	try {

		const isServiceProvider = await ServiceProviderModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status: false, message: 'User Already Exists!'});
		}

		const isSupervisor = await EmployeeModel.findOne({
			where: {
				mobile_no: data.mobile
			}
		});

		if (isSupervisor) {
			return res.status(200).json({status: false, message: 'User Already Exists!'});
		}

		const isCustomer = await NewCustomerModel.findOne({
			where: {
				mobileno: data.mobile
			}
		});

		if (isCustomer) {
			return res.status(200).json({status: false, message: 'User Already Exists!'});
		}

		const newCustomer = await NewCustomerModel.create(newCustomer_data);

		if (!newCustomer) {
			return res.status(200).json({status: false, message: 'Your Customer Not Added!'});
		}

		const user_id = newCustomer.id;

		customer_data.user_id = user_id;

		const formdata = await CustomerModel.create(customer_data);

		return res.status(200).json({status: true, data: formdata, message: "Customer Added Successfully!"});

	} catch (error) {
		console.log(error);
		return res.status(500).json({status: false, error: 'Internal Server Error', error});
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

		const User = await NewCustomerModel.findOne({
			where: {
				mobileno: number
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
					model: NewCustomerModel,
				}
			],
			order: [
				['id', 'DESC']
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
			include: [
				{
					model: NewCustomerModel,
				}
			],
			where:{
				user_id:id
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
				user_id: user_id
			}
		});
		const isdeleted = await NewCustomerModel.destroy({
			where: {
				id: user_id
			}
		});

		if (rowsDeleted === 0 && isdeleted === 0) {
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
		const fileFields = {
			image: null,
			frontAadharImage: null,
			backAadharImage: null,
			panImage: null,
			otherIdImage: null,
			signature: null
		};

		// Process uploaded files
		if (req.files) {
			Object.keys(fileFields).forEach(fieldName => {
				if (req.files[fieldName] && req.files[fieldName][0]) {
					fileFields[fieldName] = req.files[fieldName][0].filename;
				}
			});
		}

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
		const existingCustomer = await NewCustomerModel.findOne({
			where: {
				username: data.username,
				id: { [Op.ne]: user_id } // Exclude current user
			}
		});

		if (existingCustomer) {
			return res.status(400).json({status: false, message: 'Username already exists!'});
		}

		// Prepare data for NewCustomerModel (main user table)
		const newCustomer_data = {
			name: data.name?.trim() || '',
			username: data.username?.trim() || '',
			email: data.email?.trim() || '',
			mobileno: data.mobile?.trim() || ''
		};

		// Prepare data for CustomerModel (extended customer details)
		const customer_data = {
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
			gender: data.gender || null,
			block: data.block || null,
			area: data.area || null,
			apartment: data.apartment || null,
			payment_method: data.payment_method || null,
			online: data.online || null,
			cash: data.cash || null,
			...fileFields // Add file fields
		};

		// Remove empty string values and replace with null
		Object.keys(customer_data).forEach(key => {
			if (customer_data[key] === '') {
				customer_data[key] = null;
			}
		});

		console.log('NewCustomer data to update:', newCustomer_data);
		console.log('Customer data to update:', customer_data);

		// Update main customer record
		const updatedCustomerRows = await NewCustomerModel.update(newCustomer_data, {
			where: {
				id: user_id
			}
		});

		console.log('Updated Customer Rows:--------', updatedCustomerRows);

		if (!updatedCustomerRows) {
			return res.status(404).json({status: false, message: "Customer not updated!"});
		}

		// Update extended customer details
		const updatedRows= await CustomerModel.update(customer_data, {
			where: {
				user_id: user_id
			}
		});

		console.log('Updated Rows:', updatedRows);

		if (!updatedRows) {
			return res.status(404).json({status: false, message: "Customer not updated!"});
		}

		return res.status(200).json({
			status: true, 
			message: "Customer updated successfully",
			data: {
				user_id,
				updatedFields: Object.keys({...newCustomer_data, ...customer_data})
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
				user_id: user_id
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
				user_id: user_id
			}
		});
		if (data) {
			res.status(200).json({error: false, message: data})
		}
	} catch (error) {
		res.status(200).json({error: false, message: "Blocked Successfully"});
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
	UpdateStatus
};
