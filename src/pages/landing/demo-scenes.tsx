// demo-scenes.tsx — 28s product teaser for the hero section.
// 5 scenes: title → persona briefing → cue arrives → goals auto-check → close w/ CTA.
// Ported from the design system's scenes.jsx with clickable "Add to Chrome" CTA.

import React from "react";
import { Easing, animate, useSprite, Sprite, Stage } from "./demo-engine";

const FONT_DISPLAY = "'Inter Tight', 'Inter', system-ui, sans-serif";
const FONT_SANS = "'Inter', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";
const CUE_500 = "#3D8BFF";
const CUE_300 = "#7AB0FF";
const LIVE = "#FF4D4D";
const PAPER = "#ECEAE4";
const SLATE_900 = "#0B0D10";

const CWS_URL = "https://chromewebstore.google.com/detail/hgekagfaoojilnelfgalkbocbeimfphb";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EaseOut = Easing.easeOutCubic;
const fade = (start: number, end: number) => (t: number) => animate({ from: 0, to: 1, start, end })(t);
const rise = (start: number, end: number, dy = 12) =>
  (t: number) => ({
    opacity: animate({ from: 0, to: 1, start, end })(t),
    transform: `translateY(${animate({ from: dy, to: 0, start, end, ease: EaseOut })(t)}px)`,
  });
const slide = (start: number, end: number, dx = 24) =>
  (t: number) => ({
    opacity: animate({ from: 0, to: 1, start, end })(t),
    transform: `translateX(${animate({ from: dx, to: 0, start, end, ease: EaseOut })(t)}px)`,
  });

function useExit(out = 0.4) {
  const { localTime, duration } = useSprite();
  const ext = duration - localTime;
  return ext < out ? Math.max(0, ext / out) : 1;
}

