import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  sizes: { type: Array, required: false },
  quantity: { type: Number, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, trim: true },
},{ timestamps:true, minimize: false });

const productModel = mongoose.models.products || mongoose.model("products",productSchema);

export default productModel;

