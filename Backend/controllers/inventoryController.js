import inventoryLedgerModel from "../schema/inventoryLedgerModel.js";
import productModel from "../schema/productModel.js";

export const getLedger = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const ledger = await inventoryLedgerModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('productId', 'name images'); // get product name and image

    const total = await inventoryLedgerModel.countDocuments();

    res.status(200).json({
      success: true,
      ledger,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error fetching ledger" });
  }
};

export const adjustStock = async (req, res) => {
  try {
    const { productId, variantSize, quantityChanged, reason, notes } = req.body;

    if (!productId || !variantSize || quantityChanged === undefined || !reason) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const sizeIndex = product.sizes.findIndex(s => s.size === variantSize);
    if (sizeIndex === -1) return res.status(404).json({ success: false, message: "Variant size not found" });

    // Update quantity
    product.sizes[sizeIndex].quantity += Number(quantityChanged);
    
    // Save ledger entry
    const ledgerEntry = new inventoryLedgerModel({
      productId,
      variantSize,
      quantityChanged: Number(quantityChanged),
      reason,
      notes,
    });

    await product.save();
    await ledgerEntry.save();

    res.status(200).json({ success: true, message: "Stock adjusted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error adjusting stock" });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    
    // Find products where any size has quantity < threshold
    const products = await productModel.find({
      "sizes.quantity": { $lt: threshold }
    });
    
    // Filter out only the low stock variants to send back
    const lowStockItems = [];
    products.forEach(p => {
      p.sizes.forEach(s => {
        if (s.quantity < threshold) {
          lowStockItems.push({
            productId: p._id,
            productName: p.name,
            image: p.images[0],
            category: p.category,
            variantSize: s.size,
            sku: s.sku,
            quantity: s.quantity,
          });
        }
      });
    });

    res.status(200).json({ success: true, lowStockItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error fetching low stock" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const products = await productModel.find({});
    
    let totalValuation = 0;
    let totalItems = 0;
    let totalProducts = products.length;
    let activeProducts = 0;
    let outOfStockProducts = 0;

    products.forEach(p => {
      let productTotalQuantity = 0;
      p.sizes.forEach(s => {
        if (s.quantity > 0 && s.costPrice) {
          totalValuation += s.quantity * s.costPrice;
        }
        if (s.quantity > 0) {
          totalItems += s.quantity;
        }
        if (s.quantity) {
          productTotalQuantity += s.quantity;
        }
      });
      
      if (p.status === 'Active') {
        activeProducts++;
      }
      if (productTotalQuantity <= 0) {
        outOfStockProducts++;
      }
    });

    res.status(200).json({ 
      success: true, 
      valuation: totalValuation,
      totalItems,
      totalProducts,
      activeProducts,
      outOfStockProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error calculating analytics" });
  }
};
