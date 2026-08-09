import { date } from "zod";
import mongoose from "mongoose";
import orderModel from "../schema/orderModel.js";
import { updateCartRepository } from "./cartRepository.js";
import userModel from "../schema/userModel.js";
import productModel from "../schema/productModel.js";
import inventoryLedgerModel from "../schema/inventoryLedgerModel.js";

// Helper to deduct stock
const deductStock = async (items, orderId) => {
  for (const item of items) {
    const product = await productModel.findById(item._id);
    if (product) {
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex !== -1) {
        const variant = product.sizes[sizeIndex];
        if (variant.quantity < item.quantity && !variant.allowBackorder) {
          throw { status: 400, message: `Insufficient stock for ${product.name} (Size: ${item.size})` };
        }
        product.sizes[sizeIndex].quantity -= item.quantity;
        await product.save();

        const ledgerEntry = new inventoryLedgerModel({
          productId: product._id,
          variantSize: item.size,
          quantityChanged: -item.quantity,
          reason: 'Sale',
          referenceId: String(orderId)
        });
        await ledgerEntry.save();
      }
    }
  }
};

//global variables
const deliveryCharges = 100;


export const placeOrderRepository = async (userId, items, address, amount, deliveryFee, discount, saveAddress) => {
    const orderData = {
      userId,
      items,
      address,
      amount,
      deliveryFee: deliveryFee ?? 0,
      discount: discount ?? 0,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now()
    };

    // Normalize items: ensure each has productId so the review check works
    // (Mongoose auto-generates its own _id for untyped array subdocuments)
    const normalizedItems = items.map(item => ({
      ...item,
      productId: String(item._id || item.productId || ''),
    }));

    const newOrder = new orderModel({ ...orderData, items: normalizedItems });
    const response = await newOrder.save();
    
    // Deduct stock
    await deductStock(items, response._id);
    //After placing the Order the Cart Items get Removed...
    await updateCartRepository(userId, {cartData:{}});
    
    if (saveAddress) {
      const user = await userModel.findById(userId);
      if (user) {
        // Check uniqueness by matching some key fields
        const isDuplicate = user.address.some(
          (a) => a.street === address.street
        );
        if (!isDuplicate) {
          user.address.push(address);
          await user.save();
        }
      }
    }
    
    return response;
};

export const orderDataRepository = async(userId, address, saveAddress)=>{
  
  //Step1
  const user =  await userModel.findById(userId);
  const cart = user.cartData;
  //Step2
  const products = await productModel.find({
    _id: {
      $in: Object.keys(cart),
    },
  });
  //Step3
  const items = [];
  let subtotal = 0;
  //Step4
  for (const product of products) {
    const productCart = cart[product._id]; 

    for (const size in productCart) {
      const quantity = productCart[size];

      if (quantity <= 0) continue;

      items.push({
        productId: String(product._id), // explicit product ID safe from Mongoose subdoc auto _id
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        size,
        quantity,
      });
      subtotal += product.price * quantity;
    }
  }
  //Step5
  const deliveryFee = subtotal > 0 ? deliveryCharges : 0 ;
  const discount = subtotal >= 500 ? deliveryCharges : 0 ;
  const finalAmount = subtotal + deliveryFee - discount;
  //step6
  if (saveAddress) {
    if (user) {
      // Check uniqueness by matching some key fields
      const isDuplicate = user.address.some((a) => a.street === address.street);
      if (!isDuplicate) {
        user.address.push(address);
        await user.save();
      }
    }
  }
  return {
    items,
    subtotal,
    deliveryFee,
    discount,
    finalAmount,
    address,
  };
};

export const saveRazorpayOrderRepository = async (userId, calculatedData) => {
  const orderData = {
    userId,
    items: calculatedData.items,
    address: calculatedData.address,
    amount: calculatedData.finalAmount,
    deliveryFee: calculatedData.deliveryFee,
    discount: calculatedData.discount,
    paymentMethod: 'Razorpay',
    payment: true,
    date: Date.now()
  };

  // Normalize items: ensure each has productId so the review check works
  const normalizedItems = calculatedData.items.map(item => ({
    ...item,
    productId: String(item._id || item.productId || ''),
  }));

  const newOrder = new orderModel({ ...orderData, items: normalizedItems });
  const response = await newOrder.save();
  
  // Deduct stock
  await deductStock(calculatedData.items, response._id);
  await updateCartRepository(userId, { cartData: {} });
  return response;
};

export const userOrderRepository = async (userId) =>{
    const orders = await orderModel.find({userId});
    return orders;
}

export const AllOrderRepository = async ()=>{
    const orders = await orderModel.find({});
    return orders;
}

export const singleOrderRepository = async (orderId) => {
    if (mongoose.Types.ObjectId.isValid(orderId)) {
        const order = await orderModel.findById(orderId);
        if (order) return order;
    }
}

export const orderUpdateRepository = async (orderId, status) => {
    let targetId = orderId;
    const order = await orderModel.findById(targetId);
    
    // If cancelling, restore stock
    if (status === 'Cancelled' && order && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await productModel.findById(item._id);
        if (product) {
          const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
          if (sizeIndex !== -1) {
            product.sizes[sizeIndex].quantity += item.quantity;
            await product.save();
            
            const ledgerEntry = new inventoryLedgerModel({
              productId: product._id,
              variantSize: item.size,
              quantityChanged: item.quantity,
              reason: 'Cancelled Order',
              referenceId: String(orderId)
            });
            await ledgerEntry.save();
          }
        }
      }
    }
    
    const update = await orderModel.findByIdAndUpdate(targetId, { status }, { new: true });
    return update;
}