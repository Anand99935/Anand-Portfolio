"use client";

import { useEffect, useRef } from "react";
import { ASCII_PORTRAIT } from "../lib/asciiPortrait";
import { SITE } from "../lib/site";

/* Must match the ramp in scripts/generate-ascii-portrait.mjs — a glyph's
   position in it is its density, which also drives its brightness here. */
const RAMP = " .'`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const NOISE = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ@$%&";
const ROWS = ASCII_PORTRAIT.length;
const COLS = ASCII_PORTRAIT[0]?.length ?? 0;
/* Cell height / width — the generator squashed rows by 0.5 to match. */
const CELL_RATIO = 2;
export const ASCII_ASPECT = (ROWS * CELL_RATIO) / COLS;

const INK = [237, 229, 216];
const GOLD = [232, 201, 122];
const COOL = [143, 168, 196];
const ALPHA_STEPS = 10;

const DECODE_MS = 1500;
const DECODE_WINDOW = 260;
const POINTER_RADIUS = 9; // in cells
const GLITCH_EVERY = [1800, 4200];
const GLITCH_MS = 140;

type Cell = { ch: string; lvl: number; reveal: number };

const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];
const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const alphaFor = (lvl: number) => 0.1 + 0.9 * Math.pow(lvl, 1.5);

/* Top-down decode with a diagonal skew and jitter, so the face "prints"
   like a scanline rather than appearing as a block. */
const revealAt = (x: number, y: number) =>
  (y / ROWS) * DECODE_MS * 0.8 + (x / COLS) * 180 + Math.random() * 220;

function buildCells(): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const ch = ASCII_PORTRAIT[y][x] ?? " ";
      const idx = RAMP.indexOf(ch);
      cells.push({ ch, lvl: idx < 0 ? 0.5 : idx / (RAMP.length - 1), reveal: revealAt(x, y) });
    }
  }
  return cells;
}

/**
 * Canvas-rendered ASCII portrait. Decodes in on first view, scrambles
 * glyphs into gold around the pointer, and throws an occasional RGB-split
 * glitch band while idle. Click to re-run the decode. Reduced motion
 * gets the finished portrait, drawn once.
 */
