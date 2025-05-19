const { response } = require('express');

const router = require('express').Router()

const FlowController=require("../Controllers/FlowController")

router.post('/add',FlowController.AddFlow)
router.get('/getall',FlowController.GetAllFlow)
router.put('/update/:id',FlowController.UpdateFlow)


module.exports = router