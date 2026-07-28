import {
  clearWishlistRepository,
  getWishlistRepository,
  toggleWishlistRepository,
} from "../repository/wishlistRepository.js";

export const getWishlistService = async (userId) => {
  return await getWishlistRepository(userId);
};

export const toggleWishlistService = async (userId, productId) => {
  return await toggleWishlistRepository(userId, productId);
};

export const clearWishlistService = async (userId) => {
  return await clearWishlistRepository(userId);
};
