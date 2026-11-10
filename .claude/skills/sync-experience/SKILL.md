---
name: sync-experience
description: Sync the portfolio's experience section with the user's LinkedIn — open their LinkedIn profile in their Chrome, read every position, and make src/config/roles.json match it (add new roles, fix changed titles, dates and locations, remove roles that are gone), after showing the diff for approval. Use this whenever the user wants to add, update or check work experience on the site ("add my new job", "i started at X", "update my experience", "sync with linkedin", "my experience section is outdated", "make the site match my linkedin"), even if they only name a new company or role.
---

# Sync experience with LinkedIn

The site's experience list (`src/config/roles.json`, rendered on the home page) should mirror the **Experience** section of the user's LinkedIn. LinkedIn is the source of truth for the facts (company, title, dates, location, work mode); the site adds its own presentation fields (`monogram`, `tone`, `logo`) that LinkedIn doesn't have.

Read `src/content/experience.ts` for the `Role` type and how logos and dates are used, and look at `src/config/roles.json` before changing anything.

Work through the steps in order. Never edit anything on LinkedIn, and don't commit unless the user asks.

## 1. Read LinkedIn in the user's Chrome

Use **Claude in Chrome** (the `mcp__claude-in-chrome__*` tools; load them with ToolSearch if they're deferred). The user is normally signed in there, which is what makes the full experience list visible.

- The profile URL is `socials.linkedin.href` in `src/content/site.ts`. Open its full experience page: `<profile-url>details/experience/` (the main profile only shows the first few roles).
- Read it with `get_page_text`. Only the **Experience** list matters: the page also has "Who your viewers also viewed", footer links and a language list, so stop at "Profile language". If the list looks cut off, scroll to the bottom and read again until no new positions appear.
- If LinkedIn shows a sign-in wall, a checkpoint or a CAPTCHA, stop and ask the user to sign in or clear it in Chrome themselves, then continue. Don't type credentials or solve challenges.

For each position, capture:

- **company**: LinkedIn's company name exactly as shown (e.g. "Agile Creative Labs Inc."). LinkedIn writes the company line as `Company · Employment type` ("TD · Internship", "Kumon Canada, Inc. · Permanent Part-time"); keep only the part before ` · `.
- **title**: the position title.
- **start / end**: as `"Mon YYYY"` with a three-letter month ("Jan 2026", "Sep 2024"); `"Present"` for current roles. Ignore LinkedIn's duration text ("· 11 mos").
- **location**: shorten to `"City, XX"` with the province or state code ("Waterloo, Ontario, Canada" → "Waterloo, ON"; "Miami, Florida, United States" → "Miami, FL"). Leave it out if LinkedIn has none.
- **mode**: `"Remote"`, `"Hybrid"` or `"On-site"` if LinkedIn lists a location type; otherwise leave it out.

When one company lists several positions (a grouped entry with a timeline), each position becomes its **own role** with the same company. Employment type ("Internship", "Full-time"), the one-line descriptions (often starting with an emoji) and skills aren't shown on the site, so don't collect them.

## 2. Compare with roles.json

Match each LinkedIn position to an existing role by company (ignoring case, punctuation and suffixes like "Inc."), then by title and start date when a company has several roles. That gives three groups:

- **New**: on LinkedIn, not on the site.
- **Changed**: on both, but company spelling, title, dates, location or mode differ. Note each field as `old → new`.
- **Removed**: on the site, not on LinkedIn.

The site's own fields (`monogram`, `tone`, `logo`) on existing roles are **kept as they are**, even if the company name changes, unless the user asks otherwise.

For each **new** role, prepare the site fields:

- `monogram`: two characters, like the others ("Ix", "si", "WD", "Vö"): the initials of the first two words, or the first two letters of a one-word name, keeping the brand's casing.
- `tone`: one of `ink, slate, violet, blue, sky, green, lime, orange, red`, close to the company's brand colour and ideally different from the roles right next to it.
- **logo check**: logos load from logo.dev by company name, and name lookups sometimes match the wrong brand (short names like "TD" are the riskiest). Download what the site would show and look at it (Read the PNG):

  ```bash
  K=$(grep NEXT_PUBLIC_LOGO_DEV_KEY .env | cut -d= -f2)
  curl -s -o <scratch>/logo.png "https://img.logo.dev/name/<url-encoded company>?token=$K&size=128&format=png&fallback=404" -w '%{http_code}\n'
  ```

  A `404` means logo.dev has nothing for that name. Otherwise check the image:
  - right logo → leave `logo` out;
  - wrong brand, but you know the company's website → `"logo": { "domain": "example.com" }`, and check that form (`https://img.logo.dev/example.com?…`) the same way;
  - no logo, a stealth company, or unsure → `"logo": false` (the monogram tile shows instead).

  Run the same check for an **existing** role whose company name changes ("Kumon Canada" → "Kumon Canada, Inc."), since its lookup changes with the name.

## 3. Show the diff and wait

Before editing anything, show the user every change in one message:

- a short table or list per group (new / changed with `old → new` / removed),
- the monogram, tone and logo decision for each new role,
- anything you weren't sure about (a location you guessed, a company you matched loosely),
- side effects: the hero's "now: … @ …" pill shows the first role whose end is "Present" (and disappears if none is), so say when it will change; the home page shows five roles before "show N more roles".

If nothing differs, say the site already matches LinkedIn and stop. Otherwise wait for their OK; they may want to keep a removed role or adjust something. Apply exactly what they approve.

## 4. Write roles.json

- Keep the list **newest first** (LinkedIn's order): current roles first, then by start date, newest to oldest.
- Use the same key order as existing entries: `title, company, monogram, tone, logo (if any), start, end, location, mode`.
- Leave out optional fields rather than writing empty values.
- Validate: `python3 -m json.tool src/config/roles.json > /dev/null`.

## 5. Check the site

- Run the dev server (`preview_start` with the `dev` config in `.claude/launch.json`, or the one already running) and open `/`. The experience label's count should equal the number of roles, the first five rows show by default, and "show N more roles" reveals the rest. New companies should show the right logo or their monogram tile.
- Run `npm run lint`, `npx tsc --noEmit` and `npx next build`.

## 6. Report

Tell the user briefly what was added, changed and removed, any logo decisions worth a second look, and that nothing is committed yet.
