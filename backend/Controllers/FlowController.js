const db=require("../model/index")
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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

const UploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "No image file provided"
            });
        }

        // Generate the URL for the uploaded image
        const imageUrl = `/uploads/images/${req.file.filename}`;

        res.status(200).json({
            status: true,
            message: "Image uploaded successfully",
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: imageUrl
            }
        });

    } catch (error) {
        console.error("UploadImage error:", error);
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
    SearchFlow,
    UploadImage,
    upload // Export the multer middleware
}
