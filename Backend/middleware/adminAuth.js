import jwt from "jsonwebtoken"
import { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } from "../config/serverConfig.js";


const adminAuth = async(req,res,next)=>{
    try {
        const {token} = req.headers;
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Not Authorised, please Login Again",
            })
        }
        const decode_token = jwt.verify(token, JWT_SECRET);
        // (decode_token !== (ADMIN_EMAIL+ADMIN_PASSWORD))  — object vs string, always fails 
        if(decode_token.id !== (ADMIN_EMAIL+ADMIN_PASSWORD)){
            return res.status(400).json({
                success: false,
                message: "Not Authorised, Login Again",
            })
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(error.status || 401).json({
          success: false,
          message: error.message,
        });
    }
}
export default adminAuth;