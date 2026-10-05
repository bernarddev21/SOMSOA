"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Newsletter subscription failed");
      }

      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="newsletter-final" id="newsletter">
      <div className="newsletter-final-background">
        <Image
          src="/images/newsletter-lifestyle.png"
          alt="A quiet, comfortable moment at home"
          fill
          sizes="100vw"
          className="newsletter-final-image"
        />
      </div>

      <div className="newsletter-final-overlay" />

      <div className="newsletter-final-content">
        <div className="newsletter-final-copy">
          <span className="newsletter-final-eyebrow">
            STAY IN THE WARM
          </span>

          <div className="newsletter-final-rule" />

          <h2 className="newsletter-final-title">
            A little more
            <br />
            <em>comfort.</em>
          </h2>

          <p className="newsletter-final-description">
            Join the SOMSOA journal for considered living,
            new releases, private offers and small moments
            of everyday warmth.
          </p>

          <form
            className="newsletter-final-form"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="newsletter-email"
              className="newsletter-final-label"
            >
              YOUR EMAIL ADDRESS
            </label>

            <div className="newsletter-final-input-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                required
                disabled={status === "loading"}
              />

              <button
                type="submit"
                disabled={status === "loading"}
              >
                <span>
                  {status === "loading" ? "SUBSCRIBING" : "SUBSCRIBE"}
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            <span className="newsletter-final-note">
              {status === "success"
                ? "Thank you. You're now part of the SOMSOA journal."
                : status === "error"
                  ? "Something went wrong. Please try again."
                  : "No noise. Just thoughtful updates from SOMSOA."}
            </span>
          </form>
        </div>
      </div>

      <div className="newsletter-final-footer">
  <span className="newsletter-final-brand">
    SOMSOA
  </span>

  <div className="newsletter-final-legal">
    <Link href="/shipping">SHIPPING</Link>
    <Link href="/returns">RETURNS</Link>
    <Link href="/warranty">WARRANTY</Link>
    <Link href="/privacy-policy">PRIVACY</Link>
    <Link href="/terms">TERMS</Link>
    <Link href="/contact">CONTACT</Link>
  </div>

  <span className="newsletter-final-tagline">
    WARMTH FOR A CALMER TOMORROW
  </span>

  <a href="#top" className="newsletter-final-top">
    BACK TO TOP <span aria-hidden="true">↑</span>
  </a>
</div>
    </section>
  );
}