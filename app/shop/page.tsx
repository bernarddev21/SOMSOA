import Image from 'next/image';
import Link from 'next/link';
import { getStoreProducts } from '@/lib/products-server';
import PriceDisplay from '@/components/PriceDisplay';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getStoreProducts();
  return (
    <main className="shop-page">
      <section className="shop-hero">
        <div className="container shop-hero-inner">
          <div className="shop-hero-copy">
            <span className="section-eyebrow">THE SOMSOA COLLECTION</span>
            <h1>Find your<br /><em>comfort.</em></h1>
            <p>Thoughtfully designed heated slippers combining luxurious softness with effortless warmth.</p>
          </div>
          <div className="shop-hero-meta"><span>01 / COLLECTION</span><p>Considered shades.<br />One unmistakable feeling.</p></div>
        </div>
      </section>
      <section className="shop-collection" id="collection">
        <div className="container">
          <div className="shop-collection-header">
            <div><span className="section-eyebrow">SOMSOA SLIPPERS</span><h2>Designed for<br /><em>slower moments.</em></h2></div>
            <p>Every pair is built around the same idea: warmth should feel effortless.</p>
          </div>
          <div className="shop-product-grid">
            {products.map((product, index) => (
              <article className="shop-product-card" key={product.id}>
                <Link href={`/products/${product.id}`} className="shop-product-image">
                  <Image src={product.image} alt={`SOMSOA ${product.name} heated slippers`} fill sizes="(max-width: 768px) 100vw, 50vw" className="shop-product-img" />
                  <span className="shop-product-index">{String(index + 1).padStart(2, '0')}</span>
                </Link>
                <div className="shop-product-info">
                  <div><span className="shop-product-category">HEATED SLIPPER / {product.name.toUpperCase()}</span><h3>{product.name}</h3><p>{product.colour} heated slippers, designed for everyday comfort.</p></div>
                  <div className="shop-product-bottom"><PriceDisplay price={product.price} originalPrice={product.originalPrice} align="right" /><Link href={`/products/${product.id}`} className="shop-product-link">Discover <span>↗</span></Link></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
