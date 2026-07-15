import express from 'express'
import adminAuth from '../middleware/adminAuth.js';
import { allOrder, placeOrder, placeOrderRazorpay, placeOrderStripe, updateOrderStatus, userOrder } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';


const orderRouter = express.Router();

//Admin
orderRouter.post('/list', adminAuth, allOrder);
orderRouter.post('/status', adminAuth, updateOrderStatus);

//user
orderRouter.post('/userorder',userAuth,userOrder);

//payment 
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/stripe', userAuth, placeOrderStripe);
orderRouter.post('/razorpay', userAuth, placeOrderRazorpay);

export default orderRouter;