// ─── Horizontal Logo SVG ──────────────────────────────────────────────────────
function CuedeskHLogo({ height = 80, color = SLATE_900, markFill = SLATE_900, markText = PAPER }: {
  height?: number; color?: string; markFill?: string; markText?: string;
}) {
  const w = (height * 1182.315) / 329.502;
  return (
    <svg width={w} height={height} viewBox="0 0 1182.315 329.502" style={{ display: "block" }}>
      <g transform="translate(362.373,229.219)">
        <rect x="-284" y="-158" rx="35" ry="35" width="160" height="160" fill={markFill}/>
        <rect x="-249" y="-86.5" width="55" height="15" rx="7.5" ry="7.5" fill={markText}/>
        <circle cx="-174" cy="-78" r="8.75" fill={LIVE}/>
        <g transform="translate(-70,0)" fill={color}>
          <path d="M54.31640625 2.021484375C74.970703125 2.021484375 90.966796875 -9.140625 95.712890625 -27.685546875L77.431640625 -32.080078125C74.794921875 -21.4453125 66.62109375 -14.326171875 54.404296875 -14.326171875C36.650390625 -14.326171875 28.125 -29.8828125 28.125 -48.603515625C28.125 -67.587890625 36.650390625 -83.14453125 54.404296875 -83.14453125C66.4453125 -83.14453125 74.443359375 -76.201171875 77.080078125 -66.09375L95.44921875 -70.48828125C90.615234375 -88.681640625 74.70703125 -99.4921875 54.31640625 -99.4921875C26.630859375 -99.4921875 8.4375 -79.189453125 8.4375 -48.603515625C8.4375 -18.28125 26.630859375 2.021484375 54.31640625 2.021484375Z"/>
          <path d="M148.580859375 1.23046875C162.116015625 1.23046875 172.662890625 -4.833984375 178.815234375 -19.072265625L178.903125 0H197.448046875V-98.26171875H178.02421875V-40.078125C178.02421875 -24.521484375 168.268359375 -15.64453125 155.17265625 -15.64453125C142.340625 -15.64453125 134.43046875 -24.08203125 134.43046875 -38.232421875V-98.26171875H115.09453125V-35.859375C115.09453125 -11.6015625 128.541796875 1.23046875 148.580859375 1.23046875Z"/>
          <path d="M263.9390625 2.021484375C284.944921875 2.021484375 299.97421875 -8.26171875 304.632421875 -23.5546875L286.4390625 -27.861328125C283.011328125 -18.720703125 274.925390625 -13.974609375 264.11484375 -13.974609375C248.030859375 -13.974609375 237.132421875 -24.2578125 236.429296875 -43.2421875H306.1265625V-50.09765625C306.1265625 -85.517578125 284.68125 -99.4921875 262.269140625 -99.4921875C234.759375 -99.4921875 217.005468750 -78.662109375 217.005468750 -48.427734375C217.005468750 -17.9296875 234.935156250 2.021484375 263.9390625 2.021484375ZM236.517187500 -57.65625C237.571875000 -71.806640625 246.888281250 -83.49609375 262.35703125 -83.49609375C277.210546875 -83.49609375 285.56015625 -73.125 286.96640625 -57.65625Z"/>
          <path d="M362.070703125 1.93359375C379.824609375 1.93359375 386.943749999 -9.140625 390.371484374 -15.380859375H391.953515624V0H410.762109374V-130.95703125H391.426171874V-82.265625H390.371484374C387.031640624 -88.330078125 380.351953124 -99.4921875 362.070703125 -99.4921875C338.428124999 -99.4921875 320.937890624 -80.859375 320.937890624 -48.8671875C320.937890624 -17.138671875 338.164453124 1.93359375 362.070703125 1.93359375ZM366.289453125 -14.501953125C349.502343749 -14.501953125 340.713281249 -29.53125 340.713281249 -49.04296875C340.713281249 -68.37890625 349.238671874 -83.056640625 366.289453125 -83.056640625C382.900781249 -83.056640625 391.777734374 -69.43359375 391.777734374 -49.04296875C391.777734374 -28.564453125 382.724999999 -14.501953125 366.289453125 -14.501953125Z"/>
          <path d="M477.341015624 2.021484375C498.346874999 2.021484375 513.376171874 -8.26171875 518.034374999 -23.5546875L499.841015624 -27.861328125C496.413281249 -18.720703125 488.327343749 -13.974609375 477.516796874 -13.974609375C461.432812499 -13.974609375 450.534374999 -24.2578125 449.831249999 -43.2421875H519.528515624V-50.09765625C519.528515624 -85.517578125 498.083203124 -99.4921875 475.671093749 -99.4921875C448.161328124 -99.4921875 430.407421874 -78.662109375 430.407421874 -48.427734375C430.407421874 -17.9296875 448.337109374 2.021484375 477.341015624 2.021484375ZM449.919140624 -57.65625C450.973828124 -71.806640625 460.290234374 -83.49609375 475.758984374 -83.49609375C490.612499999 -83.49609375 498.962109374 -73.125 500.368359374 -57.65625Z"/>
          <path d="M574.154296875 2.021484375C598.1484375 2.021484375 614.671875 -10.634765625 614.671875 -28.564453125C614.671875 -42.1875 606.05859375 -50.9765625 587.865234375 -55.107421875L572.044921875 -58.623046875C561.234375 -61.083984375 556.83984375 -64.951171875 556.83984375 -71.455078125C556.83984375 -78.837890625 564.92578125 -84.19921875 575.560546875 -84.19921875C587.162109375 -84.19921875 592.69921875 -78.046875 595.248046875 -71.19140625L612.5625 -74.970703125C608.34375 -89.560546875 596.654296875 -99.4921875 575.384765625 -99.4921875C553.1484375 -99.4921875 537.328125 -87.802734375 537.328125 -70.224609375C537.328125 -56.162109375 546.1171875 -47.197265625 564.3984375 -43.06640625L580.921875 -39.287109375C590.23828125 -37.177734375 594.720703125 -33.134765625 594.720703125 -26.89453125C594.720703125 -19.599609375 586.810546875 -13.623046875 574.330078125 -13.623046875C562.904296875 -13.623046875 555.43359375 -18.369140625 552.708984375 -28.65234375L534.515625 -24.873046875C538.03125 -7.470703125 552.796875 2.021484375 574.154296875 2.021484375Z"/>
          <path d="M634.053515625 0H653.389453125V-34.62890625L662.79375 -44.033203125L695.928515625 0H719.834765625L677.559375 -55.8984375L717.11015625 -98.26171875H693.90703125L655.147265625 -56.77734375H653.389453125V-130.95703125H634.053515625Z"/>
        </g>
      </g>
    </svg>
  );
}

