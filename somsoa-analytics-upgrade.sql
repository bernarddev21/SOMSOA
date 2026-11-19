-- SOMSOA ecommerce analytics upgrade
-- Run in Supabase SQL Editor after confirming public.website_events exists.
-- This makes the purchase event idempotent per browser session. Revenue remains
-- sourced from public.orders, not from client-submitted analytics events.

create index if not exists website_events_created_at_idx
  on public.website_events (created_at desc);

create index if not exists website_events_type_created_at_idx
  on public.website_events (event_type, created_at desc);

create unique index if not exists website_events_one_purchase_per_session_idx
  on public.website_events (session_id)
  where event_type = 'purchase' and session_id is not null;
