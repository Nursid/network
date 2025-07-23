const express = require('express');
const router = express.Router();

const ComplainController=require("../Controllers/ComplainController")

router.post('/add',ComplainController.AddComplain)


module.exports = router