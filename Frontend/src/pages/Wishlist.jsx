import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Heart, ShoppingBag, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import axios from "axios";

const Wishlist = () => {
  const {
    wishlist,
    toggleWishlist,
    clearWishlist,
    addToCart,
    navigate,
    CurrencySym,
    backend,
    token,
  } = useContext(ShopContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch full product details for items in the wishlist
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(`${backend}/api/product/bulk`, { ids: wishlist });
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.log("Failed to fetch wishlist products:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlist, backend]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[var(--border-color)]/50 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            My Wishlist
            {products.length > 0 && (
              <span className="ml-1 text-base font-normal text-[var(--text-muted)]">
                ({products.length} {products.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Items you love — saved for later
          </p>
        </div>
        {products.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-rose-500 border-rose-300 hover:bg-rose-50 hover:border-rose-400 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <Card className="border-[var(--border-color)] text-center py-16">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-rose-400" />
            </div>
            <p className="text-lg font-bold text-[var(--text-main)]">Your wishlist is empty</p>
            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
              Browse products and click the heart icon to save items you love.
            </p>
            <Button onClick={() => navigate("/collection")} className="mt-2 gap-2">
              <ShoppingBag className="w-4 h-4" /> Explore Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((item) => {
            const imgSrc = item.images?.[0] || item.image?.[0] || item.image || "";
            return (
              <Card
                key={item._id}
                className="border border-[var(--border-color)] hover:shadow-lg transition-all duration-200 group relative overflow-hidden bg-[var(--bg-card)]"
              >
                {/* Remove from wishlist (top-right heart) */}
                <button
                  onClick={() => toggleWishlist(item._id, imgSrc)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-110 transition-transform shadow-sm"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </button>

                <CardContent className="p-4 flex flex-col gap-3">
                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="relative w-full h-48 bg-[var(--bg-subtle)] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">No image</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-muted)] capitalize font-medium">
                      {item.category}
                    </p>
                    <h3
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="font-semibold text-sm text-[var(--text-main)] truncate cursor-pointer hover:text-[var(--primary-accent)] transition-colors"
                    >
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-[var(--primary-accent)]">
                      {CurrencySym}{item.price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]/40">
                    <Button
                      onClick={() => {
                        const defaultSize = item.sizes?.[0] || "M";
                        addToCart(item._id, defaultSize, imgSrc);
                      }}
                      size="sm"
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
