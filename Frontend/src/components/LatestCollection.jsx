import { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "./Title.jsx";
import ProductItem from "./ProductItem.jsx";

const LatestCollection = () => {
  const { LatestCollection } = useContext(ShopContext);

  return (
    <section className="my-12">
      <div className="text-center py-4 space-y-2">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-full max-w-xl mx-auto text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed">
          Discover our newest arrivals curated with premium quality, cutting-edge style, and exceptional craftsmanship.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
        {LatestCollection.map((item, index) => (
          <ProductItem item={item} key={index} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
