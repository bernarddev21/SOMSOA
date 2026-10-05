import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              SOMSOA
            </Link>

            <p>
              Intelligent warmth and everyday comfort, designed for the moments
              when you choose to slow down.
            </p>

            <a
              href="mailto:hello@somsoa.co.uk"
              className="footer-email"
              aria-label="Email SOMSOA"
            >
              <Mail size={16} strokeWidth={1.5} />
              hello@somsoa.co.uk
            </a>
          </div>

          <div className="footer-links">
            <div>
              <span className="footer-heading">Shop</span>

              <Link href="#collection">
                All Products
              </Link>

              <Link href="#collection">
                Black
              </Link>

              <Link href="#collection">
                Blue
              </Link>

              <Link href="#collection">
                Pink
              </Link>
            </div>

            <div>
              <span className="footer-heading">Company</span>

              <Link href="/about">
                About SOMSOA
              </Link>

              <Link href="/contact">
                Contact
              </Link>

              <Link href="/faq">
                FAQ
              </Link>
            </div>

            <div>
              <span className="footer-heading">Support</span>

              <Link href="/shipping">
                Shipping
              </Link>

              <Link href="/returns">
                Returns
              </Link>

              <Link href="/warranty">
                Warranty
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-newsletter">
          <div>
            <span className="eyebrow">
              Stay in the loop
            </span>

            <h3>
              Comfort, delivered to your inbox.
            </h3>
          </div>

          <form className="newsletter-form">
            <label
              htmlFor="footer-email"
              className="sr-only"
            >
              Email address
            </label>

            <input
              id="footer-email"
              type="email"
              placeholder="Your email address"
            />

            <button
              type="submit"
              aria-label="Subscribe to newsletter"
            >
              Join
            </button>
          </form>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SOMSOA. All rights reserved.
          </span>

          <div className="footer-bottom-links">
            <Link href="/privacy">
              Privacy
            </Link>

            <Link href="/terms">
              Terms
            </Link>

            <a
              href="https://www.instagram.com/somsoa.uk/"
              target="_blank"
              rel="noreferrer"
              aria-label="SOMSOA on Instagram"
              className="social-link"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.75"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}