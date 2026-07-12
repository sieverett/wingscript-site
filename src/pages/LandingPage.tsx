import React, { useState, useEffect, useRef } from "react";
import "../landing-tokens.css";
import "../landing.css";
import { DemoVideo } from "./landing/demo-scenes";

/* ─────────────────────────────────────────────────────────
   LIVE DEMO — the original hero centerpiece (tick-based)
   ───────────────────────────────────────────────────────── */

const TRANSCRIPT = [
  { t: 200,  speaker: "P", text: "Honestly, we looked at Gong last quarter" },
  { t: 1000, speaker: "P", text: "and the pricing was a non-starter for a team our size —" },
  { t: 2200, speaker: "P", text: "how are you guys priced?" },
];
const CUE_PRIMARY = {
  at: 3400,
  label: "Pricing objection → reframe to value",
  body: "Acme has 14 AEs (per LinkedIn). At their ACV ($45k), one extra deal/quarter pays for the full team license. Lead with ROI, not seat price.",
  src: "your pricing playbook + Acme LinkedIn",
};
const CUE_SECONDARY = {
  at: 4600,
  label: "Competitor note",
  body: "Gong doesn't offer real-time. That's the wedge.",
};
const REPLY = {
  at: 6200,
  speaker: "Y",
  text: "Totally hear you on Gong's pricing. Quick question — what's your average deal size?",
};
const RESET = 9000;
const LOOP = 11500;

function LiveDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    // react-snap prerenders with "ReactSnap" in the UA. Skip the animation during
    // prerender so the snapshot is the tick=0 state — which matches the client's first
    // render and avoids a hydration mismatch. The animation runs normally after hydrate.
    if (typeof navigator !== "undefined" && /ReactSnap/i.test(navigator.userAgent)) return;
    const id = setInterval(() => setTick(t => (t + 100) % LOOP), 100);
    return () => clearInterval(id);
  }, []);

  const visibleP = TRANSCRIPT.filter(l => tick >= l.t);
  const showCue1 = tick >= CUE_PRIMARY.at && tick < RESET;
  const showCue2 = tick >= CUE_SECONDARY.at && tick < RESET;
  const showReply = tick >= REPLY.at && tick < RESET;
  const cuesFaded = showReply;

  const elapsed = Math.floor(tick / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="livedemo">
      <div className="livedemo__bar">
        <span className="livedemo__dot" />
        <span className="livedemo__live">Live</span>
        <span className="livedemo__meta">discovery · acme corp</span>
        <span className="livedemo__ts">{`${mm}:${ss}`}</span>
      </div>
      <div className="livedemo__body">
        <div className="livedemo__transcript">
          {visibleP.map((l, i) => (
            <div key={i} className="livedemo__line">
              <span className="livedemo__sp livedemo__sp--p">P</span>
              <span>{l.text}</span>
            </div>
          ))}
          {showReply && (
            <div className="livedemo__line livedemo__line--you">
              <span className="livedemo__sp livedemo__sp--y">You</span>
              <span>{REPLY.text}</span>
            </div>
          )}
          {!showReply && tick > 2400 && (
            <div className="livedemo__line livedemo__line--cursor">
              <span className="livedemo__sp livedemo__sp--y">You</span>
              <span className="livedemo__caret" />
            </div>
          )}
        </div>
        <div className="livedemo__cues">
          <div className={`livedemo__cue ${showCue1 ? "is-in" : ""} ${cuesFaded ? "is-fade" : ""}`}>
            <div className="livedemo__cuelbl">{CUE_PRIMARY.label}</div>
            <div className="livedemo__cuebody">{CUE_PRIMARY.body}</div>
            <div className="livedemo__cuesrc">{CUE_PRIMARY.src}</div>
          </div>
          <div className={`livedemo__cue livedemo__cue--sec ${showCue2 ? "is-in" : ""} ${cuesFaded ? "is-fade" : ""}`}>
            <div className="livedemo__cuelbl">{CUE_SECONDARY.label}</div>
            <div className="livedemo__cuebody">{CUE_SECONDARY.body}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   REQUEST MODAL — two-step: email → qualifying chips → done
   ───────────────────────────────────────────────────────── */

function RequestModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [volume, setVolume] = useState<string | null>(null);
  const [stack, setStack] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const submitToNetlify = (fields: Record<string, string>) => {
    const body = new URLSearchParams({ "form-name": "beta-signup", ...fields });
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      .catch(() => {}); // fire-and-forget — don't block UX on network failure
  };

  const handleEmail = () => {
    if (!email.includes("@")) return;
    submitToNetlify({ email });
    setStep(2);
  };

  const handleQualify = () => {
    submitToNetlify({ email, role: role || "", volume: volume || "", stack: Array.from(stack).join(", ") });
    setStep(3);
  };

  const toggleStack = (v: string) => {
    setStack(prev => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  };

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="beta-modal-title" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="close">&times;</button>

        {step === 1 && (
          <div>
            <h2 id="beta-modal-title" className="modal__h">get early access</h2>
            <p className="modal__sub">We'll email you within 48 hours.</p>
            <input
              ref={inputRef}
              className="input"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
            />
            <button className="btn btn--primary btn--lg modal__btn" onClick={handleEmail} disabled={!email.includes("@")}>
              request access <span className="btn__arrow">→</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="modal__h">Thanks.</h2>
            <p className="modal__sub">
              A few quick things to make sure you're a fit.{" "}
              <button className="modal__skip" onClick={() => setStep(3)}>skip</button>
            </p>

            <div className="qf">
              <div className="qf__lbl">What's your role?</div>
              <div className="qf__chips">
                {["AE", "Sales Manager", "Founder", "SE", "Other"].map(r => (
                  <button key={r} className={`chip ${role === r ? "chip--on" : ""}`} onClick={() => setRole(r)}>{r}</button>
                ))}
              </div>
            </div>

            <div className="qf">
              <div className="qf__lbl">How many live calls per week?</div>
              <div className="qf__chips">
                {["1–5", "5–15", "15+"].map(v => (
                  <button key={v} className={`chip ${volume === v ? "chip--on" : ""}`} onClick={() => setVolume(v)}>{v}</button>
                ))}
              </div>
            </div>

            <div className="qf">
              <div className="qf__lbl">Current call stack? <span className="qf__hint">multi-select</span></div>
              <div className="qf__chips">
                {["Gong", "Outreach", "Salesloft", "Otter", "Chorus", "Apollo", "None"].map(s => (
                  <button key={s} className={`chip ${stack.has(s) ? "chip--on" : ""}`} onClick={() => toggleStack(s)}>{s}</button>
                ))}
              </div>
            </div>

            <button className="btn btn--primary btn--lg modal__btn" onClick={handleQualify}>
              submit <span className="btn__arrow">→</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="modal__done">
            <div className="modal__check">&check;</div>
            <h2 className="modal__h">You're in the queue.</h2>
            <p className="modal__sub">We'll email <strong>{email || "you"}</strong> within 48 hours.</p>
            <button className="btn btn--secondary modal__btn" onClick={onClose}>close</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN LANDING PAGE
   ───────────────────────────────────────────────────────── */

export type LandingVariant = "sales" | "never-blank" | "teams";

// TODO: swap hero headline, subhead, "the moment" prose, and CTA copy per variant
// Variant A (sales): "Claude. On every call. Live."
// Variant B (never-blank): "Never blank in a meeting again."
// Variant C (teams): "Your team's knowledge. Live on every call."
export const LandingPage: React.FC<{ variant?: LandingVariant }> = ({ variant = "sales" }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="theme-light">
      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="nav" role="navigation">
        <div className="nav__inner">
          <a href="/sales" className="nav__brand" aria-label="wingscript">
            <img src="/cuedesk-mark.svg?v=ws1" alt="" className="nav__icon" />
            <span className="nav__wm">wingscript</span>
          </a>
          <a href="#teams" className="nav__link">for sales teams</a>
          <a href="https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp" className="btn btn--primary" target="_blank" rel="noopener noreferrer">
            get early access <span className="btn__arrow">→</span>
          </a>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Ready for Lift Off</p>
            <h1 className="hero__h">
              <span>Claude.</span>
              <span>On every call.</span>
              <span>Live.</span>
            </h1>
            <p className="hero__sub">
              wingscript is a real-time AI sales assistant — a Chrome extension
              that listens to your call and cues you with answers from your CRM,
              playbooks, and past calls, before the silence gets awkward.
            </p>
          </div>
          <div className="hero__demo">
            <LiveDemo />
          </div>
        </div>
        <div className="hero__cta">
          <a href="https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp" className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
            get early access <span className="btn__arrow">→</span>
          </a>
          <p className="hero__scarcity">Beta is invite-only. We're onboarding 15 reps in July.</p>
        </div>
      </section>

      {/* ── THE MOMENT ──────────────────────────────── */}
      <section className="prose-section">
        <div className="prose-inner">
          <h2 className="section-h">Every new rep knows the moment.</h2>
          <div className="prose">
            <p>You're six weeks in. The prospect asks a question you should know the answer to. A pricing detail from a doc you read during onboarding. A competitor comparison someone walked you through on day four. A reference customer in their industry that you're pretty sure exists — somewhere in a CRM you're still learning your way around.</p>
            <p>You have two seconds. You can stall — "great question, let me come back to that" — and watch the momentum go. You can guess, and be wrong on a call your manager is going to review. Or you can be the rep who somehow always has the answer ready. The one nobody believes started last month.</p>
            <p>wingscript is how you become that rep. It's not magic. It's your company's knowledge — the CRM, the playbooks, the call history you haven't lived through yet — plus Claude, surfacing the right thing at the right second. The veterans carry all of this in their heads. Now you don't have to wait years to.</p>
          </div>
        </div>
      </section>

      {/* ── PRODUCT DEMO VIDEO ────────────────────────── */}
      <section className="demo-video-section">
        <div className="demo-video-wrap">
          <DemoVideo />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="how">
        <div className="how__inner">
          <h2 className="section-h">It listens. It thinks. It cues you. That's it.</h2>
          <div className="how__frames">
            <div className="how__frame">
              <div className="how__viz how__viz--listen">
                <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
              </div>
              <h3 className="how__h">Listens</h3>
              <p className="how__p">wingscript runs in the background during your call. Audio stays on your machine. Transcription is live.</p>
            </div>
            <div className="how__frame">
              <div className="how__viz how__viz--think">
                <svg viewBox="0 0 120 80" width="120" height="80">
                  <circle cx="20" cy="40" r="4" fill="currentColor" />
                  <circle cx="60" cy="20" r="4" fill="currentColor" />
                  <circle cx="60" cy="60" r="4" fill="currentColor" />
                  <circle cx="100" cy="40" r="4" fill="#5400D1" />
                  <line x1="20" y1="40" x2="60" y2="20" stroke="currentColor" strokeWidth="1" />
                  <line x1="20" y1="40" x2="60" y2="60" stroke="currentColor" strokeWidth="1" />
                  <line x1="60" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="1" />
                  <line x1="60" y1="60" x2="100" y2="40" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <h3 className="how__h">Thinks</h3>
              <p className="how__p">It searches your CRM, your call history, your playbooks, and the open web, and Claude reasons over what it finds to fit this exact moment — not a keyword match.</p>
            </div>
            <div className="how__frame">
              <div className="how__viz how__viz--cue">
                <div className="cue-mini">
                  <div className="cue-mini__lbl">Pricing objection</div>
                  <div className="cue-mini__body">Lead with ROI, not seat price.</div>
                </div>
              </div>
              <h3 className="how__h">Cues</h3>
              <p className="how__p">A cue appears as a card in your heads-up display — with the source it came from. You read. You speak. The card fades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT'S NOT ───────────────────────────── */}
      <section className="prose-section prose-section--dark">
        <div className="prose-inner">
          <h2 className="section-h">wingscript is not a notetaker.</h2>
          <div className="prose">
            <p>It's not Gong. It's not Otter. It's not a post-call summarizer or a coaching review tool. Those tools tell you what happened <em>after</em> the call. They're useful. They don't help you on the call.</p>
            <p>wingscript runs <em>during</em> the conversation. The cue arrives in the seconds you have to respond, not in the email recap tomorrow. That's the whole point. If we did anything else well, we'd be doing this badly.</p>
          </div>
        </div>
      </section>

      {/* ── DISCLOSURE ──────────────────────────────── */}
      <section className="prose-section">
        <div className="prose-inner">
          <h2 className="section-h">"Wait, is this allowed?"</h2>
          <p className="prose-lead">Real-time AI on sales calls is new. Before we get to the beta, here's what you actually need to know.</p>

          <div className="disclosure">
            <h3 className="disclosure__h">Your audio stays on your machine.</h3>
            <p>wingscript transcribes locally. We send the transcript and your context to Claude over an encrypted connection — never the raw audio. Your prospect's voice never leaves your laptop.</p>
          </div>

          <div className="disclosure">
            <h3 className="disclosure__h">Disclosure is built in — and configurable.</h3>
            <p>wingscript can show a banner at the top of the call: "This call is being assisted by an AI co-pilot." Disclosure can be set per rep, or locked on org-wide by an admin — because in some states, and some deals, it isn't optional. If your legal team has questions about real-time transcription, we'd rather talk to them before a pilot than after.</p>
          </div>

          <div className="disclosure">
            <h3 className="disclosure__h">SOC 2 is in progress.</h3>
            <p>We're a beta product, and we're not going to pretend otherwise. SOC 2 Type I is targeted for Q3. If you need a security review before piloting, email <a href="mailto:security@wingscript.com">security@wingscript.com</a> and we'll send the current posture doc.</p>
          </div>
        </div>
      </section>

      {/* ── COMPATIBILITY ───────────────────────────── */}
      <section className="prose-section">
        <div className="prose-inner">
          <h2 className="section-h">Works with the stack you already use.</h2>
          <p className="prose-lead">wingscript is a Chrome extension, so it works on calls that run in your browser — Google Meet and Zoom-on-the-web. The Zoom desktop app isn't captured yet, so run your call in the browser tab. Connect Salesforce or HubSpot for CRM context, plus Gmail, Google Calendar, and Slack so a cue can surface the email thread or the answer a teammate already gave. If your call tool or CRM isn't here, tell us when you request access — it shapes what we build next.</p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ────────────────────────────── */}
      <section className="prose-section" id="who">
        <div className="prose-inner">
          <h2 className="section-h">Built for reps who are still ramping.</h2>
          <p className="prose-lead">The gap wingscript closes is the one between "I read that somewhere" and "here's the answer." That gap is widest in your first year. If you've carried the same patch for a decade and the playbook lives in your head, it'll mostly stay out of your way — it's built for everyone who isn't there yet.</p>

          <div className="fit">
            <div className="fit__card">
              <div className="fit__lbl">New AEs</div>
              <p>Your first 90 days of discovery and demo calls. You already know how to sell — you don't know this product, this pricing, these competitors yet. wingscript does.</p>
            </div>
            <div className="fit__card">
              <div className="fit__lbl">Ramping SDRs</div>
              <p>If your motion is inbound qualification — real fifteen-minute conversations about fit, budget, and timing — wingscript works the same way it does for AEs. If it's sixty cold dials a day, we're not built for that yet. We'd rather tell you now.</p>
            </div>
            <div className="fit__card">
              <div className="fit__lbl">Founder-led sales</div>
              <p>Closing your own deals with no ramp and no coach. No playbook yet? It runs on the open web and your own calls while you build one. wingscript is the veteran in your ear you never hired.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR MANAGERS ────────────────────────────── */}
      <section className="prose-section prose-section--dark" id="teams">
        <div className="prose-inner">
          <h2 className="section-h">If you hire reps, do the math.</h2>
          <div className="prose">
            <p>Take your newest rep's fully-loaded monthly cost. Multiply by the months before they produce a real quarter. Multiply that by everyone you hired this year — then add the ones who left, taking every onboarding session, shadow call, and answered Slack question with them. That's the number wingscript is aimed at.</p>
            <p><strong>It shortens the expensive part.</strong> Your playbooks, pricing, and call history reach the new rep mid-call from week one, instead of waiting to be memorized. And when a rep leaves, the answers stay in the system — not in the exit interview.</p>
            <p><strong>You see it early — and so do they.</strong> You won't wait a full ramp cycle to know if it's working. Scores against your own methodology are the leading signal — who's picking it up, who's stuck and on what — while your real number, ramped pipeline, catches up behind them. The rep sees exactly what you see, same scores, same day. The conversation moves from "why'd you miss quota" to "here's the one thing to work on," both of you looking at the same screen.</p>
            <p><strong>Proficiency in your methodology, not ours.</strong> wingscript scores calls against the framework your company actually runs — MEDDIC, SPIN, Challenger, Straight Line, or your own playbook. Every organization configures it the way they want. The cues and the scoring follow your system, not a generic rubric we invented.</p>
            <p>We run pilots with teams onboarding new hires this quarter.</p>
          </div>
          <a href="mailto:hello@wingscript.com?subject=wingscript%20team%20pilot" className="btn btn--primary btn--lg" style={{ marginTop: 24 }}>
            request a team pilot <span className="btn__arrow">→</span>
          </a>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────── */}
      <section className="prose-section">
        <div className="prose-inner">
          <h2 className="section-h">We're not selling this yet.</h2>
          <div className="prose">
            <p>wingscript is in invite-only beta. We're onboarding 15 reps in July at $25/month — not because that's the price, but because free users don't give honest feedback. Public pricing will land after we know what this is worth to the people using it on real calls.</p>
            <p>If you want in, request access. We'll review and respond within 48 hours.</p>
          </div>
          <a href="https://chromewebstore.google.com/detail/wingscript/mnfaookgldbingbnhalfedkajgagnijp" className="btn btn--primary btn--lg" style={{ marginTop: 24 }} target="_blank" rel="noopener noreferrer">
            request beta access <span className="btn__arrow">→</span>
          </a>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section className="prose-section">
        <div className="prose-inner">
          <h2 className="section-h">Questions reps actually ask.</h2>

          <div className="disclosure">
            <h3 className="disclosure__h">Can I use it without connecting my company's tools?</h3>
            <p>It starts working the moment it's on a call — live transcription plus the open web. The real power comes from your CRM and playbooks, and connecting those is usually a call for whoever owns them. Most reps loop in their manager; that's what the pilot is for.</p>
          </div>

          <div className="disclosure">
            <h3 className="disclosure__h">What if a cue is wrong?</h3>
            <p>Every cue names its source — "from the pricing sheet, updated May" — so when you say it, you know where it came from. It's an assist, not autopilot: your call whether to use it.</p>
          </div>

          <div className="disclosure">
            <h3 className="disclosure__h">Will my manager think I'm cheating?</h3>
            <p>Plenty of managers hand it to new hires on day one — ramping faster is the point, and the disclosure banner keeps it above board.</p>
          </div>

          <div className="disclosure">
            <h3 className="disclosure__h">Is my prospect's data safe?</h3>
            <p>Audio never leaves your machine; transcripts and context go to Claude over an encrypted connection. For retention, deletion, and a full security review, email <a href="mailto:security@wingscript.com">security@wingscript.com</a>.</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <div className="footer__brand"><img src="/cuedesk-mark.svg?v=ws1" alt="" className="footer__icon" /><span>wingscript</span></div>
            <p className="footer__line">Live AI co-pilot for sales calls.</p>
          </div>
          <div className="footer__links">
            <a href="/privacy">privacy</a>
            <a href="mailto:security@wingscript.com">security</a>
            <a href="mailto:hello@wingscript.com">contact</a>
            <a href="mailto:legal@wingscript.com">terms</a>
          </div>
        </div>
        <div className="footer__copy">{`© ${new Date().getFullYear()} wingscript, inc.`}</div>
      </footer>

      {/* ── MODAL ───────────────────────────────────── */}
      {modalOpen && <RequestModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};
