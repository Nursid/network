const db = require("../model/index")
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;
const AccountModel = db.Account
const moment = require('moment')

const ListingAccount = async (req, res) => {
	const { from, to } = req.query;
  
	try {
	  let dateCondition = {};
  
	  // Check if both from and to exist
	  if (from && to) {
		// Convert and validate provided dates
		const startDate = new Date(from);
		const endDate = new Date(to);
		
		if (isNaN(startDate) || isNaN(endDate)) {
		  return res.status(400).json({ message: "Invalid date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.between]: [startDate, endDate]
		  }
		};
	  } else if (from) {
		// If only 'from' exists, filter by date greater than or equal to 'from'
		const startDate = new Date(from);
		if (isNaN(startDate)) {
		  return res.status(400).json({ message: "Invalid 'from' date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.gte]: startDate
		  }
		};
	  } else if (to) {
		// If only 'to' exists, filter by date less than or equal to 'to'
		const endDate = new Date(to);
		if (isNaN(endDate)) {
		  return res.status(400).json({ message: "Invalid 'to' date format" });
		}
  
		dateCondition = {
		  date: {
			[Op.lte]: endDate
		  }
		};
	  }
  
	  // Query the database with the date condition
	  const data = await AccountModel.findAll({
		where: dateCondition,
		order: [['date', 'DESC']]
	  });
  
	  if (data.length === 0) {
		return res.status(204).json({ error: true, message: "No data found" });
	  }
  
	  res.status(200).json({ status: true, data });
  
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

const GetAccountById = async (req, res) => {
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
	GetAccountById,
	DeleteAccount
}
