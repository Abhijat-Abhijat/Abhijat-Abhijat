from pathlib import Path
import zipfile, textwrap, os

root = Path("/mnt/data/abhijat-profile-kit")
assets = root / "assets"
workflow = root / ".github" / "workflows"
assets.mkdir(parents=True, exist_ok=True)
workflow.mkdir(parents=True, exist_ok=True)

readme = r'''<p align="center">
  <img src="assets/hero.svg" width="100%" alt="Abhijat — Full-Stack Software Engineer, AI and Agent Systems, Cloud-Native Apps">
</p>

<p align="center">
  <a href="https://github.com/Abhijat-Abhijat"><img src="https://img.shields.io/badge/GitHub-Profile-292725?style=for-the-badge&logo=github&logoColor=F5F1E8" alt="GitHub profile"></a>
  <a href="https://www.linkedin.com/in/abhijat-profile/"><img src="https://img.shields.io/badge/LinkedIn-Connect-292725?style=for-the-badge&logo=linkedin&logoColor=F5F1E8" alt="LinkedIn"></a>
  <a href="https://abhijat.tech.gitlab.io/portfolio/"><img src="https://img.shields.io/badge/Portfolio-Explore-292725?style=for-the-badge&logo=gitlab&logoColor=F5F1E8" alt="Portfolio"></a>
  <a href="mailto:abhijat.tech@gmail.com"><img src="https://img.shields.io/badge/Email-Contact-292725?style=for-the-badge&logo=gmail&logoColor=F5F1E8" alt="Email"></a>
</p>

<img src="assets/about.svg" width="100%" alt="About — Full-Stack Software Engineer working on AI agent systems and cloud-native applications">

I’m a **Full-Stack Software Engineer focused on AI/agent systems and cloud-native applications**. I build intelligent pipelines and scalable systems, with experience spanning multi-agent LLM workflows, backend services, observability, and CI/CD automation.

Currently, I work at **Tata Consultancy Services on a UBS client engagement**, designing multi-agent AI pipelines for Source of Wealth classification and building observability and deployment automation using LangGraph, FastAPI, Splunk, and Azure.

<img src="assets/impact.svg" width="100%" alt="Selected impact — profile-reported project and engineering outcomes">

| Engineering impact | Reported outcome |
|---|---:|
| AI agents built and deployed | 15+ |
| Teams adopting identification agent | 13+ |
| Faster deployments through CI/CD automation | 40% |
| Reduction in system downtime through Splunk | 15% |
| Production issues resolved | 50+ |
| Stability improvement for 10K+ monthly users | 22% |

*Figures are taken from the existing profile README and describe reported work outcomes.*

<img src="assets/work.svg" width="100%" alt="Selected work — AI research automation and a custom Linux operating system">

### AI Research Scientist Agent
Multi-agent system for AI research automation, using five coordinated agents for orchestration, prompt engineering, and multi-agent workflow coordination.

`Python` `LangGraph` `HTML` `GitLab Pages`

[Explore my GitHub profile and repositories](https://github.com/Abhijat-Abhijat)

### ASH OS — Custom Linux Operating System
A lightweight Linux distribution built from scratch, with a focus on boot performance and hardened file-access policies.

`Bash` `Linux From Scratch` `Wine` `Bottles`

[Explore my GitHub profile and repositories](https://github.com/Abhijat-Abhijat)

> **Project-link note:** The current README names these projects but links them to the profile rather than distinct project repositories. Replace those links with direct repository URLs when available; none have been guessed here.

<img src="assets/toolkit.svg" width="100%" alt="Technology toolkit">

<p align="center">
  <img src="https://img.shields.io/badge/Python-292725?style=flat-square&logo=python&logoColor=F5F1E8" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-292725?style=flat-square&logo=fastapi&logoColor=F5F1E8" alt="FastAPI">
  <img src="https://img.shields.io/badge/Node.js-292725?style=flat-square&logo=nodedotjs&logoColor=F5F1E8" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-292725?style=flat-square&logo=express&logoColor=F5F1E8" alt="Express.js">
  <img src="https://img.shields.io/badge/LangGraph-292725?style=flat-square&logo=langchain&logoColor=F5F1E8" alt="LangGraph">
  <img src="https://img.shields.io/badge/Socket.IO-292725?style=flat-square&logo=socketdotio&logoColor=F5F1E8" alt="Socket.IO">
  <img src="https://img.shields.io/badge/React-292725?style=flat-square&logo=react&logoColor=F5F1E8" alt="React">
  <img src="https://img.shields.io/badge/React_Native-292725?style=flat-square&logo=react&logoColor=F5F1E8" alt="React Native">
  <img src="https://img.shields.io/badge/Electron-292725?style=flat-square&logo=electron&logoColor=F5F1E8" alt="Electron">
  <img src="https://img.shields.io/badge/Streamlit-292725?style=flat-square&logo=streamlit&logoColor=F5F1E8" alt="Streamlit">
  <img src="https://img.shields.io/badge/Azure-292725?style=flat-square&logo=microsoftazure&logoColor=F5F1E8" alt="Azure">
  <img src="https://img.shields.io/badge/Docker-292725?style=flat-square&logo=docker&logoColor=F5F1E8" alt="Docker">
  <img src="https://img.shields.io/badge/GitLab_CI%2FCD-292725?style=flat-square&logo=gitlab&logoColor=F5F1E8" alt="GitLab CI/CD">
  <img src="https://img.shields.io/badge/GitHub_Actions-292725?style=flat-square&logo=githubactions&logoColor=F5F1E8" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/MySQL-292725?style=flat-square&logo=mysql&logoColor=F5F1E8" alt="MySQL">
  <img src="https://img.shields.io/badge/MongoDB-292725?style=flat-square&logo=mongodb&logoColor=F5F1E8" alt="MongoDB">
  <img src="https://img.shields.io/badge/PostgreSQL-292725?style=flat-square&logo=postgresql&logoColor=F5F1E8" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/C%2B%2B-292725?style=flat-square&logo=cplusplus&logoColor=F5F1E8" alt="C++">
  <img src="https://img.shields.io/badge/Splunk-292725?style=flat-square&logo=splunk&logoColor=F5F1E8" alt="Splunk">
</p>

<img src="assets/experience.svg" width="100%" alt="Experience and recognition">

### Experience
**Assistant Software Engineer — Tata Consultancy Services**  
*Client: UBS · June 2024–Present · Pune*

- Designed and coordinated AI agents, including prompt engineering and multi-agent workflows.
- Built a reusable Python utility library adopted across teams.
- Developed an identification agent adopted by 13+ teams.
- Automated GitLab CI/CD pipelines, cutting deployment time by 40%.
- Built Splunk dashboards associated with a 15% reduction in downtime.

**Full Stack Developer — TCI**  
*Clients: HerHeadquarters and Mud Australia · November 2022–November 2023 · Delhi*

- Improved marketplace stability by 22% for 10,000+ monthly users.
- Resolved 50+ production-impacting issues.
- Improved GitHub Actions CI/CD, reducing build times by 30%.

### Recognition
- Silver Medal — B.Tech academic year 2022–23, SRM University Delhi NCR (SGPA 9.1)
- Star of the Month — Tata Consultancy Services
- On The Spot Award — Tata Consultancy Services
- DIAT Certified — DRDO, Pune

<img src="assets/activity.svg" width="100%" alt="GitHub activity">

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=Abhijat-Abhijat&show_icons=true&hide_border=true&title_color=292725&text_color=625D55&icon_color=9A795B&bg_color=F5F1E8&include_all_commits=true" height="165" alt="GitHub stats for Abhijat-Abhijat">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Abhijat-Abhijat&layout=compact&hide_border=true&title_color=292725&text_color=625D55&bg_color=F5F1E8" height="165" alt="Most used languages">
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=Abhijat-Abhijat&hide_border=true&background=F5F1E8&ring=9A795B&fire=9A795B&currStreakLabel=292725&sideLabels=625D55&dates=625D55" width="70%" alt="GitHub contribution streak">
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Abhijat-Abhijat/Abhijat-Abhijat/output/github-snake-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Abhijat-Abhijat/Abhijat-Abhijat/output/github-snake.svg">
    <img src="https://raw.githubusercontent.com/Abhijat-Abhijat/Abhijat-Abhijat/output/github-snake.svg" width="100%" alt="Animated GitHub contribution snake">
  </picture>
</p>

<img src="assets/connect.svg" width="100%" alt="Connect — Let's build useful things">

<p align="center">
  <a href="mailto:abhijat.tech@gmail.com"><img src="https://img.shields.io/badge/EMAIL-292725?style=for-the-badge&logo=gmail&logoColor=F5F1E8" alt="Email Abhijat"></a>
  <a href="https://www.linkedin.com/in/abhijat-profile/"><img src="https://img.shields.io/badge/LINKEDIN-292725?style=for-the-badge&logo=linkedin&logoColor=F5F1E8" alt="LinkedIn profile"></a>
  <a href="https://abhijat.tech.gitlab.io/portfolio/"><img src="https://img.shields.io/badge/PORTFOLIO-292725?style=for-the-badge&logo=gitlab&logoColor=F5F1E8" alt="Portfolio website"></a>
</p>

<p align="center"><sub>Building intelligent systems with thoughtful engineering.</sub></p>
'''

