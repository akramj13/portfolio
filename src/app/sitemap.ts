import type { MetadataRoute } from "next";
import { publishedPosts } from "@/content/posts";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** /sitemap.xml — every page, built from the same content the site renders. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/writing`, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...publishedPosts.map((post) => ({
      url: `${site.url}/writing/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
