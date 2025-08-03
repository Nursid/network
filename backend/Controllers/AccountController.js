const db = require("../model/index")
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;
const AccountModel = db.AccountModel
const EmployeeModel = db.EmployeeModel
const moment = require('moment')

const ListingAccount = async (req, res) => {
	try {
  
	  // Query the database with the date condition
	  const data = await AccountModel.findAll({
		include: [
			{
				model: db.CustomerModel,
				attributes: ['name', 'customer_id'],
				as: 'customer',
				required: false, // Use LEFT JOIN to include transactions even if customer is null
			},
			{
				model: db.EmployeeModel,
				attributes: ['name', 'id'],
				as: 'collectedByEmployee',
				required: false
			}
		],
		order: [['date', 'DESC']]
	  });
  
	  if (data.length === 0) {
		return res.status(200).json({ status: true, data: [] });
	  }
  
	  res.status(200).json({ status: true, data: data });
  
	} catch (error) {
	  console.error(error);
	  res.status(400).json({ message: "Invalid request" });
	}
};

const AddBalance = async (req, res) => {
	try {
		const data = req.body;
		data.date = moment(new Date()).format('YYYY-MM-DD');

		// Check if the trans_id exists (using transaction ID as unique identifier)
		const existingAccount = await AccountModel.findOne({
			where: { 
				trans_id: data?.trans_id,
				cust_id: data?.cust_id
			}
		});

		if (existingAccount) {
			// If exists, update the existing record
			await AccountModel.update(data, {
				where: {
					trans_id: data?.trans_id,
					cust_id: data?.cust_id
				}
			});
			return res.status(200).json({ status: true, message: "Payment record updated successfully!" });
		} else {
			// If not exists, create a new record
			const newAccount = await AccountModel.create(data);
			return res.status(200).json({ status: true, message: "Payment record added successfully!" });
		}
	} catch (error) {
		console.error('Error:', error); // Log the error for debugging
		res.status(400).json({ message: "Invalid URL or data" });
	}
}

const EditBalance = async (req, res) => {
	try {
		const account_id = req.params.id;
		const data = req.body;

		const IsAccount = await AccountModel.findOne({
			where: {
				id: account_id
			}
		});
		
		if (!IsAccount) {
			return res.status(204).json({error: true, message: "Payment record not found"});
		}
		
		await AccountModel.update(data, {
			where: {
				id: account_id
			}
		});
		
		res.status(200).json({status: true, message: "Payment record updated successfully!"});
	} catch (error) {
		res.status(400).json({message: "Invalid url"});
	}
}

