const jwt = require("jsonwebtoken");
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
		"mobileno": data.mobile
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

		if (! User) {
			return res.status(404).json({error: true, message: "NO user found"});
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

		if(req.file){
			const image = req.file;
			data.image = (image && image.originalname) ? image.originalname : null;
		}	

		const newCustomer_data = {
			"name": data?.name || '',
			"email": data?.email || '',
			"mobileno": data?.mobile || ''
		}

		const {
			email,
			name,
			mobileno,
			...customer_data
		} = data;

		let member_id;
		if (data.member_id === "true") {

			const lastEmp = await CustomerModel.findOne({
				order: [
					['member_id', 'DESC']
				]
			});

			
			if (lastEmp) {
				const lastEmpId = parseInt(lastEmp.member_id.replace("HM", ""));
				member_id = "HM" + (
					lastEmpId + 1
				);
			
			} else {
				member_id = "HM20001";
			} 
			customer_data.member_id = member_id;
		}

		const isServiceProvider = await ServiceProviderModel.findOne({
			where:{
				mobile_no: data.mobile
			}
		});

		if (isServiceProvider) {
			return res.status(200).json({status:false, message: 'User Already Exists as Service Provider!'});
		}

		const isSupervisor = await EmployeeModel.findOne({
			where:{
				mobile_no: data.mobile
			}
		})

		if (isSupervisor) {
			return res.status(200).json({status:false, message: 'User Already Exists as Supervisor!'});
		}

		const updatedCustomerRows = await NewCustomerModel.update(newCustomer_data, {
			where: {
				id: user_id
			}
		});

		if (!updatedCustomerRows) {
			return res.status(200).json({status: false, message: "User Not Found!"});
		}

		const updatedRows = await CustomerModel.update(customer_data, {
			where: {
				user_id: user_id
			}
		});
		
		if (!updatedRows) {
			return res.status(200).json({status: false, message: "Update failed! Try again"});
		}

		return res.status(200).json({status: true, message: "Updated successfully"});

	} catch (error) {
		return res.status(500).json({status: false, message: "Internal Server Error: " + error.message});
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
