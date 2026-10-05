"use client";

import { useEffect } from "react";
import { useCart } from "../../../components/CartProvider";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const sessionId = params.get("session_id");

    if (sessionId) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <main className="checkout-success">

      <div className="checkout-success-inner">

        <span className="checkout-success-eyebrow">
          SOMSOA
        </span>

        <h1>
          Thank you.
        </h1>

        <p>
          Your order has been received.
          <br />
          A little more comfort is on its way.
        </p>

        <a
          href="/#collection"
          className="btn btn-primary"
        >
          Continue Shopping →
        </a>

      </div>

    </main>
  );
}