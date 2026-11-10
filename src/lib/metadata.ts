import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Open Graph fields every page shares. Next replaces a parent's whole
 * `openGraph` object when a page sets its own, so pages spread this in rather
 * than lose the site name. Title and description are left out on purpose:
 * Next fills them, and the Twitter card's, from each page's own metadata.
 */
export const baseOpenGraph = {
  siteName: site.name,
  locale: "en_CA",
  type: "website",
} satisfies Metadata["openGraph"];
