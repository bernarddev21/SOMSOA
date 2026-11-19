-- Run this additional migration in Supabase SQL Editor AFTER the original SOMSOA admin migration.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text null,
  customer_name text null,
  customer_email text null,
  customer_phone text null,
  shipping_address jsonb null,
  currency text not null default 'gbp',
  subtotal_pence integer not null default 0,
  shipping_pence integer not null default 0,
  discount_pence integer not null default 0,
  total_pence integer not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('paid','unpaid','failed','no_payment_required')),
  fulfilment_status text not null default 'unfulfilled' check (fulfilment_status in ('unfulfilled','processing','dispatched','delivered','cancelled')),
  items jsonb not null default '[]'::jsonb,
  shipping_region text null,
  shipping_country text null,
  discount_code text null,
  discount_consumed_at timestamptz null,
  stripe_created_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_payment_idx on public.orders(payment_status,created_at desc);
create index if not exists orders_email_idx on public.orders(customer_email);
alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select, update on public.orders to authenticated;
drop policy if exists "Admins read and update orders" on public.orders;
create policy "Admins read and update orders" on public.orders for select to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin');
drop policy if exists "Admins update order fulfilment" on public.orders;
create policy "Admins update order fulfilment" on public.orders for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='admin') with check ((auth.jwt()->'app_metadata'->>'role')='admin');

alter table public.discount_codes add column if not exists max_uses integer null check (max_uses is null or max_uses > 0);
alter table public.discount_codes add column if not exists used_count integer not null default 0 check (used_count >= 0);

create or replace function public.consume_discount_code(p_code text)
returns boolean language plpgsql security definer set search_path=public as $$
declare changed integer;
begin
 update public.discount_codes set used_count=used_count+1
 where code=upper(trim(p_code)) and active=true
 and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>now())
 and (max_uses is null or used_count<max_uses);
 get diagnostics changed = row_count;
 return changed=1;
end; $$;
revoke all on function public.consume_discount_code(text) from public;
grant execute on function public.consume_discount_code(text) to service_role;

-- Increment discount usage exactly once per paid Stripe Checkout session.
create or replace function public.consume_order_discount(p_session_id text)
returns boolean language plpgsql security definer set search_path=public as $$
declare order_row public.orders%rowtype; changed integer;
begin
 select * into order_row from public.orders where stripe_session_id=p_session_id for update;
 if not found or order_row.payment_status <> 'paid' or order_row.discount_code is null or order_row.discount_consumed_at is not null then return false; end if;
 update public.discount_codes set used_count=used_count+1
 where code=order_row.discount_code and (max_uses is null or used_count<max_uses);
 get diagnostics changed = row_count;
 if changed=1 then update public.orders set discount_consumed_at=now() where id=order_row.id; return true; end if;
 return false;
end; $$;
revoke all on function public.consume_order_discount(text) from public;
grant execute on function public.consume_order_discount(text) to service_role;
