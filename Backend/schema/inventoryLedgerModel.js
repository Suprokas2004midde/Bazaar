import mongoose from "mongoose";

const inventoryLedgerSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  variantSize: { type: String, required: true },
  quantityChanged: { type: Number, required: true },
  reason: { 
    type: String, 
    required: true,
    enum: ['Sale', 'Restock', 'Manual Adjustment', 'Damage', 'Return', 'Cancelled Order', 'Initial Stock']
  },
  referenceId: { type: String }, // e.g. OrderId or PO Id
  notes: { type: String }
}, { timestamps: true });

const inventoryLedgerModel = mongoose.models.inventoryLedger || mongoose.model("inventoryLedger", inventoryLedgerSchema);

export default inventoryLedgerModel;
