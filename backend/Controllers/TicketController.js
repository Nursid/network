const db = require("../model/index")
const Ticket = db.TicketModel;
const CustomerModel = db.CustomerModel;
const ServiceProviderModel = db.ServiceProviderModel


const createTicket = async (req, res) => {
	try {
		const data = req.body;

		const isCustomer = await CustomerModel.findOne({
			where: {
				mobile: data.mobileNo
			}
		})
		// Validate required fields
		if (! isCustomer) {
			return res.status(202).json({success: false, message: "Customer not found"});
		}

		// Create new ticket
		const newTicket = await Ticket.create(data);

		return res.status(200).json({success: true, message: "Ticket created successfully", data: newTicket});

	} catch (error) {
		return res.status(500).json({success: false, message: "Internal server error", error: error.message});
	}
};

const getAllTicket = async (req, res) => {
	try {

		const ticket = await Ticket.findAll({
			include: [
				{
					model: CustomerModel,
				},
				{
					model: ServiceProviderModel,
					attributes: [
						'name', 'mobile_no'
					]
				},


			]
		});

		if (! ticket) {
			return res.status(204).json({success: false, message: "Ticket not found"});
		}
		return res.status(200).json({success: true, message: "Ticket retrieved successfully", data: ticket});
	} catch (error) {
		return res.status(500).json({success: false, message: "Internal server error", error: error.message});
	}
}


const AssignTickets = async (req, res) => {
	const {ticketId} = req.params;
	const data = req.body;
	try {


		const ticket = await Ticket.findOne({
			where: {
				id: ticketId
			}
		});

		if (! ticket) {
			return res.status(204).json({success: false, message: "Ticket not found"});
		}

		await ticket.update(data, {
			where: {
				id: ticketId
			}
		});
		return res.status(200).json({success: true, message: "Ticket Assign successfully", data: ticket});
	} catch (error) {
		return res.status(500).json({success: false, message: "Internal server error", error: error.message});
	}
}

module.exports = {
	createTicket,
	getAllTicket,
    AssignTickets
};
