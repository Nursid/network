
const db= require("../../model/index")
const AdminRolesModel= db.AdminRolesModel
const SuperAdminRolesModel = db.SuperAdminRolesModel
const EmployeeModel = db.EmployeeModel

// get the roles  
const GetRoles = async (req, res) => {
    const reqRole = req.params.role;
    const mobile = req.query.mobile;

    try {
        let result;
        let emp_id;

        if(mobile){
            const employee = await EmployeeModel.findOne({ where: { mobile_no: mobile } });
            if(employee){
                emp_id = employee.id;
            }
        }


        switch (reqRole) {
            case "super":
                result = await SuperAdminRolesModel.findOne({ where: { role: reqRole } });
                break;
            case "admin":
                result = await AdminRolesModel.findOne({ where: { emp_id: emp_id } });
                break;
            case "office":
                result = await BackofficeRoleModel.findOne();
                break;
            case "service":
                result = await ServiceProviderRolesModel.findOne();
                break;
            case "supervisor":
                result = await SuperVisorRolesModel.findOne();
                break;
            default:
                result = null;
        }
        

        if (!result) return res.status(404).json({ error: true, message: "Not Found data" });
        
        res.status(200).json({ error: false, data: result });
    } catch (error) {
        res.status(402).json({error: true, message: "Internal Server Error"});
    }
}
const GetAllAdminRoles = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await AdminRolesModel.findOne({ where: { emp_id: id } });

        if (!result) return res.status(404).json({ error: true, message: "Not Found data" });
        
        res.status(200).json({ error: false, data: result });
    } catch (error) {
        console.log(error);
        res.status(402).json({error: true, message: "Internal Server Error"});
    }
}

const UpdateAdminRoles = async (req, res) => {
    try {
        const empId = req.params.empId;
        const field = req.params.field;
        const value = req.params.value === 'true'; // Convert string to boolean

        // Find the admin role by employee ID
        const adminRole = await AdminRolesModel.findOne({ where: { emp_id: empId } });

        if (!adminRole) {
            return res.status(404).json({ error: true, message: "Admin role not found for this employee" });
        }

        // Update the specific field
        adminRole[field] = value;
        await adminRole.save();

        res.status(200).json({ 
            error: false, 
            message: "Role updated successfully",
            data: adminRole 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}


module.exports = { GetRoles, GetAllAdminRoles, UpdateAdminRoles }