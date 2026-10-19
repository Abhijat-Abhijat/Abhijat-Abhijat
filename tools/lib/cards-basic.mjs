// Hero, buttons, section titles, footer.
import { Svg, C, MOTION, ICON, measure, wrap, delay } from "./svg.mjs";

export const CARD_R = 12;

export const frame = (w, h, r = CARD_R) =>
  `<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${C.BG}" stroke="${C.BORDER}"/>`;

/* ------------------------------------------------------------------ hero */

export async function hero({ name, headline, intro, tagline, domain, avatar }) {
  const W = 800;
  const H = 400;
  const s = new Svg({
    w: W,
    h: H,
    title: `${name}: AI engineer and full-stack software engineer`,
    desc: `${headline.map((l) => l.map((r) => (typeof r === "string" ? r : r.t)).join("")).join(" ")} ${intro}`,
  });
  s.css.push(MOTION.rise, MOTION.blink);
  s.defs.push(
    `<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${C.BORDER}"/></pattern>`,
    `<clipPath id="clip"><rect width="${W}" height="${H}" rx="${CARD_R}"/></clipPath>`,
  );

  s.add(frame(W, H));
  // Right-hand plate: a quiet dot grid behind the portrait.
  const panelX = 468;
  s.add(
    `<g clip-path="url(#clip)"><rect x="${panelX}" y="0" width="${W - panelX}" height="${H}" fill="url(#dots)"/>` +
      `<path d="M${panelX + 0.5} 0V${H}" stroke="${C.BORDER}"/></g>`,
  );

  // Top row
  s.add(
    `<g class="rise" ${delay(0.05)}>` +
      `<rect x="44" y="36" width="8" height="8" fill="${C.ACCENT}"/>` +
      s.text("monom", name.toUpperCase(), { x: 62, y: 45, size: 11, fill: C.FG, ls: 1.8 }) +
      `</g>`,
  );

  // Headline: sized so the widest line fills the text column.
  const colW = panelX - 44 - 36;
  const lines = headline; // [[runs]], each run is string | { t }
  const widthAt1 = (runs) =>
    runs.reduce((acc, r) => acc + (typeof r === "string" ? measure("serif", r, 1) : measure("serifi", r.t, 1)), 0);
  const size = Math.min(74, Math.floor(colW / Math.max(...lines.map(widthAt1))));
  const lead = Math.round(size * 0.95);
  const first = 45 + 24 + Math.round(size * 0.7);
  lines.forEach((runs, i) => {
    const parts = runs.map((r) => (typeof r === "string" ? r : { cls: "serifi", t: r.t, fill: C.ACCENT }));
    s.add(
      `<g class="rise" ${delay(0.12 + i * 0.1)}>` +
        s.rich("serif", parts, { x: 44, y: first + i * lead, size, fill: C.FG, attrs: `letter-spacing="${(-size * 0.02).toFixed(2)}"` }) +
        `</g>`,
    );
  });

  // Intro
  const introY = first + (lines.length - 1) * lead + 40;
  const introLines = wrap("sans", intro, 14.5, colW);
  if (introLines.length > 2) throw new Error(`hero intro wraps to ${introLines.length} lines; shorten it so it stays at 2`);
  s.add(
    `<g class="rise" ${delay(0.5)}>` +
      introLines.map((ln, i) => s.text("sans", ln, { x: 44, y: introY + i * 22, size: 14.5, fill: C.MUTED })).join("") +
      `</g>`,
  );

  // Bottom row
  s.add(
    `<g class="rise" ${delay(0.65)}>` +
      `<circle class="blink" cx="48" cy="${H - 29}" r="3.5" fill="${C.ACCENT}"/>` +
      s.text("mono", tagline.toUpperCase(), { x: 62, y: H - 25, size: 10.5, fill: C.MUTED, ls: 1.5 }) +
      s.text("mono", domain, { x: W - 44, y: H - 25, size: 10.5, fill: C.MUTED, anchor: "end", ls: 0.4 }) +
      `</g>`,
  );

  // Portrait plate: offset accent block, hairline frame, image (or a monogram until one is supplied)
  const fx = 526;
  const fy = 58;
  const fw = 216;
  const fh = 272;
  s.add(`<g class="rise" ${delay(0.3)}>`);
  s.add(`<rect x="${fx + 12}" y="${fy + 12}" width="${fw}" height="${fh}" rx="3" fill="${C.ACCENT}"/>`);
  s.add(`<rect x="${fx + 0.5}" y="${fy + 0.5}" width="${fw - 1}" height="${fh - 1}" rx="3" fill="${C.BG}" stroke="${C.FG}" stroke-opacity=".9"/>`);
  if (avatar) {
    s.defs.push(`<clipPath id="av"><rect x="${fx + 1}" y="${fy + 1}" width="${fw - 2}" height="${fh - 2}" rx="2"/></clipPath>`);
    s.add(`<image href="${avatar}" x="${fx + 1}" y="${fy + 1}" width="${fw - 2}" height="${fh - 2}" preserveAspectRatio="xMidYMax slice" clip-path="url(#av)"/>`);
  } else {
    const mark = s.rich("serifi", ["A", { cls: "serif", t: ".", fill: C.ACCENT }], {
      x: fx + fw / 2,
      y: fy + fh / 2 + 62,
      size: 200,
      fill: C.FG,
      anchor: "middle",
    });
    s.add(mark);
  }
  s.add(`</g>`);
  return s.render();
}

