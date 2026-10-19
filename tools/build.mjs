// Builds assets/*.svg and README.md for the Abhijat-Abhijat profile repo.
//
//   cd tools && npm install && npm run build
//
// Edit PROFILE below to change copy, links or numbers. Optional: drop an avatar at
// assets/avatar.webp (or .png / .jpg); it is resized and embedded into the hero automatically.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hero, button, title, footer } from "./lib/cards-basic.mjs";
import { about, project, projectFeatured, toolkit, experience, recognition } from "./lib/cards-content.mjs";
import { replay, pickSeed } from "./lib/replay.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "assets");

/* ------------------------------------------------------------------ data */

const SITE = "https://www.abhijat.co.in/";
const GH = "https://github.com/Abhijat-Abhijat";
const LINKEDIN = "https://www.linkedin.com/in/abhijat-profile/";
const EMAIL = "abhijat.tech@gmail.com";
// GitHub Pages URL for a project site: <user>.github.io/<repo>/
const PLAY = "https://abhijat-abhijat.github.io/Abhijat-Abhijat/game/";
const SNAKE_SVG = "https://raw.githubusercontent.com/Abhijat-Abhijat/Abhijat-Abhijat/output/github-snake.svg";

// Set to a number to freeze the replay; null picks the best-looking seed on every build.
const REPLAY_SEED = null;