const FilterAmount = async (req, res) => {
	try {
        const { date, payment_mode, recharge_status, cust_id } = req.body;
        
        let startDate = "", endDate = "";
        let whereCondition = {};

        // Date filtering
        if (date) {
            switch (parseInt(date)) {
                case 1: // Today
                    startDate = moment().startOf('day').toDate();
                    endDate = moment().endOf('day').toDate();
                    break;
                case 3: // Last month
                    startDate = moment().subtract(1, 'month').startOf('month').toDate();
                    endDate = moment().subtract(1, 'month').endOf('month').toDate();
                    break;
                case 6: // Last 6 months
                    startDate = moment().subtract(6, 'months').startOf('month').toDate();
                    endDate = moment().endOf('day').toDate();
                    break;
                default:
                    return res.status(400).json({ error: 'Invalid date parameter' });
            }

            whereCondition.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Additional filters
        if (payment_mode) {
            whereCondition.payment_mode = payment_mode;
        }

        if (recharge_status) {
            whereCondition.recharge_status = recharge_status;
        }

        if (cust_id) {
            whereCondition.cust_id = {
                [Op.like]: `%${cust_id}%`
            };
        }

		const data = await AccountModel.findAll({
			where: whereCondition,
			include: [
				{
					model: db.CustomerModel,
					attributes: ['name', 'customer_id'],
					as: 'customer',
					required: false,
				},
				{
					model: db.EmployeeModel,
					attributes: ['name', 'id'],
					as: 'collectedByEmployee',
					required: false
				}
			],
			order: [['date', 'DESC']]
		});
		
		if (data.length === 0) {
			return res.status(200).json({status: false, message: "No data found"});
		}
		
		res.status(200).json({status: true, data: data});
	} catch (error) {
		res.status(400).json({
			message: "Internal Server Error: " + error
		});
	}
}

const FilterTransactions = async (req, res) => {
	try {
		const { collectedBy, paymentType, paymentMethod, dateFrom, dateTo } = req.body;
		
		let whereCondition = {};

		// Collected By filter (employee ID or name)
		if (collectedBy) {
			// Filter by employee ID in account's collected_by field
			whereCondition.collected_by = parseInt(collectedBy);
		}

		// Payment Type filter (payment_mode)
		if (paymentType && paymentType.trim() !== '') {
			whereCondition.payment_mode = paymentType;
		}

		// Payment Method filter (payment_mode) - same as payment type
		if (paymentMethod && paymentMethod.trim() !== '') {
			whereCondition.payment_mode = paymentMethod;
		}

		// Date range filter
		if (dateFrom || dateTo) {
			let dateCondition = {};
			
			if (dateFrom) {
				dateCondition[Op.gte] = moment(dateFrom).startOf('day').toDate();
			}
			
			if (dateTo) {
				dateCondition[Op.lte] = moment(dateTo).endOf('day').toDate();
			}
			
			whereCondition.date = dateCondition;
		}

		const includeOptions = [
			{
				model: db.CustomerModel,
				attributes: ['name', 'customer_id'],
				as: 'customer',
				required: false, // Use LEFT JOIN to include transactions even if customer is null
			},
			{
				model: db.EmployeeModel,
				attributes: ['name', 'id'],
				as: 'collectedByEmployee',
				required: false
			}
		];

		// If filtering by employee name, add where condition to the employee include
		if (collectedBy) {
			includeOptions[1].where = {
				id: collectedBy
			};
		}

		const data = await AccountModel.findAll({
			where: whereCondition,
			include: includeOptions,
			order: [['date', 'DESC']]
		});
		
		if (data.length === 0) {
			return res.status(200).json({ status: true, data: [], message: "No transactions found with the specified filters" });
		}
		
		res.status(200).json({ status: true, data: data });
	} catch (error) {
		console.error('Filter error:', error);
		res.status(400).json({
			status: false,
			message: "Internal Server Error: " + error.message
		});
	}
};

const GetAccountById = async (req, res) => {
	try {
		const account_id = req.params.id;
		
		const account = await AccountModel.findOne({
			where: {
				id: account_id
			},
			include: [
				{
					model: db.CustomerModel,
					attributes: ['name', 'customer_id'],
					as: 'customer',
					required: false,
				},
				{
					model: db.EmployeeModel,
					attributes: ['name', 'id'],
					as: 'collectedByEmployee',
					required: false
				}
			]
		});
		
		if (!account) {
			return res.status(404).json({error: true, message: "Payment record not found"});
		}
		
		res.status(200).json({status: true, data: account});
	} catch (error) {
		res.status(400).json({message: "Invalid request"});
	}
}

const DeleteAccount = async (req, res) => {
	try {
		const account_id = req.params.id;
		
		const account = await AccountModel.findOne({
			where: {
				id: account_id
			}
		});
		
		if (!account) {
			return res.status(404).json({error: true, message: "Payment record not found"});
		}
		
		await AccountModel.destroy({
			where: {
				id: account_id
			}
		});
		
		res.status(200).json({status: true, message: "Payment record deleted successfully!"});
	} catch (error) {
		res.status(400).json({message: "Invalid request"});
	}
}

module.exports = {
	ListingAccount,
	AddBalance,
	EditBalance,
    FilterAmount,
	FilterTransactions,
	GetAccountById,
	DeleteAccount
}
