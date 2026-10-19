# Setting this up

Five steps, about ten minutes. Everything is already generated; you only need to put it on GitHub.

## What is in the folder

```
README.md                  the profile page (generated, do not hand-edit)
assets/                    the SVG cards the README is made of
game/                      the playable snake: index.html, core.js, fonts/
.github/workflows/snake.yml   draws your contribution graph as a snake, in your palette
tools/                     the generator: edit tools/build.mjs, run npm run build
```

## 1. Put it in your profile repo

Your profile README lives in a repo named exactly like your username: `Abhijat-Abhijat/Abhijat-Abhijat`.
Copy everything from this folder into the root of that repo, replacing the old `README.md`, then commit and push to `main`.
Leave `tools/node_modules` out (the `.gitignore` already does).

## 2. Turn on GitHub Pages (this is what makes the game playable)

GitHub removes JavaScript from READMEs, so the game cannot run inside the profile. It runs on its own page instead,
and the README shows a recording of its autopilot that links there.

Repo, then **Settings, Pages**: under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
After a minute or two the game is at:

```
https://abhijat-abhijat.github.io/Abhijat-Abhijat/game/
```

Note the repo name in the middle of that address. The link in your old README left it out, which is why it never opened.

## 3. Run the snake workflow once

Repo, then **Actions, Contribution snake, Run workflow**. This creates the `output` branch holding `github-snake.svg`,
which the "Commits" section of the README displays. After this first run it refreshes itself every 12 hours.
If the Actions tab asks you to enable workflows, enable them first.

## 4. Add your avatar

Save the image as `assets/avatar.webp` (png or jpg also work), then rebuild:

```
cd tools
npm install
npm run build
```

The build crops it to the hero frame and embeds it into `assets/hero.svg`. Until you add one, the hero shows a monogram.
Commit the changed files.

### Prompts for the avatar

The hero frame is portrait, about 4:5, and draws its own mint block behind the picture, so the image itself should be
off-white line work on a flat dark ground with almost no colour of its own. Attach your photo for the likeness and,
if the tool allows a second image, your portfolio avatar as a style reference.

**Portrait (the one the hero uses).** Ask for 1024 x 1280.

```
Redraw the attached photo of me as a rough continuous-line ink portrait. Keep my likeness from the photo:
face shape, hairstyle, and glasses or facial hair if I have them.

Style: single confident pen strokes with slightly uneven weight, light hatching on the shadow side only,
no fills and no soft shading. It should look hand-drawn, minimal and a little raw, like a notebook sketch.

Colours, exactly: flat background #0D0F10 (near black), all linework #F2F0E9 (warm off-white).
At most one tiny accent in #B6F09C, under 3% of the image, for example a thin highlight on a collar or glasses frame.

Composition: head and shoulders, centred, eyes about 38% down from the top, shoulders cropped by the bottom edge,
plenty of empty dark space around. Portrait 4:5, 1024 x 1280 px.

Do not add: text, logos, watermark, frame, border, gradient, glow, drop shadow, 3D rendering, photo texture,
extra people or a busy background.
```

If you attached the portfolio avatar, add: `Match the line weight and mood of the second image. Take its style only, not its face.`

**No photo, no likeness.** For a faceless version, use the same prompt but replace the first paragraph with:

```
A head-and-shoulders silhouette of a person drawn in one continuous line, with no facial features,
leaning slightly forward as if reading a screen.
```

**Square, for GitHub's own profile picture** (Settings, Profile picture). Crop the portrait to 1:1 around the head,
or ask for the same prompt at `1024 x 1024` with the head centred.

## 5. Check it on your profile

Open `github.com/Abhijat-Abhijat` in both the light and dark GitHub themes. Both are designed for.

## Editing the content later

All the text, links and numbers sit in the `PROFILE` object at the top of `tools/build.mjs`.
Change them there and run `npm run build` again. The build stops with a clear message if any text no longer fits its card.

## Worth a second look before you publish

- **ASH OS** is described as a C and x86-64 assembly operating system, as on your portfolio. The old README and the `ashos` repo describe it differently (a website). Make sure the card matches what you want to claim.
- **Neuro Coder** has no repo I could find, so its card links to your portfolio.
- **Impact figures** (15+ workflows, 40% faster deployments and so on) are marked as self-reported on the page. Keep them only if you can stand behind them.
- **Fonts** are Instrument Serif and Geist, both under the SIL Open Font License; the licence files are in `game/fonts/` and `tools/fonts/`.
