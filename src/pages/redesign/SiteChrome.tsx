/* ============================================================
   Site chrome shared by every routed page: the sticky nav and
   the dark footer, lifted verbatim from the landing page so a
   second page (/resources) renders the same frame.
   ============================================================ */

import React from 'react';
import { Button } from './components';

/* CTA destination (single source of truth). Every install CTA on the site
   points at the same Chrome Web Store listing — a product decision from the
   handoff, not a bug. */
export const CWS = 'https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp';
export const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

/* Section anchors are root-absolute so they resolve from any path. On the
   landing page itself the browser treats "/#pricing" as a same-document
   fragment jump, exactly like "#pricing" did. */
export const SiteNav: React.FC = () => (
  <div className="wg-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border-hairline)', position: 'sticky', top: 0, background: 'rgba(250,249,252,.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', zIndex: 5 }}>
    <a href="/#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit' }}>
      <img src="/wingscript-mark-violet.png" alt="" style={{ height: 26, width: 'auto', display: 'block' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, letterSpacing: '-.02em' }}>wingscript</span>
    </a>
    <div className="wg-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <a href="/#teams" style={{ fontSize: 14, color: 'var(--ink-700)' }}>for teams</a>
      <a href="/#product" style={{ fontSize: 14, color: 'var(--ink-700)' }}>product</a>
      <a href="/#pricing" style={{ fontSize: 14, color: 'var(--ink-700)' }}>pricing</a>
      <Button variant="primary" size="md" href={CWS} {...ext} style={{ minWidth: 130 }}>Start free  →</Button>
    </div>
  </div>
);

export const SiteFooter: React.FC = () => (
  <div className="wg-lp--dark" style={{ padding: '36px 48px', background: 'var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="/wingscript-mark-white.png" alt="" style={{ height: 22, width: 'auto', display: 'block' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: '#fff' }}>wingscript</span>
    </div>
    <div style={{ display: 'flex', gap: 22, fontSize: 13.5, flexWrap: 'wrap' }}>
      <a href="/#product">product</a>
      <a href="/#pricing">pricing</a>
      <a href="/resources">resources</a>
      <a href="/privacy">privacy</a>
      <a href="mailto:support@wingscript.com">security</a>
      <a href="mailto:hello@wingscript.com">contact</a>
      <a href="/terms">terms</a>
    </div>
  </div>
);
