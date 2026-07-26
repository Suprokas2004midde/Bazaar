import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ShopContext } from "../context/ShopContext";
import OrderSummary1 from "../components/OrderSummary1";
import axios from "axios";
import { ArrowLeft, Loader2, PackageX } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";


const OrderDetails = () => {
  const { orderID, id } = useParams();
  const activeID = orderID || id;
  const { backend, token, navigate, CurrencySym } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, seterrors] = useState("");

  const fetchOrderDetails = async () => {
    // Fallback to sample order if unauthenticated or viewing demo
    if (!token) {
      setOrder(null);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${backend}/api/order/single`,
        { orderId: activeID },
        { headers: { token } }
      );
      if (response.data.success) {
        if (response.data.order) {
          setOrder(response.data.order);
        }
      } else {
        setOrder(null);
      }
    } catch (error) {
      setOrder(null);
      const errorMsg = error.response?.data?.message || error.message;
      seterrors(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [activeID, token]);


  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
        <p className="text-sm text-[var(--text-muted)]">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]">
          <PackageX className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-sm">
          We couldn't find an order matching ID:{" "}
          <span className="font-mono font-semibold">{activeID}</span>
        </p>
        {errors && <p className="text-2xl text-red-500 max-w-sm">{errors}</p>}
        <Link to="/orders">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to My Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--border-color)]/40 pt-6 pb-16">
      {/* Back button */}
      <div className="max-w-5xl mx-auto mb-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Button>
      </div>

      <OrderSummary1
        order={order}
        currency={CurrencySym || "₹"}
        onContactSupport={() => navigate("/contact")}
        onContinueShopping={() => navigate("/collection")}
      />
    </div>
  );
};

export default OrderDetails;
