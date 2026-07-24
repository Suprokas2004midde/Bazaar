import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Minus, Plus } from "lucide-react";

const ShowCartItems = ({ cartData }) => {
  const { CurrencySym, cartProductsData, updateCart, navigate } =
    useContext(ShopContext);

  return (
    <div className="space-y-4">
      {cartData.map((item, index) => {
        const productData = cartProductsData.find(
          (product) => product._id === item._id
        );

        if (!productData) return null;

        const originalPrice = productData.originalPrice || Math.round(productData.price * 1.25);

        return (
          <div
            key={index}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-stretch"
          >
            {/* Product Image */}
            <div
              onClick={() => navigate(`/product/${item._id}`)}
              className="w-full sm:w-36 h-36 bg-[var(--bg-subtle)] rounded-xl p-3 flex items-center justify-center shrink-0 border border-[var(--border-color)]/40 cursor-pointer overflow-hidden group"
            >
              <img
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                src={productData.images?.[0]}
                alt={productData.name}
              />
            </div>

            {/* Product Details & Controls */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="text-base sm:text-lg font-bold cursor-pointer text-[var(--text-main)] hover:text-[var(--primary-accent)] transition-colors line-clamp-1"
                >
                  {productData.name}
                </h3>

                {/* Description snippet */}
                <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 mt-1 mb-2.5 leading-relaxed">
                  {productData.description ||
                    "High quality premium product crafted for everyday performance and long-lasting durability."}
                </p>

                {/* Specs / Metadata */}
                <div className="text-xs text-[var(--text-muted)] font-medium mb-3 flex items-center gap-2">
                  {item.size && item.size !== "ONE_SIZE" && (
                    <span>
                      Size: <span className="font-semibold text-[var(--text-main)]">{item.size}</span>
                    </span>
                  )}
                  {item.size && item.size !== "ONE_SIZE" && (
                    <span className="text-[var(--border-color)]">|</span>
                  )}
                  <span>
                    Color: <span className="font-semibold text-[var(--text-main)]">{productData.color || "Red"}</span>
                  </span>
                </div>
              </div>

              {/* Bottom row: Price & Quantity Controls */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]/30 gap-4 flex-wrap">
                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs sm:text-sm line-through text-[var(--text-muted)] font-medium">
                    {CurrencySym}{originalPrice}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-[var(--text-main)]">
                    {CurrencySym}{productData.price}
                  </span>
                </div>

                {/* Action Controls Pill: [ Trash | - | Qty | + ] */}
                <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => updateCart(item._id, item.size, 0)}
                    className="p-2 sm:p-2.5 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors border-r border-[var(--border-color)]/60 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCart(item._id, item.size, item.quantity - 1)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm font-semibold hover:bg-[var(--secondary-accent)]/20 transition-colors cursor-pointer text-[var(--text-main)]"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-bold text-[var(--text-main)] border-x border-[var(--border-color)]/40 min-w-[34px] text-center bg-[var(--bg-card)] select-none">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCart(item._id, item.size, item.quantity + 1)}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm font-semibold hover:bg-[var(--secondary-accent)]/20 transition-colors cursor-pointer text-[var(--text-main)]"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowCartItems;
