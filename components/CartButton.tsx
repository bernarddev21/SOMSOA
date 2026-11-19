"use client";

import { useCart } from "./CartProvider";

export default function CartButton() {
  const { cartCount, openCart } = useCart();

  return (
    <button
      type="button"
      className="site-cart"
      onClick={openCart}
      aria-label={`Open cart with ${cartCount} ${
        cartCount === 1 ? "item" : "items"
      }`}
    >
      <span className="site-cart-label">
        Cart
      </span>

      {cartCount > 0 && (
        <span
          className="site-cart-count"
          aria-hidden="true"
        >
          {cartCount}
        </span>
      )}
    </button>
  );
}