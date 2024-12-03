const express = require('express');
const router = express.Router();
const TicketHeadController = require('../../Controllers/Services/TicketHeadController');
const AuthenticateToken = require('../../Middleware/AuthenticateToken');

// Create ticket head - Protected route
router.post('/create', TicketHeadController.create);

// Get all ticket heads - Protected route
router.get('/getall', TicketHeadController.findAll);

// Get single ticket head by id - Protected route
router.get('/:id', TicketHeadController.findOne);

// Update ticket head - Protected route
router.post('/update/:id', TicketHeadController.update);

// Delete ticket head - Protected route
router.delete('/delete/:id', TicketHeadController.delete);

module.exports = router;