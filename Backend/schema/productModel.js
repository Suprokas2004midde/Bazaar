import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  sizes: [{
    size: { type: String, required: true },
    sku: { type: String },
    barcode: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    reserved: { type: Number, default: 0 },
    costPrice: { type: Number },
    allowBackorder: { type: Boolean, default: false }
  }],
  bestseller: { type: Boolean },
  date: { type: Number, trim: true },
  status: { type: String, enum: ['Active', 'Closed For Sale'], default: 'Active' },
  reviews: {type: Array, default: [], required: false},
},{ timestamps:true, minimize: false });

const productModel = mongoose.models.products || mongoose.model("products",productSchema);

export default productModel;

