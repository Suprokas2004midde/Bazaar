import { date } from "zod";
import orderModel from "../schema/orderModel.js";
import { updateCartRepository } from "./cartRepository.js";


export const placeOrderRepository = async (userId, items, address, amount) => {
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    const response = await newOrder.save();
    //After placing the Order the Cart Items get Removed...
    await updateCartRepository(userId, {cartData:{}});
    return response;
};