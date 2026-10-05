"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          SOMSOA
        </Link>

        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <Link href="#collection" onClick={() => setMenuOpen(false)}>
            Collection
          </Link>

          <Link href="#comfort" onClick={() => setMenuOpen(false)}>
            The Experience
          </Link>

          <Link href="#details" onClick={() => setMenuOpen(false)}>
            Details
          </Link>
        </nav>

        <div className="header-actions">
          <Link href="#collection" className="shop-link">
            Shop Now
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}