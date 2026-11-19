'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

type EventRow = {
  visitor_id: string | null;
  session_id: string | null;
  event_type: string;
  product_id: string | null;
  referrer_domain: string | null;
  traffic_source: string | null;
  created_at: string;
};
type OrderItem = { description?: string; quantity?: number; amount_total?: number };
type OrderRow = {
  stripe_session_id: string;
  customer_email: string | null;
  total_pence: number;
  currency: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[] | null;
};

const money = (pence: number) => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', maximumFractionDigits: 2,
}).format(pence / 100);
const percent = (value: number) => `${value.toFixed(1)}%`;

function uniqueSessions(rows: EventRow[], eventType?: string) {
  return new Set(rows.filter(row => !eventType || row.event_type === eventType)
    .map(row => row.session_id).filter((id): id is string => Boolean(id))).size;
}

export default function AnalyticsAdmin() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const sb = getSupabase();
        const { data: { user } } = await sb.auth.getUser();
        if (!user || user.app_metadata?.role !== 'admin') {
          router.replace('/admin/login');
          return;
        }
        const since = new Date(Date.now() - Number(period) * 86400000).toISOString();
        const fetchEvents = async () => {
          const rows: EventRow[] = [];
          for (let from = 0; ; from += 1000) {
            const { data, error } = await sb.from('website_events')
              .select('visitor_id,session_id,event_type,product_id,referrer_domain,traffic_source,created_at')
              .gte('created_at', since).order('created_at', { ascending: false }).range(from, from + 999);
            if (error) throw error;
            rows.push(...((data ?? []) as EventRow[]));
            if (!data || data.length < 1000) break;
          }
          return rows;
        };
        const fetchOrders = async () => {
          const rows: OrderRow[] = [];
          for (let from = 0; ; from += 1000) {
            const { data, error } = await sb.from('orders')
              .select('stripe_session_id,customer_email,total_pence,currency,payment_status,created_at,items')
              .gte('created_at', since).order('created_at', { ascending: false }).range(from, from + 999);
            if (error) throw error;
            rows.push(...((data ?? []) as OrderRow[]));
            if (!data || data.length < 1000) break;
          }
          return rows;
        };
        const [eventRows, orderRows] = await Promise.all([fetchEvents(), fetchOrders()]);
        if (!active) return;
        setEvents(eventRows);
        setOrders(orderRows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Analytics failed to load.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [router, period]);

  const metrics = useMemo(() => {
    const paid = orders.filter(order => order.payment_status === 'paid');
    const revenue = paid.reduce((sum, order) => sum + (order.total_pence || 0), 0);
    const sessions = uniqueSessions(events);
    const cartSessions = uniqueSessions(events, 'add_to_cart');
    const checkoutSessions = uniqueSessions(events, 'checkout_started');
    const purchaseSessions = uniqueSessions(events, 'purchase');
    const visitors = new Set(events.map(row => row.visitor_id).filter(Boolean)).size;
    const sourceMap = new Map<string, Set<string>>();
    events.filter(row => row.event_type === 'page_view').forEach((row, index) => {
      const source = row.traffic_source || row.referrer_domain || 'Direct';
      const key = row.session_id || `event-${index}`;
      if (!sourceMap.has(source)) sourceMap.set(source, new Set<string>());
      sourceMap.get(source)!.add(key);
    });
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    paid.forEach(order => (order.items || []).forEach(item => {
      const name = item.description || 'Product';
      const current = productMap.get(name) || { quantity: 0, revenue: 0 };
      current.quantity += item.quantity || 1;
      current.revenue += item.amount_total || 0;
      productMap.set(name, current);
    }));
    const days = new Map<string, number>();
    paid.forEach(order => {
      const day = new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      days.set(day, (days.get(day) || 0) + (order.total_pence || 0));
    });
    const daily = [...days].reverse().slice(-14);
    return {
      paid, revenue, sessions, visitors, cartSessions, checkoutSessions, purchaseSessions,
      cartRate: sessions ? cartSessions / sessions * 100 : 0,
      checkoutRate: cartSessions ? checkoutSessions / cartSessions * 100 : 0,
      purchaseRate: sessions ? purchaseSessions / sessions * 100 : 0,
      averageOrder: paid.length ? revenue / paid.length : 0,
      sources: [...sourceMap].map(([name, sessions]) => ({ name, count: sessions.size })).sort((a, b) => b.count - a.count).slice(0, 8),
      products: [...productMap].map(([name, value]) => ({ name, ...value })).sort((a, b) => b.revenue - a.revenue).slice(0, 8),
      daily,
    };
  }, [events, orders]);

  const maxDaily = Math.max(1, ...metrics.daily.map(([, value]) => value));
  const maxSource = Math.max(1, ...metrics.sources.map(source => source.count));

  return <>
    <p className="admin-kicker">Performance</p>
    <div className="admin-analytics-heading">
      <div><h1 className="admin-title">Website analytics</h1><p className="admin-muted">Consented storefront activity and paid orders recorded by Stripe webhooks.</p></div>
      <label className="admin-period">Period <select className="admin-input" value={period} onChange={event => { setLoading(true); setPeriod(event.target.value as '7' | '30' | '90'); }}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
    </div>
    {error && <p className="admin-error">{error}</p>}
    {loading ? <section className="admin-panel">Loading analytics…</section> : <>
      <div className="admin-grid admin-analytics-grid">
        <div className="admin-card"><small>Paid revenue</small><strong>{money(metrics.revenue)}</strong><small>{metrics.paid.length} paid orders</small></div>
        <div className="admin-card"><small>Average order value</small><strong>{money(metrics.averageOrder)}</strong><small>Paid orders only</small></div>
        <div className="admin-card"><small>Unique browsers</small><strong>{metrics.visitors.toLocaleString('en-GB')}</strong><small>Visitors who consented to analytics</small></div>
        <div className="admin-card"><small>Purchase conversion</small><strong>{percent(metrics.purchaseRate)}</strong><small>{metrics.purchaseSessions} purchasing sessions / {metrics.sessions} tracked sessions</small></div>
      </div>
      <div className="admin-analytics-columns">
        <section className="admin-panel"><h2>Conversion funnel</h2><p className="admin-muted">Unique tracked sessions reaching each step. A session can appear in more than one step.</p>
          {[['Visited site', metrics.sessions, 100], ['Added to cart', metrics.cartSessions, metrics.cartRate], ['Started checkout', metrics.checkoutSessions, metrics.sessions ? metrics.checkoutSessions / metrics.sessions * 100 : 0], ['Purchased', metrics.purchaseSessions, metrics.purchaseRate]].map(([label, value, rate]) => <div className="admin-funnel-row" key={String(label)}><div className="admin-funnel-label"><span>{label}</span><strong>{Number(value).toLocaleString('en-GB')} <small>{percent(Number(rate))}</small></strong></div><div className="admin-bar-track"><div className="admin-bar-fill" style={{ width: `${Math.min(100, Number(rate))}%` }} /></div></div>)}
          <p className="admin-muted admin-footnote">Cart-to-checkout progression: {percent(metrics.checkoutRate)} of cart sessions.</p>
        </section>
        <section className="admin-panel"><h2>Revenue by order date</h2>{metrics.daily.length ? <div className="admin-revenue-chart">{metrics.daily.map(([day, value]) => <div className="admin-revenue-column" key={day}><strong>{money(Number(value))}</strong><div className="admin-revenue-bar-track"><div className="admin-revenue-bar" style={{ height: `${Math.max(3, Number(value) / maxDaily * 100)}%` }} /></div><small>{day}</small></div>)}</div> : <p className="admin-muted">No paid orders in this period yet.</p>}</section>
      </div>
      <div className="admin-analytics-columns">
        <section className="admin-panel"><h2>Traffic sources</h2><p className="admin-muted">Tracked sessions by first recorded source.</p>{metrics.sources.length ? metrics.sources.map(source => <div className="admin-source-row" key={source.name}><div><span>{source.name}</span><strong>{source.count}</strong></div><div className="admin-bar-track"><div className="admin-bar-fill" style={{ width: `${source.count / maxSource * 100}%` }} /></div></div>) : <p className="admin-muted">No page-view events recorded in this period.</p>}</section>
        <section className="admin-panel"><h2>Top products</h2>{metrics.products.length ? <div className="admin-product-list">{metrics.products.map(product => <div className="admin-product-row" key={product.name}><div><strong>{product.name}</strong><small>{product.quantity} units sold</small></div><strong>{money(product.revenue)}</strong></div>)}</div> : <p className="admin-muted">Product sales will appear after paid orders are received through the Stripe webhook.</p>}</section>
      </div>
      <p className="admin-muted admin-analytics-disclaimer">Revenue is based on paid orders stored from verified Stripe events. Visitor and funnel figures include only visitors who accepted optional analytics. Repeat customer rate and cart abandonment are not yet reported because reliable customer/session linkage is not available for every order.</p>
    </>}
  </>;
}
