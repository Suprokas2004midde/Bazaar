import { addToCartService, getUserCartService, updateCartService } from "../services/cartService.js"



export const addToCart = async (req,res)=>{
    try {
        const {userId, itemId, size} = req.body
        const response = await addToCartService(userId, itemId,size)
        return res.status(200).json({
            success: true,
            messsage: "Item Added to Cart",
            data: response,
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

export const updateCart = async(req,res)=>{
    try {
        //The userId is coming from the userAuth not from the frontend. rest is from frontend
        const {userId, itemId, size, quantity} = req.body; 
        const response = await updateCartService(userId, itemId, size, quantity);
        return res.status(200).json({
            success:true,
            message: "Cart Updated Successfully",
            data: response,
        })

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

export const getUserCart = async (req,res)=>{
    try {
        const {userId} = req.body;
        const response = await getUserCartService(userId);
        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: response,
        })
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