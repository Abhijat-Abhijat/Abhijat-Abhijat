// Content cards: about + numbers, projects, toolkit, experience, recognition.
import { Svg, C, ICON, MOTION, measure, wrap } from "./svg.mjs";
import { frame } from "./cards-basic.mjs";

const W = 800;

// Guard against text silently overflowing a card: fail the build instead.
function fit(lines, max, what) {
  if (lines.length > max) throw new Error(`${what} wraps to ${lines.length} lines (max ${max}): "${lines.join(" / ")}"`);
  return lines;
}

const upper = (s) => s.toUpperCase();

/* ------------------------------------------------------------------ about */

export async function about({ paragraphs, stats, note }) {
  const s = new Svg({
    w: W,
    h: 100,
    title: "About Abhijat",
    desc: `${paragraphs.join(" ")} ${stats.map((x) => `${x.value}${x.suffix} ${x.label}`).join("; ")}. ${note}`,
  });
  const padX = 40;
  const colW = W - padX * 2;
  let y = 60;

  const p1 = fit(wrap("sans", paragraphs[0], 16, colW), 4, "about p1");
  p1.forEach((ln, i) => s.add(s.text("sans", ln, { x: padX, y: y + i * 25, size: 16, fill: C.FG })));
  y += (p1.length - 1) * 25 + 38;

  const p2 = fit(wrap("sans", paragraphs[1], 14.5, colW), 3, "about p2");
  p2.forEach((ln, i) => s.add(s.text("sans", ln, { x: padX, y: y + i * 22, size: 14.5, fill: C.MUTED })));
  y += (p2.length - 1) * 22 + 30;

  s.add(`<path d="M${padX} ${y + 0.5}H${W - padX}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
  y += 18;

  const cols = stats.length;
  const cw = colW / cols;
  stats.forEach((st, i) => {
    const x = padX + i * cw + (i ? 16 : 0);
    if (i) s.add(`<path d="M${padX + i * cw + 0.5} ${y}V${y + 112}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
    s.add(
      s.rich("serif", [st.value, { t: st.suffix, fill: C.ACCENT }], {
        x,
        y: y + 50,
        size: 46,
        fill: C.FG,
        attrs: `letter-spacing="-0.9"`,
      }),
    );
    const lbl = fit(wrap("sans", st.label, 12, cw - 28), 3, `stat label "${st.label}"`);
    lbl.forEach((ln, j) => s.add(s.text("sans", ln, { x, y: y + 74 + j * 16, size: 12, fill: C.MUTED })));
  });
  y += 112 + 34;

  s.add(s.text("mono", upper(note), { x: padX, y: y + 6, size: 10, fill: C.MUTED, ls: 1.3 }));
  y += 36;

  s.h = y;
  s.parts.unshift(frame(W, y));
  return s.render();
}

/* --------------------------------------------------------------- projects */

function tagRow(s, tags, x0, y, maxW) {
  let x = x0;
  const out = [];
  for (const t of tags) {
    const label = upper(t);
    const w = Math.ceil(measure("mono", label, 10, 0.8) + 22);
    if (x + w - x0 > maxW) throw new Error(`tag row overflows: ${tags.join(", ")}`);
    out.push(
      `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="21" rx="10.5" fill="none" stroke="${C.BORDER}"/>` +
        s.text("mono", label, { x: x + 11, y: y + 15, size: 10, fill: C.MUTED, ls: 0.8 }),
    );
    x += w + 6;
  }
  return out.join("");
}

