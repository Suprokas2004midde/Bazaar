import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ShopContext } from "../context/ShopContext";
import { FaStar } from "react-icons/fa";

const ProductDetail = () => {
  const { productID } = useParams(); //normal import returns object but instances returns string
  const { productsDummyData, CurrencySym } = useContext(ShopContext);
  const [productData, setProductData] = useState();
  const [mainImage, setMainImage] = useState();
  const [selectsize, setSelectSize] = useState("");

  const fetchProductData = async () => {
    productsDummyData.map((item) => {
      if (item._id === productID) {
        setProductData(item);
        setMainImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productID, productsDummyData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">

      {/* Product Data */}

      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">

        {/* Products Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">

          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => {
              return (
                <img
                  onClick={() => {
                    setMainImage(item);
                  }}
                  src={item}
                  alt=""
                  key={index}
                  className="w-[2%] sm:w-full sm:mb-3 shrink-0 cursor-pointer "
                />
              );
            })}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={mainImage} alt="main" />
          </div>

        </div>
        {/* ---------Product Info-------- */}
        <div className="flex-1">

          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <FaStar className="w-3 5" />
            <FaStar className="w-3 5" />
            <FaStar className="w-3 5" />
            <FaStar className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {CurrencySym}
            {productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div
            className={`flex flex-col gap-4 my-8 ${productData.sizes ? "" : "hidden"}`}
          >
            <p>Select Sizes</p>

            <div className="flex gap-2">
              {productData.sizes &&
                productData.sizes.map((size, index) => (
                  <button
                    onClick={() => setSelectSize(size)}
                    key={index}
                    className={`border py-2 px-4 bg-gray-100 ${size === selectsize ? "border-orange-500" : ""} `}
                  >
                    {size}
                  </button>
                ))}
            </div>

          </div>
          <button className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">Add To Cart</button>
          <hr className="mt-8 sm:w-4/5"/>
          <div className="text-sm flex flex-col gap-1 text-gray-500 mt-5">
              <p>100% Original Product</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy Return & Exchange Policy within 10 Days</p>
          </div>
        </div>
      </div>
      <div className="mt-20">
          <div className="flex">
              <b className="border px-5 py-3 text-sm">Description</b>
              <p className="border px-5 py-3 text-sm">Review (122)</p>
          </div>
          <div className="flex flex-col border gap-4 px-6 py-6 text-sm text-gray-500">
              <p>An e-commerce website is an online platform that allows businesses and individuals to buy and sell products or services over the internet. It provides a convenient shopping experience with features like product catalogs, secure payment gateways, and order tracking — making it easy for customers to browse, compare, and purchase items from the comfort of their home.</p>
              <p>E-commerce platforms typically offer detailed product descriptions, customer reviews, and personalized recommendations to enhance the shopping experience. With support for multiple payment methods and reliable delivery options, these websites aim to provide a seamless and trustworthy transaction process for every customer.</p>
          </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default ProductDetail;
