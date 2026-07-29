import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CartTotal = ({ cartDataLength = 1 }) => {
  const {
    CurrencySym,
    getTotalAmount,
    navigate,
    DeliveryFees,
  } = useContext(ShopContext);

  const subtotal = getTotalAmount();
  const shipping = subtotal > 0 ? DeliveryFees : 0;
  const discount = subtotal >= 500 ? DeliveryFees : 0;
  const total = subtotal === 0 ? 0 : subtotal + shipping - discount;

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm sticky top-24 space-y-6">
      <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
        Order Summary
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center font-medium">
          <span className="text-[var(--text-muted)]">Subtotal</span>
          <span className="font-semibold text-[var(--text-main)]">
            {CurrencySym}
            {subtotal}
          </span>
        </div>

        <div className="flex justify-between items-center font-medium">
          <span className="text-[var(--text-muted)]">Discount</span>
          <span className="font-semibold text-[var(--text-main)]">
            {CurrencySym}
            {discount}
          </span>
        </div>

        <div className="flex justify-between items-center font-medium">
          <span className="text-[var(--text-muted)]">Shipping</span>
          <span className="font-semibold text-[var(--text-main)]">
            {CurrencySym}
            {shipping}
          </span>
        </div>

        <div className="border-t border-[var(--border-color)]/60 pt-4"></div>

        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-[var(--text-main)]">
          <span>Total</span>
          <span>
            {CurrencySym}
            {total}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full py-6 rounded-xl font-bold bg-[var(--primary-accent)] text-[var(--bg-main)] hover:bg-[#0980FF] active:scale-[0.99] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        onClick={() => navigate("/place-order")}
        disabled={cartDataLength === 0}
      >
        Checkout <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CartTotal;
