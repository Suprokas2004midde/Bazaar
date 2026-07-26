import { jsPDF } from "jspdf";
import logo from "../assets/logo.png";

const getBase64ImageFromUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

/**
 * Downloads a thermal receipt PDF formatted for 80mm POS printers
 */
export const downloadThermalReceipt = async ({
  order,
  currency = "₹",
  orderDate,
  customerName,
  addr,
  items,
  subtotal,
  deliveryFee,
  tax,
  discount,
  totalPaid,
}) => {
  // Calculate dynamic height for continuous 80mm thermal receipt roll
  const baseHeight = 120;
  const itemLines = items.reduce((acc, item) => {
    return acc + (item.name ? Math.ceil(item.name.length / 16) : 1);
  }, 0);
  const receiptHeight = Math.max(140, baseHeight + itemLines * 6);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, receiptHeight],
  });

  const margin = 4;
  const colQtyX = 42;
  const colPriceX = 58;
  const colAmtX = 76;

  let y = 6;

  // 1. Centered Bazaar Logo at top
  try {
    const imgData = await getBase64ImageFromUrl(logo);
    if (imgData) {
      // Center 28mm wide logo in 80mm paper (X = (80 - 28) / 2 = 26)
      doc.addImage(imgData, "PNG", 26, y, 28, 10);
      y += 13;
    }
  } catch (e) {
    console.error("Logo load error:", e);
  }

  // Receipt Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("ORDER RECEIPT", 40, y, { align: "center" });
  y += 4;

  // Dashed divider line
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 3.5;

  // Order Meta Info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);

  doc.text(`Order ID: ORD-${order._id ? order._id.slice(-8).toUpperCase() : "2024-78432"}`, margin, y);
  y += 3.5;
  doc.text(`Date: ${orderDate}`, margin, y);
  y += 3.5;
  doc.text(`Customer: ${customerName}`, margin, y);
  y += 3.5;
  doc.text(`Payment: ${(order.paymentMethod || "COD").toUpperCase()} (${order.payment ? "Paid" : "Pending"})`, margin, y);
  y += 4;

  // Dashed divider line
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 3.5;

  // Table Column Headers: Item | Qty | Price | Amt
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);

  doc.text("Item", margin, y);
  doc.text("Qty", colQtyX, y, { align: "right" });
  doc.text("Price", colPriceX, y, { align: "right" });
  doc.text("Amt", colAmtX, y, { align: "right" });
  y += 3.5;

  // Dashed divider line below header
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 4;

  // Items List
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);

  let totalQty = 0;

  items.forEach((item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 1;
    totalQty += itemQty;
    const itemTotal = itemPrice * itemQty;

    const formattedPrice = itemPrice.toFixed(2);
    const formattedTotal = itemTotal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Item Name wrap for column width ~32mm
    const maxNameWidth = 32;
    const splitName = doc.splitTextToSize(item.name || "Product Item", maxNameWidth);

    // First line with Qty, Price, Amt
    const startY = y;
    doc.text(splitName[0], margin, y);
    doc.text(String(itemQty), colQtyX, startY, { align: "right" });
    doc.text(formattedPrice, colPriceX, startY, { align: "right" });
    doc.text(formattedTotal, colAmtX, startY, { align: "right" });

    // Wrapped name lines if any
    if (splitName.length > 1) {
      for (let i = 1; i < splitName.length; i++) {
        y += 3.2;
        doc.text(splitName[i], margin, y);
      }
    }

    y += 4.5;
  });

  // Dashed divider line above SubTotal
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 3.5;

  // SubTotal Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);

  doc.text("SubTotal", margin, y);
  doc.text(String(totalQty), colQtyX, y, { align: "right" });
  doc.text(
    subtotal.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    colAmtX,
    y,
    { align: "right" }
  );
  y += 3.5;

  // Dashed divider line below SubTotal
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 3.5;

  // Extra Breakdown (Shipping, Tax, Discount)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);

  if (deliveryFee > 0) {
    doc.text("Shipping Fee", margin, y);
    doc.text(deliveryFee.toFixed(2), colAmtX, y, { align: "right" });
    y += 3.5;
  }

  if (tax > 0) {
    doc.text("Tax", margin, y);
    doc.text(tax.toFixed(2), colAmtX, y, { align: "right" });
    y += 3.5;
  }

  if (discount > 0) {
    doc.text("Discount", margin, y);
    doc.text(`-${discount.toFixed(2)}`, colAmtX, y, { align: "right" });
    y += 3.5;
  }

  // Dashed divider line above TOTAL
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 4;

  // TOTAL Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text("TOTAL", margin, y);
  doc.text(
    `Rs. ${totalPaid.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    colAmtX,
    y,
    { align: "right" }
  );
  y += 4;

  // Dashed divider line below TOTAL
  doc.setFont("courier", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text("------------------------------------------", 40, y, { align: "center" });
  y += 5;

  // E & O.E
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("E & O.E", colAmtX, y, { align: "right" });
  y += 6;

  // Footer Thank You Message
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Thank You", 40, y, { align: "center" });

  // Save Thermal PDF
  doc.save(`Receipt_${order._id || "Order"}.pdf`);
};
