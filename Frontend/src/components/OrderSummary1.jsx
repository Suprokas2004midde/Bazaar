import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { downloadThermalReceipt } from "../utils/downloadReceipt";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Download,
  Printer,
  ChevronRight,
  ArrowLeft,
  Clock,
  Check,
  Building2,
  Copy,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";


export function OrderSummary1({
  order,
  currency = "₹",
  onContactSupport,
  onContinueShopping,
}) {
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const {navigate} = useContext(ShopContext);

  if (!order) return null;

  // Formatting date
  const orderDate = order.date
    ? new Date(order.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "December 14, 2024";
  
  // Date As an Object
  const deliveryDate = order.date ? new Date(order.date) : new Date();
  deliveryDate.setDate(deliveryDate.getDate()+2);

  //Date As an String
  const deliveryDateText = deliveryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Address helper
  const addr = order.address || {};

  const customerName =
    addr.firstName || addr.lastName
      ? `${addr.firstName || ""} ${addr.lastName || ""}`.trim()
      : "Alex Johnson";

  const street = addr.street || "1234 Maple Street, Apt 5B";

  const cityStateZip = `${addr.city || "San Francisco"}, ${
    addr.state || "CA"
  } ${addr.zipcode || "94102"}`;

  const country = addr.country || "United States";

  // Calculations
  const items = order.items || [];
  const subtotal = items.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );
  const deliveryFee = order.deliveryFee;
  const tax = order.tax !== undefined ? order.tax : 0;
  const discount = order.discount;
  const totalPaid = (subtotal + deliveryFee + tax - discount);

  // Order status stages for timeline
  const statuses = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];
  const currentStatus = order.status || "Order Placed";
  //This index is later used to highlight completed steps
  const currentStatusIndex = Math.max(
    0,
    statuses.findIndex((s) => s.toLowerCase() === currentStatus.toLowerCase()),
  );

  // Download Thermal PDF Receipt helper
  const handleDownloadReceipt = () => {
    downloadThermalReceipt({
      order,
      currency,
      orderDate,
      customerName,
      addr,
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalPaid,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyOrderNumber = (e) => {
    e.stopPropagation();
    const orderNum = `ORD-${order._id ? order._id.toUpperCase() : "Not Found"}`;
    navigator.clipboard.writeText(orderNum);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000); //set to false after 3 Sec...
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6 px-2 sm:px-4 text-[var(--text-main)] print:py-0 print:px-0">
      {/* Top Banner / Header */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
          A confirmation email has been sent to{" "}
          <span className="font-semibold text-[var(--text-main)]">
            {addr.email || "customer@example.com"}
          </span>
        </p>
      </div>

      {/* Order Info Bar */}
      <Card
        className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm overflow-hidden cursor-pointer"
        onClick={() => setShowTimelineModal(true)}
      >
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 gap-6 sm:gap-12">
            <div>
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider block mb-1">
                Order Number 
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-mono text-[var(--text-main)] break-all">
                  ORD-
                  {order._id ? order._id.slice(-8).toUpperCase() : "Not Found"}
                </span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors focus:outline-none"
                  title="Copy Order Number"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider block mb-1">
                Order Date
              </span>
              <span className="text-sm sm:text-base font-semibold text-[var(--text-main)]">
                {orderDate}
              </span>
            </div>
          </div>

          <div className="self-end sm:self-center">
            <Badge
              variant="secondary"
              className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-800/40 text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {currentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Items & Summary) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items Ordered Card */}
          <Card className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]/60">
                <Package className="w-5 h-5 text-[var(--primary-accent)]" />
                <h2 className="font-semibold text-base sm:text-lg">
                  Items Ordered
                </h2>
              </div>

              <div className="divide-y divide-[var(--border-color)]/40">
                {items.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] py-4">
                    No items in this order.
                  </p>
                ) : (
                  items.map((item, idx) => {
                    const imgSrc =
                      Array.isArray(item.images) && item.images[0]
                        ? item.images[0]
                        : Array.isArray(item.image)
                          ? item.image[0]
                          : item.image || item.imgSrc || null;

                    const itemPrice = Number(item.price) || 0;
                    const itemQty = Number(item.quantity) || 1;
                    const itemTotal = itemPrice * itemQty;

                    return (
                      <div
                        key={idx}
                        className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          {imgSrc ? (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-subtle)] overflow-hidden shrink-0 flex items-center justify-center p-1">
                              <img
                                src={imgSrc}
                                alt={item.name || "Product"}
                                className="w-full h-full object-contain hover:scale-105 transition-transform"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-subtle)] shrink-0 flex items-center justify-center text-xs text-[var(--text-muted)]">
                              <Package className="w-6 h-6 opacity-40" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3
                              className="font-semibold text-sm sm:text-base text-[var(--text-main)] truncate hover:text-blue-500 cursor-pointer transition duration-200"
                              onClick={() => navigate(`/product/${item._id}`)}
                            >
                              {item.name || "Product Item"}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {item.size ? `${item.size} · ` : ""}
                              {item.color ? `${item.color} · ` : ""}
                              Qty: {itemQty}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm sm:text-base text-[var(--text-main)]">
                            {currency}
                            {itemTotal.toFixed(2)}
                          </p>
                          {itemQty > 1 && (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              {currency}
                              {itemPrice.toFixed(2)} each
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Breakdown Card */}
          <Card className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="font-semibold text-[var(--text-main)]">
                  {currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Shipping</span>
                <span className="font-semibold text-[var(--text-main)]">
                  {currency}
                  {deliveryFee.toFixed(2)}
                </span>
              </div>

              {tax > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Tax</span>
                  <span className="font-semibold text-[var(--text-main)]">
                    {currency}
                    {tax.toFixed(2)}
                  </span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-500 font-medium">Discount</span>
                  <span className="font-semibold text-emerald-500">
                    -{currency}
                    {discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between">
                <span className="text-base font-bold text-[var(--text-main)]">
                  Total Paid
                </span>
                <span className="text-xl font-extrabold text-[var(--text-main)]">
                  {currency}
                  {totalPaid.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Shipping, Payment & Actions) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card */}
          <Card className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]/60">
                <MapPin className="w-5 h-5 text-[var(--primary-accent)]" />
                <h2 className="font-semibold text-base sm:text-lg">
                  Shipping Address
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-[var(--text-muted)] space-y-1">
                <p className="font-semibold text-sm text-[var(--text-main)]">
                  {customerName}
                </p>
                <p>{street}</p>
                <p>{cityStateZip}</p>
                <p>{country}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)]/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-color)]/60 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-[var(--primary-accent)]" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[var(--text-main)] block">
                    Express Shipping
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {`Estimated delivery: ${deliveryDateText}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]/60">
                <CreditCard className="w-5 h-5 text-[var(--primary-accent)]" />
                <h2 className="font-semibold text-base sm:text-lg">
                  Payment Method
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 font-extrabold text-xs tracking-wider uppercase">
                  {order.paymentMethod || "VISA"}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-[var(--text-main)]">
                    {order.paymentMethod
                      ? `${order.paymentMethod.toUpperCase()} Payment`
                      : "Visa ending in 4242"}
                  </p>
                  <p className="text-[var(--text-muted)]">
                    {order.payment ? "Payment completed" : "Payment Pending"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Block */}
          <Card className="border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm print:hidden">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <Button
                variant="default"
                className="w-full justify-center gap-2 font-semibold shadow"
                onClick={() => setShowTimelineModal(true)}
              >
                <Package className="w-4 h-4" />
                Track Order
              </Button>

              <Button
                variant="outline"
                className="w-full justify-center gap-2 font-semibold"
                onClick={handleDownloadReceipt}
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-center gap-2 font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4" />
                Print Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tracking Timeline Modal / Section */}
      {showTimelineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-lg">Live Order Tracking</h3>
              </div>
              <button
                onClick={() => setShowTimelineModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] font-mono">
              ORDER ID: ORD-
              {order._id ? order._id.toUpperCase() : "No_OrderID"}
            </p>

            {/* Stepper Steps */}
            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-color)]">
              {statuses.map((stepName, stepIdx) => {
                //Track how many have completed till current status.
                const isPassed = stepIdx <= currentStatusIndex;
                //Track the current status/index
                const isCurrent = stepIdx === currentStatusIndex;

                return (
                  <div
                    key={stepIdx}
                    className="flex items-start gap-4 relative z-10"
                  >
                    <div
                      className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                          : "bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]"
                      } ${isCurrent ? "ring-4 ring-emerald-500/40 scale-110" : ""}`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" /> // Shows the Right Mark
                      ) : (
                        stepIdx + 1 // Shows the number how many left
                      )}
                    </div>

                    <div className="pt-0.5">
                      <h4
                        className={`text-sm font-semibold ${
                          isPassed
                            ? "text-[var(--text-main)]"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {stepName}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {isCurrent
                          ? deliveryDate.getTime() > Date.now() //both fetching date as an object...
                            ? "Current status - Package is moving as scheduled."
                            : "Your shipment is taking longer than expected. We apologize for the delay."
                          : isPassed
                            ? "Completed"
                            : "Pending next step"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => setShowTimelineModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Questions & Action Footer */}
      <div className="text-center pt-8 border-t border-[var(--border-color)]/60 space-y-4 print:hidden">
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Have a question about your order?
        </p>

        <div className="flex items-center justify-center gap-3">
          {onContactSupport ? (
            <Button variant="outline" size="sm" onClick={onContactSupport}>
              Contact Support
            </Button>
          ) : (
            <Link to="/contact">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
          )}

          {onContinueShopping ? (
            <Button variant="default" size="sm" onClick={onContinueShopping}>
              Continue Shopping
            </Button>
          ) : (
            <Link to="/collection">
              <Button variant="default" size="sm">
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary1;
