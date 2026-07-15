import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/serverConfig.js";

const userAuth  = async(req, res, next)=>{
    const {token} = req.headers;
    
    if(!token){
        return res.json({status:401, success: false, messsage: "Not Authorised User, Login Again"});
    }

    //Only add a userId into the reqest body....
    try {
        const decoded_token = await jwt.verify(token, JWT_SECRET);
        req.body = req.body || {}; // req.body is undefined for GET requests
        req.body.userId = decoded_token.id;
        next();
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message});
    }
}
export default userAuth;