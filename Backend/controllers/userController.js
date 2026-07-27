import { regesterUserService, loginUserService, adminLoginService, getUserProfileService, updateUserProfileService } from "../services/userService.js";

// Only controller layer has the access to the req, res. Service layer don't have access to that.

// POST /api/user/login
export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const token= await loginUserService({email,password});
        return res.status(200).json({
          success: true,
          token,
        });
        
    } catch (error) {
        return res.status(error.status).json({
          success: false,
          message: error.message,
        });
    }
}

// POST /api/user/register
export const registerUser = async(req,res)=>{
    try {
        const {name, email, password} = req.body;
        const token = await regesterUserService({name,email,password});
        return res.status(200).json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

// POST /api/user/admin
export const adminLogin = async(req,res)=>{
     try {
       const { email, password } = req.body;
       const token = await adminLoginService({ email, password });
       return res.status(200).json({
         success: true,
         token,
       });
     } catch (error) {
       return res.status(error.status).json({
         success: false,
         message: error.message,
       });
     }
}

// GET /api/user/profile
export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body; // Injected by userAuth middleware
        const profile = await getUserProfileService(userId);
        return res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        console.log(error);
        if (error.status) {
            return res.status(error.status).json({
                message: error.message,
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

// PUT /api/user/profile
export const updateUserProfile = async (req, res) => {
    try {
        const { userId, ...updateData } = req.body; // userId injected by userAuth middleware
        const profile = await updateUserProfileService(userId, updateData);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile
        });
    } catch (error) {
        console.log(error);
        if (error.status) {
            return res.status(error.status).json({
                message: error.message,
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}