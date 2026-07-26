import { success } from "zod";
import { allOrderService, placeOrderService, singleOrderService, statusUpdateService, userOrderService } from "../services/orderService.js";

// /api/order/place
export const placeOrder = async(req, res)=>{
    try {
        const {userId, items, address, amount, saveAddress} = req.body;
        const response = await placeOrderService(
          userId,
          items,
          address,
          amount,
          saveAddress
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
      const response = await allOrderService();
      res.status(200).json({
        success: true,
        messsage: "All Orderss fetched Successfully",
        orders: response,
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

export const userOrder = async (req, res)=>{
    try {
      const { userId } = req.body
      const response = await userOrderService(userId);
      res.status(200).json({
        success: true,
        messsage: "Fetched Order Data Successfully",
        orders: response,
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

export const singleOrder = async (req, res) =>{
  try {
    const {orderId, userId} = req.body;
    const response = await singleOrderService(orderId, userId);
    res.status(200).json({
      success: true,
      message: `OrderID-${orderId} details feched successfully`,
      order: response,
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

export const updateOrderStatus = async (req, res)=>{
    try {
        const {orderId, status} = req.body;
        const response = await statusUpdateService(orderId, status);
        res.status(200).json({
          success: true,
          message: "Status Updated Successfully",
          response: response,
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
