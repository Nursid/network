const db=require("../model/index")
const { Op } = require('sequelize');

const FlowModel=db.FlowModel

const AddFlow = async (req, res)=> {
    try{
        const data=req.body;
        const isAdd= await FlowModel.create(data);
        if(!isAdd){
            res.status(202).json({status: true,message:"Flow Not Added!"});
        }
        res.status(200).json({status: true, message:"Flow Added Successfully!"});
    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const GetAllFlow = async (req, res)=> {
    try{
        const data = await FlowModel.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({status: true, data: data});
    }catch(error){
        console.error("GetAllFlow error:", error);
        res.status(400).json({status: false, message:"Internal Server Error"});
    }
}

const UpdateFlow = async (req, res)=> {
    try{
        const id=req.params.id;
        const data=req.body;
        const isUpdate=await FlowModel.update(data,{
            where:{id:id}
        });
        if(!isUpdate){
            res.status(202).json({status: true,message:"Flow Not Updated!"});
        }
        res.status(200).json({status: true, message:"Flow Updated Successfully!"});
    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const GetFlow = async (req, res)=> {
    try{
        const id=req.params.id;
        const data=await FlowModel.findOne({
            where:{id:id}
        });
        if(!data){
            res.status(202).json({status: true,message:"Flow Not Found!", data: []});
        }
        res.status(200).json({status: true, data: data});
    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const SearchFlow = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                status: false, 
                message: "Search query is required"
            });
        }

        // Search for flows where the data field contains nodes with matching mac or userId
        const flows = await FlowModel.findAll({
            where: {
                [Op.or]: [
                    // Search for MAC address in nodes data
                    {
                        data: {
                            [Op.like]: `%"mac":"${query}"%`
                        }
                    },
                    // Search for userId in nodes data
                    {
                        data: {
                            [Op.like]: `%"userId":"${query}"%`
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: true, 
            data: flows,
            message: `Found ${flows.length} flow(s) matching "${query}"`
        });

    } catch (error) {
        console.error("SearchFlow error:", error);
        res.status(500).json({
            status: false, 
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    AddFlow,
    GetAllFlow,
    UpdateFlow,
    GetFlow,
    SearchFlow
}
