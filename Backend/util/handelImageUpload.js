import { upload } from "../middleware/storageEngine.js";

const handelImageUpload = async(req, res, next)=>{
    const uploadMultiple = upload.array('images',5) // first parameter is field name and second is max count for array...
    //in HTML file the file should be in the same name...
    uploadMultiple(req, res, function(err){
        if(err){
        if(err.message === 'INVALID_FILE_TYPE'){
            return res.status(400).json({
              success: false,
              message:
                'Invalid file type. Only JPG, PNG, and WebP are allowed.',
            });
        }
        return res.status(500).json({
            success: false,
            message: "image Upload failed ",
            error: err.message,
        })
    }

    // Inject uploaded file URLs into req.body so Zod validator can read them
    // if (req.files && req.files.length > 0) {
    //     req.body.images = req.files.map((file) => file.path);
    // }

    next(); //if uploads successfully then request body will have a new part called 'files'...
    } )
}

export default handelImageUpload;