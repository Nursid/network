const express = require('express');
const router = express.Router();

const ComplainController=require("../Controllers/ComplainController")

router.post('/add',ComplainController.addComplaintWithTask)
router.get('/logs/:customerId', ComplainController.getRecentComplaintsAndTasks)


module.exports = router