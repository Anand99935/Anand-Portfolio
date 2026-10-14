"use client";

import React, { useEffect, useRef, useState, startTransition } from "react";

import AsciiPortrait from "./AsciiPortrait";
import { SITE } from "../lib/site";

/* ------------------------------------------------------------------
   The full command that gets typed out character by character.
------------------------------------------------------------------ */
const COMMAND = "whoami --ascii";

/* ------------------------------------------------------------------
   Output: the live ASCII portrait plus a one-line render summary.
------------------------------------------------------------------ */
function PortraitOutput() {
  return (
    <div className="term-portrait">
      <AsciiPortrait />
      <p className="term-portrait-meta">
        <span className="term-key">✓ rendered</span>{" "}
        <span className="term-punct">120×77 glyphs ·</span>{" "}
        <span className="term-str">{SITE.name.toLowerCase()}</span>{" "}
        <span className="term-punct">· hover to disturb, click to re-render</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
   TerminalBlock
------------------------------------------------------------------ */
export default function TerminalBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Detect prefers-reduced-motion on mount */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    startTransition(() => setReducedMotion(mq.matches));
    const handler = (e: MediaQueryListEvent) => startTransition(() => setReducedMotion(e.matches));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ---- IntersectionObserver: fires the sequence on first entry ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  /* ---- Typewriter: runs once `started` flips to true ---- */
  useEffect(() => {
    if (!started) return;

    /* Under reduced motion: show full command and output instantly */
    if (reducedMotion) {
      startTransition(() => {
        setCommand(COMMAND);
        setShowOutput(true);
      });
      return;
    }

    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex += 1;
      setCommand(COMMAND.slice(0, charIndex));

      if (charIndex === COMMAND.length) {
        clearInterval(interval);
        setTimeout(() => setShowOutput(true), 500);
      }
    }, 95); // ~95 ms per character — deliberate, readable pace

    return () => clearInterval(interval);
  }, [started, reducedMotion]);

  return (
    <div ref={containerRef} className="term-shell">
      <div className="term-shell-inner">
        {/* ---- Title bar ---- */}
        <div className="term-bar">
          <div className="term-dots">
            <span className="term-dot term-dot--red" />
            <span className="term-dot term-dot--yellow" />
            <span className="term-dot term-dot--green" />
          </div>
          <span className="term-title">guest@anand: ~</span>
        </div>

        {/* ---- Body ---- */}
        <div className={`term-body${showOutput ? " is-expanded" : ""}`}>
          {/* Command line being typed */}
          <div className="term-line">
            <span className="term-prompt-arrow">➡︎</span>
            <span className="term-prompt-dir">~</span>
            <span className="term-typed">{command}</span>
            {!showOutput && <span className="terminal-cursor" aria-hidden="true" />}
          </div>

          {/* Output: revealed after typing finishes */}
          {showOutput && (
            <div className="fade-in-fast">
              <PortraitOutput />
              {/* Second prompt line at the bottom */}
              <div className="term-line term-line--mt">
                <span className="term-prompt-arrow">➡︎</span>
                <span className="term-prompt-dir">~</span>
                <span className="terminal-cursor" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
