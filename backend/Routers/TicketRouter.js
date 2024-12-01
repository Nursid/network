const express = require('express');
const router = express.Router();
const  TicketController = require('../Controllers/TicketController');
const AuthenticateToken = require('../Middleware/AuthenticateToken');

// Create ticket route - Protected route
router.post('/ticket/create', TicketController.createTicket);
router.get('/ticket/getall', TicketController.getAllTicket);
router.post('/ticket/update/:ticketId', TicketController.AssignTickets);

module.exports = router;