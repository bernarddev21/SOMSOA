'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { analyticsAttribution, analyticsIdentity } from '@/lib/analytics-client';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const identity = analyticsIdentity();
    if (!identity) return;

    const { traffic_source, referrer_domain } = analyticsAttribution();
    const productMatch = pathname.match(/^\/products\/([^/]+)/);

    void getSupabase().from('website_events').insert({
      visitor_id: identity.visitorId,
      session_id: identity.sessionId,
      event_type: productMatch ? 'product_view' : 'page_view',
      page_path: pathname,
      product_id: productMatch?.[1] ?? null,
      referrer_domain,
      traffic_source,
      device_type: window.innerWidth < 700 ? 'mobile' : 'desktop',
    }).then(({ error }) => {
      if (error) console.warn('SOMSOA page analytics failed:', error.message);
    });
  }, [pathname]);

  return null;
}
