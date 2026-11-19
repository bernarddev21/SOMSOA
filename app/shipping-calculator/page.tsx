"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, SIZE_OPTIONS } from "../../components/products";
import type { SizeSystem } from "../../components/products";
import {
  calculateShippingPlan,
  getPairWeights,
  getShippingCountries,
  type OrderLineForShipping,
  type ShippingDestination,
  type UkService,
} from "../../components/shipping";

type Line = OrderLineForShipping & {
  id: number;
  productId: string;
  unitCost: number;
};

type StripeFeePreset = {
  label: string;
  percentage: number;
  fixedPence: number;
};

const STRIPE_FEE_PRESETS: Record<string, StripeFeePreset> = {
  ukStandard: {
    label: "UK standard card",
    percentage: 1.5,
    fixedPence: 20,
  },
  ukPremium: {
    label: "UK premium card",
    percentage: 2.8,
    fixedPence: 20,
  },
  eezStandard: {
    label: "EEA card",
    percentage: 2.5,
    fixedPence: 20,
  },
  international: {
    label: "International card",
    percentage: 3.15,
    fixedPence: 20,
  },
};

function money(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function ShippingCalculatorPage() {
  const firstSize = SIZE_OPTIONS[2]?.uk ?? "7–8";
  const [lines, setLines] = useState<Line[]>([
    {
      id: 1,
      productId: PRODUCTS[0]?.id ?? "",
      sizeSystem: "UK",
      size: firstSize,
      quantity: 1,
      unitCost: 0,
    },
  ]);

  const [destination, setDestination] = useState<ShippingDestination>("GB");
  const [service, setService] = useState<UkService>("tracked48");
  const [country, setCountry] = useState("DE");
  const [customerShipping, setCustomerShipping] = useState(0);
  const [stripeFeePreset, setStripeFeePreset] = useState("ukStandard");
  const [customStripePercentage, setCustomStripePercentage] = useState(1.5);
  const [customStripeFixed, setCustomStripeFixed] = useState(20);

  const [mediumCapacity, setMediumCapacity] = useState(4);
  const [largeCapacity, setLargeCapacity] = useState(8);
  const [bagWeight, setBagWeight] = useState(10);
  const [mediumWeight, setMediumWeight] = useState(0);
  const [largeWeight, setLargeWeight] = useState(0);
  const [mediumCost, setMediumCost] = useState(0);
  const [largeCost, setLargeCost] = useState(0);

  const sizes = (system: SizeSystem) =>
    SIZE_OPTIONS.map((item) =>
      system === "UK" ? item.uk : system === "EU" ? item.eu : item.us
    );

  const updateLine = (id: number, patch: Partial<Line>) =>
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, ...patch } : line
      )
    );

  const addLine = () =>
    setLines((current) => [
      ...current,
      {
        id: Date.now(),
        productId: PRODUCTS[0]?.id ?? "",
        sizeSystem: "UK",
        size: firstSize,
        quantity: 1,
        unitCost: 0,
      },
    ]);

  const removeLine = (id: number) =>
    setLines((current) =>
      current.length === 1
        ? current
        : current.filter((line) => line.id !== id)
    );

  const weights = useMemo(() => getPairWeights(lines), [lines]);

  const parcels = useMemo(
    () =>
      calculateShippingPlan(weights, {
        mediumCapacity,
        largeCapacity,
        bagWeight,
        mediumWeight,
        largeWeight,
        mediumCost,
        largeCost,
        destination,
        service,
        country,
      }),
    [
      weights,
      mediumCapacity,
      largeCapacity,
      bagWeight,
      mediumWeight,
      largeWeight,
      mediumCost,
      largeCost,
      destination,
      service,
      country,
    ]
  );

  const productValue = lines.reduce((sum, line) => {
    const product = PRODUCTS.find((item) => item.id === line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0);

  const productCost = lines.reduce(
    (sum, line) => sum + line.unitCost * line.quantity,
    0
  );

  const orderRevenue = productValue + customerShipping;

  const stripePreset = STRIPE_FEE_PRESETS[stripeFeePreset];
  const stripePercentage =
    stripeFeePreset === "custom"
      ? customStripePercentage
      : stripePreset.percentage;
  const stripeFixed =
    stripeFeePreset === "custom"
      ? customStripeFixed
      : stripePreset.fixedPence;

  const stripeFee = Math.round(
    orderRevenue * (stripePercentage / 100) + stripeFixed
  );

  const productWeight = weights.reduce<number>(
    (sum, weight) => sum + weight,
    0
  );
  const postage = parcels.reduce(
    (sum, parcel) => sum + parcel.postage,
    0
  );
  const packaging = parcels.reduce(
    (sum, parcel) => sum + parcel.packagingCost,
    0
  );
  const shippingCost = postage + packaging;
  const difference = customerShipping - shippingCost;

  const totalBusinessCost =
    productCost + shippingCost + stripeFee;

  const estimatedProfit = orderRevenue - totalBusinessCost;

  const estimatedMargin =
    orderRevenue > 0
      ? (estimatedProfit / orderRevenue) * 100
      : 0;

  return (
    <main className="somsoa-shipping-calculator">
      <style>{`
        .somsoa-shipping-calculator{max-width:1180px;margin:auto;padding:48px 24px 80px;color:#24241f}
        .somsoa-shipping-calculator h1{font-size:clamp(38px,5vw,58px);font-weight:500;line-height:1;margin:8px 0 14px}
        .somsoa-shipping-calculator h2{font-size:20px;font-weight:500;margin:0 0 20px}
        .sc-eyebrow{font-size:11px;letter-spacing:.16em}.sc-intro{max-width:720px;color:#6f6e67;line-height:1.6}
        .sc-card{margin-top:22px;padding:24px;border:1px solid #deddd7;border-radius:18px;background:#fff}
        .sc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}
        .sc-field{display:grid;gap:7px;font-size:12px}.sc-field input,.sc-field select{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid #d4d3cc;border-radius:10px;background:#fff;font:inherit}
        .sc-line{padding:18px 0;border-top:1px solid #ecebe6}.sc-line:first-child{border-top:0;padding-top:0}
        .sc-line-head,.sc-parcel{display:flex;justify-content:space-between;gap:18px;align-items:center}.sc-line-head{margin-bottom:14px}
        .sc-btn{border:1px solid #cccac2;border-radius:999px;padding:9px 14px;background:#fff;cursor:pointer}.sc-primary{background:#24241f;color:#fff;border-color:#24241f}
        .sc-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:14px;margin-top:22px}.sc-metric{padding:20px;border-radius:16px;background:#f4f1eb}.sc-metric span{display:block;font-size:10px;letter-spacing:.13em;color:#77756d;margin-bottom:9px}.sc-metric strong{font-size:21px;font-weight:500}
        .sc-positive{color:#315d39}.sc-negative{color:#9a3939}.sc-parcel{padding:16px 0;border-top:1px solid #ecebe6}.sc-parcel:first-child{border-top:0}
        .sc-small{color:#74736d;font-size:13px;line-height:1.55;margin-top:9px}
        @media(max-width:650px){.somsoa-shipping-calculator{padding:30px 16px 60px}.sc-card{padding:18px}.sc-parcel{display:block}}
      `}</style>

      <div className="sc-eyebrow">SOMSOA · INTERNAL TOOL</div>
      <h1>Shipping calculator</h1>
      <p className="sc-intro">
        Calculate the packing plan, Royal Mail postage, packaging cost, Stripe
        processing fee and estimated profit for the order.
      </p>

      <section className="sc-card">
        <h2>1. Order</h2>
        {lines.map((line, index) => {
          const availableSizes = sizes(line.sizeSystem);
          return (
            <div className="sc-line" key={line.id}>
              <div className="sc-line-head">
                <strong>Item {index + 1}</strong>
                {lines.length > 1 && (
                  <button
                    type="button"
                    className="sc-btn"
                    onClick={() => removeLine(line.id)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="sc-grid">
                <label className="sc-field">
                  Product
                  <select
                    value={line.productId}
                    onChange={(event) =>
                      updateLine(line.id, {
                        productId: event.target.value,
                      })
                    }
                  >
                    {PRODUCTS.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} · {product.colour}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sc-field">
                  Size system
                  <select
                    value={line.sizeSystem}
                    onChange={(event) => {
                      const next = event.target.value as SizeSystem;
                      updateLine(line.id, {
                        sizeSystem: next,
                        size: sizes(next)[2],
                      });
                    }}
                  >
                    <option value="UK">UK</option>
                    <option value="EU">EU</option>
                    <option value="US">US</option>
                  </select>
                </label>

                <label className="sc-field">
                  Size
                  <select
                    value={line.size}
                    onChange={(event) =>
                      updateLine(line.id, {
                        size: event.target.value,
                      })
                    }
                  >
                    {availableSizes.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </label>

                <label className="sc-field">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(event) =>
                      updateLine(line.id, {
                        quantity: Math.max(
                          1,
                          Number(event.target.value) || 1
                        ),
                      })
                    }
                  />
                </label>

                <label className="sc-field">
                  Supplier unit cost (£)
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={(line.unitCost / 100).toFixed(2)}
                    onChange={(event) =>
                      updateLine(line.id, {
                        unitCost: Math.round(
                          Number(event.target.value || 0) * 100
                        ),
                      })
                    }
                  />
                </label>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="sc-btn sc-primary"
          onClick={addLine}
        >
          + Add another product / size
        </button>
      </section>

      <section className="sc-card">
        <h2>2. Packaging</h2>
        <div className="sc-grid">
          <label className="sc-field">
            Medium capacity (pairs)
            <input
              type="number"
              min={2}
              value={mediumCapacity}
              onChange={(event) =>
                setMediumCapacity(
                  Math.max(2, Number(event.target.value) || 2)
                )
              }
            />
          </label>

          <label className="sc-field">
            Large capacity (pairs)
            <input
              type="number"
              min={5}
              value={largeCapacity}
              onChange={(event) =>
                setLargeCapacity(
                  Math.max(5, Number(event.target.value) || 5)
                )
              }
            />
          </label>

          <label className="sc-field">
            SOMSOA bag weight (g)
            <input
              type="number"
              min={0}
              value={bagWeight}
              onChange={(event) =>
                setBagWeight(
                  Math.max(0, Number(event.target.value) || 0)
                )
              }
            />
          </label>

          <label className="sc-field">
            Medium carton weight (g)
            <input
              type="number"
              min={0}
              value={mediumWeight}
              onChange={(event) =>
                setMediumWeight(
                  Math.max(0, Number(event.target.value) || 0)
                )
              }
            />
          </label>

          <label className="sc-field">
            Large carton weight (g)
            <input
              type="number"
              min={0}
              value={largeWeight}
              onChange={(event) =>
                setLargeWeight(
                  Math.max(0, Number(event.target.value) || 0)
                )
              }
            />
          </label>

          <label className="sc-field">
            Medium carton cost (£)
            <input
              type="number"
              min={0}
              step="0.01"
              value={(mediumCost / 100).toFixed(2)}
              onChange={(event) =>
                setMediumCost(
                  Math.round(Number(event.target.value || 0) * 100)
                )
              }
            />
          </label>

          <label className="sc-field">
            Large carton cost (£)
            <input
              type="number"
              min={0}
              step="0.01"
              value={(largeCost / 100).toFixed(2)}
              onChange={(event) =>
                setLargeCost(
                  Math.round(Number(event.target.value || 0) * 100)
                )
              }
            />
          </label>
        </div>

        <p className="sc-small">
          Medium: 40 × 32 × 35 cm internal. Large: 60 × 40 × 25 cm internal.
          Current capacities are provisional at 4 and 8 pairs until your supplier
          confirms the physical packing. Enter the real carton weights/costs when confirmed.
        </p>
      </section>

      <section className="sc-card">
        <h2>3. Delivery, customer charge & payment fees</h2>
        <div className="sc-grid">
          <label className="sc-field">
            Destination
            <select
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value as ShippingDestination
                )
              }
            >
              <option value="GB">United Kingdom</option>
              <option value="INT">International</option>
            </select>
          </label>

          {destination === "GB" ? (
            <label className="sc-field">
              Royal Mail service
              <select
                value={service}
                onChange={(event) =>
                  setService(event.target.value as UkService)
                }
              >
                <option value="tracked48">Tracked 48</option>
                <option value="tracked24">Tracked 24</option>
              </select>
            </label>
          ) : (
            <label className="sc-field">
              Country
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                {getShippingCountries()
                  .filter((entry) => entry.code !== "GB")
                  .map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.name}
                    </option>
                  ))}
              </select>
            </label>
          )}

          <label className="sc-field">
            Customer shipping charged (£)
            <input
              type="number"
              min={0}
              step="0.01"
              value={(customerShipping / 100).toFixed(2)}
              onChange={(event) =>
                setCustomerShipping(
                  Math.round(Number(event.target.value || 0) * 100)
                )
              }
            />
          </label>

          <label className="sc-field">
            Stripe fee preset
            <select
              value={stripeFeePreset}
              onChange={(event) =>
                setStripeFeePreset(event.target.value)
              }
            >
              {Object.entries(STRIPE_FEE_PRESETS).map(
                ([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.label} · {preset.percentage}% + £{(preset.fixedPence / 100).toFixed(2)}
                  </option>
                )
              )}
              <option value="custom">Custom</option>
            </select>
          </label>

          {stripeFeePreset === "custom" && (
            <>
              <label className="sc-field">
                Stripe percentage (%)
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={customStripePercentage}
                  onChange={(event) =>
                    setCustomStripePercentage(
                      Math.max(0, Number(event.target.value) || 0)
                    )
                  }
                />
              </label>

              <label className="sc-field">
                Stripe fixed fee (£)
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={(customStripeFixed / 100).toFixed(2)}
                  onChange={(event) =>
                    setCustomStripeFixed(
                      Math.max(0, Math.round(Number(event.target.value || 0) * 100))
                    )
                  }
                />
              </label>
            </>
          )}
        </div>

        {destination === "INT" && (
          <p className="sc-small">
            A single SOMSOA bag uses International Tracked. Consolidated cartons
            use International Tracked Heavier. Country codes are mapped to the
            Royal Mail destination zones used by the current online tariff.
          </p>
        )}
      </section>

      <section className="sc-summary">
        <div className="sc-metric">
          <span>PRODUCT VALUE</span>
          <strong>{money(productValue)}</strong>
        </div>
        <div className="sc-metric">
          <span>PRODUCT WEIGHT</span>
          <strong>{(productWeight / 1000).toFixed(2)} kg</strong>
        </div>
        <div className="sc-metric">
          <span>PARCELS</span>
          <strong>{parcels.length}</strong>
        </div>
        <div className="sc-metric">
          <span>POSTAGE</span>
          <strong>{money(postage)}</strong>
        </div>
        <div className="sc-metric">
          <span>PACKAGING</span>
          <strong>{money(packaging)}</strong>
        </div>
        <div className="sc-metric">
          <span>TOTAL SHIPPING COST</span>
          <strong>{money(shippingCost)}</strong>
        </div>
        <div className="sc-metric">
          <span>CUSTOMER SHIPPING</span>
          <strong>{money(customerShipping)}</strong>
        </div>
        <div className="sc-metric">
          <span>SHIPPING SURPLUS / SHORTFALL</span>
          <strong
            className={
              difference >= 0 ? "sc-positive" : "sc-negative"
            }
          >
            {money(difference)}
          </strong>
        </div>
        <div className="sc-metric">
          <span>PRODUCT COST</span>
          <strong>{money(productCost)}</strong>
        </div>
        <div className="sc-metric">
          <span>STRIPE FEE</span>
          <strong>{money(stripeFee)}</strong>
        </div>
        <div className="sc-metric">
          <span>ORDER REVENUE</span>
          <strong>{money(orderRevenue)}</strong>
        </div>
        <div className="sc-metric">
          <span>EST. PROFIT</span>
          <strong
            className={
              estimatedProfit >= 0 ? "sc-positive" : "sc-negative"
            }
          >
            {money(estimatedProfit)}
          </strong>
        </div>
        <div className="sc-metric">
          <span>EST. MARGIN</span>
          <strong
            className={
              estimatedProfit >= 0 ? "sc-positive" : "sc-negative"
            }
          >
            {estimatedMargin.toFixed(1)}%
          </strong>
        </div>
      </section>

      <section className="sc-card">
        <h2>Profit breakdown</h2>
        <div className="sc-parcel">
          <div>Product revenue</div>
          <strong>{money(productValue)}</strong>
        </div>
        <div className="sc-parcel">
          <div>Customer shipping revenue</div>
          <strong>{money(customerShipping)}</strong>
        </div>
        <div className="sc-parcel">
          <div>Royal Mail postage</div>
          <strong>-{money(postage)}</strong>
        </div>
        <div className="sc-parcel">
          <div>Packaging</div>
          <strong>-{money(packaging)}</strong>
        </div>
        <div className="sc-parcel">
          <div>Product cost</div>
          <strong>-{money(productCost)}</strong>
        </div>
        <div className="sc-parcel">
          <div>Estimated Stripe fee</div>
          <strong>-{money(stripeFee)}</strong>
        </div>
        <div className="sc-parcel" style={{ borderTop: "2px solid #24241f" }}>
          <div>Estimated profit before other operating costs</div>
          <strong
            className={estimatedProfit >= 0 ? "sc-positive" : "sc-negative"}
          >
            {money(estimatedProfit)}
          </strong>
        </div>
        <p className="sc-small">
          Stripe pricing depends on the payment method and card type. The preset is an estimate; use Custom to reproduce an actual Stripe fee from a completed transaction.
        </p>
      </section>

      <section className="sc-card">
        <h2>Parcel plan</h2>
        {!parcels.length ? (
          <p className="sc-small">
            No valid parcel configuration was found for the selected
            destination/service and current packaging assumptions.
          </p>
        ) : (
          parcels.map((parcel, index) => (
            <div
              className="sc-parcel"
              key={`${parcel.kind}-${index}`}
            >
              <div>
                <strong>
                  Parcel {index + 1} · {parcel.kind === "bag"
                    ? "SOMSOA bag"
                    : parcel.kind === "medium"
                      ? "Medium carton"
                      : "Large carton"}
                </strong>
                <div className="sc-small">
                  {parcel.pairs} pair{parcel.pairs === 1 ? "" : "s"} · {parcel.productWeight}g product + {parcel.packagingWeight}g packaging = {parcel.totalWeight}g packed
                </div>
              </div>
              <div>
                <strong>{money(parcel.postage)}</strong>
                <div className="sc-small">
                  {money(parcel.packagingCost)} packaging
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="sc-card">
        <h2>Royal Mail reference</h2>
        <p className="sc-small">
          Current online UK Tracked 48: small parcel ≤2kg £3.65; medium ≤2kg £5.55,
          ≤10kg £7.35, ≤20kg £11.85. Tracked 24: small parcel ≤2kg £4.65; medium
          ≤2kg £6.55, ≤10kg £8.55, ≤20kg £13.85.
        </p>
        <p className="sc-small">
          UK small parcel maximum: 45 × 35 × 16 cm and 2kg. UK medium maximum:
          61 × 46 × 46 cm and 20kg. International small parcels are up to 2kg;
          International Tracked Heavier medium parcels are up to 20kg.
        </p>
      </section>
    </main>
  );
}
