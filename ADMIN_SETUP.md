# SOMSOA admin setup: orders and discounts

## 1. Environment variables

Keep secrets in `.env.local` at the project root. Never commit or share that file. Required server-only variables:

- `SUPABASE_SERVICE_ROLE_KEY` — Supabase secret/service-role key (server only)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

The Supabase URL and publishable key are also required for storefront reads and browser sign-in. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and Brevo variables are only needed by features already using them.

## 2. Database migration

In Supabase SQL Editor, run `somsoa-orders-discounts-migration.sql` after the original `somsoa-admin-migration.sql` has been applied. It creates the orders table and discount usage controls. The service-role key bypasses RLS and must never be used in browser code.

## 3. Stripe webhook

Configure the Stripe webhook endpoint as:

`https://YOUR_DOMAIN/api/stripe/webhook`

Subscribe to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Use the signing secret for that endpoint as `STRIPE_WEBHOOK_SECRET`. For local testing use Stripe CLI forwarding to `http://localhost:3000/api/stripe/webhook` and its generated signing secret.

## 4. Admin pages

- `/admin/orders`: verified Stripe Checkout sessions saved idempotently by Stripe session ID; manual fulfilment status updates.
- `/admin/discounts`: create percentage/fixed-amount codes, set minimum spend, optional expiry and maximum uses, enable/disable codes.
- `/admin`: paid order count and revenue from the orders table.

Discount fixed values are entered in pence in the database-backed UI (e.g. £5.00 = 500). Percentage discounts are whole percentages. Discount use is counted on the first paid webhook delivery, not when a checkout session is merely created.

## 5. Test before live launch

1. Use Stripe test-mode keys and a test webhook signing secret.
2. Run `npm install` and `npm run build`.
3. Run `npm run dev` and sign into `/admin` with an account whose protected `app_metadata.role` is `admin`.
4. Create a test discount code and check it is applied at checkout.
5. Complete a Stripe test payment; confirm exactly one order appears in `/admin/orders` and revenue updates on `/admin`.
6. Send the same webhook event again from Stripe; confirm the order is not duplicated and discount use is not incremented twice.
7. Test failed/delayed payments and fulfilment updates.
8. Only after these pass, configure live Stripe keys and the production webhook endpoint.

## Important limitations

- The admin browser session uses the existing Supabase Auth client and RLS policies. Ensure the original admin migration is installed and the two intended users have protected `app_metadata.role = admin`.
- This project package does not contain `.env.local` or any secret keys.
- Production testing cannot be performed from this generated archive; it requires your own Supabase project, Stripe dashboard/webhook and deployment domain.
