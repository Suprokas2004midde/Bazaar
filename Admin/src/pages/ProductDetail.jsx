import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ProductDetail = ({ token }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  // Image gallery state
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Restock modal state
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockSize, setRestockSize] = useState("");
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockReason, setRestockReason] = useState("Restock");
  const [isRestocking, setIsRestocking] = useState(false);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      // Fetch Product
      const prodRes = await axios.post(`${backendUrl}/api/product/single`, {
        _id: productId,
      });
      if (prodRes.data.success) {
        setProduct(prodRes.data.product);
      } else {
        toast.error("Failed to load product details");
      }

      // Fetch Stats
      const statRes = await axios.get(
        `${backendUrl}/api/product/admin-stats/${productId}`,
        { headers: { token } },
      );
      if (statRes.data.success) {
        setStats(statRes.data.stats);
      }
    } catch (err) {
      toast.error("Error loading product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockSize || !restockQuantity || isNaN(restockQuantity)) {
      return toast.error("Please provide valid size and quantity");
    }

    setIsRestocking(true);
    try {
      const payload = {
        productId,
        variantSize: restockSize,
        quantityChanged: Number(restockQuantity),
        reason: restockReason,
        notes: "Manual restock from Product Details page",
      };

      const res = await axios.post(
        `${backendUrl}/api/inventory/adjust`,
        payload,
        { headers: { token } },
      );
      if (res.data.success) {
        toast.success("Stock adjusted successfully");
        setShowRestockModal(false);
        setRestockQuantity("");
        fetchProductData(); // refresh data
      } else {
        toast.error(res.data.message || "Failed to restock");
      }
    } catch (error) {
      toast.error("Error during restocking");
    } finally {
      setIsRestocking(false);
    }
  };

  const handelDelete = async ()=>{
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`,{_id: productId},{headers: {token}});
      if(response.data.success){
        toast.success("Product Deleted Successfully");
        navigate(-1);
      }else{
        toast.error(response.data.message || "Failed Too Delete Product");
      }
    } catch (error) {
      toast.error("Error in Delete");
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Loading Product Details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Product not found.
      </div>
    );
  }

  const totalAvailableStock = product.sizes
    ? product.sizes.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
    : 0;
  const primarySKU = product.sizes?.find((s) => s.sku)?.sku || "-";
  const publishedDate = product.date
    ? new Date(product.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={() => navigate("/list")}
            className="text-sm text-gray-500 hover:text-gray-800 mb-2 flex items-center gap-1"
          >
            <IoIosArrowBack /> Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex gap-4 text-sm text-gray-500 mt-2 font-medium">
            <p>
              Category:{" "}
              <span className="text-gray-800">{product.category}</span>
            </p>
            <p>
              Published: <span className="text-gray-800">{publishedDate}</span>
            </p>
            <p>
              SKU: <span className="text-gray-800">{primarySKU}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Edit
          </button>
          <button
            onClick={()=> handelDelete()}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/5] border border-gray-200">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[mainImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}

            {/* Carousel Arrows (if multiple images) */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setMainImageIndex((prev) =>
                      prev === 0 ? product.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 transition"
                >
                  <IoIosArrowBack size={20} />
                </button>
                <button
                  onClick={() =>
                    setMainImageIndex((prev) =>
                      prev === product.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 transition"
                >
                  <IoIosArrowForward size={20} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 ${mainImageIndex === idx ? "border-gray-800" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Stats */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-400">💰</span> Price
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{product.price}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-400">📦</span> No. of Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-400">🛒</span> Available Stocks
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalAvailableStock}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-400">📈</span> Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description & Attributes */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description:
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="md:w-64 flex-shrink-0">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex border-b border-gray-200 bg-gray-50">
                    <div className="w-1/2 p-2 text-xs font-semibold text-gray-500">
                      Category
                    </div>
                    <div className="w-1/2 p-2 text-xs text-gray-900 font-medium bg-white">
                      {product.category}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200 bg-gray-50">
                    <div className="w-1/2 p-2 text-xs font-semibold text-gray-500">
                      Subcategory
                    </div>
                    <div className="w-1/2 p-2 text-xs text-gray-900 font-medium bg-white">
                      {product.subcategory || "-"}
                    </div>
                  </div>
                  <div className="flex bg-gray-50">
                    <div className="w-1/2 p-2 text-xs font-semibold text-gray-500">
                      Bestseller
                    </div>
                    <div className="w-1/2 p-2 text-xs text-gray-900 font-medium bg-white">
                      {product.bestseller ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes & Restock */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Variants (Sizes):
                </h3>
                <button
                  onClick={() => setShowRestockModal(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  + Add Stock
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {product.sizes &&
                  product.sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className={`border p-3 rounded-lg flex flex-col gap-1 min-w-[120px] ${s.quantity <= 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="text-sm font-bold text-gray-800 text-center">
                        {s.size || (typeof s === "string" ? s : "-")}
                      </div>
                      <div className="text-xs text-center text-gray-500">
                        {s.sku || "No SKU"}
                      </div>
                      <div
                        className={`text-sm text-center font-bold mt-1 ${s.quantity > 0 ? "text-green-600" : "text-red-500"}`}
                      >
                        {s.quantity !== undefined ? s.quantity : 0} in stock
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Reviews ({product.reviews?.length || 0})
            </h3>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800 text-sm">
                        {rev.name}
                      </span>
                      <span className="text-orange-500 text-xs font-bold">
                        ★ {rev.star}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{rev.reviewText}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(rev.time).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Restock Variant
              </h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleRestock} className="p-4 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Size / Variant
                </label>
                <select
                  required
                  value={restockSize}
                  onChange={(e) => setRestockSize(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="" disabled>
                    Select a size...
                  </option>
                  {product.sizes &&
                    product.sizes.map((s, idx) => {
                      const sizeStr =
                        s.size || (typeof s === "string" ? s : null);
                      if (!sizeStr) return null;
                      return (
                        <option key={idx} value={sizeStr}>
                          {sizeStr}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <select
                  required
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                  <option value="Restock">Restock</option>
                  <option value="Manual Adjustment">Manual Adjustment</option>
                  <option value="Return">Return</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRestocking}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-70"
                >
                  {isRestocking ? "Saving..." : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
