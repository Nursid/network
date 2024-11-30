const db = require("../model/index")
const Ticket = db.TicketModel;
const CustomerModel = db.NewCustomerModel;

const createTicket = async (req, res) => {
    try {
        const data = req.body;

        const isCustomer = await CustomerModel.findOne({
            where: {
                mobileno: data.mobileNo,
            }
        })
        // Validate required fields
        if (!isCustomer) {
            return res.status(202).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Create new ticket
        const newTicket = await Ticket.create(data);

        return res.status(200).json({
            success: true,
            message: "Ticket created successfully",
            data: newTicket
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllTicket = async (req, res) => {
    try {
    
        const ticket = await Ticket.findAll();

        if (!ticket) {
            return res.status(204).json({
                success: false,
                message: "Ticket not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Ticket retrieved successfully",
            data: ticket
        });
    }
        catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message    
            });
            }
        }

module.exports = {
    createTicket,
    getAllTicket
};