// ============================================================================
// SCENE 1 — Title (0 → 2.5s)
// ============================================================================
function SceneTitle() {
  const { localTime } = useSprite();
  const exit = useExit(0.35);
  const logoEntry = rise(0.15, 0.85, 18)(localTime);
  const tagEntry = rise(0.85, 1.4, 10)(localTime);
  const subEntry = rise(1.2, 1.7, 8)(localTime);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 78% 18%, rgba(61,139,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 85%, rgba(61,139,255,0.06) 0%, transparent 60%), #0B0D10",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 28, opacity: exit,
    }}>
      <div style={{ ...logoEntry }}>
        <CuedeskHLogo height={120} color={PAPER} markFill={PAPER} markText={SLATE_900}/>
      </div>
      <div style={{ ...tagEntry, fontFamily: FONT_DISPLAY, fontWeight: 500,
        fontSize: 28, color: "rgba(236,234,228,0.78)", letterSpacing: "-0.020em",
        textAlign: "center", whiteSpace: "nowrap" }}>
        the live AI co-pilot for sales calls.
      </div>
      <div style={{ ...subEntry, marginTop: 8, display: "flex", gap: 10, alignItems: "center",
        fontFamily: FONT_MONO, fontSize: 12, color: "rgba(236,234,228,0.45)",
        letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: LIVE,
          boxShadow: "0 0 0 0 rgba(255,77,77,0.55)" }}/>
        now in chrome
      </div>
    </div>
  );
}

