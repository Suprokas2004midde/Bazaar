import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type:String, required: true},
    items: { type:Array, required: true},
    amount: { type:Number, required: true},
    deliveryFee: {type: Number, default:0, required:false},
    discount: {type: Number, default:0, required:false},
    address: { type:Object, required: true},
    status: { type:String, required: true, default: 'Order Placed'},
    paymentMethod: { type:String, required: true},
    payment: { type:Boolean, required: true},
    date: { type:Number, required: true},

},{minimize: false, timestamps: true})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema);
export default orderModel;