/* The live trial offer (converse-ai spec 1432).
   =============================================
   The trial length is set by whatever campaign an operator is running, so
   this page must not carry a literal. One unauthenticated endpoint on the
   API knows the answer; it fails open to the configured default server-side,
   so a response always means something usable.

   Null is the honest state: still loading, offline, or unreadable. Copy that
   interpolates the length MUST read correctly when it is null, because that
   is exactly what the prerendered HTML and a first paint contain. */

import { useEffect, useState } from 'react';

const API_BASE = 'https://api.wingscript.com';

export interface TrialOffer {
  trialDays: number;
  label: string | null;
  campaignSlug: string | null;
  campaignEndsAt: string | null;
}

export function useTrialOffer(): TrialOffer | null {
  const [offer, setOffer] = useState<TrialOffer | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip during react-snap prerender so the snapshot matches the first
    // client render — the same rule useLucide follows.
    if (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) return;

    // No fetch at all (an old browser, a locked-down webview, a test
    // environment): nothing to do, and throwing out of an effect would take
    // the page down with it.
    if (typeof fetch !== 'function') return;

    let live = true;
    try {
      fetch(`${API_BASE}/api/public/trial-offer`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((raw: {
          trial_days?: unknown;
          label?: unknown;
          campaign_slug?: unknown;
          campaign_ends_at?: unknown;
        }) => {
          if (!live) return;
          // Only a response that really carries a length is an offer. A 200
          // from something else — a proxy notice, a captive portal — must
          // never become "Start a undefined-day team trial".
          const days = Number(raw?.trial_days);
          if (!Number.isFinite(days) || days <= 0) return;
          const str = (v: unknown) => (typeof v === 'string' && v ? v : null);
          setOffer({
            trialDays: Math.round(days),
            label: str(raw.label),
            campaignSlug: str(raw.campaign_slug),
            campaignEndsAt: str(raw.campaign_ends_at),
          });
        })
        .catch(() => {
          /* copy states no number */
        });
    } catch {
      /* a fetch that throws synchronously is still just "no offer" */
    }
    return () => {
      live = false;
    };
  }, []);

  return offer;
}
