const db=require("../model/index")

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
            attributes: ['id', 'olt_name', 'port', 'status'],
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


module.exports = {
    AddFlow,
    GetAllFlow,
    UpdateFlow
}
