// Projects live in src/config/projects.json so they can be edited without
// touching code. Each project's files live in public/projects/<slug>/:
// icon.svg (app icon) and screenshot.png (shown on cards and its page).

import type { Tone } from "@/components/placeholder";
import projectsData from "@/config/projects.json";

export type ProjectIcon =
  | "keyboard"
  | "video"
  | "brain"
  | "gamepad"
  | "stethoscope"
  | "chart"
  | "layers"
  | "mic"
  | "trending";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  tags: string[];
  features: string[];
  highlights: string[];
  challenges: string[];
  link: string;
  tone: Tone;
  /**
   * App icon: an image in /public (e.g. "/projects/cotabby/icon.svg") or a full URL.
   * SVG is best; PNG/WebP at 128px+ also work. Leave it out for a placeholder.
   */
  icon?: string;
  badge?: string;
  /**
   * Screenshot, e.g. "/projects/cotabby/screenshot.png". Ideally 16:10 and
   * ~2000px wide; it's cropped from the top. Leave it out for placeholder art.
   */
  image?: string;
  /** Which part of the screenshot to keep when it's cropped (CSS object-position). Defaults to "top". */
  imagePosition?: string;
};

// Edit projects in src/config/projects.json; they show in that order.
export const projects = projectsData as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function linkLabel(link: string) {
  return link.includes("github.com") ? "View on GitHub" : "Visit site";
}
