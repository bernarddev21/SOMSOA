'use client';

import { getSupabase } from '@/lib/supabase';

const CONSENT_KEY = 'somsoa-analytics-consent';
const VISITOR_KEY = 'somsoa-visitor-id';
const SESSION_KEY = 'somsoa-session-id';

export type AnalyticsIdentity = { visitorId: string; sessionId: string };

function getOrCreate(key: string, storage: Storage): string {
  let value = storage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    storage.setItem(key, value);
  }
  return value;
}

export function analyticsIdentity(): AnalyticsIdentity | null {
  if (typeof window === 'undefined' || localStorage.getItem(CONSENT_KEY) !== 'accepted') return null;
  return {
    visitorId: getOrCreate(VISITOR_KEY, localStorage),
    sessionId: getOrCreate(SESSION_KEY, sessionStorage),
  };
}

export function analyticsAttribution() {
  const stored = sessionStorage.getItem('somsoa-analytics-attribution');
  if (stored) {
    try { return JSON.parse(stored) as { traffic_source: string; referrer_domain: string | null }; }
    catch { sessionStorage.removeItem('somsoa-analytics-attribution'); }
  }
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const referrerDomain = document.referrer ? new URL(document.referrer).hostname : null;
  let source = 'Direct';
  if (utmSource) source = `${utmSource}${utmMedium ? ` / ${utmMedium}` : ''}`;
  else if (referrerDomain && /google|bing|yahoo|duckduckgo/i.test(referrerDomain)) source = 'Organic search';
  else if (referrerDomain && /facebook|instagram|tiktok|pinterest|x\.com|twitter/i.test(referrerDomain)) source = 'Social';
  else if (referrerDomain) source = 'Referral';
  const value = { traffic_source: source, referrer_domain: referrerDomain };
  sessionStorage.setItem('somsoa-analytics-attribution', JSON.stringify(value));
  return value;
}

export async function trackCommerceEvent(eventType: 'add_to_cart' | 'checkout_started', productId?: string) {
  let identity: AnalyticsIdentity | null = null;
  try {
    identity = analyticsIdentity();
    if (!identity) return null;
    const { traffic_source, referrer_domain } = analyticsAttribution();
    const { error } = await getSupabase().from('website_events').insert({
      visitor_id: identity.visitorId,
      session_id: identity.sessionId,
      event_type: eventType,
      page_path: window.location.pathname,
      product_id: productId ?? null,
      referrer_domain,
      traffic_source,
      device_type: window.innerWidth < 700 ? 'mobile' : 'desktop',
    });
    if (error) console.warn(`SOMSOA ${eventType} analytics failed:`, error.message);
  } catch (error) {
    // Analytics must never prevent cart or checkout functionality.
    console.warn(`SOMSOA ${eventType} analytics unavailable:`, error);
  }
  return identity;
}
