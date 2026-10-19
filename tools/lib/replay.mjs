// The README snake: a recording of the real game engine's autopilot, baked into SMIL animation.
// GitHub renders SVG as an image (no script), but SMIL runs, so the replay moves on the profile page.
import { createRequire } from "node:module";
import { Svg, C, ICON, MOTION, measure, num } from "./svg.mjs";
import { frame } from "./cards-basic.mjs";

const require = createRequire(import.meta.url);
const core = require("../../game/core.js");

export const BOARD = { cols: 18, rows: 13 };

// Pick a seed whose run is short enough to feel lively and never stalls for long.
export function pickSeed({ cols, rows } = BOARD) {
  let best = null;
  for (let seed = 1; seed < 400; seed++) {
    const r = core.record({ seed, cols, rows, maxTicks: 400 });
    if (!r.complete) continue;
    const ticks = r.frames.length - 1;
    // Count moves that did not bring the head closer to the current food (stalling / detours).
    let detours = 0;
    for (let f = 1; f < r.frames.length; f++) {
      const prev = r.frames[f - 1];
      if (!prev.food) continue;
      const h0 = prev.snake[0];
      const h1 = r.frames[f].snake[0];
      const d0 = Math.abs(h0.x - prev.food.x) + Math.abs(h0.y - prev.food.y);
      const d1 = Math.abs(h1.x - prev.food.x) + Math.abs(h1.y - prev.food.y);
      if (d1 >= d0 && r.frames[f].ate == null) detours++;
    }
    const score = Math.abs(ticks - 118) + detours * 3;
    if (!best || score < best.score) best = { seed, score, ticks, detours };
  }
  return best;
}

const pad2 = (n) => String(n).padStart(2, "0");

