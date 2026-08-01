import crypto from "crypto";
import razorpay from 'razorpay';
import { AllOrderRepository, orderDataRepository, orderUpdateRepository, placeOrderRepository, saveRazorpayOrderRepository, singleOrderRepository, userOrderRepository } from "../repository/orderRepository.js";


//gateway init
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});


export const placeOrderService = async (userId, items, address, amount, deliveryFee, discount, saveAddress) => {
  const response = await placeOrderRepository(userId, items, address, amount, deliveryFee, discount, saveAddress);
  return response;
};

export const placeRazorpayService = async (userId, items, address, deliveryFee, discount, saveAddress)=>{
  const orderData = await orderDataRepository(userId, address, saveAddress);
  const options = {
    amount: orderData.finalAmount*100,
    currency: "INR",
    receipt: `USER_${Date.now()}`
  };
  const razorpayOrder = await razorpayInstance.orders.create(options);
  return {
    key: process.env.RAZORPAY_API_KEY,
    order: razorpayOrder
  };
};

export const verifyRazorpayService = async (
  userId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  address,
  saveAddress
) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const error = new Error("Missing Razorpay payment parameters");
    error.status = 400;
    throw error;
  }

  // 1. Verify HMAC SHA256 Signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    const error = new Error("Invalid Payment Signature");
    error.status = 400;
    throw error;
  }

  // 2. Fetch order from Razorpay to verify status & amount
  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
  
  if (!orderInfo) {
    const error = new Error("Razorpay order details not found");
    error.status = 404;
    throw error;
  }

  // 3. Recalculate cart details & verify total amount matches
  const orderData = await orderDataRepository(userId, address, saveAddress);
  const expectedAmount = orderData.finalAmount * 100;

  if (orderInfo.amount !== expectedAmount) {
    const error = new Error("Order amount mismatch");
    error.status = 400;
    throw error;
  }

  // 4. Save order to database & clear user cart
  const savedOrder = await saveRazorpayOrderRepository(userId, orderData);
  return savedOrder;
};

export const userOrderService = async (userId) =>{
  const response = await userOrderRepository(userId);
  return response;
}

export const allOrderService = async ()=>{
  const response = await AllOrderRepository();
  return response;
}

export const singleOrderService = async (orderId, userId) => {
  const order = await singleOrderRepository(orderId);
  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }
  if (String(order.userId) === String(userId)) {
    return order;
  } else {
    const error = new Error("User is not authorized to view this order");
    error.status = 403;
    throw error;
  }
}

export const statusUpdateService = async(orderId, status) =>{
  const response = await orderUpdateRepository(orderId, status);;
  return response;
}