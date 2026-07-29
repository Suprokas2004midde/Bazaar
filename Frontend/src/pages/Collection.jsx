import React, { useContext, useEffect, useState } from "react";
import { ChevronRight, Filter, Loader2 } from "lucide-react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import Pagination from "../components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const { backend, search, showSearch } =
    useContext(ShopContext);

  const [productsList, setProductsList] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");

  // Server-side Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch paginated products from server
  const fetchPaginatedProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      if (category.length > 0) {
        params.append("category", category.join(","));
      }
      if (subCategory.length > 0) {
        params.append("subcategory", subCategory.join(","));
      }

      if (showSearch && search) {
        params.append("search", search);
      }
      const response = await axios.get(`${backend}/api/product/list-page?${params.toString()}`);
      if (response.data.success) {
        setProductsList(response.data.products);
        setTotalPages(response.data.totalPages || 1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Sort local products when sortType changes
  const applySort = () => {
    let copy = productsList.slice();
    switch (sortType) {
      case "low-high":
        setDisplayedProducts(copy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setDisplayedProducts(copy.sort((a, b) => b.price - a.price));
        break;
      default:
        setDisplayedProducts(copy);
        break;
    }
  };

  const toggleCategory = (event) => {
    const val = event.target.value;
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  const toggleSubCategory = (event) => {
    const val = event.target.value;
    setSubCategory((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchPaginatedProducts();
  }, [currentPage, itemsPerPage, category, subCategory, search, showSearch]);

  useEffect(() => {
    applySort();
  }, [sortType, productsList]);

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-8 pb-12 border-t border-[var(--border-color)]/40">
      {/* Filter Sidebar */}
      <div className="min-w-64 space-y-4">
        <button 
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center justify-between w-full text-lg font-bold text-[var(--text-main)] cursor-pointer sm:cursor-default"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[var(--primary-accent)]" /> FILTERS
          </span>
          <ChevronRight
            className={`w-5 h-5 sm:hidden transition-transform duration-200 ${
              showFilter ? "rotate-90" : ""
            }`}
          />
        </button>

        <div className={`space-y-4 ${showFilter ? "block" : "hidden sm:block"}`}>
          {/* Categories */}
          <Card className="border-[var(--border-color)]">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2 text-sm text-[var(--text-main)] font-medium">
              {["Men", "Women", "Kids", "Headphone", "Laptop", "Camera", "Accessories"].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-[var(--primary-accent)] transition-colors">
                  <input
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                    className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-accent)] focus:ring-[var(--primary-accent)] accent-[var(--primary-accent)] cursor-pointer"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* SubCategory Type */}
          <Card className="border-[var(--border-color)]">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2 text-sm text-[var(--text-main)] font-medium">
              {["Topwear", "Bottomwear", "Winterwear", "Footwear"].map((sub) => (
                <label key={sub} className="flex items-center gap-3 cursor-pointer hover:text-[var(--primary-accent)] transition-colors">
                  <input
                    type="checkbox"
                    value={sub}
                    onChange={toggleSubCategory}
                    checked={subCategory.includes(sub)}
                    className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-accent)] focus:ring-[var(--primary-accent)] accent-[var(--primary-accent)] cursor-pointer"
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Display Area */}
      <div className="flex-1 space-y-6 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="h-10 px-3 py-1 bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)] rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
          >
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Price (Low to High)</option>
            <option value="high-low">Sort by: Price (High to Low)</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
            <p className="text-[var(--text-muted)] text-sm animate-pulse">Loading products from server...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 flex-1">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-[var(--text-muted)] space-y-2">
                  <p className="text-lg font-semibold">No products match your filter.</p>
                  <p className="text-xs">Try selecting different categories or clear your search.</p>
                </div>
              ) : (
                displayedProducts.map((item, index) => (
                  <ProductItem item={item} key={item._id || index} />
                ))
              )}
            </div>

            {/* Pagination Control */}
            {displayedProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(newLimit) => {
                  setItemsPerPage(newLimit);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