export async function replay({ seed, hold = 30, tickMs = 110, stackLabel = "of 12 stack items collected", hint, cta }) {
  const W = 800;
  const H = 380;
  const CELL = 24;
  const { cols, rows } = BOARD;
  const bx = 328;
  const by = 34;
  const bw = cols * CELL;
  const bh = rows * CELL;

  const rec = core.record({ seed, cols, rows, maxTicks: 400 });
  if (!rec.complete) throw new Error(`seed ${seed} did not complete the stack`);
  const frames = rec.frames;
  const tokens = rec.tokens;
  const F = frames.length;
  const N = F + hold;
  const dur = +((N * tickMs) / 1000).toFixed(3);
  const at = (f) => +(f / N).toFixed(4);
  const px = (c) => bx + c.x * CELL;
  const py = (c) => by + c.y * CELL;

  const s = new Svg({
    w: W,
    h: H,
    title: "Snake autopilot replay",
    desc: `A snake plays itself on an ${cols} by ${rows} board and eats ${tokens.length} stack items (${tokens.map((t) => t.name).join(", ")}). Open the full page to play it yourself with the arrow keys.`,
  });
  s.css.push(
    MOTION.blink,
    // Reduced motion: hide the animated layer and show one still frame instead.
    `.still{display:none}@media (prefers-reduced-motion:reduce){.anim{display:none}.still{display:inline}}`,
  );
  s.defs.push(
    `<pattern id="cells" x="${bx}" y="${by}" width="${CELL}" height="${CELL}" patternUnits="userSpaceOnUse"><circle cx="${CELL / 2}" cy="${CELL / 2}" r="1" fill="${C.FG}" fill-opacity=".16"/></pattern>`,
  );

  s.add(frame(W, H));

  /* ---- board ---- */
  s.add(`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#cells)"/>`);
  s.add(`<rect x="${bx - 0.5}" y="${by - 0.5}" width="${bw + 1}" height="${bh + 1}" rx="4" fill="none" stroke="${C.BORDER}"/>`);

  /* ---- left column: label, counter, ledger, button ---- */
  const lx = 40;
  s.add(`<circle class="blink" cx="${lx + 4}" cy="45" r="3.5" fill="${C.ACCENT}"/>`);
  s.add(s.text("mono", "AUTOPILOT REPLAY", { x: lx + 18, y: 49, size: 10.5, fill: C.MUTED, ls: 1.5 }));

  const numSize = 78;
  const numBase = 132;
  const slashX = lx + Math.ceil(measure("serif", "00", numSize, -1.5)) + 12;
  s.add(s.rich("serif", [{ t: "/ " + tokens.length, fill: C.MUTED }], { x: slashX, y: numBase, size: 34, fill: C.MUTED }));
  s.add(s.text("sans", stackLabel, { x: lx, y: numBase + 26, size: 13, fill: C.MUTED }));

  const ledgerTop = 190;
  const ledgerGap = 20;
  const perCol = Math.ceil(tokens.length / 2);
  const colX = [lx, lx + 132];

  // Frame where each token is eaten
  const eatFrame = new Array(tokens.length).fill(null);
  frames.forEach((fr, f) => {
    if (fr.ate != null) eatFrame[fr.ate] = f;
  });
  const eatOrder = frames.map((fr, f) => (fr.ate != null ? f : null)).filter((f) => f != null);

  const animEat = (attr, from, to, f) =>
    `<animate attributeName="${attr}" calcMode="discrete" dur="${dur}s" repeatCount="indefinite" values="${from};${to};${to}" keyTimes="0;${at(f)};1"/>`;

  const ledger = (litUpTo) =>
    tokens
      .map((t, i) => {
        const x = colX[Math.floor(i / perCol)];
        const y = ledgerTop + (i % perCol) * ledgerGap;
        const lit = litUpTo != null && eatFrame[i] != null && eatFrame[i] <= litUpTo;
        const animated = litUpTo == null;
        const marker =
          `<rect x="${x + 0.5}" y="${y - 8.5}" width="8" height="8" rx="2" fill="${lit ? C.ACCENT : C.BG}" stroke="${lit ? C.ACCENT : C.BORDER}">` +
          (animated ? animEat("fill", C.BG, C.ACCENT, eatFrame[i]) + animEat("stroke", C.BORDER, C.ACCENT, eatFrame[i]) : "") +
          `</rect>`;
        s.use("sans", t.name);
        const label =
          `<text class="sans" x="${x + 18}" y="${y}" font-size="13" fill="${lit ? C.FG : C.MUTED}">${t.name}` +
          (animated ? animEat("fill", C.MUTED, C.FG, eatFrame[i]) : "") +
          `</text>`;
        return marker + label;
      })
      .join("");

  // CTA button (the whole card is the link; this just reads as one)
  const by2 = 306;
  const ctaW = 224;
  const cta1 =
    `<rect x="${lx + 0.5}" y="${by2 + 0.5}" width="${ctaW - 1}" height="39" rx="6" fill="${C.BG}" stroke="${C.ACCENT}" stroke-opacity=".7"/>` +
    ICON.play(lx + 16, by2 + 12, 16, C.ACCENT) +
    s.text("sansm", cta, { x: lx + 41, y: by2 + 24.7, size: 13.5, fill: C.ACCENT }) +
    ICON.arrowUR(lx + ctaW - 30, by2 + 13, 14, C.ACCENT);
  s.add(cta1);

  s.add(s.text("mono", hint.toUpperCase(), { x: bx, y: H - 14, size: 10, fill: C.MUTED, ls: 1.2 }));

  /* ---- animated layer ---- */
  const cellBox = (extra = "") => `<rect x="2" y="2" width="20" height="20" rx="4"${extra}/>`;

  const anim = [];
  anim.push(`<g class="anim">`);

  // counter numerals: one <text> per count, shown between the right two eat frames
  for (let k = 0; k <= tokens.length; k++) {
    const start = k === 0 ? 0 : eatOrder[k - 1];
    const end = k === tokens.length ? null : eatOrder[k];
    const initial = k === 0 ? 1 : 0;
    let values;
    let keyTimes;
    if (k === 0) {
      values = "1;0;0";
      keyTimes = `0;${at(end)};1`;
    } else if (end == null) {
      values = "0;1;1";
      keyTimes = `0;${at(start)};1`;
    } else {
      values = "0;1;0;0";
      keyTimes = `0;${at(start)};${at(end)};1`;
    }
    s.use("serif", pad2(k));
    anim.push(
      `<text class="serif" x="${lx - 2}" y="${numBase}" font-size="${numSize}" letter-spacing="-1.5" fill="${C.FG}" opacity="${initial}">${pad2(k)}` +
        `<animate attributeName="opacity" calcMode="discrete" dur="${dur}s" repeatCount="indefinite" values="${values}" keyTimes="${keyTimes}"/></text>`,
    );
  }

  anim.push(ledger(null));

  // food items: visible from spawn until eaten
  const spans = [];
  let cur = null;
  frames.forEach((fr, f) => {
    const key = fr.food ? `${fr.food.x},${fr.food.y},${fr.food.index}` : null;
    if (!cur || cur.key !== key) {
      if (cur) {
        cur.end = f;
        spans.push(cur);
      }
      cur = fr.food ? { key, ...fr.food, start: f, end: null } : null;
    }
  });
  // The food spawned in the final frame (after the last item was eaten) is never shown: `cur` is dropped.
  for (const sp of spans) {
    const code = tokens[sp.index].code;
    s.use("monom", code);
    const values = sp.start === 0 ? "1;0;0" : "0;1;0;0";
    const keyTimes = sp.start === 0 ? `0;${at(sp.end)};1` : `0;${at(sp.start)};${at(sp.end)};1`;
    anim.push(
      `<g transform="translate(${px(sp)} ${py(sp)})" opacity="${sp.start === 0 ? 1 : 0}">` +
        cellBox(` fill="${C.ACCENT}" fill-opacity=".12" stroke="${C.ACCENT}"`) +
        `<text class="monom" x="12" y="15.4" font-size="9.5" text-anchor="middle" fill="${C.ACCENT}">${code}</text>` +
        `<animate attributeName="opacity" calcMode="discrete" dur="${dur}s" repeatCount="indefinite" values="${values}" keyTimes="${keyTimes}"/></g>`,
    );
  }

  // snake body: one rect per segment, each replays its own path
  const maxLen = Math.max(...frames.map((fr) => fr.snake.length));
  for (let i = maxLen - 1; i >= 0; i--) {
    const vals = [];
    for (let f = 0; f < N; f++) {
      const fr = frames[Math.min(f, F - 1)];
      const c = fr.snake[i];
      vals.push(c ? `${px(c)} ${py(c)}` : "-100 -100");
    }
    const first = frames[0].snake[i];
    const fill = i === 0 ? C.ACCENT : C.FG;
    const op = i === 0 ? 1 : Math.max(0.3, 0.94 - i * 0.045);
    anim.push(
      `<g transform="translate(${first ? px(first) : -100} ${first ? py(first) : -100})">` +
        cellBox(` fill="${fill}" fill-opacity="${num(op)}"`) +
        `<animateTransform attributeName="transform" type="translate" calcMode="discrete" dur="${dur}s" repeatCount="indefinite" values="${vals.join(";")}"/></g>`,
    );
  }

  // "+ Name" popups when something is eaten
  frames.forEach((fr, f) => {
    if (fr.ate == null) return;
    const head = fr.snake[0];
    const label = `+ ${tokens[fr.ate].name}`;
    s.use("monom", label);
    const w = measure("monom", label, 10.5);
    let x = px(head) + CELL / 2;
    x = Math.min(Math.max(x, bx + w / 2 + 6), bx + bw - w / 2 - 6);
    let y = py(head) - 7;
    if (y < by + 12) y = py(head) + CELL + 15;
    const end = Math.min(f + 12, N - 1);
    anim.push(
      `<text class="monom" x="${num(x)}" y="${y}" font-size="10.5" text-anchor="middle" fill="${C.ACCENT}" stroke="${C.BG}" stroke-width="3" paint-order="stroke" opacity="0">${label}` +
        `<animate attributeName="opacity" calcMode="discrete" dur="${dur}s" repeatCount="indefinite" values="0;1;0;0" keyTimes="0;${at(f)};${at(end)};1"/></text>`,
    );
  });
  anim.push(`</g>`);
  s.add(...anim);

  /* ---- still frame for reduced motion: mid-run, 8 items eaten ---- */
  const stillIdx = frames.findIndex((fr) => fr.eaten === 8);
  const sf = frames[stillIdx];
  const still = [`<g class="still">`];
  s.use("serif", "08");
  still.push(`<text class="serif" x="${lx - 2}" y="${numBase}" font-size="${numSize}" letter-spacing="-1.5" fill="${C.FG}">08</text>`);
  still.push(ledger(stillIdx));
  if (sf.food) {
    const code = tokens[sf.food.index].code;
    s.use("monom", code);
    still.push(
      `<g transform="translate(${px(sf.food)} ${py(sf.food)})">` +
        cellBox(` fill="${C.ACCENT}" fill-opacity=".12" stroke="${C.ACCENT}"`) +
        `<text class="monom" x="12" y="15.4" font-size="9.5" text-anchor="middle" fill="${C.ACCENT}">${code}</text></g>`,
    );
  }
  for (let i = sf.snake.length - 1; i >= 0; i--) {
    const c = sf.snake[i];
    const op = i === 0 ? 1 : Math.max(0.3, 0.94 - i * 0.045);
    still.push(`<g transform="translate(${px(c)} ${py(c)})">${cellBox(` fill="${i === 0 ? C.ACCENT : C.FG}" fill-opacity="${num(op)}"`)}</g>`);
  }
  still.push(`</g>`);
  s.add(...still);

  return { svg: await s.render(), info: { seed, ticks: F - 1, loopSeconds: dur } };
}
