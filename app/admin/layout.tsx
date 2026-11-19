
'use client';

import { useState } from 'react';
import Link from 'next/link';
import './admin.css';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products & pricing' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/discounts', label: 'Discount codes' },
  { href: '/admin/analytics', label: 'Website analytics' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          SOMSOA <span>CONTROL CENTRE</span>
        </Link>

        <nav>
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="admin-sidebar-note">
          Private administration
        </p>
      </aside>

      <header className="admin-mobile-header">
        <Link className="admin-brand" href="/admin">
          SOMSOA <span>CONTROL CENTRE</span>
        </Link>

        <button
          type="button"
          className="admin-mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {menuOpen && (
          <nav className="admin-mobile-nav">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
