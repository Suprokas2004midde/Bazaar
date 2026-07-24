import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { Loader2 } from 'lucide-react';

const BestSeller = () => {
  const { bestSeller, loading } = useContext(ShopContext);

  return (
    <section className="my-12">
      <div className="text-center py-4 space-y-2">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-full max-w-xl mx-auto text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed">
          Explore top-rated fan favorites loved by thousands of happy shoppers around the globe.
        </p>
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-48 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-accent)]" />
          <p className="text-[var(--text-muted)] text-sm animate-pulse">Loading best sellers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
          {bestSeller.map((item, index) => (
            <ProductItem item={item} key={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSeller;