// 400-wide half card. Each card gives up 6px of a 12px gutter on its inner side (side "l" is the left card,
// "r" the right), so a pair placed edge to edge, with no whitespace between the two <img> tags, lines up
// flush with the full-width cards above and below.
export async function project({ label, name, desc, tags, metric, side = "l" }) {
  const w = 400;
  const cw = 394;
  const h = 232;
  const s = new Svg({ w, h, title: name, desc: `${label}. ${desc} ${tags.join(", ")}${metric ? `. ${metric.value}${metric.suffix || ""} ${metric.caption}` : ""}` });
  s.add(`<g transform="translate(${side === "l" ? 0 : w - cw} 0)">`);
  s.add(frame(cw, 224));
  s.add(s.text("mono", upper(label), { x: 28, y: 38, size: 10.5, fill: C.MUTED, ls: 1.4 }));
  s.add(ICON.arrowUR(cw - 28 - 16, 24, 16, C.MUTED));
  s.add(s.text("serif", name, { x: 28, y: 86, size: 38, fill: C.FG, attrs: `letter-spacing="-0.76"` }));
  if (metric) {
    const right = cw - 28;
    const numW = measure("serif", `${metric.value}${metric.suffix || ""}`, 38, -0.76);
    s.add(
      s.rich("serif", [metric.value, { t: metric.suffix || "", fill: C.ACCENT }], {
        x: right,
        y: 86,
        size: 38,
        fill: C.FG,
        anchor: "end",
        attrs: `letter-spacing="-0.76"`,
      }),
    );
    // Caption sits left of the number in up to two short lines, bottom-aligned with the numeral.
    const cap = fit(wrap("mono", upper(metric.caption), 9, 110, 1.1), 2, `${name} metric caption`);
    const capX = right - numW - 12;
    if (measure("serif", name, 38, -0.76) + 28 + 16 > capX - measure("mono", cap[0], 9, 1.1)) {
      throw new Error(`${name}: title and metric caption collide`);
    }
    cap.forEach((ln, i) => s.add(s.text("mono", ln, { x: capX, y: 86 - (cap.length - 1 - i) * 13, size: 9, fill: C.MUTED, anchor: "end", ls: 1.1 })));
  }
  const lines = fit(wrap("sans", desc, 13.5, 336), 3, `${name} desc`);
  lines.forEach((ln, i) => s.add(s.text("sans", ln, { x: 28, y: 116 + i * 20, size: 13.5, fill: C.MUTED })));
  s.add(tagRow(s, tags, 28, 178, 336));
  s.add(`</g>`);
  return s.render();
}

export async function projectFeatured({ label, name, desc, tags, log }) {
  const h = 244;
  const s = new Svg({ w: W, h, title: name, desc: `${label}. ${desc} ${tags.join(", ")}` });
  s.css.push(
    `@media (prefers-reduced-motion:no-preference){.caret{animation:caret 1.1s steps(1) infinite}@keyframes caret{50%{opacity:0}}}`,
  );
  s.add(frame(W, 236));
  s.add(s.text("mono", upper(label), { x: 40, y: 44, size: 10.5, fill: C.MUTED, ls: 1.4 }));
  s.add(s.text("serif", name, { x: 40, y: 108, size: 62, fill: C.FG, attrs: `letter-spacing="-1.24"` }));
  const lines = fit(wrap("sans", desc, 14.5, 400), 4, `${name} desc`);
  lines.forEach((ln, i) => s.add(s.text("sans", ln, { x: 40, y: 142 + i * 22, size: 14.5, fill: C.MUTED })));
  s.add(tagRow(s, tags, 40, 190, 420));

  // faux OS window with a boot log
  const px = 500;
  const py = 62;
  const pw = 260;
  const ph = 156;
  s.add(`<rect x="${px + 0.5}" y="${py + 0.5}" width="${pw - 1}" height="${ph - 1}" rx="8" fill="${C.BG}" stroke="${C.BORDER}"/>`);
  s.add(`<path d="M${px} ${py + 32.5}H${px + pw}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
  [0, 1, 2].forEach((i) => s.add(`<circle cx="${px + 18 + i * 14}" cy="${py + 16}" r="4" fill="${C.BORDER}"/>`));
  s.add(s.text("mono", "boot.log", { x: px + pw - 16, y: py + 20, size: 10, fill: C.MUTED, anchor: "end", ls: 0.6 }));
  log.forEach((ln, i) => {
    const y = py + 58 + i * 22;
    s.add(
      s.rich("mono", [{ t: "[ ", fill: C.MUTED }, { cls: "monom", t: "ok", fill: C.ACCENT }, { t: " ]", fill: C.MUTED }, { t: `  ${ln}`, fill: C.FG }], {
        x: px + 18,
        y,
        size: 11.5,
      }),
    );
  });
  const lastY = py + 58 + log.length * 22;
  s.add(s.text("mono", ">", { x: px + 18, y: lastY, size: 11.5, fill: C.ACCENT }));
  s.add(`<rect class="caret" x="${px + 32}" y="${lastY - 10}" width="7" height="13" fill="${C.ACCENT}"/>`);

  s.add(ICON.arrowUR(W - 40 - 16, 26, 16, C.MUTED));
  return s.render();
}

/* ---------------------------------------------------------------- toolkit */

export async function toolkit({ rows }) {
  const rowH = 48;
  const top = 12;
  const h = top * 2 + rows.length * rowH;
  const s = new Svg({
    w: W,
    h,
    title: "Toolkit",
    desc: rows.map((r) => `${r.label}: ${r.items.join(", ")}`).join(". "),
  });
  s.add(frame(W, h));
  const labelX = 40;
  const itemX = 228;
  rows.forEach((r, i) => {
    const yTop = top + i * rowH;
    const base = yTop + rowH / 2 + 5;
    if (i) s.add(`<path d="M${labelX} ${yTop + 0.5}H${W - labelX}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
    s.add(s.text("mono", upper(r.label), { x: labelX, y: base - 1, size: 10.5, fill: C.MUTED, ls: 1.4 }));
    let x = itemX;
    r.items.forEach((it, j) => {
      if (j) {
        x += 10;
        s.add(s.text("sans", "/", { x, y: base, size: 15, fill: C.BORDER }));
        x += measure("sans", "/", 15) + 10;
      }
      s.add(s.text("sans", it, { x, y: base, size: 15, fill: C.FG }));
      x += measure("sans", it, 15);
    });
    if (x > W - labelX) throw new Error(`toolkit row "${r.label}" overflows (${Math.round(x)}px)`);
  });
  return s.render();
}