// ============================================================================
// SCENE 2 — Persona briefing (2.5 → 9.0s)
// ============================================================================
function ScenePersona() {
  const { localTime } = useSprite();
  const exit = useExit(0.4);
  const eyebrowSt = rise(0.0, 0.5, 10)(localTime);
  const h2St = rise(0.25, 0.95, 14)(localTime);
  const subSt = rise(0.65, 1.2, 10)(localTime);
  const mockSt = slide(0.15, 0.85, 30)(localTime);

  const rows = [
    { t: "ROLE", body: "VP Sales · Acme Corp · 14 AEs", at: 1.5 },
    { t: "BACKGROUND", body: "Promoted Sep 2025. Led mid-market at Stripe.", at: 2.1 },
    { t: "PRIORITIES", body: "Rep ramp time. Forecast accuracy. Less tool sprawl.", at: 2.7 },
    { t: "RECENT POST", body: "\u201cThe death of the SDR is overblown. Outbound is back.\u201d", at: 3.3 },
    { t: "LAST CALL", body: "Sep 14 · asked for ROI proof. Never sent.", at: 3.9 },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, background: "#F8F6F2", opacity: exit,
      display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 56, padding: "80px 96px", alignItems: "center",
    }}>
      <div>
        <div style={{ ...eyebrowSt, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em",
          textTransform: "uppercase", color: "#1E5BD6", marginBottom: 20,
          display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "#1E5BD6" }}/> Before the call
        </div>
        <h2 style={{ ...h2St, fontFamily: FONT_DISPLAY, fontSize: 72, lineHeight: 0.98,
          letterSpacing: "-0.035em", fontWeight: 600, margin: "0 0 28px", color: "#1A1814" }}>
          Knows the room<br/><span style={{ backgroundImage: "linear-gradient(transparent 70%, rgba(61,139,255,0.30) 70%)" }}>before you join.</span>
        </h2>
        <p style={{ ...subSt, fontSize: 18, lineHeight: 1.55, color: "rgba(26,24,20,0.65)",
          maxWidth: 440, margin: "0 0 28px" }}>
          cuedesk reads their LinkedIn, your CRM, and your last conversation — and hands you a briefing the moment your meeting opens.
        </p>
        <div style={{ ...subSt, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["linkedin", "hubspot · salesforce", "your last call", "acme.com · changelog"].map(c => (
            <span key={c} style={{ fontFamily: FONT_MONO, fontSize: 11.5, padding: "6px 10px",
              borderRadius: 6, background: "rgba(11,13,16,0.04)", border: "1px solid rgba(11,13,16,0.08)",
              color: "rgba(26,24,20,0.7)", whiteSpace: "nowrap" }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 500, ...mockSt,
          background: "rgba(15,17,21,0.92)", border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14, boxShadow: "0 40px 100px rgba(0,0,0,0.55)", color: PAPER,
          fontFamily: FONT_SANS, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(61,139,255,0.06)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIVE }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: CUE_300 }}>pre-call</span>
            <span style={{ fontSize: 12.5, color: "rgba(236,234,228,0.72)" }}>acme discovery · in 4 min</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 11, color: "rgba(236,234,228,0.5)" }}>10:00 AM</span>
          </div>
          <div style={{ padding: "18px 18px 14px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", flex: "none",
              background: "radial-gradient(circle at 30% 30%, #4a5060, #20242c)",
              border: "1px solid rgba(255,255,255,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 27, color: PAPER }}>M</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: "-0.020em", color: PAPER, lineHeight: 1.1 }}>Marcus Chen</div>
              <div style={{ marginTop: 3, fontSize: 12.5, color: "rgba(236,234,228,0.72)" }}>VP Sales · Acme Corp · $42M ARR</div>
            </div>
          </div>
          <div style={{ padding: "0 18px 14px" }}>
            {rows.map((r, i) => {
              const op = fade(r.at, r.at + 0.45)(localTime);
              const tx = animate({ from: 14, to: 0, start: r.at, end: r.at + 0.5, ease: EaseOut })(localTime);
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "120px 1fr", gap: 14, alignItems: "baseline",
                  padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.05)",
                  opacity: op, transform: `translateX(${tx}px)`,
                }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(236,234,228,0.5)" }}>{r.t}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.5, color: "rgba(236,234,228,0.92)" }}>{r.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCENE 3 — Cue arrives (9.0 → 17.0s)
// ============================================================================
function SceneCue() {
  const { localTime } = useSprite();
  const exit = useExit(0.4);
  const eyebrowSt = rise(0.0, 0.4, 8)(localTime);
  const h2St = rise(0.2, 0.85, 14)(localTime);
  const subSt = rise(0.6, 1.1, 10)(localTime);
  const mockSt = slide(0.0, 0.7, 36)(localTime);

  const propLine1 = "\u2026and we love the demo, really. But honestly the price is twice what we budgeted.";
  const propLine2 = "How are you priced for a team our size?";
  const prop1Start = 1.6;
  const prop2Start = 3.6;
  const chars1 = Math.max(0, Math.min(propLine1.length, Math.floor((localTime - prop1Start) * 38)));
  const chars2 = Math.max(0, Math.min(propLine2.length, Math.floor((localTime - prop2Start) * 36)));

  const cueAt = 5.3;
  const cueOp = fade(cueAt, cueAt + 0.45)(localTime);
  const cueTy = animate({ from: 14, to: 0, start: cueAt, end: cueAt + 0.5, ease: EaseOut })(localTime);
  const cueLblOp = fade(cueAt + 0.05, cueAt + 0.45)(localTime);
  const cueBodyOp = fade(cueAt + 0.20, cueAt + 0.70)(localTime);
  const cueSrcOp = fade(cueAt + 0.55, cueAt + 0.95)(localTime);
  const secCueAt = cueAt + 0.85;
  const secCueOp = fade(secCueAt, secCueAt + 0.45)(localTime);
  const secCueTy = animate({ from: 10, to: 0, start: secCueAt, end: secCueAt + 0.45, ease: EaseOut })(localTime);

  const tsec = 14 + Math.floor(localTime * 0.6);
  const tstr = `07:${String(tsec).padStart(2, "0")}`;

  return (
    <div style={{
      position: "absolute", inset: 0, opacity: exit,
      background: "radial-gradient(ellipse at 25% 30%, rgba(255,255,255,0.10) 0%, transparent 50%), linear-gradient(135deg, #3D8BFF 0%, #1E5BD6 100%)",
      display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, padding: "80px 96px", alignItems: "center",
    }}>
      <div style={{ color: "#fff" }}>
        <div style={{ ...eyebrowSt, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 20,
          display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.4)" }}/> The cue
        </div>
        <h2 style={{ ...h2St, fontFamily: FONT_DISPLAY, fontSize: 76, lineHeight: 0.98,
          letterSpacing: "-0.04em", fontWeight: 600, margin: "0 0 32px", color: "#FFFFFF" }}>
          The answer.<br/>Before they<br/>finish asking.
        </h2>
        <p style={{ ...subSt, fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.82)", maxWidth: 460, margin: 0 }}>
          The prospect asks. cuedesk has already searched your CRM, your playbooks, and the open web — and put the answer on screen. In 400&nbsp;ms.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <div style={{
          width: 500, ...mockSt,
          background: "rgba(15,17,21,0.92)", border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14, boxShadow: "0 40px 100px rgba(0,0,0,0.55)", color: PAPER,
          fontFamily: FONT_SANS, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIVE }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: LIVE }}>Live</span>
            <span style={{ fontSize: 12.5, color: "rgba(236,234,228,0.72)" }}>demo · acme corp · with Marcus</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 11, color: "rgba(236,234,228,0.5)" }}>{tstr}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 16px 6px" }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(236,234,228,0.5)" }}>transcript</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "rgba(236,234,228,0.35)" }}>streaming</span>
          </div>
          <div style={{ padding: "4px 16px 14px", fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.65, display: "flex", flexDirection: "column", gap: 6 }}>
            {localTime > prop1Start && (
              <div style={{ display: "grid", gridTemplateColumns: "36px 28px 1fr", gap: 8 }}>
                <span style={{ fontSize: 10, color: "rgba(236,234,228,0.3)", paddingTop: 3 }}>{tstr}</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 5px", borderRadius: 3, background: "rgba(255,138,138,0.15)", color: "#FF8A8A", height: "fit-content", marginTop: 2, textAlign: "center" }}>Mar</span>
                <span style={{ color: "rgba(236,234,228,0.88)" }}>
                  {propLine1.slice(0, chars1)}
                  {chars1 < propLine1.length && <span style={{ display: "inline-block", width: 5, height: 12, background: "rgba(236,234,228,0.5)", verticalAlign: -2, marginLeft: 2 }}/>}
                </span>
              </div>
            )}
            {localTime > prop2Start && (
              <div style={{ display: "grid", gridTemplateColumns: "36px 28px 1fr", gap: 8 }}>
                <span style={{ fontSize: 10, color: "rgba(236,234,228,0.3)", paddingTop: 3 }}>{`07:${String(tsec + 2).padStart(2, "0")}`}</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 5px", borderRadius: 3, background: "rgba(255,138,138,0.15)", color: "#FF8A8A", height: "fit-content", marginTop: 2, textAlign: "center" }}>Mar</span>
                <span style={{ color: "rgba(236,234,228,0.88)" }}>
                  {propLine2.slice(0, chars2)}
                  {chars2 < propLine2.length && <span style={{ display: "inline-block", width: 5, height: 12, background: "rgba(236,234,228,0.5)", verticalAlign: -2, marginLeft: 2 }}/>}
                </span>
              </div>
            )}
          </div>

          {localTime > cueAt - 0.1 && (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 16px 6px", opacity: cueLblOp }}>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: CUE_300 }}>cue · just arrived</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "rgba(236,234,228,0.35)" }}>380ms · 2 sources</span>
            </div>
            <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{
                position: "relative", background: "rgba(61,139,255,0.10)", border: "1px solid rgba(61,139,255,0.30)",
                borderRadius: 10, padding: "14px 18px 14px 20px", opacity: cueOp, transform: `translateY(${cueTy}px)`,
              }}>
                <span style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, background: CUE_500, borderRadius: 1 }}/>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: CUE_300, marginBottom: 8, opacity: cueLblOp }}>Pricing objection</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.6, color: PAPER, opacity: cueBodyOp }}>
                  Don't discount. Anchor on the $180k they said they spent on the legacy tool last call. Offer annual to drop 12%.
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "rgba(236,234,228,0.55)", display: "flex", alignItems: "center", gap: 6, opacity: cueSrcOp }}>
                  call · apr 12 · 14:22 — "$180k/yr legacy spend"
                </div>
              </div>
              {localTime > secCueAt && (
                <div style={{
                  position: "relative", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 10, padding: "14px 18px 14px 20px", opacity: secCueOp, transform: `translateY(${secCueTy}px)`,
                }}>
                  <span style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 2, background: "rgba(236,234,228,0.30)", borderRadius: 1 }}/>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(236,234,228,0.55)", marginBottom: 8 }}>Playbook · objection</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12.5, lineHeight: 1.6, color: PAPER }}>
                    "Reframe to ROI before discount. Ask: what's the cost of staying where you are?"
                  </div>
                </div>
              )}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCENE 4 — Goals auto-check (17.0 → 24.0s)
