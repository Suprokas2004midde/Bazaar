import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProduct = ({category, subCategory, id}) => {
    const { productsDummyData }= useContext(ShopContext);
    const [related, setRelated] = useState([]);


    useEffect(()=>{
        if(productsDummyData.length > 0){
            let cpyproducts = productsDummyData.slice();

            cpyproducts=cpyproducts.filter((item)=> category===item.category);
            cpyproducts=cpyproducts.filter((item)=> subCategory===item.subCategory);
            cpyproducts=cpyproducts.filter((item)=>item._id !== id);
            setRelated(cpyproducts);
        }
    },[])


  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item,index)=>{
          return <ProductItem item={item} key={index} />;
        })}
      </div>
    </div>
  );
}

export default RelatedProduct
