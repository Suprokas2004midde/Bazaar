import userModel from "../schema/userModel.js"

export const addToCartRepository = async()=>{
    
}

export const findUserRepository = async(id)=>{
    const userdata = await userModel.findById(id);
    return userdata;
} 

export const updateCartRepository = async(userId, {cartData})=>{
    const response = await userModel.findByIdAndUpdate(userId,{cartData});
    return response;
}