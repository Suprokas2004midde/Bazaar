import userModel from "../schema/userModel.js";

export const findUserRepository = async (id) => {
  return await userModel.findById(id);
};

// Get full wishlist (array of product IDs)
export const getWishlistRepository = async (userId) => {
  const user = await userModel.findById(userId);
  return user?.wishlist || [];
};

// Toggle: add if not present, remove if present
export const toggleWishlistRepository = async (userId, productId) => {
  const user = await userModel.findById(userId);
  if (!user) throw { status: 404, message: "User not found" };

  const wishlist = user.wishlist || [];
  const exists = wishlist.includes(String(productId));

  let updatedWishlist;
  if (exists) {
    updatedWishlist = wishlist.filter((id) => String(id) !== String(productId));
  } else {
    updatedWishlist = [...wishlist, String(productId)];
  }

  await userModel.findByIdAndUpdate(userId, { wishlist: updatedWishlist });
  return { wishlist: updatedWishlist, added: !exists };
};

// Clear entire wishlist
export const clearWishlistRepository = async (userId) => {
  await userModel.findByIdAndUpdate(userId, { wishlist: [] });
  return [];
};
