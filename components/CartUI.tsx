"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import {
  getShippingCountries,
  type ShippingRegion,
} from "./shipping";

function defaultCountryForRegion(region: ShippingRegion) {
  switch (region) {
    case "GB":
      return "GB";
    case "EU":
      return "DE";
    case "US":
      return "US";
    case "CA":
      return "CA";
    case "ROW":
      return "NG";
  }
}

export default function CartUI() {
  const {
    items,
    cartTotal,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

  const [checkoutError, setCheckoutError] =
    useState("");

  const [shippingRegion, setShippingRegion] =
    useState<ShippingRegion>("GB");

  const [shippingCountry, setShippingCountry] =
    useState("GB");

  const availableCountries = useMemo(
    () => getShippingCountries(shippingRegion),
    [shippingRegion]
  );

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) {
    return null;
  }

  const handleRegionChange = (
    region: ShippingRegion
  ) => {
    setShippingRegion(region);
    setShippingCountry(
      defaultCountryForRegion(region)
    );
    setCheckoutError("");
  };

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const response = await fetch(
        "/api/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.product.id,
              sizeSystem: item.sizeSystem,
              size: item.size,
              quantity: item.quantity,
            })),

            shippingRegion,
            shippingCountry,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to start checkout."
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe did not return a checkout URL."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsCheckingOut(false);
    }
  };

  return (
    <div
      className="cart-overlay"
      role="presentation"
      onMouseDown={closeCart}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="cart-header">
          <div>
            <p className="cart-eyebrow">
              SOMSOA
            </p>

            <h2 id="cart-title">
              Your Cart
            </h2>
          </div>

          <button
            type="button"
            className="cart-close-button"
            onClick={closeCart}
            aria-label="Close shopping cart"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>
              Your cart is currently empty.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={closeCart}
            >
              Continue Shopping →
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => {
                const itemTotal =
                  item.product.price *
                  item.quantity;

                return (
                  <article
                    className="cart-item"
                    key={item.id}
                  >
                    <img
                      src={item.product.image}
                      alt={`${item.product.name} heated slippers`}
                      className="cart-item-image"
                    />

                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <div>
                          <h3>
                            {item.product.name}
                          </h3>

                          <p className="cart-item-colour">
                            {item.product.colour}
                          </p>

                          <p className="cart-item-size">
                            Size: {item.size} (
                            {item.sizeSystem})
                          </p>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div
                          className="cart-quantity-controls"
                          aria-label={`Quantity for ${item.product.name}`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            −
                          </button>

                          <span aria-live="polite">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <p className="cart-item-price">
                          £
                          {(
                            itemTotal / 100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>
                  Total
                </span>

                <strong>
                  £
                  {(
                    cartTotal / 100
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="cart-shipping">
                <label
                  htmlFor="shipping-region"
                  className="cart-shipping-label"
                >
                  DELIVERY DESTINATION
                </label>

                <select
                  id="shipping-region"
                  className="cart-shipping-select"
                  value={shippingRegion}
                  onChange={(event) =>
                    handleRegionChange(
                      event.target.value as ShippingRegion
                    )
                  }
                  disabled={isCheckingOut}
                >
                  <option value="GB">
                    United Kingdom
                  </option>

                  <option value="EU">
                    Europe
                  </option>

                  <option value="US">
                    United States
                  </option>

                  <option value="CA">
                    Canada
                  </option>

                  <option value="ROW">
                    Rest of World
                  </option>
                </select>
              </div>

              {shippingRegion !== "GB" && (
                <div className="cart-shipping">
                  <label
                    htmlFor="shipping-country"
                    className="cart-shipping-label"
                  >
                    COUNTRY
                  </label>

                  <select
                    id="shipping-country"
                    className="cart-shipping-select"
                    value={shippingCountry}
                    onChange={(event) => {
                      setShippingCountry(
                        event.target.value
                      );
                      setCheckoutError("");
                    }}
                    disabled={isCheckingOut}
                  >
                    {availableCountries.map(
                      (country) => (
                        <option
                          key={country.code}
                          value={country.code}
                        >
                          {country.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              <div className="cart-shipping-note">
                <strong>
                  SHIPPING CALCULATED AT CHECKOUT
                </strong>

                <span>
                  Shipping is calculated from your
                  country, order weight and parcel
                  configuration.
                </span>
              </div>

              {checkoutError && (
                <p className="cart-checkout-error">
                  {checkoutError}
                </p>
              )}

              <button
                type="button"
                className="cart-checkout-button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                aria-busy={isCheckingOut}
              >
                {isCheckingOut
                  ? "Opening Checkout..."
                  : "Checkout →"}
              </button>

              <p className="cart-checkout-note">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}