import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ShowCartItems from '../components/ShowCartItems';
import CartTotal from '../components/CartTotal';
import { Button } from '../components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    let tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="space-y-6 pb-16 pt-4">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-main)] mb-6">
        Shopping Cart
      </h1>

      {cartData.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-12 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">Your cart is empty</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Explore our products and discover great deals!
          </p>
          <Button
            onClick={() => navigate('/collection')}
            className="mt-4 font-semibold px-6 py-2.5 rounded-xl gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <ShowCartItems cartData={cartData} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartTotal cartDataLength={cartData.length} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
