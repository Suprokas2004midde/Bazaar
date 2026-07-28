import {
  clearWishlistService,
  getWishlistService,
  toggleWishlistService,
} from "../services/wishlistService.js";

// GET /api/wishlist/get
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const wishlist = await getWishlistService(userId);
    return res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/wishlist/toggle
export const toggleWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const result = await toggleWishlistService(userId, productId);
    return res.status(200).json({
      success: true,
      message: result.added ? "Added to wishlist" : "Removed from wishlist",
      wishlist: result.wishlist,
      added: result.added,
    });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/wishlist/clear
export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    await clearWishlistService(userId);
    return res.status(200).json({ success: true, message: "Wishlist cleared", wishlist: [] });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
