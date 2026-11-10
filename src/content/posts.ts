import type { MDXContent } from "mdx/types";
import BuildingMyPortfolio, { metadata as buildingMyPortfolio } from "./writing/building-my-portfolio.mdx";

/**
 * Blog posts are MDX files in src/content/writing/, each exporting its
 * details as `metadata`. To add a post: create `<slug>.mdx`, put its images
 * in public/writing/<slug>/, and add one line to the list below.
 */
export type PostMeta = {
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2025-09-30". */
  date: string;
  readingTime: number;
  tags: string[];
  /** Shown on the writing page, e.g. "/writing/<slug>/cover.png". */
  cover?: string;
  /** Hidden from the site while true. */
  draft?: boolean;
};

export type Post = PostMeta & { slug: string; Body: MDXContent };

const all: Post[] = [
  { slug: "building-my-portfolio", ...buildingMyPortfolio, Body: BuildingMyPortfolio },
];

/** Published posts, newest first. */
export const publishedPosts = all
  .filter((p) => !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

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
