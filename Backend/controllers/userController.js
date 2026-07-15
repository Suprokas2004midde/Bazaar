import { regesterUserService, loginUserService, adminLoginService } from "../services/userService.js";

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