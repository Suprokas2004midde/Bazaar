import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Partial', 'Received', 'Cancelled'],
    default: 'Pending'
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    variantSize: { type: String, required: true },
    orderedQuantity: { type: Number, required: true },
    receivedQuantity: { type: Number, default: 0 },
    unitCost: { type: Number, required: true }
  }],
  orderDate: { type: Date, default: Date.now },
  expectedDate: { type: Date }
}, { timestamps: true });

const purchaseOrderModel = mongoose.models.purchaseOrders || mongoose.model("purchaseOrders", purchaseOrderSchema);

export default purchaseOrderModel;
