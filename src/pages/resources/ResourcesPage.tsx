/* ============================================================
   /resources — outside guides and comparisons, one card each.
   Same design system as the landing page (.wg-redesign tokens,
   ramp-loop card geometry). Content lives in resources.ts.
   ============================================================ */

import React, { useEffect } from 'react';
import '../redesign/redesign-tokens.css';
import { Icon, useLucide } from '../redesign/components';
import { SiteNav, SiteFooter, ext } from '../redesign/SiteChrome';
import { RESOURCES, Resource } from './resources';

const eyebrow: React.CSSProperties = {
  font: '600 11px/1 var(--font-sans)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--violet-500)',
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
  <a href={resource.href} {...ext} className="wg-resource-card" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: 14, padding: 24 }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--violet-500)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>{resource.source}</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, lineHeight: 1.3, letterSpacing: '-.015em', margin: '0 0 8px' }}>{resource.title}</h2>
    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-500)', margin: '0 0 18px', flexGrow: 1 }}>{resource.description}</p>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--violet-500)' }}>
      Read on {new URL(resource.href).hostname} <Icon name="arrow-up-right" style={{ width: 14, height: 14 }} />
    </span>
  </a>
);

export const ResourcesPage: React.FC = () => {
  useLucide();
  useEffect(() => {
    const previous = document.title;
    document.title = 'Resources · wingscript';
    return () => { document.title = previous; };
  }, []);

  return (
    <div className="wg-redesign wg-lp" id="top" style={{ display: 'flex', flexDirection: 'column' }}>
      <SiteNav />

      {/* flexGrow pins the footer to the viewport bottom while the list is short */}
      <div className="wg-section" style={{ padding: '72px 48px 96px', flexGrow: 1 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>From around the web</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 40, lineHeight: 1.08, letterSpacing: '-.03em', margin: '0 0 14px' }}>Resources</h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-700)', margin: '0 0 40px', maxWidth: 560 }}>Guides and comparisons we found useful for small sales teams.</p>
          <div className="wg-resource-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {RESOURCES.map(r => <ResourceCard key={r.href} resource={r} />)}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default ResourcesPage;
