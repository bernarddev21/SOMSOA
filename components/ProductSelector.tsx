"use client";

import { useEffect, useState } from "react";
import type { Product, SizeSystem } from "./products";
import { SIZE_OPTIONS } from "./products";
import { useCart } from "./CartProvider";

type ProductSelectorProps = {
  product: Product;
};

export default function ProductSelector({
  product,
}: ProductSelectorProps) {
  const { addItem } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [sizeSystem, setSizeSystem] =
    useState<SizeSystem>("UK");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const getSizeLabel = (
    size: (typeof SIZE_OPTIONS)[number]
  ) => {
    if (sizeSystem === "EU") {
      return size.eu;
    }

    if (sizeSystem === "US") {
      return size.us;
    }

    return size.uk;
  };

  const openSelector = () => {
    setIsOpen(true);
  };

  const closeSelector = () => {
    setIsOpen(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }

    addItem({
      product,
      sizeSystem,
      size: selectedSize,
      quantity,
    });

    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSelector();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Minimal product information under the image */}
      <div className="product-meta">

        <div className="product-meta-top">

          <span className="product-meta-colour">
            {product.colour}
          </span>

          <span className="product-meta-price">
            £{(product.price / 100).toFixed(2)}
          </span>

        </div>

        <button
          type="button"
          className="product-select-trigger"
          onClick={openSelector}
        >
          <span>Select</span>
          <span aria-hidden="true">→</span>
        </button>

      </div>


      {/* Product selection drawer */}
      {isOpen && (
        <div
          className="product-drawer-overlay"
          role="presentation"
          onMouseDown={closeSelector}
        >

          <aside
            className="product-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${product.id}-drawer-title`}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="product-drawer-header">

              <div>
                <span className="product-drawer-eyebrow">
                  SOMSOA
                </span>

                <h2
                  id={`${product.id}-drawer-title`}
                >
                  {product.name}
                </h2>
              </div>

              <button
                type="button"
                className="product-drawer-close"
                onClick={closeSelector}
                aria-label={`Close ${product.name} selection`}
              >
                ×
              </button>

            </div>


            <div className="product-drawer-content">

              <div className="product-drawer-image-wrap">
                <img
                  src={product.image}
                  alt={`${product.name} SOMSOA heated slippers`}
                  className="product-drawer-image"
                />
              </div>


              <div className="product-drawer-information">

                <div className="product-drawer-title-row">

                  <div>
                    <span className="product-drawer-colour">
                      {product.colour}
                    </span>

                    <h3>
                      {product.name}
                    </h3>
                  </div>

                  <span className="product-drawer-price">
                    £{(product.price / 100).toFixed(2)}
                  </span>

                </div>


                {/* Size system */}
                <div className="product-drawer-section">

                  <span className="product-drawer-label">
                    SIZE SYSTEM
                  </span>

                  <div className="product-drawer-system">

                    {(
                      ["UK", "EU", "US"] as SizeSystem[]
                    ).map((system) => (
                      <button
                        key={system}
                        type="button"
                        className={
                          sizeSystem === system
                            ? "product-drawer-system-button active"
                            : "product-drawer-system-button"
                        }
                        onClick={() => {
                          setSizeSystem(system);
                          setSelectedSize("");
                        }}
                      >
                        {system}
                      </button>
                    ))}

                  </div>

                </div>


                {/* Sizes */}
                <div className="product-drawer-section">

                  <div className="product-drawer-section-heading">

                    <span className="product-drawer-label">
                      SIZE
                    </span>

                    <span className="product-drawer-current-size">
                      {selectedSize || "Choose size"}
                    </span>

                  </div>

                  <div className="product-drawer-sizes">

                    {SIZE_OPTIONS.map((size) => {
                      const label = getSizeLabel(size);

                      return (
                        <button
                          key={`${product.id}-${size.eu}`}
                          type="button"
                          className={
                            selectedSize === label
                              ? "product-drawer-size active"
                              : "product-drawer-size"
                          }
                          onClick={() =>
                            setSelectedSize(label)
                          }
                        >
                          {label}
                        </button>
                      );
                    })}

                  </div>

                </div>


                {/* Quantity */}
                <div className="product-drawer-section">

                  <span className="product-drawer-label">
                    QUANTITY
                  </span>

                  <div className="product-drawer-quantity">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) =>
                          Math.max(1, current - 1)
                        )
                      }
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (current) => current + 1
                        )
                      }
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* Add to cart */}
                <button
                  type="button"
                  className="product-drawer-add"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                >
                  <span>
                    {selectedSize
                      ? "Add to Cart"
                      : "Select a Size"}
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </button>

              </div>

            </div>

          </aside>

        </div>
      )}
    </>
  );
}