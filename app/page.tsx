import Image from "next/image";
import CartButton from "../components/CartButton";
import ProductSelector from "../components/ProductSelector";
import { PRODUCTS } from "../components/products";
import Newsletter from "../components/home/Newsletter";

export default function Home() {
  return (
    <main id="top">

      {/* =========================
          SITE HEADER
      ========================== */}

      <header className="site-header">
        <div className="site-header-inner">

          <a
            href="#top"
            className="site-logo"
            aria-label="SOMSOA home"
          >
            SOMSOA
          </a>

          <nav
            className="site-nav"
            aria-label="Main navigation"
          >
            <a href="#collection">
              Collection
            </a>

            <a href="#experience">
              Experience
            </a>

            <a href="#how-it-works">
              How It Works
            </a>
          </nav>

          <CartButton />

        </div>
      </header>


      {/* =========================
          HERO
      ========================== */}

      <section className="hero">

        <div className="hero-background">

          <Image
            src="/images/hero-slippers.png"
            alt="SOMSOA heated slippers"
            fill
            priority
            sizes="100vw"
            className="hero-bg-image"
          />

        </div>

        <div className="hero-overlay" />

        <div className="container hero-content">

          <div className="hero-copy">

            <span className="eyebrow">
              SOMSOA COMFORT COLLECTION
            </span>

            <h1>
              Comfort,
              <br />
              <em>elevated.</em>
            </h1>

            <p>
              Luxurious softness. Effortless warmth.
              <br />
              Thoughtful design for moments that matter.
            </p>

            <div className="hero-actions">

              <a
                href="#collection"
                className="btn btn-primary"
              >
                Explore Collection
              </a>

              <a
                href="#experience"
                className="btn btn-secondary"
              >
                Discover SOMSOA
              </a>

            </div>

          </div>

        </div>

      </section>


            {/* =========================
    COLLECTION
========================== */}

<section
  id="collection"
  className="collection"
>
  <div className="container">

    <div className="collection-intro">

      <div>

        <span className="collection-eyebrow">
          THE COLLECTION
        </span>

        <h2>
          Choose your <em>comfort.</em>
        </h2>

      </div>

      <p className="collection-description">
        Three timeless shades. One unmistakable feeling.
      </p>

    </div>


    {/* =========================
        PRODUCT GRID
    ========================== */}

    <div className="collection-grid">


      {/* =========================
          MIDNIGHT
      ========================== */}

      <article className="collection-product">

        <div className="collection-card">

          <div className="collection-card-image">

            <Image
              src={PRODUCTS[0].image}
              alt="Midnight SOMSOA heated slippers"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className="product-image"
            />

          </div>

          <div className="collection-card-overlay" />

          <div className="collection-card-content">

            <div>

              <span className="collection-card-number">
                01 / MIDNIGHT
              </span>

              <h3>
                Midnight
              </h3>

            </div>

          </div>

        </div>

        <ProductSelector
          product={PRODUCTS[0]}
        />

        <div className="collection-stock">
          <span className="collection-stock-label">
            IN STOCK IN THE UK
          </span>

          <span className="collection-stock-detail">
            Normally dispatched within 1 working day
          </span>
        </div>

      </article>


      {/* =========================
          OCEAN
      ========================== */}

      <article className="collection-product">

        <div className="collection-card">

          <div className="collection-card-image">

            <Image
              src={PRODUCTS[1].image}
              alt="Ocean SOMSOA heated slippers"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className="product-image"
            />

          </div>

          <div className="collection-card-overlay" />

          <div className="collection-card-content">

            <div>

              <span className="collection-card-number">
                02 / OCEAN
              </span>

              <h3>
                Ocean
              </h3>

            </div>

          </div>

        </div>

        <ProductSelector
          product={PRODUCTS[1]}
        />

        <div className="collection-stock">
          <span className="collection-stock-label">
            IN STOCK IN THE UK
          </span>

          <span className="collection-stock-detail">
            Normally dispatched within 1 working day
          </span>
        </div>

      </article>


      {/* =========================
          BLUSH
      ========================== */}

      <article className="collection-product">

        <div className="collection-card">

          <div className="collection-card-image">

            <Image
              src={PRODUCTS[2].image}
              alt="Blush SOMSOA heated slippers"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className="product-image"
            />

          </div>

          <div className="collection-card-overlay" />

          <div className="collection-card-content">

            <div>

              <span className="collection-card-number">
                03 / BLUSH
              </span>

              <h3>
                Blush
              </h3>

            </div>

          </div>

        </div>

        <ProductSelector
          product={PRODUCTS[2]}
        />

        <div className="collection-stock">
          <span className="collection-stock-label">
            IN STOCK IN THE UK
          </span>

          <span className="collection-stock-detail">
            Normally dispatched within 1 working day
          </span>
        </div>

      </article>


    </div>

  </div>

</section>
      {/* =========================
          EXPERIENCE
      ========================== */}

      <section
        id="experience"
        className="experience"
      >

        <div className="experience-background">

          <Image
            src="/images/somsoa-lifestyle.png"
            alt="Relaxing at home in SOMSOA slippers"
            fill
            className="experience-bg-image"
          />

        </div>

        <div className="experience-overlay" />

        <div className="container experience-container">

          <div className="experience-copy">

            <span className="collection-eyebrow">
              THE SOMSOA EXPERIENCE
            </span>

            <h2>
              More than warmth.
              <br />
              <em>A better way to unwind.</em>
            </h2>

            <p className="experience-description">
              SOMSOA brings together softness, warmth and thoughtful
              design to create an experience you can feel from the
              moment you slip them on.
            </p>

          </div>


          <div className="experience-features">

            <article className="experience-feature">

              <span className="feature-number">
                01
              </span>

              <div className="feature-text">

                <h3>Gentle warmth</h3>

                <p>
                  Designed to provide a soothing layer of warmth
                  when your feet need it most.
                </p>

              </div>

            </article>


            <article className="experience-feature">

              <span className="feature-number">
                02
              </span>

              <div className="feature-text">

                <h3>Plush by design</h3>

                <p>
                  Plush materials and a soft interior make every
                  step feel effortlessly luxurious.
                </p>

              </div>

            </article>


            <article className="experience-feature">

              <span className="feature-number">
                03
              </span>

              <div className="feature-text">

                <h3>Made for your moments</h3>

                <p>
                  Whether you're relaxing at home or winding down
                  after a long day, everything you need to slow down
                  is right at your feet.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="container">

          <div className="how-it-works-heading">

            <div className="how-it-works-title">

              <span className="section-eyebrow">
                HOW IT WORKS
              </span>

              <h2>
                Thoughtful technology.
                <br />
                <em>Effortless living.</em>
              </h2>

            </div>

            <p className="how-it-works-description">
              Integrated heating technology designed to deliver
              simple, adjustable warmth whenever you need it.
            </p>

          </div>


          <div className="technology-showcase">

            <div className="technology-showcase-header">

              <div>

                <span className="technology-kicker">
                  SOMSOA SLIPPER
                </span>

                <h3>
                  Designed with intention.
                </h3>

              </div>

              <span className="technology-index">
                01 / TECHNOLOGY
              </span>

            </div>


            <div className="technology-visual">

              <Image
                src="/images/somsoa-technology.png"
                alt="SOMSOA heated slipper technology"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 1120px"
                className="technology-visual-image"
              />

            </div>


            <div className="technology-showcase-footer">

              <span>
                ENGINEERED FOR EVERYDAY
              </span>

              <p>
                Carefully considered components work together
                beneath the surface to create a simpler,
                more refined experience.
              </p>

            </div>

          </div>


          {/* HOW IT WORKS STEPS */}

          <div className="how-it-works-steps">


            {/* STEP 01 */}

            <article className="how-step">

              <div className="how-step-top">

                <div className="how-step-meta">

                  <span className="how-step-label">
                    CHARGE
                  </span>

                </div>

                <div className="how-step-image-wrap">

                  <Image
                    src="/images/how-it-works-plug.png"
                    alt="SOMSOA charging plug"
                    width={150}
                    height={150}
                    className="how-step-image"
                  />

                </div>

              </div>

              <div className="how-step-content">

                <h3>Power up.</h3>

                <p>
                  Connect your SOMSOA slippers and power them up
                  before settling into your evening.
                </p>

              </div>

            </article>


            {/* STEP 02 */}

            <article className="how-step">

              <div className="how-step-top">

                <div className="how-step-meta">

                  <span className="how-step-label">
                    WARM
                  </span>

                </div>

                <div className="how-step-image-wrap">

                  <Image
                    src="/images/how-it-works-thermostat.png"
                    alt="SOMSOA temperature control"
                    width={150}
                    height={150}
                    className="how-step-image"
                  />

                </div>

              </div>

              <div className="how-step-content">

                <h3>Choose your warmth.</h3>

                <p>
                  Select the heat level that feels right for you
                  and let the integrated heating system work quietly
                  beneath the surface.
                </p>

              </div>

            </article>


            {/* STEP 03 */}

            <article className="how-step">

              <div className="how-step-top">

                <div className="how-step-meta">

                  <span className="how-step-label">
                    RELAX
                  </span>

                </div>

                <div className="how-step-image-wrap">

                  <Image
                    src="/images/how-it-works-chair.png"
                    alt="SOMSOA slippers beside a comfortable chair"
                    width={150}
                    height={150}
                    className="how-step-image"
                  />

                </div>

              </div>

              <div className="how-step-content">

                <h3>Settle in.</h3>

                <p>
                  Slip them on, settle in and switch off with
                  effortless ease after a long day.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =========================
          SOMSOA STANDARD
      ========================== */}

      <section
        className="somsoa-standard"
        id="standard"
      >

        <div className="standard-hero">


          {/* LEFT — EDITORIAL */}

          <div className="standard-editorial">

            <span className="standard-eyebrow">
              THE SOMSOA STANDARD
            </span>

            <h2 className="standard-title">
              The details,
              <br />
              <em>considered.</em>
            </h2>

            <div className="standard-rule" />

            <p className="standard-intro">
              At SOMSOA, we believe true comfort is found in the details.
              Every material, every element and every decision is made to
              elevate the moments that matter most.
            </p>

            <a
              href="#standard"
              className="standard-link"
            >
              <span>OUR APPROACH</span>
              <span className="standard-arrow">→</span>
            </a>

          </div>


          {/* RIGHT — PRODUCT IMAGE */}

          <div className="standard-visual">

            <div className="standard-image-wrap">

              <Image
                src="/images/somsoa-top-right.png"
                alt="Close-up of a SOMSOA heated slipper"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                className="standard-image"
              />

            </div>

            <div className="standard-image-mark">
              <span>S</span>
            </div>

          </div>

        </div>


        {/* THREE PRINCIPLES */}

        <div className="standard-principles">


          {/* SOFTNESS */}

          <article
            className="standard-principle"
            style={{
              backgroundImage:
                "url('/images/standard-softness.png')",
            }}
          >

            <div className="principle-content">

              <div className="principle-copy">

                <span className="principle-label">
                  SOFTNESS
                </span>

                <span className="principle-line" />

                <h3>
                  Made to be
                  <br />
                  lived in.
                </h3>

                <p>
                  Plush, premium materials gently embrace your feet,
                  delivering softness you can feel with every step.
                </p>

                <span className="principle-arrow">
                  →
                </span>

              </div>

            </div>

          </article>


          {/* WARMTH */}

          <article
            className="standard-principle"
            style={{
              backgroundImage:
                "url('/images/standard-warmth.png')",
            }}
          >

            <div className="principle-content">

              <div className="principle-copy">

                <span className="principle-label">
                  WARMTH
                </span>

                <span className="principle-line" />

                <h3>
                  Warmth when
                  <br />
                  you want it.
                </h3>

                <p>
                  Integrated heating technology gives you adjustable
                  warmth that feels natural, effortless and perfectly balanced.
                </p>

                <span className="principle-arrow">
                  →
                </span>

              </div>

            </div>

          </article>


          {/* SIMPLICITY */}

          <article
            className="standard-principle"
            style={{
              backgroundImage:
                "url('/images/standard-simplicity.png')",
            }}
          >

            <div className="principle-content">

              <div className="principle-copy">

                <span className="principle-label">
                  SIMPLICITY
                </span>

                <span className="principle-line" />

                <h3>
                  Nothing
                  <br />
                  complicated.
                </h3>

                <p>
                  Simple to use, easy to recharge and designed to fit
                  seamlessly into your everyday routine.
                </p>

                <span className="principle-arrow">
                  →
                </span>

              </div>

            </div>

          </article>

        </div>

      </section>


                  {/* =========================
          REVIEWS
      ========================== */}

      <section className="reviews" id="reviews">
        <div className="reviews-inner">
          <div className="reviews-header">
            <div>
              <span className="reviews-eyebrow">
                CUSTOMER STORIES
              </span>

              <h2 className="reviews-title">
                Loved for the
                <br />
                <em>little things.</em>
              </h2>
            </div>

            <p className="reviews-intro">
              Thoughtfully made comfort, appreciated by the people
              who make SOMSOA part of their everyday.
            </p>
          </div>

          <div className="reviews-grid">
            <article className="review-card">
              <div className="review-top">
                <span
                  className="review-stars"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </span>
                <span className="review-number">01</span>
              </div>

              <blockquote>
                “The kind of comfort you don't realise you've been missing.
                I've worn mine every evening since they arrived — my feet are
                finally warm through winter.”
              </blockquote>

              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  HR
                </span>

                <div className="review-meta">
                  <span className="review-name">Hannah R.</span>
                  <span className="review-detail">
                    Verified purchase · Midnight
                  </span>
                </div>
              </div>
            </article>

            <article className="review-card">
              <div className="review-top">
                <span
                  className="review-stars"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </span>
                <span className="review-number">02</span>
              </div>

              <blockquote>
                “Warm, incredibly comfortable and beautifully simple to use —
                charged mine on Sunday and it lasted the whole week.”
              </blockquote>

              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  TB
                </span>

                <div className="review-meta">
                  <span className="review-name">Tom B.</span>
                  <span className="review-detail">
                    Verified purchase · Ocean
                  </span>
                </div>
              </div>
            </article>

            <article className="review-card">
              <div className="review-top">
                <span
                  className="review-stars"
                  aria-label="5 out of 5 stars"
                >
                  ★★★★★
                </span>
                <span className="review-number">03</span>
              </div>

              <blockquote>
                “They've quickly become the first thing I reach for in the
                evening — even on our cold kitchen floor.”
              </blockquote>

              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  PK
                </span>

                <div className="review-meta">
                  <span className="review-name">Priya K.</span>
                  <span className="review-detail">
                    Verified purchase · Blush
                  </span>
                </div>
              </div>
            </article>

            <article className="review-card">
              <div className="review-top">
                <span
                  className="review-stars"
                  aria-label="4 out of 5 stars"
                >
                  ★★★★☆
                </span>
                <span className="review-number">04</span>
              </div>

              <blockquote>
                “I love how gently the warmth builds instead of feeling too
                intense straight away. It stays warm for such a long time,
                making evenings at home feel that much more comfortable.”
              </blockquote>

              <div className="review-author">
                <span className="review-avatar" aria-hidden="true">
                  CT
                </span>

                <div className="review-meta">
                  <span className="review-name">Claire T.</span>
                  <span className="review-detail">
                    Verified purchase · Midnight
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="final-cta" id="shop">
        <div className="final-cta-inner">
          <span className="final-cta-eyebrow">
            YOUR EVENING, ELEVATED.
          </span>

          <h2 className="final-cta-title">
            Come home
            <br />
            <em>to comfort.</em>
          </h2>

          <p className="final-cta-description">
            Choose the shade that suits your space, slip into
            considered warmth, and make more room for the moments
            that help you unwind.
          </p>

          <div className="final-cta-actions">
  <a
    href="#collection"
    className="final-cta-link"
    aria-label="Choose your SOMSOA slipper shade"
  >
    <span>CHOOSE YOUR SHADE</span>
    <span className="final-cta-arrow" aria-hidden="true">
      →
    </span>
  </a>
</div>

        </div>
      </section>
            {/* =========================
          NEWSLETTER
      ========================== */}

      <Newsletter />

    </main>
  );
}