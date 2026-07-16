import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backend, token } = useContext(ShopContext);
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
        // newest orders first
        console.log(response.data.orders);
        const sorted = [...response.data.orders];
        setOrderData(sorted.reverse());
      }

    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(()=>{
    fetchOrderData();
  },[token]);

  return (
    <div className="border-t pt-16 pb-16 px-4 sm:px-8">
      {/* Page title */}
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Order list */}
      <div className="flex flex-col gap-4">
        {orderData.length === 0 ? (
          <p className="text-gray-400 text-center py-20 text-sm">
            No orders found.
          </p>
        ) : (
          orderData.map((order, orderIndex) => {
            const items = order.items ?? []; 
            const visibleItems = items.slice(0, 4); //Only for images
            const extraCount = items.length - 4;

            return (
              <div
                key={order._id ?? orderIndex}
                className="border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* ── Left: thumbnails ── */}
                <div className="flex items-center gap-2 flex-wrap">
                  {visibleItems.map((item, idx) => {
                    // items are stored flat: item.images[] is the array (plural)
                    const imgSrc = item.images?.[0] ?? null;

                    return imgSrc ? (
                      <div
                        key={idx}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50"
                      >
                        <img
                          src={imgSrc}
                          alt={item.name ?? "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      /* fallback placeholder if no image */
                      <div
                        key={idx}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-xs text-gray-400">No img</span>
                      </div>
                    );
                  })}

                  {/* Overflow box – dotted border with +N */}
                  {extraCount > 0 && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-gray-300 flex-shrink-0 flex items-center justify-center bg-gray-50">
                      <span className="text-gray-500 font-semibold text-sm sm:text-base">
                        +{extraCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Right: order meta + status ── */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 sm:ml-auto flex-shrink-0">
                  {/* Date */}
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <p className="text-xs mt-0.5">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        order.status === "Delivered"
                          ? "bg-green-500"
                          : order.status === "Cancelled"
                          ? "bg-red-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {order.status}
                    </span>
                  </div>

                  {/* Track button */}
                  <button className="border border-gray-300 px-5 py-2 text-sm font-medium rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150 whitespace-nowrap">
                    Track Order
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
