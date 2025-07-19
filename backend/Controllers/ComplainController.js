const db=require("../model/index")
const ComplainModel=db.CustomerComplaintModel

const AddComplain=async(req,res)=>{
    const {
        customer_id,
        subject,
        description
    }=req.body

    const complain=await ComplainModel.create({
        customerId:customer_id,
        subject:subject,
        description:description
    })

    if(!complain){
        return res.status(400).json({error:true,message:"Complain not added"})
    }

    return res.status(200).json({message:"Complain added successfully"})
}

module.exports={
    AddComplain
}