(assets / "hero.svg").write_text('''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360">
<rect width="1200" height="360" rx="18" fill="#292725"/>
<path d="M0 290 C220 235 300 365 560 300 S950 245 1200 300" fill="none" stroke="#756451" stroke-width="1.5" opacity=".65"/>
<path d="M0 315 C250 260 360 390 620 320 S970 275 1200 325" fill="none" stroke="#756451" stroke-width="1" opacity=".35"/>
<rect x="64" y="54" width="52" height="4" fill="#B49A7A"/>
<text x="64" y="95" font-family="Arial, Helvetica, sans-serif" font-size="17" letter-spacing="4" fill="#D5C7B2">ENGINEERING · INTELLIGENCE · SYSTEMS</text>
<text x="60" y="180" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="#F5F1E8">Abhijat.</text>
<text x="64" y="224" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#E4DED2">Full-Stack Software Engineer</text>
<text x="64" y="258" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#BFB6A8">AI / Agent Systems  ·  Cloud-Native Applications</text>
<text x="64" y="324" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2" fill="#B49A7A">BUILDING INTELLIGENT PIPELINES THAT SHIP</text>
<circle cx="1030" cy="145" r="78" fill="none" stroke="#B49A7A" stroke-width="1.5" opacity=".65"/>
<circle cx="1030" cy="145" r="54" fill="none" stroke="#B49A7A" stroke-width="1" opacity=".45"/>
<circle cx="1030" cy="145" r="30" fill="#B49A7A" opacity=".12"/>
<path d="M952 145 H1000 M1060 145 H1108 M1030 67 V115 M1030 175 V223 M975 90 L1010 125 M1050 165 L1085 200 M1085 90 L1050 125 M1010 165 L975 200" stroke="#B49A7A" stroke-width="1.5" opacity=".75"/>
<circle cx="1030" cy="145" r="5" fill="#F5F1E8"/>
<circle cx="952" cy="145" r="3" fill="#B49A7A"/><circle cx="1108" cy="145" r="3" fill="#B49A7A"/><circle cx="1030" cy="67" r="3" fill="#B49A7A"/><circle cx="1030" cy="223" r="3" fill="#B49A7A"/>
</svg>''')
def section_svg(path, number, title, subtitle):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="116" viewBox="0 0 1200 116">
<rect width="1200" height="116" rx="12" fill="#F5F1E8"/>
<rect x="0" y="0" width="7" height="116" rx="3" fill="#9A795B"/>
<text x="34" y="38" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="3" fill="#9A795B">{number} / FIELD NOTES</text>
<text x="34" y="78" font-family="Georgia, 'Times New Roman', serif" font-size="35" fill="#292725">{title}</text>
<text x="1164" y="75" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#756F66">{subtitle}</text>
<line x1="34" y1="96" x2="1165" y2="96" stroke="#D8D0C3" stroke-width="1"/>
</svg>'''
    (assets / path).write_text(svg)

section_svg("about.svg", "01", "About", "People, systems, outcomes")
section_svg("impact.svg", "02", "Selected impact", "Measured engineering outcomes")
section_svg("work.svg", "03", "Selected work", "AI research · Operating systems")
section_svg("toolkit.svg", "04", "Technology", "A practical, production-minded toolkit")
section_svg("experience.svg", "05", "Experience & recognition", "Work, ownership, learning")
section_svg("activity.svg", "06", "Activity", "Open work, contributions, iteration")
section_svg("connect.svg", "07", "Let's connect", "Thoughtful systems start with good conversations")

snake = r'''name: Generate contribution snake

