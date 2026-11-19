import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductSelector from "@/components/ProductSelector";
import { getStoreProducts } from "@/lib/products-server";
import PriceDisplay from "@/components/PriceDisplay";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getStoreProducts();
  const product = products.find((item) => item.id === slug);
  if (!product) notFound();

  return (
    <main className="product-page" style={{ background: "#f8f6f1", minHeight: "75vh", padding: "48px 0 80px" }}>
      <div className="container">
        <p style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 24 }}><Link href="/shop">The collection</Link> / {product.name}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 48, alignItems: "center" }}>
          <div style={{ position: "relative", aspectRatio: "1 / 1", background: "#eeece6", borderRadius: 4, overflow: "hidden" }}>
            <Image src={product.image} alt={`SOMSOA ${product.name} heated slippers`} fill priority sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "contain", padding: 20 }} />
          </div>
          <div style={{ maxWidth: 520 }}>
            <span style={{ fontSize: 11, letterSpacing: ".18em" }}>SOMSOA COMFORT COLLECTION</span>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, margin: "16px 0" }}>{product.name}</h1>
            <p style={{ color: "#68645d", lineHeight: 1.8 }}>Thoughtfully designed heated slippers combining luxurious softness with effortless warmth. A considered essential for slower, more comfortable moments.</p>
            <div style={{ margin: "24px 0" }}><PriceDisplay price={product.price} originalPrice={product.originalPrice} size="large" /></div>
            <ProductSelector product={product} />
            <p style={{ fontSize: 12, color: "#777", marginTop: 22 }}>Secure checkout · Tracked delivery options at checkout</p>
          </div>
        </div>
      </div>
    </main>
  );
}
