import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Wishlist = () => {
  const { cartProductsData, CurrencySym, addToCart, navigate } = useContext(ShopContext);

  // We take a sample subset or saved products for Wishlist demo
  const wishlistItems = cartProductsData.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[var(--border-color)]/50">
        <h2 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          My Wishlist
        </h2>
        <p className="text-xs text-[var(--text-muted)]">Saved items you love and want to purchase later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <Card className="border-[var(--border-color)] text-center py-12">
          <CardContent className="space-y-3">
            <Heart className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
            <p className="text-base font-semibold text-[var(--text-main)]">Your wishlist is empty</p>
            <p className="text-xs text-[var(--text-muted)] font-normal">
              Browse products and click the heart icon to save items to your wishlist.
            </p>
            <Button onClick={() => navigate('/collection')} className="mt-2 text-xs">
              Explore Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => {
            const imgSrc = item.image?.[0] || item.images?.[0] || item.image || "";
            return (
              <Card
                key={item._id}
                className="border border-[var(--border-color)] hover:shadow-md transition-all group relative overflow-hidden"
              >
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div className="relative w-full h-48 bg-[var(--bg-subtle)] rounded-lg overflow-hidden flex items-center justify-center">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">No image</span>
                    )}
                    <span className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-rose-500 cursor-pointer hover:scale-110 transition">
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="font-semibold text-sm text-[var(--text-main)] truncate cursor-pointer hover:underline"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] capitalize">{item.category}</p>
                    <p className="text-base font-bold text-[var(--primary-accent)]">
                      {CurrencySym}{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]/40">
                    <Button
                      onClick={() => {
                        const defaultSize = item.sizes?.[0] || "M";
                        addToCart(item._id, defaultSize, imgSrc);
                      }}
                      size="sm"
                      className="w-full text-xs font-medium gap-1.5 bg-[var(--primary-accent)] text-white"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
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
