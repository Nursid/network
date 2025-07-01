const db = require("../../model/index")
const PlanModel = db.PlanModel


const AddPlans = async (req, res) => {
    const data = req.body;
    
    // Store the data to the Database
    try {
        
        // If service does not exist, create a new one
        const NewPlan = await PlanModel.create(data);
        if(!NewPlan){
            res.status(202).json({
                error: true,
                message: "Failed to add service",
            });
        }
        res.status(200).json({
            error: false,
            data: NewPlan,
            message: "Plan Added Successfully!"
        });
        
    } catch (error) {
        console.error("Error occurred while adding service:", error);
        res.status(500).json({
            error: true,
            message: "Failed to add service",
            details: error.message // Optionally include more details about the error
        });
    }
};
const GetAllServices = async (req, res) => {

    try {
        // get all the services 
        const AllPlan = await PlanModel.findAll()
        if (!AllPlan) return res.status(400).json("No data Found")

        res.status(200).json({
            status: 200,
            data: AllPlan
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            error: error
        })
    }
}

const UpdatePlan = async (req, res) => {    
    const id = req.params.id;
    const data = req.body;
    
    try {
        const UpdatePlan = await PlanModel.update(data, {
            where: {
                id: id
            }
        });
        
        if (!UpdatePlan) {
            return res.status(400).json("Plan Not Updated");
        }
        
        res.status(200).json({
            error: false,
            data: UpdatePlan,
            message: "Plan Updated Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Failed to update service",
            details: error.message // Optionally include more details about the error
        });
    }
};

const DeletePlan = async (req, res) => {
    const id = req.params.id;
    
    // Store the data to the Database
    try {
        
        // If service does not exist, create a new one
        const NewPlan = await PlanModel.destroy({
            where:{
                id:id
            }
        });
        res.status(200).json({
            error: false,
            data: NewPlan,
            message: "Plan Added Successfully!"
        });
        
    } catch (error) {
        res.status(500).json({
            error: true,
            message: "Failed to add service",
            details: error.message // Optionally include more details about the error
        });
    }
};




module.exports ={AddPlans, GetAllServices, DeletePlan, UpdatePlan} 