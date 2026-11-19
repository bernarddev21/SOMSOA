# SOMSOA live catalogue and checkout integration

## What this version does

- The homepage and shop catalogue read active products and current prices from Supabase.
- Product detail routes (`/products/midnight`, `/products/ocean`, `/products/blush`) load the matching active product from Supabase.
- The browser cart restores saved items, refreshes their price and removes products that have since been deactivated.
- Stripe Checkout retrieves the current active product record from Supabase on the server for every line item. It does not trust a browser-supplied price.
- Sale price is used when present; otherwise the regular price is used. Prices are stored in integer pence.

## Required environment variables

Create `.env.local` in the same directory as `package.json` and copy your own values into it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET
```

Never commit `.env.local` or share secret keys. The Supabase products table must allow public read access to active catalogue rows and admin-only writes, as configured in the database setup previously run for this project.

## Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000` and `http://localhost:3000/admin`.

Before deployment, run `npm run build` and test a Stripe test-mode checkout. The local build could not be independently verified in the packaging environment because dependency installation timed out.

## Important scope notes

This package completes the live product-price path (admin catalogue -> storefront/product page/cart -> server-validated Stripe line items). The current Stripe webhook still logs paid order details rather than saving a durable order record, so persistent order management and revenue reporting in the admin panel are not yet implemented. Discount-code administration is also not included in this integration. Do not treat the current analytics consent UI as legal compliance by itself; review privacy/cookie requirements before production.
