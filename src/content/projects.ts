// Projects live in src/config/projects.json so they can be edited without
// touching code. Screenshots are placeholders for now; set `image` when real
// art exists. Icons are image files, usually in public/projects/.

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
   * App icon: an image in /public (e.g. "/projects/cotabby.svg") or a full URL.
   * SVG is best; PNG/WebP at 128px+ also work. Leave it out for a placeholder.
   */
  icon?: string;
  badge?: string;
  image?: string;
};

// Edit projects in src/config/projects.json; they show in that order.
export const projects = projectsData as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function linkLabel(link: string) {
  return link.includes("github.com") ? "View on GitHub" : "Visit site";
}
