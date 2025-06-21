const router = require("express").Router();
const rolesController  = require('../../Controllers/RolesAndPermission/RolesAndPermissionController')


// set the Admin Roles
router.post("/add", rolesController.AddAdminRoles);
// get the roles 
router.get("/get/:role", rolesController.GetRoles);
router.get("/admin/:id", rolesController.GetAllAdminRoles);

// update the role field 
router.get("/update/:role/:field/:value", rolesController.UpdateRoles)
// update admin roles by employee ID
router.put("/admin/update/:empId/:field/:value", rolesController.UpdateAdminRoles);


module.exports = router