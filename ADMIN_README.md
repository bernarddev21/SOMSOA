# SOMSOA Admin – first integration pass

## Included
- `/admin/login`: Supabase email/password sign-in; requires trusted `app_metadata.role = admin`.
- `/admin`: overview and catalogue/event counts.
- `/admin/products`: edits product price, sale price and active state in Supabase.
- `/admin/analytics`: reports consented events recorded in `website_events`.
- First-party page/product view tracker with an opt-in / reject consent prompt.

## Required environment
Copy `.env.example` to `.env.local` and fill in the Supabase Project URL and Publishable key. Keep all secret/service-role keys server-side only; this implementation does not require a service-role key in the browser.

## Install
Run `npm install` after replacing the project files. This project uses `@supabase/supabase-js`; the uploaded source archive did not contain the package dependency installed on the developer's local machine, so npm must resolve it in the destination environment.

## Important limitations in this pass
- Existing storefront product cards and the Stripe checkout endpoint still use `components/products.ts` static prices. The admin catalogue edits are saved to Supabase but are not yet wired through to the storefront or checkout. Do not use price editing for live sales until the checkout is changed to fetch and validate server-side catalogue prices.
- Paid orders/revenue are not persisted to an orders table yet. The dashboard intentionally shows these as unavailable rather than inventing figures.
- Analytics only records page views and product views after consent. Add-to-cart, checkout and purchase events are not yet connected. The purchase event must be tied to verified Stripe webhook events, not browser claims.
- The dashboard uses client-side Supabase auth and relies on the database RLS policies from the migration. Test both admin accounts after signing out/in so refreshed JWTs contain the admin app_metadata claim.
- Before production, add rate limiting / bot protection to public analytics ingestion and review consent wording/privacy policy for UK GDPR/PECR compliance.
