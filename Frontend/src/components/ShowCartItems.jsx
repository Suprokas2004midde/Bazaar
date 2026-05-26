import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { CiCircleRemove } from "react-icons/ci";

const ShowCartItems = ({ cartData, setCartData }) => {
  const { cartItems, CurrencySym, productsDummyData, updateCart } =
    useContext(ShopContext);
  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = productsDummyData.find(
            (product) => product._id === item._id,
          );

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>
                  <div className="flex gap-6 items-center mt-2">
                    <p>
                      {CurrencySym}
                      {productData.price}
                    </p>
                    {item.size === "ONE_SIZE" ? null : (
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                        {item.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <input
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
                onChange={(e)=> e.target.value==='' || e.target.value==='0' ? null : updateCart(item._id,item.size,Number(e.target.value))} //this is imp because without number (e.target.value) always returns a string value...
              />
              <CiCircleRemove
                className="w-8 h-8 cursor-pointer"
                onClick={() => updateCart(item._id, item.size, 0)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShowCartItems;
