import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CiCircleRemove } from "react-icons/ci";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const List = ({ token }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list-page?page=${currentPage}&limit=${itemsPerPage}`
      )
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products)
        setTotalPages(response.data.totalPages || 1)
        setTotalProducts(response.data.totalProducts || 0)
      } else {
        toast.error(response.data.message || 'Failed to fetch products.')
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { _id: id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Product removed.')
        fetchProducts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to remove product.')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, itemsPerPage])

  return (
    <div className="flex flex-col gap-4 w-full pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">All Products ({totalProducts})</h2>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-100 rounded-md text-sm font-semibold text-gray-600">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Quantity</span>
        <span>Price</span>
        <span className="text-center">Action</span>
      </div>

      {loading && (
        <p className="text-gray-600 text-lg font-medium text-center mt-10 py-4">
          Loading products…
        </p>
      )}

      {!loading && products.length === 0 && (
        <p className="text-gray-600 text-lg font-medium text-center mt-10 py-4">
          No products found.
        </p>
      )}

      {/* Product rows */}
      {!loading &&
        products.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img
              src={product.images?.[0] || ""}
              alt={product.name}
              className="w-16 h-16 object-cover rounded border border-gray-200"
            />
            <p className="font-medium text-gray-800 truncate">{product.name}</p>
            <p className="text-gray-500">{product.category}</p>
            <p className="font-medium text-gray-800 ">{product.quantity ? product.quantity : 0} Unit</p>
            <p className="font-semibold text-gray-800">₹ {product.price}</p>
            <div className="flex justify-center">
              <button
                onClick={() => removeProduct(product._id)}
                className="text-gray-600 hover:text-red-700 font-bold text-lg leading-none transition-colors"
                title="Remove product"
              >
                <CiCircleRemove className="w-7 h-7" />
              </button>
            </div>
          </div>
        ))}

      {/* Admin Server-side Pagination Bar */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-white font-medium focus:outline-none"
            >
              {[5, 10, 15, 20].map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
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
  )
}

export default List
