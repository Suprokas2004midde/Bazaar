import React, { useContext } from 'react';
import { Link } from "react-router";
import { Star, Heart, Eye } from "lucide-react";
import { ShopContext } from '../context/ShopContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const ProductItem = ({ item }) => {
  const { CurrencySym, toggleWishlist, isInWishlist } = useContext(ShopContext);

  // ── Review-based rating, driven off item?.reviews (same shape as productData?.reviews) ──
  const reviewCount = item?.reviews?.length || 0;

  const avgRating =
    reviewCount > 0
      ? item.reviews.reduce((sum, review) => sum + (review.star || 0), 0) / reviewCount
      : item?.rating || 0;

  const inStock = item?.inStock !== false; // treat missing field as in-stock
  const wishlisted = isInWishlist?.(item._id);
  const description = item.description? `${item.description.slice(0, 40)} ...` : null;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist?.(item._id, item.images?.[0]);
  };

  return (
    <Card className="overflow-hidden rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${item._id}`} className="block">
        {/* Image well — full bleed, no letterboxing */}
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)]">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />

          {item.category && (
            <Badge className="absolute top-3 right-3 bg-black/70 text-white border-none font-medium px-3 py-1 rounded-full">
              {item.category}
            </Badge>
          )}

          {/* Wishlist heart */}
          <button
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 left-3 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 backdrop-blur-sm hover:bg-[#FF0800]/30 transition-colors"
          >
            <Heart
              size={16}
              className={
                wishlisted
                  ? "fill-[#FF0800] text-[#FF0800]"
                  : "fill-transparent text-[#FF0800]"
              }
            />
          </button>
        </div>

        <CardContent className="p-4 pt-4 space-y-2">
          {/* Title */}
          <p className="font-bold text-base text-[var(--text-main)] line-clamp-1">
            {item.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star size={14} className={"fill-amber-400 text-amber-400"} />
            </div>
            <span className="text-xs text-[var(--text-muted)]">
              {avgRating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Description */}
          <div className="hidden md:block">
            {item.description && (
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Price + Stock */}
          <div className=" md:flex items-center justify-between pt-1">
            <p className="text-lg font-bold text-[var(--text-main)]">
              {CurrencySym}
              {item.price}
            </p>
            <Badge
              className={`text-xs border-none px-2.5 py-0.5 font-medium rounded-full ${
                inStock
                  ? "bg-[#FAFAFA]/25 text-[#0ecb15]"
                  : "bg-[#FF0800]/15 text-[#FF0800]"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </CardContent>
      </Link>

      {/* View Details */}
      <div className="hidden sm:block sm:px-4 pb-4">
        <Link
          to={`/product/${item._id}`}
          className="w-full flex items-center justify-center gap-2 bg-[var(--bg-subtle)] hover:bg-[#0980FF] hover:text-white text-[var(--text-main)] text-sm font-medium py-2.5 rounded-full border border-[var(--text-muted)]/20 transition-colors duration-500"
        >
          <Eye size={16} />
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default ProductItem;
