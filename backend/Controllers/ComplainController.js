// const db=require("../model/index")
// const ComplainModel=db.CustomerComplaintModel

// const AddComplain=async(req,res)=>{
//     const {
//         customer_id,
//         subject,
//         description
//     }=req.body

//     const complain=await ComplainModel.create({
//         customerId:customer_id,
//         subject:subject,
//         description:description
//     })

//     if(!complain){
//         return res.status(400).json({error:true,message:"Complain not added"})
//     }

//     return res.status(200).json({message:"Complain added successfully"})
// }

// module.exports={
//     AddComplain
// }


const db = require("../model");
const Complaint = db.CustomerComplaintModel;
const Task = db.ComplaintTaskModel;

const addComplaintWithTask = async (req, res) => {
    const {
      customer_id,
  
      // Complaint
      subject,
      description,
      category,
      priority,
      assignedTo,
      complaintDate,
  
      // Task
      taskTitle,
      taskDescription,
      taskType,
      taskDate,
      taskAssignTo
    } = req.body;
  
    const transaction = await db.sequelize.transaction();
  
    try {
      // 1️⃣ Create Complaint
      const complaint = await Complaint.create(
        {
          customerId: customer_id,
          subject,
          description,
          category,
          priority,
          assignedTo,        // ✅ complaint assigned
          complaintDate
        },
        { transaction }
      );
  
      // 2️⃣ Create Task (optional)
      if (taskTitle) {
        await Task.create(
          {
            complaintId: complaint.id,
            title: taskTitle,
            description: taskDescription,
            taskType,
            assignedTo: taskAssignTo,  // ✅ task assigned
            dueDate: taskDate
          },
          { transaction }
        );
      }
  
      await transaction.commit();
  
      return res.status(200).json({
        success: true,
        message: "Complaint & Task created successfully"
      });
  
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message
      });
    }
  };
  


  const getRecentComplaintsAndTasks = async (req, res) => {
    const { customerId } = req.params;
  
    try {
        const complaints = await db.CustomerComplaintModel.findAll({
            where: { customerId },
            order: [["createdAt", "DESC"]],
            limit: 5,
            include: [
              {
                model: db.ComplaintTaskModel,
                as: "tasks",              // 🔥 MUST MATCH alias
                separate: true,
                order: [["createdAt", "DESC"]],
                limit: 5
              }
            ]
          });
          
  
          const logs = [];

          complaints.forEach((c) => {
            logs.push({
              type: "COMPLAINT",
              date: c.createdAt,
              text: `Complaint Logged: ${c.subject}`
            });
          
            c.tasks?.forEach((t) => {
              logs.push({
                type: "TASK",
                date: t.createdAt,
                text:
                  t.taskType === "visit"
                    ? `Visit Scheduled: ${t.title}`
                    : `Task Assigned: ${t.title}`
              });
            });
          });
          
          logs.sort((a, b) => new Date(b.date) - new Date(a.date));
      // 🔹 Send only latest 5
      return   res.status(200).json(logs.slice(0, 5));
  
    } catch (error) {
      console.error("LOG FETCH ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch complaint & task logs"
      });
    }
  };
  
  
  

module.exports = { addComplaintWithTask , getRecentComplaintsAndTasks};


