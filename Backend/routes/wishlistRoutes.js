import express from 'express';
import { clearWishlist, getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import userAuth from '../middleware/userAuth.js';

const wishlistRouter = express.Router();

wishlistRouter.post('/get', userAuth, getWishlist);
wishlistRouter.post('/toggle', userAuth, toggleWishlist);
wishlistRouter.post('/clear', userAuth, clearWishlist);

export default wishlistRouter;
