// Shared SVG helpers: palette, embedded fonts, text measurement, wrapping, icons.
//
// Fonts are subset to the exact glyphs each SVG uses and embedded as data: URIs, so the
// artwork renders identically wherever GitHub is opened (GitHub blocks external fonts in SVG <img>).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";
import { create as openFont } from "fontkit";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(HERE, "..", "fonts");

export const C = {
  BG: "#0D0F10",
  FG: "#F2F0E9",
  MUTED: "#A6A49B",
  ACCENT: "#B6F09C",
  BORDER: "#343638",
};

const SERIF_STACK = `"Instrument Serif", Georgia, "Times New Roman", serif`;
const SANS_STACK = `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`;
const MONO_STACK = `"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;

// class name -> face. One class per face keeps subsetting exact.
export const FACES = {
  serif: { file: "instrument-serif-latin-400-normal.woff2", family: "AJ Serif", stack: SERIF_STACK, weight: 400, style: "normal" },
  serifi: { file: "instrument-serif-latin-400-italic.woff2", family: "AJ Serif", stack: SERIF_STACK, weight: 400, style: "italic" },
  sans: { file: "geist-sans-latin-400-normal.woff2", family: "AJ Sans", stack: SANS_STACK, weight: 400, style: "normal" },
  sansm: { file: "geist-sans-latin-500-normal.woff2", family: "AJ Sans", stack: SANS_STACK, weight: 500, style: "normal" },
  sansb: { file: "geist-sans-latin-600-normal.woff2", family: "AJ Sans", stack: SANS_STACK, weight: 600, style: "normal" },
  mono: { file: "geist-mono-latin-400-normal.woff2", family: "AJ Mono", stack: MONO_STACK, weight: 400, style: "normal" },
  monom: { file: "geist-mono-latin-500-normal.woff2", family: "AJ Mono", stack: MONO_STACK, weight: 500, style: "normal" },
};

const rawCache = new Map();
const metricCache = new Map();

function rawFont(cls) {
  if (!rawCache.has(cls)) rawCache.set(cls, fs.readFileSync(path.join(FONT_DIR, FACES[cls].file)));
  return rawCache.get(cls);
}

function metricFont(cls) {
  if (!metricCache.has(cls)) metricCache.set(cls, openFont(rawFont(cls)));
  return metricCache.get(cls);
}

// Advance width of a string in px (letter-spacing in px added per character, as SVG does).
export function measure(cls, str, size, ls = 0) {
  const f = metricFont(cls);
  const w = (f.layout(str).advanceWidth * size) / f.unitsPerEm;
  return w + ls * [...str].length;
}

// Greedy word wrap using real font metrics.
export function wrap(cls, text, size, maxWidth, ls = 0) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && measure(cls, test, size, ls) > maxWidth) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const num = (n) => (Number.isInteger(n) ? String(n) : Number(n.toFixed(2)).toString());

export class Svg {
  constructor({ w, h, title, desc = "" }) {
    this.w = w;
    this.h = h;
    this.title = title;
    this.desc = desc;
    this.parts = [];
    this.defs = [];
    this.css = [];
    this.used = {};
  }

  use(cls, str) {
    if (!FACES[cls]) throw new Error(`unknown face class: ${cls}`);
    const set = (this.used[cls] ||= new Set(" "));
    for (const ch of String(str)) set.add(ch);
  }

  // text(cls, "hello", { x, y, size, fill, ls, anchor, op, extra })
  text(cls, str, o = {}) {
    this.use(cls, str);
    return this.textTag("text", cls, str, o);
  }

  // tspan inside a text element
  tspan(cls, str, o = {}) {
    this.use(cls, str);
    return this.textTag("tspan", cls, str, o);
  }

  // One <text> made of styled runs: rich("serif", ["I build ", { cls: "serifi", t: "useful", fill }], opts)
  rich(baseCls, parts, o = {}) {
    let inner = "";
    this.use(baseCls, "");
    for (const p of parts) {
      if (typeof p === "string") {
        this.use(baseCls, p);
        inner += esc(p);
      } else {
        const cls = p.cls || baseCls;
        this.use(cls, p.t);
        const { t, cls: _c, ...rest } = p;
        inner += this.textTag("tspan", cls === baseCls ? "" : cls, t, rest);
      }
    }
    return this.textTag("text", baseCls, inner, { ...o, raw: true });
  }

  textTag(tag, cls, str, o) {
    const a = [];
    const klass = `${cls}${o.extra ? " " + o.extra : ""}`.trim();
    if (klass) a.push(`class="${klass}"`);
    if (o.x != null) a.push(`x="${num(o.x)}"`);
    if (o.y != null) a.push(`y="${num(o.y)}"`);
    if (o.dx != null) a.push(`dx="${num(o.dx)}"`);
    if (o.size != null) a.push(`font-size="${num(o.size)}"`);
    if (o.fill) a.push(`fill="${o.fill}"`);
    if (o.ls) a.push(`letter-spacing="${num(o.ls)}"`);
    if (o.anchor) a.push(`text-anchor="${o.anchor}"`);
    if (o.op != null) a.push(`opacity="${num(o.op)}"`);
    if (o.attrs) a.push(o.attrs);
    return `<${tag} ${a.join(" ")}>${o.raw ? str : esc(str)}</${tag}>`;
  }

  add(...s) {
    this.parts.push(...s);
    return this;
  }

  async render() {
    let fontCss = "";
    let classCss = "";
    for (const [cls, set] of Object.entries(this.used)) {
      const face = FACES[cls];
      const glyphs = [...set].join("");
      const data = await subsetFont(rawFont(cls), glyphs, { targetFormat: "woff2" });
      fontCss += `@font-face{font-family:"${face.family}";font-style:${face.style};font-weight:${face.weight};src:url(data:font/woff2;base64,${data.toString("base64")}) format("woff2")}`;
      classCss += `.${cls}{font-family:"${face.family}",${face.stack};font-weight:${face.weight};font-style:${face.style}}`;
    }
    const style = `${fontCss}${classCss}${this.css.join("")}`;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}" role="img" aria-labelledby="t d">` +
      `<title id="t">${esc(this.title)}</title><desc id="d">${esc(this.desc)}</desc>` +
      (this.defs.length ? `<defs>${this.defs.join("")}</defs>` : "") +
      `<style>${style}</style>` +
      this.parts.join("\n") +
      `</svg>\n`
    );
  }
}

