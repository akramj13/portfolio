---
name: new-post
description: Write a new blog post for this portfolio from the user's notes, rough draft or voice-memo transcript — shape it into an MDX post in their own casual voice, save its images in a folder per post under public/writing/ (files they give, or screenshots of websites), register it, and leave it as a draft they can read on the dev server before publishing. Use this whenever the user wants to write, draft, publish or turn something into a blog post or article on the site ("write a post about…", "turn these notes into a blog", "i want to blog about my hackathon", "here's a draft, put it on the site", "publish my post"), even if they don't say "MDX" or "blog".
---

# Write a new blog post

Posts are MDX files in `src/content/writing/<slug>.mdx`. Each one exports its details as `metadata` at the top and is registered with one import and one list entry in `src/content/posts.ts`. Images live in `public/writing/<slug>/`. Read `src/content/posts.ts` (the `PostMeta` type) and every existing post in `src/content/writing/` before writing: they're the reference for both the format and the user's voice.

The user writes the ideas; you shape them. Work through the steps in order, and don't commit unless they ask.

## 1. Gather what you need

The user gives you notes, a rough draft, or a transcript (pasted, or as a file path). Also find out, from their message or by asking once:

- **images**: files to include (paths), and/or websites to screenshot (URLs);
- anything the post should link to (repos, sites);
- a title, if they have one in mind.

If the notes leave a real gap (a key fact, an outcome, a number), ask about it rather than filling it in. Inventing details in someone's personal writing is the worst mistake you can make here; a short post that's all true beats a polished one with made-up claims.

## 2. Write the post in their voice

Match the existing posts. For this user, that means:

- **all lowercase**, including the title and headings, except proper nouns and acronyms where it would read oddly to lowercase them (keep "AI", "API", product names);
- casual and direct, first person, short paragraphs, the odd "lol" or aside in parentheses, like talking to a friend;
- `##` section headings, short bulleted lists with **bold** lead-ins where it helps, `---` between big sections;
- no corporate filler ("in today's fast-paced world", "leverage", "delve") and no closing summary that repeats everything.

Keep their phrasing wherever it already works, fix typos and grammar, and reorder for flow. Your job is structure and polish, not a rewrite. Keep their opinions and jokes. Don't add claims, numbers, names or outcomes that aren't in their notes.

### Metadata

Put this at the very top of the file, the same shape as existing posts:

```mdx
export const metadata = {
  title: "lowercase title, specific not clickbait",
  excerpt: "one sentence on what the post is about, in their voice.",
  date: "YYYY-MM-DD",
  readingTime: 4,
  tags: ["Tag", "Another"],
  cover: "/writing/<slug>/<image>.png",
  draft: true,
};
```

- `date`: today (`date +%F`), unless they give one.
- `readingTime`: words ÷ 200, rounded up, at least 1 (`wc -w` on the body).
- `tags`: 2–5, Title Case, like the existing ones ("Next.js", "AI", "Hackathon").
- `cover`: the image that best represents the post (usually the first); leave it out if there are no images.
- `draft: true` always, for now; step 5 removes it when the user approves.
- `slug` (the file name): short kebab-case from the title, unique among existing posts.

### MDX gotchas

MDX is JSX, so in prose: escape literal `{`, `}` and `<` (write `\{`, `\}`, `&lt;`, or put them in backticks), and write a literal `*` as `\*`. Fenced code blocks are safe as-is. Links are normal Markdown; external ones open in a new tab automatically.

## 3. Add the images

Save everything under `public/writing/<slug>/` with short, descriptive kebab-case names (`dashboard.png`, `team-at-demo.jpg`), never the original camera or screenshot filenames.

- **Files from the user**: copy them in. Convert HEIC or other formats with `sips -s format png` (or `jpeg` for photos), and if wider than 2000px shrink with `sips --resampleWidth 2000`.
- **Screenshots of websites**: capture with the shared script from the add-project skill, then look at the PNG before using it (cookie banners, blank loading states):

  ```bash
  node .claude/skills/add-project/scripts/capture-screenshot.mjs <url> public/writing/<slug>/<name>.png
  ```

Reference each image where it belongs in the text as `![descriptive alt text](/writing/<slug>/<name>.png)`. The alt text says what the image shows, not "image" or "screenshot".

## 4. Register it

In `src/content/posts.ts`, add an import next to the existing ones and an entry to the list:

```ts
import MyNewPost, { metadata as myNewPost } from "./writing/my-new-post.mdx";
// …
  { slug: "my-new-post", ...myNewPost, Body: MyNewPost },
```

The list is sorted by date automatically, so the order of entries doesn't matter.

## 5. Let them read it, then publish

Drafts are hidden from the writing page, the home page, the sitemap and production builds, but open by URL on the dev server with a "draft" label.

1. Run the dev server (`preview_start` with the `dev` config in `.claude/launch.json`, or the one already running) and open `/writing/<slug>`. Check that it renders, images load, and there are no console errors.
2. Run `npm run lint`, `npx tsc --noEmit` and `npx next build`.
3. Send the user the link and a short summary: title, excerpt, tags, reading time, images used, and anything you changed beyond light edits or weren't sure about. Ask if they want changes or want it published.
4. When they say publish: remove `draft: true`, then check `/writing` lists it, the home page shows it if it's one of the two newest, and the build still passes.

## 6. Report

Tell the user where the post lives (file and URL), whether it's still a draft or published, the images you added, and that nothing is committed yet.