const PROFILE = {
  name: "Abhijat",
  headline: [["I build ", { t: "useful" }], ["software and"], ["AI products."]],
  intro: "AI engineer and full-stack software engineer, building production agent systems at TCS for UBS.",
  tagline: "Build. Ship. Repeat.",
  domain: "abhijat.co.in",

  about: {
    paragraphs: [
      "I work at the intersection of AI and software engineering. Today that means production AI agent systems at Tata Consultancy Services, embedded with UBS. I care about the engineering around the model, because an AI system is only as good as what holds it up.",
      "Away from work I build an operating system, developer tools and a job platform that ranks by fit. I also wrote a beginner’s book on AI and IoT.",
    ],
    stats: [
      { value: "15", suffix: "+", label: "AI agent workflows built" },
      { value: "13", suffix: "+", label: "teams using the identification agent" },
      { value: "40", suffix: "%", label: "faster deployments via CI/CD" },
      { value: "15", suffix: "%", label: "reported drop in downtime" },
      { value: "50", suffix: "+", label: "production issues resolved" },
      { value: "22", suffix: "%", label: "stability gain on a 10K+ user product" },
    ],
    note: "Figures are self-reported from my work history.",
  },

  featured: {
    label: "Systems / C and x86-64 assembly",
    name: "ASH OS",
    desc: "A lightweight operating system built in C and x86-64 assembly, with kernel-level secure file access policies.",
    tags: ["C", "x86-64 assembly", "Kernel", "Security"],
    log: ["kernel loaded", "memory map ready", "file access policy on", "shell ready"],
    href: `${GH}/ashos`,
  },
  projects: [
    {
      key: "jobify",
      label: "Mobile / React Native",
      name: "Jobify",
      desc: "A job platform that ranks listings by fit rather than recency, with real-time notifications and dynamic search filters.",
      tags: ["React Native", "Expo"],
      metric: { value: "30", suffix: "%", caption: "better job matching" },
      href: `${GH}/jobify`,
    },
    {
      key: "neuro-coder",
      label: "AI / Developer tool",
      name: "Neuro Coder",
      desc: "An AI-powered coding assistant for writing, debugging and understanding code.",
      tags: ["AI", "Developer tools"],
      href: SITE,
    },
    {
      key: "coding-session-tracker",
      label: "VS Code extension",
      name: "Coding Session Tracker",
      desc: "Tracks active coding time, Pomodoro sessions and daily and weekly stats, with a productivity heatmap. Your data stays local.",
      tags: ["TypeScript", "VS Code API"],
      href: `${GH}/coding-session-tracker`,
    },
    {
      key: "quantabotics",
      label: "AI / Multi-agent",
      name: "QuantaBotics",
      desc: "A FastAPI hub that routes input to specialised agents for summarizing, calculating, coding, search, sentiment and visualization.",
      tags: ["Python", "FastAPI", "Agents"],
      href: `${GH}/multiAgentPOC`,
    },
  ],

  toolkit: [
    { label: "Languages", items: ["Python", "TypeScript", "JavaScript", "C", "x86-64 assembly", "Bash"] },
    { label: "Backend", items: ["Spring Boot", "FastAPI", "Node.js", "REST APIs"] },
    { label: "Frontend", items: ["React", "React Native", "Electron"] },
    { label: "AI and ML", items: ["Azure OpenAI", "LangGraph", "RAG", "Multi-agent systems"] },
    { label: "Cloud and DevOps", items: ["Azure", "Docker", "GitHub Actions", "GitLab CI/CD", "Splunk"] },
    { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
    { label: "Systems and security", items: ["Linux", "Operating systems", "Secure file access"] },
  ],

  experience: {
    entries: [
      {
        dates: "Jun 2024 – now",
        current: true,
        role: "Assistant System Engineer",
        company: "Tata Consultancy Services, for UBS. Trainee until June 2025.",
        summary:
          "Multi-agent AI workflows and Python utilities. An identification agent adopted by 13+ teams, CI/CD changes tied to 40% faster deployments, and Splunk dashboards tied to a 15% drop in downtime.",
      },
      { dates: "Apr – Jun 2024", role: "Full Stack Engineer", company: "Laptop First" },
      {
        dates: "Nov 2022 – Nov 2023",
        role: "Software Engineering",
        company: "TCI, client work for HerHeadquarters and Mud Australia.",
        summary: "Stability work on a product with 10,000+ monthly users: 50+ production issues resolved and a reported 30% faster build time.",
      },
    ],
    note: "Impact figures are self-reported.",
  },

  recognition: {
    left: {
      heading: "Recognition",
      items: [
        { t: "Silver Medal", sub: "Second rank in B.Tech CSE, SRM University Delhi-NCR, 2022–23" },
        { t: "Star of the Month", sub: "Tata Consultancy Services, August 2025" },
        { t: "On The Spot Award", sub: "Tata Consultancy Services, January 2026" },
        { t: "DIAT certified", sub: "DRDO Pune" },
      ],
    },
    right: {
      heading: "Writing and publications",
      items: [
        { t: "The Basics of AI and IoT", sub: "A beginner’s book" },
        { t: "ASH OS", sub: "Academic paper" },
        { t: "Smart Industrial Robot", sub: "Registered design" },
        {
          t: "33 posts on the blog",
          sub: "Featured: “What I learned building AI verification pipelines” and “Building a tiny operating system to understand computers better”",
        },
      ],
    },
  },

  footer: { line: "Build. Ship. Repeat.", note: "Open to conversations about AI agents, backend and tools" },
};

/* --------------------------------------------------------------- avatar */

async function loadAvatar() {
  for (const ext of ["webp", "png", "jpg", "jpeg"]) {
    const file = path.join(ASSETS, `avatar.${ext}`);
    try {
      await fs.access(file);
    } catch {
      continue;
    }
    // Portrait plate is 216x272; embed at 2x so it stays sharp on retina screens.
    let buf;
    try {
      const sharp = (await import("sharp")).default;
      buf = await sharp(file).resize(432, 544, { fit: "cover", position: "top" }).webp({ quality: 82 }).toBuffer();
    } catch {
      buf = await fs.readFile(file);
      if (buf.length > 300_000) console.warn(`! ${file} is ${Math.round(buf.length / 1024)} KB; install sharp (npm install) so it can be resized.`);
    }
    console.log(`avatar: embedded assets/avatar.${ext} (${Math.round(buf.length / 1024)} KB)`);
    return `data:image/webp;base64,${buf.toString("base64")}`;
  }
  console.log("avatar: none found, using the monogram placeholder (add assets/avatar.webp to replace it)");
  return null;
}

/* ----------------------------------------------------------------- build */

const written = [];
async function write(name, svg) {
  await fs.writeFile(path.join(ASSETS, name), svg);
  written.push([name, svg.length]);
}

async function main() {
  await fs.mkdir(ASSETS, { recursive: true });
  const P = PROFILE;
  const avatar = await loadAvatar();

  await write("hero.svg", await hero({ name: P.name, headline: P.headline, intro: P.intro, tagline: P.tagline, domain: P.domain, avatar }));

  await write("btn-portfolio.svg", await button({ label: "Portfolio", icon: "globe", variant: "primary", trailing: true }));
  await write("btn-github.svg", await button({ label: "GitHub", icon: "github" }));
  await write("btn-linkedin.svg", await button({ label: "LinkedIn", icon: "linkedin" }));
  await write("btn-email.svg", await button({ label: "Email", icon: "mail" }));
  await write("btn-play.svg", await button({ label: "Play snake", icon: "play", variant: "accent" }));

  const T = [
    ["about", "01", "About", ["I like building ", { t: "useful" }, " things."], "Bio and numbers"],
    ["work", "02", "Work", ["Selected ", { t: "work" }, "."], "More on the portfolio"],
    ["play", "03", "Play", ["Eat the ", { t: "stack" }, "."], "Arrows to steer"],
    ["toolkit", "04", "Toolkit", ["What I ", { t: "reach for" }, "."], "By layer"],
    ["experience", "05", "Experience", ["Where I’ve ", { t: "worked" }, "."], "2022 to now"],
    ["recognition", "06", "Recognition", ["Recognition and ", { t: "writing" }, "."], "On the record"],
    ["commits", "07", "Commits", ["A year of ", { t: "commits" }, "."], "Updated daily"],
    ["connect", "08", "Connect", ["Let’s build something ", { t: "useful" }, "."], "Email or LinkedIn"],
  ];
  for (const [key, n, label, runs, meta] of T) await write(`title-${key}.svg`, await title({ n, label, runs, meta }));

  await write("about.svg", await about(P.about));
  await write("project-ashos.svg", await projectFeatured(P.featured));
  for (const [i, p] of P.projects.entries()) await write(`project-${p.key}.svg`, await project({ ...p, side: i % 2 ? "r" : "l" }));

  const seedInfo = REPLAY_SEED != null ? { seed: REPLAY_SEED } : pickSeed();
  const rep = await replay({
    seed: seedInfo.seed,
    stackLabel: "of 12 stack items collected",
    hint: "Arrows or WASD to steer / Space pauses / B toggles autopilot",
    cta: "Take the controls",
  });
  await write("snake-replay.svg", rep.svg);
  console.log(`replay: seed ${rep.info.seed}, ${rep.info.ticks} ticks, loop ${rep.info.loopSeconds}s`);

  await write("toolkit.svg", await toolkit({ rows: P.toolkit }));
  await write("experience.svg", await experience(P.experience));
  await write("recognition.svg", await recognition(P.recognition));
  await write("footer.svg", await footer({ line: P.footer.line, name: P.name, domain: P.domain, note: P.footer.note }));

  await fs.writeFile(path.join(ROOT, "README.md"), readme(P));
  for (const [n, size] of written) console.log(`  assets/${n.padEnd(34)} ${(size / 1024).toFixed(1)} KB`);
  const total = written.reduce((a, [, s]) => a + s, 0);
  console.log(`wrote README.md and ${written.length} SVGs (${(total / 1024).toFixed(0)} KB total)`);
}

/* ---------------------------------------------------------------- README */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function readme(P) {
  const img = (file, alt, extra = 'width="100%"') => `<img src="assets/${file}" ${extra} alt="${esc(alt)}">`;
  const link = (href, inner) => `<a href="${href}">${inner}</a>`;
  const statsAlt = P.about.stats.map((s) => `${s.value}${s.suffix} ${s.label}`).join("; ");
  const projectAlt = (p) => `${p.name}, ${p.label}. ${p.desc}${p.metric ? ` ${p.metric.value}${p.metric.suffix} ${p.metric.caption}.` : ""} ${p.tags.join(", ")}.`;
  // Two 49.9% images leave ~1px of slack, so a pair never wraps; the 12px gutter is drawn inside the SVGs.
  const half = (p) => link(p.href, img(`project-${p.key}.svg`, projectAlt(p), 'width="49.9%"'));
  const toolkitAlt = P.toolkit.map((r) => `${r.label}: ${r.items.join(", ")}`).join(". ");
  const expAlt = P.experience.entries.map((e) => `${e.dates}, ${e.role}, ${e.company} ${e.summary || ""}`.trim()).join(" ");
  const recAlt = [P.recognition.left, P.recognition.right].map((c) => `${c.heading}: ${c.items.map((i) => `${i.t} (${i.sub})`).join("; ")}`).join(". ");

  const btn = (file, alt, href) => link(href, img(file, alt, 'height="48"'));

  return `<!--
  Generated by tools/build.mjs. Edit PROFILE at the top of that file, then run \`npm run build\` inside tools/.
  Palette: BG #0D0F10, FG #F2F0E9, MUTED #A6A49B, ACCENT #B6F09C, BORDER #343638 (from abhijat.co.in).
  GitHub strips JavaScript from READMEs, so the playable snake lives in game/ (GitHub Pages) and the README shows a replay.
-->

${link(SITE, img("hero.svg", `${P.name}. I build useful software and AI products. ${P.intro}`))}

<p align="center">
${btn("btn-portfolio.svg", "Portfolio", SITE)}
${btn("btn-github.svg", "GitHub", GH)}
${btn("btn-linkedin.svg", "LinkedIn", LINKEDIN)}
${btn("btn-email.svg", "Email", `mailto:${EMAIL}`)}
${btn("btn-play.svg", "Play snake", PLAY)}
</p>

${img("title-about.svg", "01 About. I like building useful things.")}
${img("about.svg", `${P.about.paragraphs.join(" ")} ${statsAlt}. ${P.about.note}`)}

${img("title-work.svg", "02 Work. Selected work.")}
${link(P.featured.href, img("project-ashos.svg", `${P.featured.name}, ${P.featured.label}. ${P.featured.desc} ${P.featured.tags.join(", ")}.`))}
<p align="center">
${half(P.projects[0])}${half(P.projects[1])}
${half(P.projects[2])}${half(P.projects[3])}
</p>

${img("title-play.svg", "03 Play. Eat the stack.")}
${link(PLAY, img("snake-replay.svg", "A snake plays itself and eats twelve stack items: Python, TypeScript, Spring Boot, React, Azure OpenAI, LangGraph, RAG, Docker, PostgreSQL, C, x86 ASM and FastAPI. Click to play the real game."))}

<p align="center"><sub>A recording of the game's autopilot. Click it to take the controls.</sub></p>

${img("title-toolkit.svg", "04 Toolkit. What I reach for.")}
${img("toolkit.svg", toolkitAlt)}

${img("title-experience.svg", "05 Experience. Where I've worked.")}
${img("experience.svg", `${expAlt} ${P.experience.note}`)}

${img("title-recognition.svg", "06 Recognition. Recognition and writing.")}
${img("recognition.svg", recAlt)}

${img("title-commits.svg", "07 Commits. A year of commits.")}
<img src="${SNAKE_SVG}" width="100%" alt="A snake eating my public GitHub contributions over the past year. Regenerated daily by GitHub Actions.">

${img("title-connect.svg", "08 Connect. Let's build something useful.")}
<p align="center">
${btn("btn-email.svg", `Email ${EMAIL}`, `mailto:${EMAIL}`)}
${btn("btn-linkedin.svg", "LinkedIn", LINKEDIN)}
${btn("btn-github.svg", "GitHub", GH)}
${btn("btn-portfolio.svg", "Portfolio", SITE)}
</p>

${link(SITE, img("footer.svg", `${P.name}. ${P.footer.line} ${P.footer.note}.`))}
`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
