import Image from "next/image";

export default function ShopPage() {
  return (
    <main className="shop-page">

      {/* =========================
          SHOP HERO
      ========================== */}
      <section className="shop-hero">
        <div className="container shop-hero-inner">

          <div className="shop-hero-copy">
            <span className="section-eyebrow">
              THE SOMSOA COLLECTION
            </span>

            <h1>
              Find your
              <br />
              <em>comfort.</em>
            </h1>

            <p>
              Thoughtfully designed heated slippers combining
              luxurious softness with effortless warmth.
            </p>
          </div>

          <div className="shop-hero-meta">
            <span>01 / COLLECTION</span>

            <p>
              Three considered shades.
              <br />
              One unmistakable feeling.
            </p>
          </div>

        </div>
      </section>


      {/* =========================
          PRODUCT COLLECTION
      ========================== */}
      <section
        className="shop-collection"
        id="collection"
      >
        <div className="container">

          <div className="shop-collection-header">

            <div>
              <span className="section-eyebrow">
                SOMSOA SLIPPERS
              </span>

              <h2>
                Designed for
                <br />
                <em>slower moments.</em>
              </h2>
            </div>

            <p>
              Every pair is built around the same idea:
              warmth should feel effortless.
            </p>

          </div>


          <div className="shop-product-grid">

            {/* =========================
                MIDNIGHT
            ========================== */}
            <article className="shop-product-card">

              <a
                href="/products/midnight"
                className="shop-product-image"
              >
                <Image
                  src="/images/Black%20Heated%20Slippers.png"
                  alt="SOMSOA Midnight heated slippers"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="shop-product-img"
                />

                <span className="shop-product-index">
                  01
                </span>
              </a>


              <div className="shop-product-info">

                <div>
                  <span className="shop-product-category">
                    HEATED SLIPPER / MIDNIGHT
                  </span>

                  <h3>Midnight</h3>

                  <p>
                    Quiet, understated and effortlessly versatile.
                  </p>
                </div>


                <div className="shop-product-bottom">

                  <span className="shop-product-price">
                    £79.00
                  </span>

                  <a
                    href="/products/midnight"
                    className="shop-product-link"
                  >
                    Discover
                    <span>↗</span>
                  </a>

                </div>

              </div>

            </article>


            {/* =========================
                OCEAN
            ========================== */}
            <article className="shop-product-card">

              <a
                href="/products/ocean"
                className="shop-product-image"
              >
                <Image
                  src="/images/Blue%20Heated%20Slippers.png"
                  alt="SOMSOA Ocean heated slippers"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="shop-product-img"
                />

                <span className="shop-product-index">
                  02
                </span>
              </a>


              <div className="shop-product-info">

                <div>
                  <span className="shop-product-category">
                    HEATED SLIPPER / OCEAN
                  </span>

                  <h3>Ocean</h3>

                  <p>
                    A deeper tone for quiet evenings and colder days.
                  </p>
                </div>


                <div className="shop-product-bottom">

                  <span className="shop-product-price">
                    £79.00
                  </span>

                  <a
                    href="/products/ocean"
                    className="shop-product-link"
                  >
                    Discover
                    <span>↗</span>
                  </a>

                </div>

              </div>

            </article>


            {/* =========================
                BLUSH
            ========================== */}
            <article className="shop-product-card">

              <a
                href="/products/blush"
                className="shop-product-image"
              >
                <Image
                  src="/images/Pink.png"
                  alt="SOMSOA Blush heated slippers"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="shop-product-img"
                />

                <span className="shop-product-index">
                  03
                </span>
              </a>


              <div className="shop-product-info">

                <div>
                  <span className="shop-product-category">
                    HEATED SLIPPER / BLUSH
                  </span>

                  <h3>Blush</h3>

                  <p>
                    Soft in tone, warm in feel and made to unwind.
                  </p>
                </div>


                <div className="shop-product-bottom">

                  <span className="shop-product-price">
                    £79.00
                  </span>

                  <a
                    href="/products/blush"
                    className="shop-product-link"
                  >
                    Discover
                    <span>↗</span>
                  </a>

                </div>

              </div>

            </article>

          </div>

        </div>
      </section>


      {/* =========================
          PRODUCT STATEMENT
      ========================== */}
      <section className="shop-statement">

        <div className="container">

          <div className="shop-statement-inner">

            <span className="section-eyebrow">
              THE SOMSOA STANDARD
            </span>

            <h2>
              Warmth,
              <br />
              <em>without compromise.</em>
            </h2>

            <p>
              Plush materials, considered construction and
              integrated heating come together in a slipper
              designed to make everyday comfort feel exceptional.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FEATURE STRIP
      ========================== */}
      <section className="shop-features">

        <div className="container">

          <div className="shop-features-grid">

            {/* FEATURE 01 */}
            <article className="shop-feature">

              <span>01</span>

              <div>
                <small>WARMTH</small>

                <h3>
                  Adjustable heat.
                </h3>

                <p>
                  Choose the warmth that feels right
                  and settle into your evening.
                </p>
              </div>

            </article>


            {/* FEATURE 02 */}
            <article className="shop-feature">

              <span>02</span>

              <div>
                <small>COMFORT</small>

                <h3>
                  Plush by design.
                </h3>

                <p>
                  Soft materials surround every step
                  with a feeling of effortless comfort.
                </p>
              </div>

            </article>


            {/* FEATURE 03 */}
            <article className="shop-feature">

              <span>03</span>

              <div>
                <small>SIMPLICITY</small>

                <h3>
                  Made to unwind.
                </h3>

                <p>
                  Simple controls and thoughtful details
                  keep everything wonderfully uncomplicated.
                </p>
              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =========================
          SHOP CLOSING SECTION
      ========================== */}
      <section className="shop-closing">

        <div className="shop-closing-background">

          <Image
            src="/images/shop-closing-background.png"
            alt="Soft botanical shadows on a warm cream background"
            fill
            sizes="100vw"
            className="shop-closing-image"
          />

        </div>


        <div className="container shop-closing-content">

          <span className="section-eyebrow">
            YOUR EVENING, ELEVATED
          </span>

          <h2>
            Come home
            <br />
            to <em>comfort.</em>
          </h2>

          <p>
            Thoughtfully designed warmth for
            <br />
            slower evenings and softer mornings.
          </p>

          <a
            href="#collection"
            className="btn btn-primary"
          >
            Explore the collection
            <span aria-hidden="true"> →</span>
          </a>

        </div>

      </section>


    </main>
  );
}