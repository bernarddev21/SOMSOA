# SOMSOA ecommerce analytics upgrade

## What's included
- Consent-gated page views and product views in `public.website_events`.
- Consent-gated `add_to_cart` and `checkout_started` events.
- Purchase funnel events inserted server-side only after a verified Stripe webhook confirms payment.
- Purchase event attribution uses browser visitor/session identifiers attached to Checkout Session metadata only when the visitor accepted analytics.
- Revenue, average order value and product sales are calculated from paid rows in `public.orders`, never from browser events.
- Admin analytics period selector for 7, 30 and 90 days, with funnel, revenue trend, source and product summaries.

## One additional SQL step
Run `somsoa-analytics-upgrade.sql` in Supabase SQL Editor. It adds query indexes and a unique partial index so a browser session cannot be counted as multiple purchase sessions by repeated webhook deliveries. It does not create a second analytics table.

## Important measurement notes
- Visitors who reject analytics are not included in browser/session funnel metrics. Their paid orders still appear in financial revenue and order reporting.
- Unique browsers are browser identifiers, not verified unique people.
- Funnel rates are session-based: add-to-cart sessions / tracked sessions, checkout sessions / cart sessions, and purchase sessions / tracked sessions.
- Traffic source classification is best-effort and uses UTM source/medium when present, otherwise referrer domain. It is not an advertising attribution platform.
- Cart abandonment is not presented as a definitive metric: the current implementation does not have a defined abandonment timeout or cross-device identity.
- Revenue includes paid order totals (including shipping and after discounts) as recorded by Stripe in the orders table. Refunds and chargebacks are not yet netted out.

## Required configuration
Keep all secrets in local `.env.local` and in the hosting provider's server-side environment settings. Never add service-role, Stripe secret, or webhook signing keys to `NEXT_PUBLIC_` variables or commit them to source control.
