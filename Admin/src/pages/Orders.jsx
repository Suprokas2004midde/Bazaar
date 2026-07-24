import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const ORDER_STATUSES = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered',
]

const statusColor = {
  'Order Placed':    'bg-yellow-100 text-yellow-700',
  'Packing':         'bg-blue-100 text-blue-700',
  'Shipped':         'bg-indigo-100 text-indigo-700',
  'Out for delivery':'bg-orange-100 text-orange-700',
  'Delivered':       'bg-green-100 text-green-700',
}

const Orders = ({ token }) => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.slice().reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      // Gracefully handle if orders endpoint not yet implemented
      if (error?.response?.status !== 404) {
        toast.error('Failed to fetch orders.')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Status updated.')
        fetchOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to update status.')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [token])

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Orders</h2>

      {loading && <p className="text-gray-500 text-sm py-4">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500 text-sm py-4">No orders yet.</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="grid grid-cols-1 md:grid-cols-[0.5fr_3fr_1fr_.5fr_1fr] gap-4 items-start
                     border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          {/* Parcel Icon */}
          <div className="flex items-center justify-center">
            <img
              src={assets.parcel_icon}
              alt="parcel"
              className="w-12 h-12 opacity-70"
            />
          </div>

          {/* Order Details */}
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            {order.items?.map((item, idx) => (
              <p key={idx} className="font-medium">
                {item.name} &times; {item.quantity}
                <span className="text-gray-400 ml-1 font-normal">
                  ({item.size})
                </span>
              </p>
            ))}
            <hr className="my-1 border-gray-200" />
            <p className="font-semibold text-gray-800">
              {order.address?.firstName} {order.address?.lastName}
            </p>
            <p className="text-gray-500 text-xs">
              {order.address?.street}, {order.address?.city},{" "}
              {order.address?.state} – {order.address?.zipcode}
            </p>
            <p className="text-gray-500 text-xs">{order.address?.country}</p>
            <p className="text-gray-500 text-xs">📞 {order.address?.phone}</p>
          </div>

          {/* Items & Payment */}
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <p>
              Items:{" "}
              <span className="font-medium text-gray-800">
                {order.items?.length}
              </span>
            </p>
            <p>
              Method:{" "}
              <span className="font-medium text-gray-800">
                {order.paymentMethod}
              </span>
            </p>
            <p>
              Payment:{" "}
              <span
                className={`font-medium ${order.payment ? "text-green-600" : "text-red-500"}`}
              >
                {order.payment ? "Done" : "Pending"}
              </span>
            </p>
            <p>
              Date:{" "}
              <span className="font-medium text-gray-800">
                {order.date ? new Date(order.date).toLocaleDateString() : "—"}
              </span>
            </p>
          </div>

          {/* Amount */}
          <div className="text-sm font-bold text-gray-900 flex items-center">
            ₹{order.amount}
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={order.status || "Order Placed"}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className={`border rounded-md px-2 py-1.5 text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-black cursor-pointer
                         ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}
                         border-transparent`}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders
