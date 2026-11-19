import type { CSSProperties } from "react";

type PriceDisplayProps = {
  price: number;
  originalPrice?: number;
  size?: "regular" | "large";
  align?: "left" | "right";
};

const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;

export default function PriceDisplay({ price, originalPrice, size = "regular", align = "left" }: PriceDisplayProps) {
  const onSale = typeof originalPrice === "number" && originalPrice > price;
  const saving = onSale ? Math.round((1 - price / originalPrice) * 100) : 0;
  const large = size === "large";
  const wrapper: CSSProperties = { display: "flex", alignItems: "center", justifyContent: align === "right" ? "flex-end" : "flex-start", flexWrap: "wrap", gap: large ? "9px" : "7px", lineHeight: 1.2 };
  return (
    <div className={onSale ? "somsoa-price somsoa-price-sale" : "somsoa-price"} style={wrapper} aria-label={onSale ? `Sale price ${money(price)}, was ${money(originalPrice!)}, ${saving} percent off` : `Price ${money(price)}`}>
      {onSale && <span style={{ fontSize: large ? 11 : 9, letterSpacing: ".14em", fontWeight: 600, textTransform: "uppercase", color: "#fff", background: "#8d3c32", padding: "5px 7px", borderRadius: 2 }}>Sale</span>}
      <span style={{ color: onSale ? "#963f34" : "inherit", fontWeight: onSale ? 600 : 400, fontSize: large ? 27 : 15 }}>{money(price)}</span>
      {onSale && <s style={{ color: "#89847b", fontSize: large ? 17 : 12, fontWeight: 400 }}>{money(originalPrice!)}</s>}
      {onSale && <span style={{ color: "#6c665e", fontSize: large ? 11 : 9, letterSpacing: ".08em", fontWeight: 600 }}>{saving}% OFF</span>}
    </div>
  );
}
