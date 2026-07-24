import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

const Orders = () => {
  const { backend, token, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const fetchOrderData = async () => {
    try {
      if (!token) return null;
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
        {orderData.length === 0 ? (
          <Card className="border-[var(--border-color)]">
            <CardContent className="p-12 text-center text-[var(--text-muted)] space-y-3">
              <Package className="w-12 h-12 mx-auto text-[var(--primary-accent)]/50" />
              <p className="text-base font-semibold text-[var(--text-main)]">No orders found</p>
              <p className="text-xs">Your past orders will appear here once you place a purchase.</p>
            </CardContent>
          </Card>
        ) : (
          orderData.map((order, orderIndex) => {
            const items = order.items ?? [];
            const visibleItems = items.slice(0, 4);
            const extraCount = items.length - 4;

            return (
              <Card
                key={order._id ?? orderIndex}
                className="hover:border-[var(--primary-accent)]/60 transition-all"
              >
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Thumbnails */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {visibleItems.map((item, idx) => {
                      const imgSrc = item.images?.[0] ?? null;

                      return imgSrc ? (
                        <div
                          key={idx}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-[var(--border-color)]/40 bg-[var(--bg-subtle)] flex items-center justify-center shrink-0 p-1"
                        >
                          <img
                            src={imgSrc}
                            alt={item.name ?? "Product"}
                            className="w-full h-full object-contain"
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
                      className="px-3 py-1 flex items-center gap-1.5 w-fit"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-emerald-500"
                            : order.status === "Shipped"
                              ? "bg-indigo-500"
                              : order.status === "Out for delivery"
                                ? "bg-amber-500"
                                : "bg-[var(--primary-accent)]"
                        }`}
                      />
                      <span className="font-bold text-xs">{order.status}</span>
                    </Badge>

                    {/* Track Button */}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={()=> navigate(`/track/${id}`)} 
                      >
                        Track Order
                      </Button>
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
