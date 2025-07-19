const router = require('express').Router()
/*  Account API */
const AccountController = require('../Controllers/AccountController');
const LocationModel = require("../Controllers/misc/LocationController")

const ticketRouter = require('./TicketRouter')
const ticketHeadRouter = require('./Services/TicketHeadRouter')
const flowRouter = require('./FlowRouter')
const complainRouter = require('./ComplainRouter')

router.get('/account-listing',AccountController.ListingAccount);
router.post('/add-balance',AccountController.AddBalance);
router.post("/edit-balance/:id",AccountController.EditBalance);
router.post("/filter-amount",AccountController.FilterAmount);
router.get("/account-detail/:id",AccountController.GetAccountById);
router.delete("/delete-account/:id",AccountController.DeleteAccount);



//  Location API
router.get("/location-listing",LocationModel.ListingLocation )

/* Ticket API */
router.use('/', ticketRouter);

/* Ticket Head API */
router.use('/ticket-head', ticketHeadRouter);

/* Network API */
router.use('/flow', flowRouter);

/* Complain API */
router.use('/complain', complainRouter);


module.exports = router