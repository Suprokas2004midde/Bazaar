import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactName: { type: String },
  email: { type: String },
  phone: { type: String },
  notes: { type: String }
}, { timestamps: true });

const supplierModel = mongoose.models.suppliers || mongoose.model("suppliers", supplierSchema);

export default supplierModel;
