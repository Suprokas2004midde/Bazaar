import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Package, Lock, LogIn, XCircle, Loader2 } from "lucide-react";

const Orders = () => {
  const { backend, token, CurrencySym } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // Orders that are still in a pre-shipment state can be cancelled by the customer
  const isCancelable = (status) => !status || status === "Order Placed";

  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation();
    if (!orderId || cancelingId) return;
    try {
      setCancelingId(orderId);
      const response = await axios.post(
        `${backend}/api/order/cancel`,
        { orderId },
        { headers: { token } },
      );
      if (response.data.success) {
        setOrderData((prev) =>
          prev.map((o) =>
            (o._id ?? "") === orderId ? { ...o, status: "Cancelled" } : o,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancelingId(null);
    }
  };

  const fetchOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return null;
      }
      const response = await axios.post(
        `${backend}/api/order/userorder`,
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        const sorted = [...response.data.orders];
        setOrderData(sorted.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [token]);

  return (
    <div className="border-t border-[var(--border-color)]/40 pt-10 pb-16">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {loading ? (
        <div className="py-12 text-center text-[var(--text-muted)] text-sm">
          Loading orders...
        </div>
      ) : !token ? (
        <Card className="border-[var(--border-color)]">
          <CardContent className="p-12 text-center text-[var(--text-muted)] space-y-3">
            <Lock className="w-12 h-12 mx-auto text-[var(--primary-accent)]/70" />
            <p className="text-base font-semibold text-[var(--text-main)]">
              Please Log In
            </p>
            <p className="text-xs">
              You need to be logged in to view your order history.
            </p>
            <Button onClick={() => navigate("/login")} className="mt-2 gap-2">
              <LogIn className="w-4 h-4" /> Log In
            </Button>
          </CardContent>
        </Card>
      ) : orderData.length === 0 ? (
        <Card className="border-[var(--border-color)]">
          <CardContent className="p-12 text-center text-[var(--text-muted)] space-y-3">
            <Package className="w-12 h-12 mx-auto text-[var(--primary-accent)]/50" />
            <p className="text-base font-semibold text-[var(--text-main)]">
              No orders found
            </p>
            <p className="text-xs">
              Your past orders will appear here once you place a purchase.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="px-5 py-3.5 font-semibold">Product</th>
                  <th className="px-5 py-3.5 font-semibold">Price</th>
                  <th className="px-5 py-3.5 font-semibold">Payment</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((order, orderIndex) => {
                  //Fetching all details related one order...
                  const items = order.items ?? [];
                  const visibleItems = items.slice(0, 4);
                  const extraCount = items.length - 4;
                  const orderID = order._id || `order-${orderIndex}`;

                  return (
                    <React.Fragment key={order._id ?? orderIndex}>
                      {/* Order meta strip: order id + date, spans the full row */}
                      <tr className="bg-[var(--bg-subtle)]/50">
                        <td
                          colSpan={5}
                          className="px-5 py-2 text-xs text-[var(--text-muted)] border-t border-[var(--border-color)]"
                        >
                          <span className="font-medium text-[var(--text-main)]">
                            Order ID: {order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            Placed on{" "}
                            {new Date(order.date).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                      </tr>

                      <tr
                        className="border-b border-[var(--border-color)] hover:bg-[var(--bg-subtle)]/60 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/track/${orderID}`)}
                      >
                        {/* Product thumbnails */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {visibleItems.map((item, idx) => {
                              const imgSrc = item.images?.[0]
                                ? item.images[0]
                                : item.image || null;

                              return imgSrc ? (
                                <div
                                  key={idx}
                                  className="w-14 h-14 rounded-lg overflow-hidden border border-[var(--border-color)]/40 bg-white flex items-center justify-center shrink-0 p-1"
                                >
                                  <img
                                    src={imgSrc}
                                    alt={item.name ?? "Product"}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  />
                                </div>
                              ) : (
                                <div
                                  key={idx}
                                  className="w-14 h-14 rounded-lg border border-[var(--border-color)]/40 bg-[var(--bg-subtle)] flex items-center justify-center shrink-0"
                                >
                                  <span className="text-[10px] text-[var(--text-muted)]">
                                    No image
                                  </span>
                                </div>
                              );
                            })}
                            {extraCount > 0 && (
                              <div className="w-14 h-14 rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-subtle)] shrink-0 font-bold text-xs text-[var(--primary-accent)]">
                                +{extraCount}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-semibold text-[var(--text-main)] whitespace-nowrap">
                          {CurrencySym ?? "$"}
                          {order.amount ?? "—"}
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4 text-[var(--text-muted)] whitespace-nowrap">
                          {order.paymentMethod || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <Badge
                            variant="secondary"
                            className={`px-3 py-1 flex items-center gap-1.5 w-fit text-slate-900 ${
                              order.status === "Delivered"
                                ? "bg-emerald-200"
                                : order.status === "Shipped"
                                  ? "bg-indigo-300"
                                  : order.status === "Out for delivery"
                                    ? "bg-amber-300"
                                    : order.status === "Cancelled"
                                      ? "bg-rose-200"
                                      : "bg-orange-200"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-emerald-600"
                                  : order.status === "Shipped"
                                    ? "bg-indigo-600"
                                    : order.status === "Out for delivery"
                                      ? "bg-amber-600"
                                      : order.status === "Cancelled"
                                        ? "bg-rose-600"
                                        : "bg-orange-600"
                              }`}
                            />
                            <span className="font-bold text-xs text-slate-900">
                              {order.status || "Order Placed"}
                            </span>
                          </Badge>
                        </td>

                        {/* Action */}
                        <td
                          className="px-5 py-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isCancelable(order.status) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={cancelingId === orderID}
                              onClick={(e) => handleCancelOrder(e, orderID)}
                              className="rounded-full gap-1 text-rose-600 border-rose-300 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition duration-200"
                            >
                              {cancelingId === orderID ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              Cancel Order
                            </Button>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
