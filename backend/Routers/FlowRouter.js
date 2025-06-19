const { response } = require('express');

const router = require('express').Router()

const FlowController=require("../Controllers/FlowController")

router.post('/add',FlowController.AddFlow)
router.get('/get/:id',FlowController.GetFlow)
router.get('/getall',FlowController.GetAllFlow)
router.put('/update/:id',FlowController.UpdateFlow)
router.get('/search',FlowController.SearchFlow)
router.post('/upload-image', FlowController.upload.single('image'), FlowController.UploadImage)

module.exports = router