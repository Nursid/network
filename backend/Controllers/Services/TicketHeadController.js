const db = require("../../model/index");
const TicketHead = db.TicketHead;

// Create a new ticket head
exports.create = async (req, res) => {
    try {
        const data = req.body;

        const isTicketHead = await TicketHead.findOne({
            where:{
                name: data.name
            }
        })
        // Validate required fields
        if (isTicketHead) {
            return res.status(202).json({
                success: false,
                message: "Name Already Exist!"
            });
        }

        // Create ticket head
        const ticketHead = await TicketHead.create(data);

        res.status(200).json({
            success: true,
            message: "Ticket head created successfully",
            data: ticketHead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating ticket head",
            error: error.message
        });
    }
};

// Get all ticket heads
exports.findAll = async (req, res) => {
    try {
        const ticketHeads = await TicketHead.findAll();
        res.status(200).json({
            success: true,
            data: ticketHeads
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving ticket heads",
            error: error.message
        });
    }
};

// Get single ticket head by id
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketHead = await TicketHead.findByPk(id);
        
        if (!ticketHead) {
            return res.status(404).json({
                success: false,
                message: "Ticket head not found"
            });
        }

        res.status(200).json({
            success: true,
            data: ticketHead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving ticket head",
            error: error.message
        });
    }
};

// Update ticket head by id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const ticketHead = await TicketHead.findOne({
            where: {
                id: id
            }
        });
        
        if (!ticketHead) {
            return res.status(204).json({
                success: false,
                message: "Ticket head not found"
            });
        }

        // Update ticket head
        await ticketHead.update(data,{
            where:{
                id:id
            }
        });

        res.status(200).json({
            success: true,
            message: "Ticket head updated successfully",
            data: ticketHead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating ticket head",
            error: error.message
        });
    }
};

// Delete ticket head by id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketHead = await TicketHead.findByPk(id);
        
        if (!ticketHead) {
            return res.status(404).json({
                success: false,
                message: "Ticket head not found"
            });
        }

        await ticketHead.destroy();

        res.status(200).json({
            success: true,
            message: "Ticket head deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting ticket head",
            error: error.message
        });
    }
};