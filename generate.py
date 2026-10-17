
from pathlib import Path
from html import escape

ASSETS = Path("assets")
ASSETS.mkdir(exist_ok=True)

# Palette: charcoal, warm paper, muted bronze.
CHARCOAL = "#292725"
PAPER = "#F5F1E8"
BRONZE = "#9A795B"
MUTED = "#756F66"
RULE = "#D8D0C3"


hero = f'''<svg xmlns="http://www.w3.org/2000/svg"
 width="1200" height="360" viewBox="0 0 1200 360">
 <rect width="1200" height="360" rx="18" fill="{CHARCOAL}"/>
 <path d="M0 290 Q260 210 500 300 T1200 285"
 fill="none" stroke="{BRONZE}" opacity=".55"/>
 <path d="M0 320 Q280 240 560 325 T1200 310"
 fill="none" stroke="{BRONZE}" opacity=".3"/>
 <rect x="64" y="54" width="52" height="4" fill="#B49A7A"/>
 <text x="64" y="95" font-family="Arial,sans-serif"
 font-size="16" letter-spacing="4" fill="#D5C7B2">
 ENGINEERING · INTELLIGENCE · SYSTEMS</text>
 <text x="60" y="180" font-family="Georgia,serif"
 font-size="76" fill="{PAPER}">Abhijat.</text>
 <text x="64" y="225" font-family="Arial,sans-serif"
 font-size="23" fill="#E4DED2">
 Full-Stack Software Engineer</text>
 <text x="64" y="261" font-family="Arial,sans-serif"
 font-size="18" fill="#BFB6A8">
 AI / Agent Systems · Cloud-Native Applications</text>
 <text x="64" y="324" font-family="Arial,sans-serif"
 font-size="13" letter-spacing="2" fill="#B49A7A">
 BUILDING INTELLIGENT SYSTEMS THAT SHIP</text>
 <circle cx="1020" cy="150" r="82" fill="none"
 stroke="#B49A7A" stroke-width="1.5" opacity=".7"/>
 <circle cx="1020" cy="150" r="57" fill="none"
 stroke="#B49A7A" opacity=".55"/>
 <circle cx="1020" cy="150" r="30" fill="#B49A7A" opacity=".12"/>
 <path d="M938 150 H990 M1050 150 H1102 M1020 68 V120
 M1020 180 V232 M962 92 L1000 130 M1040 170 L1078 208
 M1078 92 L1040 130 M1000 170 L962 208"
 fill="none" stroke="#B49A7A" stroke-width="1.5"/>
 <circle cx="1020" cy="150" r="5" fill="{PAPER}"/>
</svg>'''

sections = {
    "about.svg": ("01", "About", "People, systems, outcomes"),
    "impact.svg": ("02", "Selected impact", "Engineering outcomes"),
    "work.svg": ("03", "Selected work", "AI research · Operating systems"),
    "toolkit.svg": ("04", "Technology", "A practical engineering toolkit"),
    "experience.svg": ("05", "Experience & recognition", "Work, ownership, learning"),
    "activity.svg": ("06", "Activity", "Contributions and iteration"),
    "connect.svg": ("07", "Let's connect", "Good systems start with good conversations"),
}

def section_svg(number, title, subtitle):
    title = escape(title)
    subtitle = escape(subtitle)
    return f'''<svg xmlns="http://www.w3.org/2000/svg"
 width="1200" height="116" viewBox="0 0 1200 116">
 <rect width="1200" height="116" rx="12" fill="{PAPER}"/>
 <rect width="7" height="116" rx="3" fill="{BRONZE}"/>
 <text x="34" y="34" font-family="Arial,sans-serif"
 font-size="12" letter-spacing="3" fill="{BRONZE}">
 {number} / FIELD NOTES</text>
 <text x="34" y="78" font-family="Georgia,serif"
 font-size="35" fill="{CHARCOAL}">{title}</text>
 <text x="1165" y="73" text-anchor="end"
 font-family="Arial,sans-serif" font-size="15"
 fill="{MUTED}">{subtitle}</text>
 <line x1="34" y1="96" x2="1165" y2="96"
 stroke="{RULE}" stroke-width="1"/>
</svg>'''

(ASSETS / "hero.svg").write_text(hero, encoding="utf-8")

for filename, (number, title, subtitle) in sections.items():
    content = section_svg(number, title, subtitle)
    (ASSETS / filename).write_text(content, encoding="utf-8")

print("Created hero.svg and 7 section SVG files in assets/")
