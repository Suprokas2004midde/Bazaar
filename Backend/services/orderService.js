import { placeOrderRepository } from "../repository/orderRepository.js";

export const placeOrderService = async (userId, items, address, amount) => {
  const response = await placeOrderRepository(userId, items, address, amount);
  return response;
};
