import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Inventory = ({ token }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Data states
  const [analytics, setAnalytics] = useState({ valuation: 0, totalItems: 0, totalProducts: 0, activeProducts: 0, outOfStockProducts: 0 });
  const [lowStock, setLowStock] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/inventory/analytics`, { headers: { token }});
      if (res.data.success) {
        setAnalytics({ 
          valuation: res.data.valuation, 
          totalItems: res.data.totalItems,
          totalProducts: res.data.totalProducts,
          activeProducts: res.data.activeProducts,
          outOfStockProducts: res.data.outOfStockProducts
        });
      }
    } catch (err) {
      toast.error('Failed to fetch analytics');
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/inventory/low-stock?threshold=10`, { headers: { token }});
      if (res.data.success) {
        setLowStock(res.data.lowStockItems);
      }
    } catch (err) {
      toast.error('Failed to fetch low stock');
    }
  };

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/inventory/ledger?limit=50`, { headers: { token }});
      if (res.data.success) {
        setLedger(res.data.ledger);
      }
    } catch (err) {
      toast.error('Failed to fetch ledger');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list-page?page=1&limit=100`);
      if (res.data.success) {
        setAllProducts(res.data.products);
      }
    } catch (err) {
      toast.error('Failed to fetch all products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'lowStock') fetchLowStock();
    if (activeTab === 'ledger') fetchLedger();
    if (activeTab === 'allProducts') fetchAllProducts();
  }, [activeTab, token]);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Inventory Management</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'analytics' ? 'border-b-2 border-orange-500 font-medium text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('analytics')}
        >Analytics</button>
        <button 
          className={`py-2 px-4 ${activeTab === 'lowStock' ? 'border-b-2 border-orange-500 font-medium text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('lowStock')}
        >Low Stock Alerts</button>
        <button 
          className={`py-2 px-4 ${activeTab === 'ledger' ? 'border-b-2 border-orange-500 font-medium text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ledger')}
        >Ledger / Audit Trail</button>
        <button 
          className={`py-2 px-4 ${activeTab === 'allProducts' ? 'border-b-2 border-orange-500 font-medium text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('allProducts')}
        >All Products</button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="text-lg font-medium text-orange-800 mb-2">Total Stock Valuation</h3>
              <p className="text-3xl font-bold text-orange-600">₹{analytics.valuation?.toLocaleString() || 0}</p>
              <p className="text-sm text-orange-700 mt-2">Cost basis of all inventory on hand.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Total Items in Stock</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalItems?.toLocaleString() || 0}</p>
              <p className="text-sm text-blue-700 mt-2">Total physical units currently available.</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Total Products</h3>
              <p className="text-3xl font-bold text-purple-600">{analytics.totalProducts?.toLocaleString() || 0}</p>
              <p className="text-sm text-purple-700 mt-2">Unique products in your catalog.</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-green-800 mb-2">Active Products</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.activeProducts?.toLocaleString() || 0}</p>
              <p className="text-sm text-green-700 mt-2">Products currently available for sale.</p>
            </div>
            <div className="p-6 bg-red-50 rounded-lg border border-red-100">
              <h3 className="text-lg font-medium text-red-800 mb-2">Out of Stock Products</h3>
              <p className="text-3xl font-bold text-red-600">{analytics.outOfStockProducts?.toLocaleString() || 0}</p>
              <p className="text-sm text-red-700 mt-2">Products with zero total quantity.</p>
            </div>
          </div>
        )}

        {/* Low Stock Tab */}
        {activeTab === 'lowStock' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Items Below Threshold (10 units)</h3>
            {lowStock.length === 0 ? (
              <p className="text-gray-500">No low stock items found. You're fully stocked!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Variant (Size)</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Remaining Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img src={item.image} alt="" className="w-10 h-10 object-cover rounded" />
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 font-medium">{item.variantSize}</td>
                        <td className="px-4 py-3">{item.sku || '-'}</td>
                        <td className="px-4 py-3 text-red-500 font-bold">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Ledger Tab */}
        {activeTab === 'ledger' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Stock Movement History</h3>
            {loading ? <p>Loading ledger...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Variant</th>
                      <th className="px-4 py-3">Change</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Ref ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(entry.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3">{entry.productId ? entry.productId.name : 'Unknown Product'}</td>
                        <td className="px-4 py-3 font-medium">{entry.variantSize}</td>
                        <td className={`px-4 py-3 font-bold ${entry.quantityChanged > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.quantityChanged > 0 ? '+' : ''}{entry.quantityChanged}
                        </td>
                        <td className="px-4 py-3">{entry.reason}</td>
                        <td className="px-4 py-3 text-xs">{entry.referenceId || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* All Products Tab */}
        {activeTab === 'allProducts' && (
          <div>
            <h3 className="text-lg font-medium mb-4">All Products & Stock Levels</h3>
            {loading ? <p>Loading products...</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Selling Price</th>
                      <th className="px-4 py-3">Variants (Size | SKU | Qty)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <img src={product.images?.[0]} alt="" className="w-10 h-10 object-cover rounded border" />
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </td>
                        <td className="px-4 py-3">{product.category} / {product.subcategory}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">₹{product.price}</td>
                        <td className="px-4 py-3">
                          {product.sizes && product.sizes.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {product.sizes.map((s, i) => (
                                <div key={i} className="text-xs bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-2 w-max">
                                  <span className="font-bold text-gray-700">{s.size || (typeof s === 'string' ? s : '-')}</span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-gray-600">{s.sku || 'No SKU'}</span>
                                  <span className="text-gray-400">|</span>
                                  <span className={`font-bold ${s.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>Qty: {s.quantity !== undefined ? s.quantity : 0}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No variants</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Inventory;