export default function AsciiPortrait({
  active = true,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restartRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || !active || COLS === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cells = buildCells();
    const fontFamily = getComputedStyle(canvas).fontFamily || "monospace";

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    /* Finished portrait pre-rendered once per size; per frame we blit it
       and only redraw the cells an effect is touching. */
    const still = document.createElement("canvas");
    const stillCtx = still.getContext("2d");

    let raf = 0;
    let visible = false;
    let start = performance.now();
    let decoded = reduced;
    let pointer: { x: number; y: number } | null = null;
    let glitch: { row: number; rows: number; shift: number; until: number } | null = null;
    let nextGlitch = performance.now() + 2400;
    let lastFrame = 0;

    const setFont = (c: CanvasRenderingContext2D) => {
      c.font = `500 ${ch * 0.92}px ${fontFamily}`;
      c.textAlign = "center";
      c.textBaseline = "middle";
    };

    const drawStill = () => {
      if (!stillCtx) return;
      still.width = canvas.width;
      still.height = canvas.height;
      stillCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont(stillCtx);
      /* Bucket by alpha so fillStyle changes ~10 times, not ~9k. */
      for (let step = 0; step < ALPHA_STEPS; step++) {
        stillCtx.fillStyle = rgba(INK, alphaFor((step + 0.5) / ALPHA_STEPS));
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (cell.ch === " ") continue;
          if (Math.min(ALPHA_STEPS - 1, (cell.lvl * ALPHA_STEPS) | 0) !== step) continue;
          const x = i % COLS;
          const y = (i / COLS) | 0;
          stillCtx.fillText(cell.ch, x * cw + cw / 2, y * ch + ch / 2);
        }
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = rect.width / COLS;
      ch = cw * CELL_RATIO;
      const height = ch * ROWS;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont(ctx);
      drawStill();
      if (reduced || decoded) paintStill();
    };

    const paintStill = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(still, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCell = (i: number, glyph: string, color: number[], alpha: number, dx = 0, dy = 0) => {
      const x = i % COLS;
      const y = (i / COLS) | 0;
      ctx.fillStyle = rgba(color, alpha);
      ctx.fillText(glyph, x * cw + cw / 2 + dx, y * ch + ch / 2 + dy);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      /* ~40fps is plenty for glyph noise and halves the fillText bill. */
      if (now - lastFrame < 24) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastFrame = now;
      const t = now - start;

      if (!decoded) {
        ctx.clearRect(0, 0, cw * COLS, ch * ROWS);
        let pending = false;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (cell.ch === " ") continue;
          const d = t - cell.reveal;
          if (d < 0) {
            pending = true;
            continue;
          }
          if (d < DECODE_WINDOW) {
            pending = true;
            drawCell(i, randomGlyph(), GOLD, 0.35 + 0.6 * (1 - d / DECODE_WINDOW));
          } else {
            drawCell(i, cell.ch, INK, alphaFor(cell.lvl));
          }
        }
        /* Scanline riding the decode front */
        const front = Math.min(1, t / (DECODE_MS * 0.8)) * ch * ROWS;
        const grad = ctx.createLinearGradient(0, front - 40, 0, front + 4);
        grad.addColorStop(0, rgba(GOLD, 0));
        grad.addColorStop(1, rgba(GOLD, 0.18));
        ctx.fillStyle = grad;
        ctx.fillRect(0, front - 40, cw * COLS, 44);
        if (!pending) {
          decoded = true;
          nextGlitch = now + 1200;
        }
      } else {
        paintStill();

        /* Idle glitch: a band of rows tears sideways with an RGB split. */
        if (!glitch && now >= nextGlitch) {
          glitch = {
            row: (Math.random() * ROWS) | 0,
            rows: 1 + ((Math.random() * 4) | 0),
            shift: (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 6),
            until: now + GLITCH_MS,
          };
        }
        if (glitch) {
          const y0 = glitch.row * ch;
          const hBand = glitch.rows * ch;
          ctx.clearRect(0, y0, cw * COLS, hBand);
          for (let r = glitch.row; r < Math.min(ROWS, glitch.row + glitch.rows); r++) {
            for (let x = 0; x < COLS; x++) {
              const i = r * COLS + x;
              const cell = cells[i];
              if (cell.ch === " ") continue;
              const a = alphaFor(cell.lvl);
              drawCell(i, cell.ch, GOLD, a * 0.55, glitch.shift * cw - 1.5, 0);
              drawCell(i, cell.ch, COOL, a * 0.55, glitch.shift * cw + 1.5, 0);
            }
          }
          if (now >= glitch.until) {
            glitch = null;
            nextGlitch =
              now + GLITCH_EVERY[0] + Math.random() * (GLITCH_EVERY[1] - GLITCH_EVERY[0]);
          }
        }

        /* Sparse ambient flicker keeps the field alive */
        for (let k = 0; k < 6; k++) {
          const i = (Math.random() * cells.length) | 0;
          const cell = cells[i];
          if (cell.ch === " " || cell.lvl < 0.25) continue;
          drawCell(i, randomGlyph(), GOLD, 0.5 * cell.lvl);
        }
      }

      /* Pointer lens: cells near the cursor are pushed out, scrambled
         and lit gold; the strength falls off with distance. */
      if (pointer && decoded) {
        const px = pointer.x / cw;
        const py = pointer.y / ch;
        const x0 = Math.max(0, Math.floor(px - POINTER_RADIUS));
        const x1 = Math.min(COLS - 1, Math.ceil(px + POINTER_RADIUS));
        const y0 = Math.max(0, Math.floor(py - POINTER_RADIUS / CELL_RATIO));
        const y1 = Math.min(ROWS - 1, Math.ceil(py + POINTER_RADIUS / CELL_RATIO));
        ctx.clearRect(x0 * cw, y0 * ch, (x1 - x0 + 1) * cw, (y1 - y0 + 1) * ch);
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const i = y * COLS + x;
            const cell = cells[i];
            const dx = x + 0.5 - px;
            const dy = (y + 0.5 - py) * CELL_RATIO;
            const dist = Math.hypot(dx, dy) / POINTER_RADIUS;
            if (dist >= 1) {
              if (cell.ch !== " ") drawCell(i, cell.ch, INK, alphaFor(cell.lvl));
              continue;
            }
            const force = 1 - dist;
            const push = force * force * cw * 2.2;
            const nx = dist === 0 ? 0 : dx / (dist * POINTER_RADIUS);
            const ny = dist === 0 ? 0 : dy / (dist * POINTER_RADIUS);
            const glyph =
              cell.ch === " "
                ? Math.random() < force * 0.35 ? randomGlyph() : " "
                : Math.random() < force * 0.85 ? randomGlyph() : cell.ch;
            if (glyph === " ") continue;
            const base = cell.ch === " " ? 0.25 : alphaFor(cell.lvl);
            drawCell(i, glyph, GOLD, Math.min(1, base + force * 0.6), nx * push, ny * push);
          }
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(frame);
    };

    restartRef.current = () => {
      if (reduced) return;
      cells.forEach((cell, i) => {
        cell.reveal = revealAt(i % COLS, (i / COLS) | 0);
      });
      start = performance.now();
      decoded = false;
      kick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) {
          if (!decoded) start = performance.now();
          kick();
        }
      },
      { threshold: 0.15 },
    );

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      pointer = null;
    };

    const ro = new ResizeObserver(resize);
    let cancelled = false;
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      resize();
      ro.observe(wrap);
      io.observe(wrap);
    });

    if (!reduced) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  return (
    <div
      ref={wrapRef}
      className={`ascii-portrait${className ? ` ${className}` : ""}`}
      style={{ aspectRatio: `${COLS} / ${ROWS * CELL_RATIO}` }}
    >
      <canvas
        ref={canvasRef}
        className="ascii-portrait__canvas"
        role="img"
        aria-label={`ASCII portrait of ${SITE.name}`}
        data-cursor-label="RE-RENDER"
        onClick={() => restartRef.current()}
      />
    </div>
  );
}
