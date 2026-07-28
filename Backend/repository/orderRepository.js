import { date } from "zod";
import mongoose from "mongoose";
import orderModel from "../schema/orderModel.js";
import { updateCartRepository } from "./cartRepository.js";
import userModel from "../schema/userModel.js";


export const placeOrderRepository = async (userId, items, address, amount, deliveryFee, discount, saveAddress) => {
    const orderData = {
      userId,
      items,
      address,
      amount,
      deliveryFee: deliveryFee ?? 0,
      discount: discount ?? 0,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    const response = await newOrder.save();
    //After placing the Order the Cart Items get Removed...
    await updateCartRepository(userId, {cartData:{}});
    
    if (saveAddress) {
      const user = await userModel.findById(userId);
      if (user) {
        // Check uniqueness by matching some key fields
        const isDuplicate = user.address.some(
          (a) => a.street === address.street
        );
        if (!isDuplicate) {
          user.address.push(address);
          await user.save();
        }
      }
    }
    
    return response;
};

export const userOrderRepository = async (userId) =>{
    const orders = await orderModel.find({userId});
    return orders;
}

export const AllOrderRepository = async ()=>{
    const orders = await orderModel.find({});
    return orders;
}
export const singleOrderRepository = async (orderId) => {
    if (mongoose.Types.ObjectId.isValid(orderId)) {
        const order = await orderModel.findById(orderId);
        if (order) return order;
    }
}

export const orderUpdateRepository = async (orderId, status) => {
    let targetId = orderId;
    const update = await orderModel.findByIdAndUpdate(targetId, { status }, { new: true });
    return update;
}