/* ------------------------------------------------------------- experience */

export async function experience({ entries, note }) {
  const s = new Svg({
    w: W,
    h: 100,
    title: "Experience",
    desc: entries.map((e) => `${e.dates}: ${e.role}, ${e.company}. ${e.summary || ""}`).join(" ") + ` ${note}`,
  });
  const datesX = 40;
  const roleX = 190;
  const sumX = 490;
  let y = 0;
  entries.forEach((e, i) => {
    const top = y + 30;
    if (i) s.add(`<path d="M40 ${y + 0.5}H${W - 40}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
    s.add(s.text("mono", upper(e.dates), { x: datesX, y: top + 15, size: 10.5, fill: e.current ? C.ACCENT : C.MUTED, ls: 1.2 }));
    s.add(s.text("serif", e.role, { x: roleX, y: top + 20, size: 26, fill: C.FG, attrs: `letter-spacing="-0.4"` }));
    const comp = fit(wrap("sans", e.company, 13, sumX - roleX - 24), 2, `company "${e.company}"`);
    comp.forEach((ln, j) => s.add(s.text("sans", ln, { x: roleX, y: top + 44 + j * 18, size: 13, fill: C.MUTED })));
    const sum = e.summary ? fit(wrap("sans", e.summary, 13, W - 40 - sumX), 6, `summary for ${e.role}`) : [];
    sum.forEach((ln, j) => s.add(s.text("sans", ln, { x: sumX, y: top + 15 + j * 19, size: 13, fill: C.FG, op: 0.82 })));
    const blockH = Math.max(44 + comp.length * 18, 15 + sum.length * 19);
    y = top + blockH + 28;
  });
  s.add(s.text("mono", upper(note), { x: 40, y: y + 8, size: 10, fill: C.MUTED, ls: 1.3 }));
  y += 40;
  s.h = y;
  s.parts.unshift(frame(W, y));
  return s.render();
}

/* ------------------------------------------------------------ recognition */

export async function recognition({ left, right }) {
  const s = new Svg({
    w: W,
    h: 100,
    title: "Recognition and writing",
    desc: `${left.heading}: ${left.items.map((i) => `${i.t}, ${i.sub}`).join("; ")}. ${right.heading}: ${right.items.map((i) => `${i.t}, ${i.sub}`).join("; ")}.`,
  });
  const x1 = 40;
  const x2 = 432;
  const colW1 = 330;
  const colW2 = W - 40 - x2;

  const column = (x, colW, col) => {
    let y = 46;
    s.add(`<rect x="${x}" y="${y - 9}" width="8" height="8" fill="${C.ACCENT}"/>`);
    s.add(s.text("monom", upper(col.heading), { x: x + 18, y: y, size: 10.5, fill: C.FG, ls: 1.6 }));
    y += 34;
    col.items.forEach((it) => {
      const t = fit(wrap("sansm", it.t, 14.5, colW), 2, `item "${it.t}"`);
      t.forEach((ln, j) => s.add(s.text("sansm", ln, { x, y: y + j * 20, size: 14.5, fill: C.FG })));
      y += (t.length - 1) * 20 + 19;
      const sub = fit(wrap("sans", it.sub, 12.5, colW), 3, `sub "${it.sub}"`);
      sub.forEach((ln, j) => s.add(s.text("sans", ln, { x, y: y + j * 17, size: 12.5, fill: C.MUTED })));
      y += (sub.length - 1) * 17 + 28;
    });
    return y;
  };
  const yl = column(x1, colW1, left);
  const yr = column(x2, colW2, right);
  const h = Math.max(yl, yr) + 6;
  s.add(`<path d="M${x2 - 32 + 0.5} 30V${h - 30}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
  s.h = h;
  s.parts.unshift(frame(W, h));
  return s.render();
}