on:
  schedule:
    - cron: "17 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Generate contribution snake SVGs
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: Abhijat-Abhijat
          outputs: |
            dist/github-snake.svg?color_snake=%239A795B&color_dots=%23E6E0D4%23CFC4B1%23B49A7A%239A795B%236B523A
            dist/github-snake-dark.svg?palette=github-dark

      - name: Publish generated SVGs to output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
'''
(workflow / "snake.yml").write_text(snake)

guide = '''# Abhijat profile README kit

This kit is for `Abhijat-Abhijat/Abhijat-Abhijat`, the special profile repository.

## Files
- `README.md` — replacement profile README.
- `assets/*.svg` — custom editorial-style banners and section headers.
- `.github/workflows/snake.yml` — daily contribution-snake generator.

## Install
1. Download and unzip this kit.
2. In your local clone of `https://github.com/Abhijat-Abhijat/Abhijat-Abhijat`, back up the current `README.md`.
3. Copy this kit's `README.md`, `assets/`, and `.github/workflows/snake.yml` into the repository, preserving the folder structure.
4. Commit and push to `main`.
5. In GitHub, open the repository's **Settings → Actions → General → Workflow permissions** and allow read/write permissions if required by the publishing workflow.
6. Open **Actions → Generate contribution snake → Run workflow**. The workflow creates/updates an `output` branch with `github-snake.svg` and `github-snake-dark.svg`.
7. Refresh the profile README after the workflow succeeds.

## Accuracy notes
- Content and metrics are based on the existing public profile README as reviewed during preparation.
- The current profile README links both named projects to the profile root, not distinct project repositories. This kit preserves that fact and flags it for replacement when direct URLs are known.
- No new awards, metrics, or project URLs have been invented.
- Shields, stats cards, and streak cards are third-party hosted images and depend on those services being available.
- Contribution snake uses the open-source `Platane/snk` GitHub Action. See https://github.com/Platane/snk for current options and usage.

## Optional edits
- Replace the LinkedIn URL or email if your public contact details change.
- Update technology badges to match your current stack.
- Add direct project URLs when you confirm the repository addresses.
'''
(root / "SETUP.md").write_text(guide)
(root / "README.md").write_text(readme)

zip_path = Path("/mnt/data/abhijat-profile-kit.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for p in root.rglob("*"):
        if p.is_file():
            z.write(p, p.relative_to(root.parent))
print(f"Created {zip_path} with {sum(1 for p in root.rglob('*') if p.is_file())} files")
