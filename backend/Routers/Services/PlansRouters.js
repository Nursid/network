const router = require("express").Router()

const PlanController = require("../../Controllers/Services/PlanController")
// add the service 
router.post('/add',  PlanController.AddPlans);
// get all the service 
router.get("/getall", PlanController.GetAllServices);


module.exports = router 
