import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 500 });
  const stripe = new Stripe(secret);
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, webhookSecret); }
  catch { return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 }); }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const isPaid = session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded';
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
      const shipping = session.collected_information?.shipping_details;
      const customerAddress = session.customer_details?.address;
      const address = shipping?.address ?? customerAddress;
      const itemSummary = lineItems.data.map((item) => ({
        description: item.description ?? 'Product',
        quantity: item.quantity ?? 1,
        amount_total: item.amount_total ?? 0,
        currency: item.currency ?? 'gbp',
      }));
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('orders').upsert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
        customer_name: shipping?.name ?? session.customer_details?.name ?? null,
        customer_email: session.customer_details?.email ?? session.customer_email ?? null,
        customer_phone: session.customer_details?.phone ?? null,
        shipping_address: address ? {
          line1: address.line1, line2: address.line2, city: address.city,
          state: address.state, postal_code: address.postal_code, country: address.country,
        } : null,
        currency: session.currency ?? 'gbp',
        subtotal_pence: session.amount_subtotal ?? 0,
        shipping_pence: session.total_details?.amount_shipping ?? 0,
        discount_pence: session.total_details?.amount_discount ?? 0,
        total_pence: session.amount_total ?? 0,
        payment_status: isPaid ? 'paid' : event.type === 'checkout.session.async_payment_failed' ? 'failed' : session.payment_status,
        fulfilment_status: 'unfulfilled',
        items: itemSummary,
        shipping_region: session.metadata?.shipping_region ?? null,
        shipping_country: session.metadata?.shipping_country ?? null,
        discount_code: session.metadata?.discount_code ?? null,
        stripe_created_at: new Date(session.created * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'stripe_session_id' });
      if (error) throw error;

      // Record a purchase funnel event only for visitors who supplied analytics
      // identifiers after accepting the optional analytics consent prompt.
      const analyticsVisitorId = session.metadata?.analytics_visitor_id;
      const analyticsSessionId = session.metadata?.analytics_session_id;
      if (isPaid && analyticsVisitorId && analyticsSessionId) {
        const { data: existingPurchase, error: lookupError } = await supabase
          .from('website_events')
          .select('id')
          .eq('session_id', analyticsSessionId)
          .eq('event_type', 'purchase')
          .limit(1)
          .maybeSingle();
        if (lookupError) throw lookupError;
        if (!existingPurchase) {
          const { error: analyticsError } = await supabase.from('website_events').insert({
            visitor_id: analyticsVisitorId,
            session_id: analyticsSessionId,
            event_type: 'purchase',
            page_path: '/checkout/success',
            product_id: null,
            referrer_domain: null,
            traffic_source: 'Unknown',
            device_type: 'unknown',
          });
          if (analyticsError && analyticsError.code !== '23505') throw analyticsError;
        }
      }

      if (isPaid && session.metadata?.discount_code) {
        const { error: consumeError } = await supabase.rpc('consume_order_discount', { p_session_id: session.id });
        if (consumeError) console.error('Discount usage counter update failed:', consumeError.message);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('SOMSOA order persistence failed:', error);
    return NextResponse.json({ error: 'Order persistence failed.' }, { status: 500 });
  }
}