/* ---------- icons: 16x16 grid, drawn at (x, y) with size s ---------- */

const stroke = (inner, color, x, y, s) =>
  `<g transform="translate(${num(x)} ${num(y)}) scale(${num(s / 16)})" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;

export const ICON = {
  arrowUR: (x, y, s, color) => stroke(`<path d="M4.5 11.5l7-7M5.5 4.5h6v6"/>`, color, x, y, s),
  mail: (x, y, s, color) => stroke(`<rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5"/><path d="M2.5 4.75L8 9l5.5-4.25"/>`, color, x, y, s),
  globe: (x, y, s, color) =>
    stroke(`<circle cx="8" cy="8" r="6.25"/><path d="M1.75 8h12.5M8 1.75c1.9 1.8 2.8 3.9 2.8 6.25S9.9 12.45 8 14.25M8 1.75C6.1 3.55 5.2 5.65 5.2 8s.9 4.45 2.8 6.25"/>`, color, x, y, s),
  play: (x, y, s, color) =>
    `<g transform="translate(${num(x)} ${num(y)}) scale(${num(s / 16)})"><path d="M4.5 2.75v10.5L13 8z" fill="${color}"/></g>`,
  github: (x, y, s, color) =>
    `<g transform="translate(${num(x)} ${num(y)}) scale(${num(s / 16)})" fill="${color}"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></g>`,
  // LinkedIn "in" mark on a 24 grid
  linkedin: (x, y, s, color) =>
    `<g transform="translate(${num(x)} ${num(y)}) scale(${num(s / 24)})" fill="${color}"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></g>`,
};

/* ---------- shared animation CSS, always gated behind reduced-motion ---------- */

export const MOTION = {
  // Fade + 12px rise on load. "backwards" fill means the element is visible by default and only
  // hidden while its delay runs, so renderers that never play animations still show everything.
  rise: `@media (prefers-reduced-motion:no-preference){.rise{animation:rise .9s cubic-bezier(.16,1,.3,1) backwards}@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}}`,
  // Slow blink for status dots.
  blink: `@media (prefers-reduced-motion:no-preference){.blink{animation:blink 2.4s ease-in-out infinite}@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}}`,
};

export const delay = (s) => `style="animation-delay:${s}s"`;
