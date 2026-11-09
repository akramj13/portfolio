// Hardcoded blog. Each post body is plain JSX for now; swap for MDX or a
// CMS later. Posts marked `soon` show in the list but have no page yet.

import type { ReactNode } from "react";
import { Placeholder } from "@/components/placeholder";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  readingTime: number;
  tags: string[];
  soon?: boolean;
  body?: () => ReactNode;
};

export const posts: Post[] = [
  {
    slug: "building-my-portfolio",
    title: "building my portfolio — why & how (short version)",
    excerpt:
      "why i made my portfolio, what tech powers it, and how full-stack automation makes it better than your average \"about me\" site.",
    date: "2025-09-30",
    readingTime: 5,
    tags: ["Portfolio", "Automation", "Next.js", "Full-stack"],
    body: BuildingMyPortfolio,
  },
  {
    slug: "notes-on-cotabby",
    title: "notes from building an on-device autocomplete",
    excerpt: "placeholder — a write-up on cotabby is on the way.",
    date: "2026-11-01",
    readingTime: 0,
    tags: ["Swift", "AI"],
    soon: true,
  },
  {
    slug: "v2",
    title: "portfolio v2: deleting everything",
    excerpt: "placeholder — why the new site is just a frontend.",
    date: "2026-11-09",
    readingTime: 0,
    tags: ["Design", "Next.js"],
    soon: true,
  },
];

export const publishedPosts = posts.filter((p) => !p.soon);

export function getPost(slug: string) {
  return publishedPosts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function BuildingMyPortfolio() {
  return (
    <>
      <Placeholder tone="slate" label="screenshot · portfolio home" className="aspect-[16/9]" />
      <p>
        i built my portfolio (
        <a href="https://github.com/akramj13/portfolio" target="_blank" rel="noreferrer">
          code here
        </a>
        ) because i’m lazy lol. i wanted a site that:
      </p>
      <ul>
        <li>
          <strong>never needs a full redeploy</strong>
        </li>
        <li>
          <strong>auto-updates with my latest projects &amp; experience</strong>
        </li>
        <li>
          <strong>keeps things fresh with zero extra work from me</strong>
        </li>
      </ul>
      <p>
        so i stitched together a little system: a set of{" "}
        <a href="https://playwright.dev/" target="_blank" rel="noreferrer">
          playwright
        </a>{" "}
        scripts that sync my linkedin (and other sources), then push updates right into my
        portfolio. now, whenever i tweak something on linkedin, it shows up in my “experience”
        section. it’s kind of magic.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Placeholder tone="ink" label="screenshot · admin" className="aspect-[4/3]" />
        <Placeholder tone="violet" label="screenshot · editor" className="aspect-[4/3]" />
      </div>
      <hr />
      <h2>tech &amp; structure (the 60-second tour)</h2>
      <p>what glues this all together?</p>
      <ul>
        <li>
          <strong>next.js (app router) + tailwind</strong> — frontend, fast &amp; flexible
        </li>
        <li>
          <strong>prisma + postgresql</strong> — data layer (snappy + typesafe)
        </li>
        <li>
          <strong>custom admin UI + markdown blog</strong> — write/publish from anywhere
        </li>
        <li>
          <strong>image/resume upload</strong> — with CDN &amp; caching
        </li>
        <li>
          <strong>deployment:</strong> docker, nginx, vps + cloudflare (hybrid, cheap, reliable)
        </li>
        <li>
          <strong>playwright scripting</strong> — for that sweet external sync
        </li>
      </ul>
      <p>
        so it’s not just a static site but a small full-stack app, wrapped in automation and a
        bit of duct tape.
      </p>
      <hr />
      <h2>what i love (&amp; the trade-offs)</h2>
      <p>
        the best bit? i <em>never</em> have to manually update my experience. but… it also means
        more moving parts: scripts, APIs, storage, error handling, and all the fun that comes
        with real infra. if the sync breaks, parts of the portfolio can look stale. worth it.
      </p>
      <p>
        i try to keep the design minimal, responsive, and clean — so the tech never distracts
        from the story.
      </p>
      <h2>wrap</h2>
      <p>
        this portfolio is a lazy-person’s dream — set it up once, let it mostly run itself. for
        me, the real joy is in the automation: letting tech do the busywork so i can focus on
        the fun stuff.
      </p>
      <hr />
      <p className="text-base text-muted">
        *(wanted to make a quick post behind the motivations of putting so much time into a
        portfolio site.)
        <br />
        **(i’m also just testing to make sure this feature of my site works lol.)
      </p>
    </>
  );
}
