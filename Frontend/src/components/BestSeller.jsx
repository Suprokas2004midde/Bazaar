import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

    const {bestSeller} = useContext(ShopContext);
    const[BestSeller, SetBestSeller]= useState([]);

    useEffect(()=>{
        const bestproducts = bestSeller.filter((item) => (item.bestseller)); 
        SetBestSeller(bestproducts.slice(0,3));
    },[])

  return (
    <div className="my-10">
      <div className="text-center py-3 text-3xl">
        <Title text1={"BEST"} text2={"SELLER"}></Title>
        <p className="w-3/4 m-auto text-sm md:text-xl text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem eos
          qui, labore eligendi ipsum reiciendis ad recusandae id cupiditate
          culpa eius.
        </p>
      </div>
      <div className="grid min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {BestSeller.map((item, index) => {
          return <ProductItem item={item} key={index} />;
        })}
      </div>
    </div>
  );
}

export default BestSeller
