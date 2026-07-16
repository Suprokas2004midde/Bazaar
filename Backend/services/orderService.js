import { AllOrderRepository, orderUpdateRepository, placeOrderRepository, userOrderRepository } from "../repository/orderRepository.js";

export const placeOrderService = async (userId, items, address, amount) => {
  const response = await placeOrderRepository(userId, items, address, amount);
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

export const statusUpdateService = async(orderId, status) =>{
  const response = await orderUpdateRepository(orderId, status);;
  return response;
}