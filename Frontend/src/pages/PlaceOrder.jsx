import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const {
    navigate,
    backend,
    token,
    setCartItems,
    cartItems,
    getTotalAmount,
    DeliveryFees,
    cartProductsData,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const iteminfo = structuredClone(cartProductsData.find((product) => product._id === items));
            if (iteminfo) {
              iteminfo.size = item;
              iteminfo.quantity = cartItems[items][item];
              orderItems.push(iteminfo);
            }
          }
        }
      }

      const finalOrder = {
        items: orderItems,
        address: formData,
        amount: getTotalAmount(),
      };

      switch (method) {
        case 'cod':
          if (finalOrder.items.length === 0) {
            toast.warning("Your cart is empty. Please add items before placing an order.");
            return;
          }
          const response = await axios.post(
            `${backend}/api/order/place`,
            finalOrder,
            { headers: { token } },
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col lg:flex-row justify-between gap-8 pt-8 min-h-[80vh] border-t border-[var(--border-color)]/40">
      {/* Delivery Info Form */}
      <Card className="flex-1 border-[var(--border-color)]">
        <CardContent className="p-6 space-y-4">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              placeholder="First name"
              required
            />
            <Input
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              placeholder="Last name"
              required
            />
          </div>

          <Input
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email address"
            required
          />

          <Input
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            placeholder="Street address"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              placeholder="City"
              required
            />
            <Input
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              placeholder="State"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="number"
              placeholder="Zipcode"
              required
            />
            <Input
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              placeholder="Country"
              required
            />
          </div>

          <Input
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="number"
            placeholder="Phone number"
            required
          />
        </CardContent>
      </Card>

      {/* Right Column: Order Summary & Payment Method */}
      <div className="w-full lg:w-[480px] space-y-8">
        <CartTotal />

        <Card className="border-[var(--border-color)]">
          <CardContent className="p-6 space-y-4">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stripe */}
              <div
                onClick={() => setMethod("stripe")}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  method === "stripe"
                    ? "border-[var(--primary-accent)] bg-[var(--secondary-accent)]/15"
                    : "border-[var(--border-color)] bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="text-blue-500 font-bold text-xs italic">stripe</span>
                {method === "stripe" && <CheckCircle2 className="w-4 h-4 text-[var(--primary-accent)]" />}
              </div>

              {/* Razorpay */}
              <div
                onClick={() => setMethod("razorpay")}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  method === "razorpay"
                    ? "border-[var(--primary-accent)] bg-[var(--secondary-accent)]/15"
                    : "border-[var(--border-color)] bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="text-[#2c9ef4] font-extrabold text-xs">Razorpay</span>
                {method === "razorpay" && <CheckCircle2 className="w-4 h-4 text-[var(--primary-accent)]" />}
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setMethod("cod")}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  method === "cod"
                    ? "border-[var(--primary-accent)] bg-[var(--secondary-accent)]/15"
                    : "border-[var(--border-color)] bg-[var(--bg-subtle)]"
                }`}
              >
                <span className="text-xs font-bold text-[var(--text-main)]">COD</span>
                {method === "cod" && <CheckCircle2 className="w-4 h-4 text-[var(--primary-accent)]" />}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold uppercase tracking-wider mt-4">
              Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default PlaceOrder;
