# SOMSOA sale-price presentation

The storefront now distinguishes the effective selling price from the catalogue price.

- A sale is active only when `sale_price_pence` is non-null and lower than `price_pence`.
- The lower sale price is shown prominently with a SALE label.
- The original catalogue price is crossed out.
- The percentage reduction is calculated from the two database values.
- If the sale price is empty, equal to, or higher than the catalogue price, the normal price is shown without a sale badge.

Updated surfaces: homepage product selectors, shop cards, individual product pages, product selection drawer, and cart items. Stripe checkout continues to obtain the current effective price from the server-side Supabase catalogue.

No database migration is required for this presentation change.
