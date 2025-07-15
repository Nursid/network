const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const customerRouter = require("../../Controllers/AuthControllers/CustomerControllers");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Customer signup route
router.post('/signup', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'frontAadharImage', maxCount: 1 },
  { name: 'backAadharImage', maxCount: 1 },
  { name: 'panImage', maxCount: 1 },
  { name: 'otherIdImage', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), customerRouter.SignupUser);

// Other routes
router.get("/login", customerRouter.LoginUser);
router.delete("/deleteall", customerRouter.DeleteUsers);
router.get('/delete/:id', customerRouter.GetDeleteCustomerById);
router.get("/getall", customerRouter.AllCustomer);
router.get("/getbyid/:id", customerRouter.GetCustomer);
router.post("/get", customerRouter.AllCustomer);
router.post("/filter", customerRouter.FilterCustomers);
router.post("/dynamicfilter", customerRouter.GetCustomerFilter);
router.get("/getallcustomerfilterbyflow", customerRouter.AllCustomerFilterByFlow);

router.put('/getupdate/:user_id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'frontAadharImage', maxCount: 1 },
  { name: 'backAadharImage', maxCount: 1 },
  { name: 'panImage', maxCount: 1 },
  { name: 'otherIdImage', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), customerRouter.GetUpdateTheCustomer);
router.post('/block/:id', customerRouter.GetupdateBlockStatus);


module.exports = router;
