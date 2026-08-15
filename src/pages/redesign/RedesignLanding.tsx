/* ============================================================
   Wingscript landing redesign (unpublished preview)
   Faithful recreation of the Claude Design handoff
   "Wingscript Landing.dc.html". Lives at /preview; the existing
   /sales /teams /never-blank pages are left untouched.
   ============================================================ */

import React from 'react';
import './redesign-tokens.css';
import { Button, Tag, LiveDot, CueCard, Icon, useLucide } from './components';

/* ── CTA destinations (single source of truth) ──────────────
   All five "Add to Chrome"/"Start free"/"See it live" CTAs point
   at the same Chrome Web Store listing (a product decision from
   the handoff, not a bug). TEAM_TRIAL and DEMO are assumptions —
   confirm/replace before publishing. */
const CWS = 'https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp';
const TEAM_TRIAL = 'https://app.wingscript.com/admin?create=1'; // self-serve org create → auto TEAM trial
const DEMO = 'mailto:hello@wingscript.com?subject=wingscript%20team%20demo'; // TODO: swap for a scheduler when live
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

const eyebrow: React.CSSProperties = {
  font: '600 11px/1 var(--font-sans)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--violet-500)',
};

export const RedesignLanding: React.FC = () => {
  useLucide();

  return (
    <div className="wg-redesign wg-lp" id="top">

      {/* ── NAV ── */}
      <div className="wg-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border-hairline)', position: 'sticky', top: 0, background: 'rgba(250,249,252,.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', zIndex: 5 }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit' }}>
          <img src="/wingscript-mark-violet.png" alt="" style={{ height: 26, width: 'auto', display: 'block' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, letterSpacing: '-.02em' }}>wingscript</span>
        </a>
        <div className="wg-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#teams" style={{ fontSize: 14, color: 'var(--ink-700)' }}>for teams</a>
          <a href="#product" style={{ fontSize: 14, color: 'var(--ink-700)' }}>product</a>
          <a href="#pricing" style={{ fontSize: 14, color: 'var(--ink-700)' }}>pricing</a>
          <Button variant="primary" size="md" href={CWS} {...ext} style={{ minWidth: 130 }}>Start free  →</Button>
        </div>
      </div>

      {/* ── HERO (two-column: copy left, live demo right) ── */}
      <div className="wg-section" style={{ padding: '84px 48px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -220, right: -80, width: 720, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(30,150,255,.12),transparent 62%)', pointerEvents: 'none' }} />
        <div className="wg-hero-grid" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.04fr)', gap: 60, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 56, lineHeight: 1, letterSpacing: '-.038em', margin: '0 0 22px' }}>Claude. On every call. Any dialer. Live.</h1>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: 'var(--ink-700)', margin: '0 0 28px', maxWidth: 500 }}>A wing on every sales call your team makes — any dialer, any meeting app, any phone. It cues the right thing to say in the two seconds you have to say it.</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" size="lg" href={CWS} {...ext}>Add to Chrome  →</Button>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-300)', marginTop: 24 }}>Meet · Zoom · Aircall · Kixie · HubSpot dialer · OpenPhone · your cell</div>
            <div style={{ marginTop: 18 }}>
              <a href={CWS} {...ext} style={{ fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>See it live on a call <Icon name="arrow-right" style={{ width: 15, height: 15 }} /></a>
            </div>
          </div>

          {/* LIVE DEMO MOMENT */}
          <div style={{ animation: 'wgCue .6s var(--ease-lift) both .15s' }}>
            <div style={{ background: 'var(--gradient-hud)', border: '1px solid var(--border-on-dark)', borderRadius: 16, boxShadow: 'var(--elevation-lift)', padding: 18, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 14 }}>
                <LiveDot label="Live · listening" />
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'rgba(255,255,255,.45)' }}>discovery · acme corp</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>02:14</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7, color: 'rgba(240,238,245,.78)', marginBottom: 16 }}>
                <div style={{ marginBottom: 6 }}><span style={{ color: 'var(--sky-400)' }}>P</span>&nbsp;&nbsp;…we looked at Gong last quarter and the pricing was a non-starter —</div>
                <div><span style={{ color: 'var(--sky-400)' }}>P</span>&nbsp;&nbsp;how are you guys priced?</div>
                <div style={{ marginTop: 8, color: 'var(--violet-300)' }}><span>You</span>&nbsp;&nbsp;<span style={{ display: 'inline-block', width: 7, height: 15, background: 'var(--violet-300)', verticalAlign: -2, animation: 'wgGlow .9s steps(2) infinite alternate' }} /></div>
              </div>
              <CueCard accent="violet" label="Pricing objection → reframe to value" source="pricing playbook + Acme LinkedIn">Acme has 14 AEs. At their ACV ($45k), one extra deal a quarter pays for the whole team license. Lead with ROI, not seat price.</CueCard>
            </div>
          </div>
        </div>
      </div>

      {/* ── THE SPLIT ── */}
      <div className="wg-section" style={{ padding: '24px 48px 76px' }}>
        <div className="wg-split-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--border-hairline)', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: 'var(--elevation-md)' }}>
          {/* reps track */}
          <div id="reps" style={{ padding: 40, borderRight: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--violet-50)', display: 'grid', placeItems: 'center' }}><Icon name="user" style={{ width: 19, height: 19, color: 'var(--violet-500)' }} /></div>
              <div style={eyebrow}>For the rep</div>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, lineHeight: 1.1, letterSpacing: '-.025em', margin: '0 0 10px' }}>Start free, today.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-500)', margin: '0 0 22px' }}>Ramping in your first year? Install it yourself and be the rep who always has the answer ready — no admin, no approval.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="feather" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />Live cues from your playbooks & CRM, mid-call</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="dumbbell" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />Practice new pitches in the dojo before they count</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="clipboard-check" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />A scored debrief after every call</div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Free</span><span style={{ fontSize: 13.5, color: 'var(--ink-500)' }}>then $19/mo Pro</span></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="primary" size="md" href={CWS} {...ext}>Add to Chrome  →</Button>
              </div>
            </div>
          </div>
          {/* teams track */}
          <div id="teams" style={{ padding: 40, background: 'linear-gradient(160deg,#FCFAFF,#fff)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--violet-500)', display: 'grid', placeItems: 'center' }}><Icon name="users" style={{ width: 19, height: 19, color: '#fff' }} /></div>
              <div style={eyebrow}>For the team · 5–50 reps</div>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, lineHeight: 1.1, letterSpacing: '-.025em', margin: '0 0 10px' }}>Ramp the whole floor.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-500)', margin: '0 0 22px' }}>You hire, you coach, you carry a number. wingscript gets new reps productive faster and shows you where each one is stuck — the same day.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="check" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />Everything reps get, across every seat</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="activity" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />Live session monitoring + per-rep dashboards</div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}><Icon name="sliders-horizontal" style={{ width: 17, height: 17, color: 'var(--violet-500)', flex: 'none', marginTop: 2 }} />Assign dojo drills; score to your methodology</div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>$39</span><span style={{ fontSize: 13.5, color: 'var(--ink-500)' }}>/seat/mo · no platform fee</span></div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="primary" size="md" href={TEAM_TRIAL} {...ext}>Start a team trial  →</Button>
                <Button variant="ghost" size="md" href={DEMO}>Book a demo</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT: FREEDOM / CAPTURE-AGNOSTIC BAND ── */}
      <div id="product" className="wg-section" style={{ padding: '84px 48px 76px', background: '#fff', borderTop: '1px solid var(--border-hairline)', position: 'relative', overflow: 'hidden' }}>
        <img src="/wingscript-mark-violet.png" alt="" style={{ position: 'absolute', right: -30, top: '50%', height: 360, width: 'auto', transform: 'translateY(-50%)', animation: 'wgLift .9s var(--ease-lift) both .2s', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ ...eyebrow, marginBottom: 16 }}>Any call · any tool · any phone</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 36, lineHeight: 1.08, letterSpacing: '-.028em', margin: '0 0 16px' }}>Time to Leave the Nest.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.62, color: 'var(--ink-700)', margin: '0 auto 18px', maxWidth: 600 }}>Every other real-time coach lives inside one dialer, one meeting bot, a whitelist of apps — a nest you never get to leave. wingscript captures the audio itself, so it flies along on whatever you already use.</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 19, lineHeight: 1.4, letterSpacing: '-.02em', color: 'var(--ink-900)', margin: '0 auto 32px', maxWidth: 540 }}>That's the wing: freedom to take any call, on any tool, and still have the answer ready.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 9, flexWrap: 'wrap' }}>
            {['Google Meet', 'Zoom', 'Aircall', 'Kixie', 'HubSpot dialer', 'OpenPhone', 'your cell'].map(t => (
              <Tag key={t} tone="file">{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT: THE RAMP LOOP ── */}
      <div className="wg-section" style={{ padding: '66px 48px', background: 'var(--paper)', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ ...eyebrow, marginBottom: 14 }}>The ramp loop</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1.12, letterSpacing: '-.025em', margin: 0 }}>Practice. Cue. Debrief. Coach. On repeat.</h2>
          </div>
          <div className="wg-ramp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {[
              { icon: 'dumbbell', step: '01 · PRACTICE', h: 'The dojo', p: 'Rehearse the new pitch against a roleplay before it costs you a live deal.' },
              { icon: 'feather', step: '02 · CUE', h: 'Live in the call', p: 'One grounded idea appears in the moment you need it, citing its source.' },
              { icon: 'clipboard-check', step: '03 · DEBRIEF', h: 'Scored after', p: 'Every call graded against your methodology — MEDDIC, SPIN, or your own.' },
              { icon: 'users', step: '04 · COACH', h: 'Manager sees it', p: 'Per-rep dashboards show where each new hire is stuck — same day, not next quarter.' },
            ].map(c => (
              <div key={c.step} style={{ background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: 14, padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--violet-50)', display: 'grid', placeItems: 'center', marginBottom: 16 }}><Icon name={c.icon} style={{ width: 20, height: 20, color: 'var(--violet-500)' }} /></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--violet-500)', letterSpacing: '.1em', marginBottom: 6 }}>{c.step}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, margin: '0 0 7px' }}>{c.h}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-500)', margin: 0 }}>{c.p}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-500)', margin: '26px 0 0' }}>No one else has all four under one roof. Everywhere else it's three separate purchases.</p>
        </div>
      </div>

      {/* ── PRODUCT: REAL-TIME vs POST-CALL ── */}
      <div className="wg-section" style={{ padding: '66px 48px', background: '#fff', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, lineHeight: 1.12, letterSpacing: '-.025em', margin: '0 0 8px', textAlign: 'center' }}>Notetakers tell you what happened.</h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-500)', margin: '0 auto 36px', maxWidth: 560, textAlign: 'center' }}>wingscript is there while it's still happening. That's the whole difference.</p>
          <div className="wg-compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ border: '1px solid var(--border-hairline)', borderRadius: 14, padding: 28, background: 'var(--paper)' }}>
              <div style={{ font: '600 11px/1 var(--font-sans)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 12 }}>Gong, Otter, Chorus — after</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-500)', margin: 0 }}>The recap email tomorrow. The coaching review next week. Useful — but the call is over and the deal already moved.</p>
            </div>
            <div style={{ border: '1px solid var(--violet-100)', borderLeft: '3px solid var(--violet-500)', borderRadius: 14, padding: 28, background: 'linear-gradient(120deg,var(--violet-50),#fff)' }}>
              <div style={{ font: '600 11px/1 var(--font-sans)', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--violet-500)', marginBottom: 12 }}>wingscript — during</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-900)', margin: 0 }}>The cue arrives in the two seconds you have to respond. It changes what you say next — not just what you review later.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICING ROW (4 tiers) ── */}
      <div id="pricing" className="wg-section" style={{ padding: '64px 48px', background: 'var(--paper)', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, lineHeight: 1.12, letterSpacing: '-.025em', margin: '0 0 8px' }}>Published pricing. Start free.</h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink-500)', margin: 0 }}>Free for any rep to start. $39/seat when you're ready to ramp the team — no platform fee, no annual lock-in. Call minutes bill separately at ~$0.10/min.</p>
          </div>
          <div className="wg-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Free</div>
              <div style={{ marginBottom: 12 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26 }}>$0</span></div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-500)', margin: 0 }}>Capped live cues + the dojo. Enough to feel the moment.</p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Pro</div>
              <div style={{ marginBottom: 12 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26 }}>$19</span><span style={{ color: 'var(--ink-500)', fontSize: 13 }}>/seat/mo</span></div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-500)', margin: 0 }}>Unlimited cues, full debriefs, your CRM & playbooks.</p>
            </div>
            <div style={{ background: 'linear-gradient(150deg,#FCFAFF,#fff)', border: '1px solid var(--violet-100)', borderTop: '3px solid var(--violet-500)', borderRadius: 14, padding: 24, position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Team</div>
              <div style={{ marginBottom: 12 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26 }}>$39</span><span style={{ color: 'var(--ink-500)', fontSize: 13 }}>/seat/mo</span></div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-500)', margin: 0 }}>Monitoring, dashboards, drill assignment, methodology scoring.</p>
            </div>
            <div style={{ background: 'var(--ink-900)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 4, color: '#fff' }}>Enterprise</div>
              <div style={{ marginBottom: 12 }}><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff' }}>Custom</span></div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(240,238,245,.6)', margin: 0 }}>50+ seats, SSO, implementation. A demo, then a number.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CLOSER ── */}
      <div className="wg-section" style={{ padding: '72px 48px', background: 'var(--gradient-cover)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, lineHeight: 1.08, letterSpacing: '-.028em', margin: '0 0 16px', color: '#fff' }}>Ready for <em>lift</em> off.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(240,238,245,.82)', margin: '0 0 28px' }}>Put a wing on your next call. Free to start — no credit card, no sales call.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={CWS} {...ext} className="wg-closer-btn wg-closer-btn--solid">Add to Chrome  →</a>
            <a href={DEMO} className="wg-closer-btn wg-closer-btn--ghost">Book a team demo</a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="wg-lp--dark" style={{ padding: '36px 48px', background: 'var(--ink-900)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/wingscript-mark-white.png" alt="" style={{ height: 22, width: 'auto', display: 'block' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: '#fff' }}>wingscript</span>
        </div>
        <div style={{ display: 'flex', gap: 22, fontSize: 13.5 }}>
          <a href="#product">product</a>
          <a href="#pricing">pricing</a>
          <a href="/privacy">privacy</a>
          <a href="mailto:security@wingscript.com">security</a>
          <a href="mailto:hello@wingscript.com">contact</a>
        </div>
      </div>

    </div>
  );
};

export default RedesignLanding;