/* --------------------------------------------------------------- buttons */

const ICON_PAD = 16;

export async function button({ label, icon, variant = "ghost", trailing = false }) {
  const H = 40;
  const m = 4; // transparent margin so inline images breathe
  const size = 13.5;
  const textW = measure("sansm", label, size);
  const iconW = icon ? 16 + 9 : 0;
  const trail = trailing ? 9 + 14 : 0;
  const bw = Math.ceil(ICON_PAD + iconW + textW + trail + ICON_PAD);
  const W = bw + m * 2;
  const s = new Svg({ w: W, h: H + m * 2, title: label });
  const fg = variant === "primary" ? C.BG : variant === "accent" ? C.ACCENT : C.FG;
  const ic = variant === "primary" ? C.BG : variant === "accent" ? C.ACCENT : C.MUTED;
  const fill = variant === "primary" ? C.FG : C.BG;
  const stroke = variant === "primary" ? C.FG : variant === "accent" ? C.ACCENT : C.BORDER;
  s.add(`<rect x="${m + 0.5}" y="${m + 0.5}" width="${bw - 1}" height="${H - 1}" rx="6" fill="${fill}" stroke="${stroke}"${variant === "accent" ? ' stroke-opacity=".7"' : ""}/>`);
  let x = m + ICON_PAD;
  const cy = m + H / 2;
  if (icon) {
    s.add(ICON[icon](x, cy - 8, 16, ic));
    x += 25;
  }
  s.add(s.text("sansm", label, { x, y: cy + 4.7, size, fill: fg }));
  if (trailing) s.add(ICON.arrowUR(x + textW + 9, cy - 7, 14, ic));
  return s.render();
}

/* ---------------------------------------------------------- section title */

export async function title({ n, label, runs, meta }) {
  const W = 800;
  const PAD = 30; // breathing room above the label: GitHub only puts 16px between stacked images
  const IN = 28; // inner side margin, so text never touches the band's edge
  const H = 92 + PAD;
  const s = new Svg({ w: W, h: H, title: `${n} ${label}: ${runs.map((r) => (typeof r === "string" ? r : r.t)).join("")}` });
  s.css.push(
    MOTION.rise,
    `@media (prefers-reduced-motion:no-preference){.slide{animation:slide 11s cubic-bezier(.45,0,.55,1) infinite alternate}@keyframes slide{from{transform:translateX(0)}to{transform:translateX(${W - IN * 2 - 8}px)}}}`,
  );
  // A flat dark band: it all but disappears on GitHub's dark theme and keeps the cream type legible on the light one.
  s.add(`<rect width="${W}" height="${H}" rx="${CARD_R}" fill="${C.BG}"/>`);
  s.add(`<g transform="translate(0 ${PAD})">`);
  s.add(
    `<g class="rise">` +
      s.rich("monom", [{ t: n, fill: C.ACCENT }, { cls: "mono", t: `  /  ${label.toUpperCase()}`, fill: C.MUTED }], { x: IN + 2, y: 20, size: 11, ls: 1.8 }) +
      s.text("mono", meta.toUpperCase(), { x: W - IN - 2, y: 20, size: 10.5, fill: C.MUTED, anchor: "end", ls: 1.4 }) +
      `</g>`,
  );
  const parts = runs.map((r) => (typeof r === "string" ? r : { cls: "serifi", t: r.t, fill: C.ACCENT }));
  s.add(
    `<g class="rise" ${delay(0.08)}>` +
      s.rich("serif", parts, { x: IN, y: 66, size: 46, fill: C.FG, attrs: `letter-spacing="-0.9"` }) +
      `</g>`,
  );
  s.add(`<path d="M${IN} 82.5H${W - IN}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
  s.add(`<circle class="slide" cx="${IN + 4}" cy="82.5" r="3" fill="${C.ACCENT}"/>`);
  s.add(`</g>`);
  return s.render();
}

/* ----------------------------------------------------------------- footer */

export async function footer({ line, name, domain, note }) {
  const W = 800;
  const H = 210;
  const s = new Svg({ w: W, h: H, title: `${name}: ${line}` });
  s.css.push(
    MOTION.rise,
    `@media (prefers-reduced-motion:no-preference){.caret{animation:caret 1.1s steps(1) infinite}@keyframes caret{50%{opacity:0}}}`,
  );
  s.add(frame(W, H));
  s.add(
    s.text("mono", name.toUpperCase(), { x: 40, y: 44, size: 10.5, fill: C.MUTED, ls: 1.6 }),
    s.text("mono", domain, { x: W - 40, y: 44, size: 10.5, fill: C.MUTED, anchor: "end", ls: 0.4 }),
  );
  const size = 92;
  const w = measure("serif", line, size, -size * 0.02);
  const x = 40;
  const y = 138;
  s.add(`<g class="rise">` + s.text("serif", line, { x, y, size, fill: C.FG, attrs: `letter-spacing="${(-size * 0.02).toFixed(2)}"` }) + `</g>`);
  s.add(`<rect class="caret" x="${Math.round(x + w + 10)}" y="${y - 62}" width="26" height="62" fill="${C.ACCENT}"/>`);
  s.add(`<path d="M40 172.5H${W - 40}" stroke="${C.BORDER}" shape-rendering="crispEdges"/>`);
  s.add(s.text("mono", note.toUpperCase(), { x: 40, y: 194, size: 10, fill: C.MUTED, ls: 1.4 }));
  return s.render();
}
