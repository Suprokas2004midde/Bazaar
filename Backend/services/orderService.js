import { AllOrderRepository, orderUpdateRepository, placeOrderRepository, singleOrderRepository, userOrderRepository } from "../repository/orderRepository.js";

export const placeOrderService = async (userId, items, address, amount, saveAddress) => {
  const response = await placeOrderRepository(userId, items, address, amount, saveAddress);
  return response;
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