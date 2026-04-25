import {useContext, useEffect, useState} from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from './Title.jsx';
import ProductItem from './ProductItem.jsx';

const LatestCollection = () => {

    const { productsDummyData } = useContext(ShopContext);
    const [latestProd, SetlatestProd] = useState([]);

    useEffect(()=>{
      SetlatestProd(productsDummyData.slice(0,10))
    },[])
    console.log(latestProd)
  return (
    <div className="my-10">
      <div className="text-center py-3 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"}></Title>
        <p className="w-3/4 m-auto text-sm md:text-xl text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem eos
          qui, labore eligendi ipsum reiciendis ad recusandae id cupiditate
          culpa eius.
        </p>
      </div>
      <div className="grid min-[300px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProd.map((item, index) => {
          return <ProductItem item={item} key={index} />;
        })}
      </div>
    </div>
  );
}

export default LatestCollection
