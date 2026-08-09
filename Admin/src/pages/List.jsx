import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState({ totalProducts: 0, outOfStockProducts: 0, totalItems: 0, activeProducts: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/inventory/analytics`, { headers: { token } });
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.log('Failed to fetch analytics', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list-page?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages || 1);
        setTotalProducts(response.data.totalProducts || 0);
      } else {
        toast.error(response.data.message || 'Failed to fetch products.');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus, e) => {
    e.stopPropagation(); // Prevent navigating to detail page
    const newStatus = currentStatus === 'Active' ? 'Closed For Sale' : 'Active';
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/status`,
        { productId: id, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(`Status changed to ${newStatus}`);
        fetchProducts();
        fetchAnalytics();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to change status.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, [currentPage, itemsPerPage]);

  const calculateTotalStock = (sizes) => {
    if (!sizes || sizes.length === 0) return 0;
    return sizes.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  };

  const getPrimarySKU = (sizes) => {
    if (!sizes || sizes.length === 0) return '-';
    const variant = sizes.find(s => s.sku);
    return variant ? variant.sku : '-';
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return '0.0';
    const total = reviews.reduce((acc, curr) => acc + curr.star, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getStatusBadge = (product) => {
    if (product.status === 'Closed For Sale') {
      return (
        <button onClick={(e) => toggleStatus(product._id, product.status, e)} className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          Closed For Sale
        </button>
      );
    }
    const totalQty = calculateTotalStock(product.sizes);
    if (totalQty <= 0) {
      return (
        <button onClick={(e) => toggleStatus(product._id, product.status, e)} className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
          Out Of Stock
        </button>
      );
    }
    return (
      <button onClick={(e) => toggleStatus(product._id, product.status, e)} className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
        Active
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* Top Stat Cards matching the mockup */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="text-gray-500 text-sm font-medium flex justify-between">Total Products <span className="text-green-500 bg-green-50 px-1 rounded text-xs">+100%</span></div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalProducts || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="text-gray-500 text-sm font-medium flex justify-between">Total Stock Units <span className="text-green-500 bg-green-50 px-1 rounded text-xs">+10%</span></div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalItems || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="text-gray-500 text-sm font-medium flex justify-between">Out of Stock <span className="text-red-500 bg-red-50 px-1 rounded text-xs">Alert</span></div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.outOfStockProducts || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="text-gray-500 text-sm font-medium flex justify-between">Active Products <span className="text-green-500 bg-green-50 px-1 rounded text-xs">Live</span></div>
          <div className="text-3xl font-bold text-gray-800 mt-2">{analytics.activeProducts || 0}</div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[auto_3fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
          <div className="w-5 flex justify-center"><input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-gray-300" disabled /></div>
          <span>Product Name</span>
          <span>Price</span>
          <span>Category</span>
          <span>Stock</span>
          <span>SKU</span>
          <span>Rating</span>
          <span>Status</span>
          <span className="text-center w-8"></span>
        </div>

        {loading && (
          <p className="text-gray-600 text-sm font-medium text-center py-10">Loading products…</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-gray-600 text-sm font-medium text-center py-10">No products found.</p>
        )}

        {/* Product Rows */}
        {!loading && products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="grid grid-cols-[auto_3fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer text-sm text-gray-700"
          >
            <div className="w-5 flex justify-center" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500 border-gray-300 cursor-pointer" />
            </div>
            
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={product.images?.[0] || ""} alt="" className="w-10 h-10 object-cover rounded bg-gray-100 flex-shrink-0" />
              <p className="font-medium text-gray-900 truncate" title={product.name}>{product.name}</p>
            </div>
            
            <p className="font-medium">₹{product.price}</p>
            <p className="truncate">{product.category}</p>
            <p className="font-medium">{calculateTotalStock(product.sizes)}</p>
            <p className="truncate text-gray-500">{getPrimarySKU(product.sizes)}</p>
            
            <div className="flex items-center gap-1 text-orange-500 font-medium">
              ★ {getAverageRating(product.reviews)}
            </div>
            
            <div>
              {getStatusBadge(product)}
            </div>

            <div className="w-8 flex justify-center text-gray-400 hover:text-gray-700 font-bold">
              ...
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white font-medium focus:outline-none"
            >
              {[10, 25, 50].map((opt) => (
                <option key={opt} value={opt}>{opt} / page</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100 font-medium cursor-pointer"
            >
              Prev
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100 font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
