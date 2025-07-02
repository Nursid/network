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
        
        // Parse the data field for each flow if it's a string
        const processedData = data.map(flow => {
            let result = flow.toJSON ? flow.toJSON() : flow;
            
            if (result && typeof result.data === 'string') {
                try {
                    let parsedData = JSON.parse(result.data);
                    // If still a string (double-encoded), parse again
                    while (typeof parsedData === 'string') {
                        parsedData = JSON.parse(parsedData);
                    }
                    result.data = parsedData;
                } catch (e) {
                    console.error("Error parsing flow data:", e);
                    // If parsing fails, keep original string
                }
            }
            
            return result;
        });
        
        res.status(200).json({status: true, data: processedData});
    }catch(error){
        console.error("GetAllFlow error:", error);
        res.status(500).json({status: false, message:"Internal Server Error"});
    }
}

const UpdateFlow = async (req, res)=> {
    try{
        const id=req.params.id;
        const data=req.body;
        
        const affectedRows = await FlowModel.update(data,{
            where:{id:id}
        });
        if(!affectedRows){
            return res.status(202).json({status: false,message:"Flow Not Updated!"});
        }
        res.status(200).json({status: true, message:"Flow Updated Successfully!"});
    }catch(error){
        res.status(400).json({status: true ,message:"Internal Server Error"});
    }
}

const GetFlow = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await FlowModel.findOne({
            where: { id: id }
        });
        if (!data) {
            return res.status(202).json({ status: false, message: "Flow Not Found!", data: null });
        }

        // Convert to plain object
        let result = data.toJSON ? data.toJSON() : data;
        
        // Parse the data field if it's a string
        if (result && typeof result.data === 'string') {
            try {
                let parsedData = JSON.parse(result.data);
                // If still a string (double-encoded), parse again
                while (typeof parsedData === 'string') {
                    parsedData = JSON.parse(parsedData);
                }
                result.data = parsedData;
            } catch (e) {
                console.error("Error parsing flow data:", e);
                // If parsing fails, keep original string
            }
        }

        res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.error("GetFlow error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
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

        // Parse the data field for each flow if it's a string
        const processedFlows = flows.map(flow => {
            let result = flow.toJSON ? flow.toJSON() : flow;
            
            if (result && typeof result.data === 'string') {
                try {
                    let parsedData = JSON.parse(result.data);
                    // If still a string (double-encoded), parse again
                    while (typeof parsedData === 'string') {
                        parsedData = JSON.parse(parsedData);
                    }
                    result.data = parsedData;
                } catch (e) {
                    console.error("Error parsing flow data in search:", e);
                    // If parsing fails, keep original string
                }
            }
            
            return result;
        });

        res.status(200).json({
            status: true, 
            data: processedFlows,
            message: `Found ${processedFlows.length} flow(s) matching "${query}"`
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
