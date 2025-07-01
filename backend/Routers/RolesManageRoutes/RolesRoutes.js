const router = require("express").Router();
const rolesController  = require('../../Controllers/RolesAndPermission/RolesAndPermissionController')

// get the roles 
router.get("/get/:role", rolesController.GetRoles);
router.get("/admin/:id", rolesController.GetAllAdminRoles);
router.put("/admin/update/:empId/:field/:value", rolesController.UpdateAdminRoles);


module.exports = router