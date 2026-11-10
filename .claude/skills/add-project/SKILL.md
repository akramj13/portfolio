---
name: add-project
description: Add a new project to this portfolio site end to end — gather the details, write the src/config/projects.json entry, capture or save the screenshot, draw a matching icon.svg, and check the project cards and page. Use this whenever the user wants to add, showcase, list or feature a project, app, hackathon build or side project on the portfolio (e.g. "add cotabby to my projects", "put my new app on the site", "here's my hackathon repo, add it"), even if they only paste a GitHub or website link and don't say "project".
---

# Add a project to the portfolio

A project on this site is three things that have to agree with each other:

- an entry in `src/config/projects.json` (the order of the list is the order on the site, and **the first three also show on the home page**),
- a folder `public/projects/<slug>/` with `screenshot.png` and `icon.svg`,
- the cards and pages that render them (`/projects`, `/projects/<slug>`, the home "building" section).

The `Project` type in `src/content/projects.ts` documents every field. Read it, and skim two or three existing entries in `projects.json`, before writing anything: the house style is easier to match by example than by rules.

Work through the steps below in order. Don't commit anything unless the user asks.

## 1. Gather the details

Start from whatever the user gave you and fill in as much as you can yourself, so you only ask about what you genuinely can't find:

- **GitHub link** → `gh repo view <owner/repo>` and `gh api repos/<owner>/<repo>/readme --jq .content | base64 -d` for the description, features, stack and live URL; `gh api repos/<owner>/<repo>/languages` for tags.
- **Live site** → open it in the built-in browser (`get_page_text`) for the tagline, what it does, and any numbers worth a badge.

Then draft the whole entry and show it to the user **in one message**, together with the two questions only they can answer:

1. **Where should it go in the list?** Suggest a spot (newest and strongest work near the top) and say plainly whether it will appear on the home page.
2. **Is anything wrong or missing?** Especially the duration, a badge (a prize, download count, stars), and the link to use.

Wait for their answer before writing files. A wrong date or claim on someone's portfolio is worse than a short delay.

### Writing the copy

Match the existing entries:

- `title`: the product's real name and capitalisation ("Vidsynth.ai", "AlzGuard"). If the repo or site brands it differently from what the user called it (repo `uxshopify`, site "Mystery Shopper"), use the product's name and mention the choice in your report so the user can swap it.
- `tagline`: one short sentence with a full stop, what it is for whom ("AI short-form video studio for creators.").
- `description`: 1–2 sentences, concrete, with any outcome or numbers.
- `features`, `highlights`, `challenges`: 2–5 items each, sentence case, no trailing full stops. Highlights are what *the user* did or achieved; challenges are real hard parts, not filler.
- `tags`: 3–7 technologies, most important first (the first three show on the card).
- `duration`: like the others ("2 days", "~2 months", "Ongoing").
- `badge`: optional and short ("YIC winner", "6k+ downloads"). Only include it if it's true and the user confirmed it.
- `link`: the live site if there is one, otherwise the repo.
- `slug`: kebab-case from the title, unique in the file (it's the URL and the folder name).

## 2. Get the screenshot

The cards are 16:10 and crop from the top, so the ideal image is a 2000×1250 PNG of the site's first screen.

**If there's a live site**, capture it:

```bash
node .claude/skills/add-project/scripts/capture-screenshot.mjs <url> public/projects/<slug>/screenshot.png [settle-ms]
```

It drives headless Chrome, waits for the page to load plus a few real seconds so fade-ins and client-side rendering finish, and saves a 2000×1250 PNG. Then **look at the PNG** (Read it) before moving on. Captures can still come back as a cookie banner, a login wall or an error page. If so, retry with a longer settle time (e.g. 8000), a better URL (a demo or landing page), or ask the user. If the script exits with an error, it says why; fall back to asking the user.

**If there's no site, or the capture keeps failing**, ask the user for an image (their own screenshot, a demo GIF frame, a diagram). Save it as `public/projects/<slug>/screenshot.png`, converting with `sips -s format png` if needed, and if it's wider than 2000px shrink it with `sips --resampleWidth 2000`. Don't screenshot the GitHub repo page as a stand-in: it looks like every other repo and says nothing about the project.

If the important part of the image isn't at the top centre (e.g. a headline on the far left of a very wide screenshot), set `"imagePosition"` in the entry, e.g. `"left top"`.

## 3. Draw the icon

Each project has its own app-style icon at `public/projects/<slug>/icon.svg`. It should feel like it belongs to *this* project: take the colours and the single most recognisable motif from the screenshot (its logo, mascot, signature UI element, or what the product is about). Open two or three existing icons in `public/projects/*/icon.svg` first and match their construction:

- `viewBox="0 0 64 64"`, `width="128" height="128"`, a full-bleed tile `<rect width="64" height="64" rx="15" …/>` (usually a two-stop gradient) with the motif on top.
- One bold, simple motif that still reads at 40px. Flat shapes or thick strokes (≥2 units), no small text, no photos, no more than three or four colours.
- Keep it under ~2 KB of hand-written SVG. Use `clipPath` to the tile if anything touches the edges.
- Echo the project's own branding freely, but don't reproduce someone else's trademarked logo (a partner or sponsor); draw your own motif in their palette instead.

Render it and look at it before you move on:

```bash
.claude/skills/add-project/scripts/render-icon.sh public/projects/<slug>/icon.svg <scratch-dir>
```

Read the PNG it prints. If the motif is muddy, off-centre, or blends into the background, fix it now; it's much cheaper than after review.

## 4. Write the entry

- Pick `tone` from `ink, slate, violet, blue, sky, green, lime, orange, red`, the one closest to the icon's main colour. It colours the placeholder art if the screenshot ever goes missing.
- Set `"icon": "/projects/<slug>/icon.svg"` and `"image": "/projects/<slug>/screenshot.png"`.
- Insert the entry at the position the user chose, keeping the same key order as the other entries, and validate the file: `python3 -m json.tool src/config/projects.json > /dev/null`.

## 5. Check the cards

Look at the result the way a visitor would, using the dev server (`preview_start` with the `dev` config in `.claude/launch.json`, or the one already running):

- `/projects`: the new card shows the screenshot (not the placeholder), the crop keeps the important part, and the card sits where the user asked.
- `/projects/<slug>`: the page loads with the icon, screenshot, lists and tags; no console errors.
- `/` if it's in the first three: the "building" row shows the icon.

Then run `npm run lint`, `npx tsc --noEmit` and `npx next build`, and confirm `/projects/<slug>` appears in the build output.

## 6. Report back

Tell the user, briefly: where the project now sits (and whether it's on the home page), the files you added or changed, what the icon depicts and why, anything you guessed or couldn't verify (e.g. a duration you inferred), and that nothing is committed yet.