// ============================================================================
function SceneGoals() {
  const { localTime } = useSprite();
  const exit = useExit(0.4);
  const eyebrowSt = rise(0.0, 0.45, 10)(localTime);
  const h2St = rise(0.20, 0.85, 14)(localTime);
  const subSt = rise(0.60, 1.10, 10)(localTime);
  const statSt = rise(0.95, 1.45, 8)(localTime);
  const mockSt = slide(0.1, 0.8, 36)(localTime);

  const goals = [
    { label: "Confirm pain points", at: 1.5, evidence: "rep ramp · forecast accuracy", t: "07:42" },
    { label: "Validate budget range", at: 2.4, evidence: "$45k ACV · 14 seats", t: "09:18" },
    { label: "Surface competitive concerns", at: 3.2, evidence: "Gong, Salesloft mentioned", t: "11:04" },
    { label: "Identify decision criteria", at: 4.0, evidence: "needs ROI proof in 30d", t: "14:21" },
    { label: "Lock the next step", at: 4.9, evidence: "demo · thu 2pm · w/ rev ops", t: "18:33" },
  ];

  const completed = goals.filter(g => localTime > g.at + 0.4).length;

  return (
    <div style={{
      position: "absolute", inset: 0, opacity: exit,
      background: "radial-gradient(ellipse at 78% 18%, rgba(61,139,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 20% 85%, rgba(61,139,255,0.06) 0%, transparent 60%), #0B0D10",
      display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 56, padding: "60px 96px", alignItems: "center",
      color: PAPER,
    }}>
      <div>
        <div style={{ ...eyebrowSt, fontSize: 11, fontWeight: 700, letterSpacing: "0.20em",
          textTransform: "uppercase", color: CUE_300, marginBottom: 20,
          display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: CUE_300 }}/> During the call
        </div>
        <h2 style={{ ...h2St, fontFamily: FONT_DISPLAY, fontSize: 68, lineHeight: 1.0,
          letterSpacing: "-0.035em", fontWeight: 600, margin: "0 0 28px" }}>
          Every goal,<br/><span style={{ color: CUE_300 }}>checked off</span><br/>as you talk.
        </h2>
        <p style={{ ...subSt, fontSize: 18, lineHeight: 1.55, color: "rgba(236,234,228,0.65)", maxWidth: 460, margin: "0 0 18px" }}>
          You set your goals before the call. cuedesk listens for the moment each one lands — and quietly ticks the box, with the evidence right there.
        </p>
        <div style={{ ...statSt, maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_MONO, fontSize: 12, color: "rgba(236,234,228,0.55)", marginBottom: 8 }}>
            <span>meeting progress</span>
            <span style={{ color: PAPER }}>{completed} / {goals.length}</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(completed / goals.length) * 100}%`, height: "100%", background: CUE_500, transition: "width 380ms cubic-bezier(0.22,1,0.36,1)" }}/>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 500, ...mockSt,
          background: "rgba(15,17,21,0.92)", border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14, boxShadow: "0 40px 100px rgba(0,0,0,0.55)", color: PAPER,
          fontFamily: FONT_SANS, overflow: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: LIVE }}/>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: LIVE }}>Live</span>
            <span style={{ fontSize: 12.5, color: "rgba(236,234,228,0.72)" }}>meeting goals · acme discovery</span>
            <span style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 11, color: "rgba(236,234,228,0.5)" }}>{completed} / 5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 16px 6px" }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(236,234,228,0.5)" }}>objectives</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "rgba(236,234,228,0.35)" }}>tracked live</span>
          </div>
          <div style={{ padding: "4px 16px 16px" }}>
            {goals.map((g, i) => {
              const rowOp = fade(0.2 + i * 0.08, 0.55 + i * 0.08)(localTime);
              const checked = localTime > g.at;
              const cp = animate({ from: 0, to: 1, start: g.at, end: g.at + 0.4, ease: EaseOut })(localTime);
              const evOp = fade(g.at + 0.15, g.at + 0.55)(localTime);
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "26px 1fr auto", gap: 12, alignItems: "flex-start",
                  padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)", opacity: rowOp,
                }}>
                  <Checkbox checked={checked} progress={cp}/>
                  <div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17, letterSpacing: "-0.012em",
                      color: checked ? PAPER : "rgba(236,234,228,0.72)", transition: "color 220ms" }}>{g.label}</div>
                    {checked && (
                      <div style={{ marginTop: 4, fontFamily: FONT_MONO, fontSize: 11.5, color: CUE_300, opacity: evOp,
                        display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 1, background: CUE_300, opacity: 0.6 }}/>
                        captured: {g.evidence}
                      </div>
                    )}
                  </div>
                  {checked && (
                    <div style={{ padding: "3px 8px", borderRadius: 4, background: "rgba(47,143,80,0.15)",
                      color: "#7BC596", fontFamily: FONT_MONO, fontSize: 10.5, whiteSpace: "nowrap", marginTop: 2, opacity: evOp }}>
                      auto · {g.t}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({ checked, progress }: { checked: boolean; progress: number }) {
  const off = 36 - Math.min(1, progress) * 36;
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 5, marginTop: 1, flex: "none",
      background: checked ? CUE_500 : "transparent",
      border: `1.5px solid ${checked ? CUE_500 : "rgba(236,234,228,0.30)"}`,
      transition: "background 180ms, border-color 180ms",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: checked ? "0 0 0 3px rgba(61,139,255,0.18)" : "none",
    }}>
      {checked && (
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <path d="M3.5 9.5L7.5 13.5L14.5 5" stroke="#fff" strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="36" strokeDashoffset={off}/>
        </svg>
      )}
    </div>
  );
}

// ============================================================================
// SCENE 5 — Close (24.0 → 28.0s) — CTA is a real link
// ============================================================================
function SceneClose() {
  const { localTime } = useSprite();
  const beat1 = fade(0.15, 0.55)(localTime);
  const beat2 = fade(0.50, 0.90)(localTime);
  const beat3 = fade(0.85, 1.25)(localTime);
  const logoSt = rise(1.25, 1.85, 14)(localTime);
  const ctaSt = rise(1.95, 2.50, 8)(localTime);

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 80% 20%, rgba(255,77,77,0.10) 0%, transparent 55%), #0B0D10",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ display: "flex", gap: 36, marginBottom: 64,
        fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 72,
        letterSpacing: "-0.035em", lineHeight: 1.0 }}>
        <span style={{ opacity: beat1, color: "rgba(236,234,228,0.4)", transform: `translateY(${(1 - beat1) * 8}px)` }}>listens.</span>
        <span style={{ opacity: beat2, color: "rgba(236,234,228,0.4)", transform: `translateY(${(1 - beat2) * 8}px)` }}>thinks.</span>
        <span style={{ opacity: beat3, color: PAPER, transform: `translateY(${(1 - beat3) * 8}px)` }}>cues.</span>
      </div>

      <div style={{ ...logoSt }}>
        <CuedeskHLogo height={96} color={PAPER} markFill={PAPER} markText={SLATE_900}/>
      </div>

      <div style={{ ...ctaSt, marginTop: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <a
          href={CWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "12px 22px", borderRadius: 8,
            background: CUE_500, color: "#fff",
            fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17,
            letterSpacing: "-0.012em", whiteSpace: "nowrap",
            boxShadow: "0 12px 28px rgba(61,139,255,0.32)",
            textDecoration: "none",
          }}
        >
          Add to Chrome
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M4 9H14M10 5L14 9L10 13" stroke="#fff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "rgba(236,234,228,0.5)", letterSpacing: "0.04em" }}>
          invite-only beta
        </span>
      </div>
    </div>
  );
}

// ─── Export: DemoVideo ──────────────────────────────────────────────────────
export function DemoVideo() {
  return (
    <Stage width={1280} height={800} duration={28} background={SLATE_900}>
      <Sprite start={0} end={2.5}><SceneTitle /></Sprite>
      <Sprite start={2.5} end={9.0}><ScenePersona /></Sprite>
      <Sprite start={9.0} end={17.0}><SceneCue /></Sprite>
      <Sprite start={17.0} end={24.0}><SceneGoals /></Sprite>
      <Sprite start={24.0} end={28.0}><SceneClose /></Sprite>
    </Stage>
  );
}
