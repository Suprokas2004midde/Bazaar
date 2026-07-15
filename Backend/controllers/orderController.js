import { success } from "zod";
import { placeOrderService } from "../services/orderService.js";


export const placeOrder = async(req, res)=>{
    try {
        const {userId, items, address, amount} = req.body;
        const response = await placeOrderService(
          userId,
          items,
          address,
          amount,
        );
        res.status(200).json({
            success: true,
            messsage: "Order Placed",
            data: response.data,
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

export const placeOrderStripe = async(req, res)=>{
    try {
        
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

export const placeOrderRazorpay = async(req, res)=>{
    try {
        
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

export const allOrder = async (req, res)=>{
    try {
        
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

export const userOrder = async (req, res)=>{
    try {
        
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

export const updateOrderStatus = async (req, res)=>{
    try {
        
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
