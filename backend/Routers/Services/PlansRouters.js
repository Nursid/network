const router = require("express").Router()

const PlanController = require("../../Controllers/Services/PlanController")
// add the service 
router.post('/add',  PlanController.AddPlans);

router.post('/update/:id',  PlanController.UpdatePlan);

// get all the service 
router.get("/getall", PlanController.GetAllServices);

router.delete("/delete/:id", PlanController.DeletePlan);



module.exports = router 
