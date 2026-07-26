import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, Lock, LogIn } from "lucide-react";

const Orders = () => {
  const { backend, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return null;
      }
      const response = await axios.post(
        `${backend}/api/order/userorder`,
        {},
        { headers: { token } }
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

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-[var(--text-muted)] text-sm">
            Loading orders...
          </div>
        ) : !token ? (
          <Card className="border-[var(--border-color)]">
            <CardContent className="p-12 text-center text-[var(--text-muted)] space-y-3">
              <Lock className="w-12 h-12 mx-auto text-[var(--primary-accent)]/70" />
              <p className="text-base font-semibold text-[var(--text-main)]">Please Log In</p>
              <p className="text-xs">You need to be logged in to view your order history.</p>
              <Button onClick={() => navigate('/login')} className="mt-2 gap-2">
                <LogIn className="w-4 h-4" /> Log In
              </Button>
            </CardContent>
          </Card>
        ) : orderData.length === 0 ? (
          <Card className="border-[var(--border-color)]">
            <CardContent className="p-12 text-center text-[var(--text-muted)] space-y-3">
              <Package className="w-12 h-12 mx-auto text-[var(--primary-accent)]/50" />
              <p className="text-base font-semibold text-[var(--text-main)]">No orders found</p>
              <p className="text-xs">Your past orders will appear here once you place a purchase.</p>
            </CardContent>
          </Card>
        ) : (
          orderData.map((order, orderIndex) => {
            //Fetching all details related one order...
            const items = order.items ?? [];
            const visibleItems = items.slice(0, 4);
            const extraCount = items.length - 4;
            const orderID = order._id || `order-${orderIndex}`;

            return (
              <Card
                key={order._id ?? orderIndex}
                className="hover:border-[var(--primary-accent)]/60 transition-all cursor-pointer group"
                onClick={() => navigate(`/track/${orderID}`)}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Thumbnails */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {visibleItems.map((item, idx) => {
                      const imgSrc = item.images[0]
                        ? item.images[0]
                        : item.image || null;

                      return imgSrc ? (
                        <div
                          key={idx}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[var(--border-color)]/40 bg-[var(--bg-subtle)] flex items-center justify-center shrink-0 p-1"
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
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-[var(--border-color)]/40 bg-[var(--bg-subtle)] flex items-center justify-center shrink-0"
                        >
                          <span className="text-xs text-[var(--text-muted)]">
                            No image
                          </span>
                        </div>
                      );
                    })}
                    {/*If extra count available then only it will showTimelineModal...*/}
                    {extraCount > 0 && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-subtle)] shrink-0 font-bold text-sm text-[var(--primary-accent)]">
                        +{extraCount}
                      </div>
                    )}
                  </div>

                  {/* Order Meta & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 sm:ml-auto">
                    <div className="text-xs sm:text-sm text-[var(--text-muted)] space-y-0.5">
                      <span className="font-semibold text-[var(--text-main)] block">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <p>
                        {items.length} item{items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="secondary"
                      className={`px-3 py-1 flex items-center gap-1.5 w-fit text-slate-900 ${
                        order.status === "Delivered"
                          ? "bg-emerald-200"
                          : order.status === "Shipped"
                            ? "bg-indigo-300"
                            : order.status === "Out for delivery"
                              ? "bg-amber-300"
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
                                : "bg-orange-600"
                        }`}
                      />
                      <span className="font-bold text-xs text-slate-900">
                        {order.status || "Order Placed"}
                      </span>
                    </Badge>

                    {/* Track Button */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link to={`/track/${orderID}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1 text-slate-900 bg-gray-200 hover:bg-gray-300 transition duration-200 "
                        >
                          Track Order
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
