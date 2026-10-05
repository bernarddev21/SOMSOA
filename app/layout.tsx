import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { CartProvider } from "../components/CartProvider";
import CartUI from "../components/CartUI";


const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yourdomain.com"), // replace with your real domain
  title: {
    default: "SOMSOA | Luxury Heated Slippers",
    template: "%s | SOMSOA",
  },
  description:
    "Luxury heated slippers with plush softness and adjustable warmth. Designed for calmer evenings.",
  openGraph: {
    title: "SOMSOA | Luxury Heated Slippers",
    description: "Comfort, elevated. Luxury heated slippers designed for slower evenings.",
    siteName: "SOMSOA",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartUI />
        </CartProvider>
      </body>
    </html>
  );
}