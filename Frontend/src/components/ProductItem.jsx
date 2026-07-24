import React, { useContext } from 'react';
import { Link } from "react-router";
import { ShopContext } from '../context/ShopContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const ProductItem = ({ item }) => {
  const { CurrencySym } = useContext(ShopContext);
  const currency = CurrencySym;

  return (
    <Card className="overflow-hidden group hover:border-[var(--primary-accent)]/80 transition-all duration-300">
      <Link to={`/product/${item._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] flex items-center justify-center p-3">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
          />
          <Badge variant="accent" className="absolute top-2 right-2 opacity-95 shadow-sm">
            {currency}{item.price}
          </Badge>
        </div>
        <CardContent className="p-4 pt-3">
          <p className="font-semibold text-sm line-clamp-1 text-[var(--text-main)] group-hover:text-[var(--primary-accent)] transition-colors">
            {item.name}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
            {currency}{item.price}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductItem;
