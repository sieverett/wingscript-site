/* ============================================================
   Book-a-demo request form — modal over the landing page.
   Submits to Formspree (forwards to hello@wingscript.com); the
   team-pilot mailto survives as the error-path fallback.
   ============================================================ */

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './components';

/* Formspree endpoint — claimed by the owner via the /claim flow. */
export const DEMO_FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';
const FALLBACK_MAILTO = 'mailto:hello@wingscript.com?subject=wingscript%20team%20pilot';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 13,
  color: 'var(--ink-700)',
  marginBottom: 6,
};

export const DemoRequestModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [status, setStatus] = useState<Status>('idle');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    setStatus('submitting');
    try {
      const res = await fetch(DEMO_FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: 'rgba(20,16,24,.55)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wg-demo-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)',
          background: '#fff',
          border: '1px solid var(--border-hairline)',
          borderRadius: 16,
          boxShadow: 'var(--elevation-lift)',
          padding: 28,
          position: 'relative',
          animation: 'wgCue var(--duration-cue) var(--ease-lift) both',
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            display: 'grid',
            placeItems: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            color: 'var(--ink-500)',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {status === 'success' ? (
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, letterSpacing: '-.02em', margin: '0 0 10px' }}>
              Thanks — we'll be in touch.
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-500)', margin: '0 0 20px' }}>
              Expect a reply within a business day to set up your team demo.
            </p>
            <Button variant="secondary" size="md" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 id="wg-demo-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, letterSpacing: '-.02em', margin: '0 0 6px' }}>
              Book a team demo.
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.55, color: 'var(--ink-500)', margin: '0 0 20px' }}>
              A short walkthrough on your team's real calls — no deck, no commitment.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label htmlFor="wg-demo-name" style={labelStyle}>Name</label>
              <input ref={nameRef} id="wg-demo-name" name="name" type="text" required maxLength={100} className="wg-field" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="wg-demo-email" style={labelStyle}>Work email</label>
              <input id="wg-demo-email" name="email" type="email" required className="wg-field" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="wg-demo-team-size" style={labelStyle}>Team size</label>
              <select id="wg-demo-team-size" name="team_size" defaultValue="" required className="wg-field">
                <option value="" disabled>Select…</option>
                <option value="1–5">1–5 reps</option>
                <option value="6–20">6–20 reps</option>
                <option value="20+">20+ reps</option>
              </select>
            </div>

            <Button variant="primary" size="md" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Request a demo  →'}
            </Button>

            {status === 'error' && (
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--danger-500)', margin: '14px 0 0' }}>
                Something went wrong sending your request —{' '}
                <a href={FALLBACK_MAILTO} style={{ fontWeight: 600 }}>email us instead</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default DemoRequestModal;
