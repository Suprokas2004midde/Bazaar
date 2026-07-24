import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import axios from 'axios';

const RelatedProduct = ({ category, subCategory, id }) => {
  const { backend } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  
  const fetchRelated = async () => {
    if (category && backend) {
      try {
        const params = new URLSearchParams();
        if (category) {
          params.append("category", category);
        }
        if (subCategory) {
          params.append("subcategory", subCategory);
        }
        const response = await axios.get(
          `${backend}/api/product/list-page?${params.toString()}`,
        );
        if (response.data.success && Array.isArray(response.data.products)) {
          let fetched = response.data.products.filter(
            (item) => item._id !== id,
          );
          setRelated(fetched.slice(0, 5));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchRelated();
  }, [id, category, subCategory]);

  if (!related || related.length === 0) return null;

  return (
    <section className="my-16">
      <div className="text-center py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
        {related.map((item, index) => (
          <ProductItem item={item} key={item._id || index} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProduct;
