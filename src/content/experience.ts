// Hardcoded from the current akramj.com experience section.
//
// Logos load from logo.dev by company name, so a new role only needs its
// `company`. If the name matches the wrong brand, set `logo: { domain }` to
// pin it; set `logo: false` to skip the lookup. While a logo loads, or if
// there isn't one, the row shows a tile built from `monogram` + `tone`.

import type { Tone } from "@/components/placeholder";
import type { LogoSource } from "@/lib/logo-dev";

export type Role = {
  title: string;
  company: string;
  monogram: string;
  tone: Tone;
  start: string;
  end: string;
  location?: string;
  mode?: "Remote" | "Hybrid" | "On-site";
  /** Override the logo lookup (defaults to `{ name: company }`), or `false` for none. */
  logo?: LogoSource | false;
};

/** Where a role's logo comes from: its override, or a lookup by company name. */
export function roleLogo(role: Role): LogoSource | false {
  return role.logo ?? { name: role.company };
}

export const roles: Role[] = [
  {
    title: "Software & ML Engineer",
    company: "Illuminex AI",
    monogram: "Ix",
    tone: "violet",
    start: "Jan 2026",
    end: "Present",
    location: "Waterloo, ON",
    mode: "Remote",
  },
  {
    title: "Software Engineer Intern",
    company: "siift.ai",
    monogram: "si",
    tone: "blue",
    start: "Sep 2025",
    end: "Dec 2025",
    location: "Vancouver, BC",
    mode: "Remote",
  },
  {
    title: "Full Stack Developer",
    company: "Wellington-Dufferin-Guelph Public Health",
    monogram: "WD",
    tone: "green",
    start: "May 2025",
    end: "Aug 2025",
    location: "Guelph, ON",
    mode: "Hybrid",
  },
  {
    title: "Software Engineer Intern",
    company: "Vöxtur Capital",
    monogram: "Vö",
    tone: "ink",
    start: "Jan 2025",
    end: "Apr 2025",
    location: "Miami, FL",
    mode: "Remote",
  },
  {
    title: "Software Engineer Intern",
    company: "Agile Creative Labs Inc.",
    monogram: "AC",
    tone: "orange",
    start: "Sep 2024",
    end: "Dec 2024",
    location: "Ottawa, ON",
    mode: "Remote",
  },
  {
    title: "Software Engineer",
    company: "Stealth Startup",
    monogram: "St",
    tone: "slate",
    // A name lookup would match an unrelated brand; stealth means no logo anyway.
    logo: false,
    start: "Jul 2024",
    end: "Oct 2024",
    location: "Toronto, ON",
    mode: "Remote",
  },
  {
    title: "Information Technology Consultant",
    company: "Canada Cartage",
    monogram: "CC",
    tone: "red",
    start: "Jun 2024",
    end: "Sep 2024",
  },
  {
    title: "Teaching Assistant",
    company: "Kumon Canada",
    monogram: "Ku",
    tone: "sky",
    start: "Sep 2020",
    end: "Jun 2024",
    location: "Brampton, ON",
    mode: "Hybrid",
  },
];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Jan 2026" → "01/26", "Present" → "now". Used where space is tight. */
export function shortDate(value: string) {
  if (value.toLowerCase() === "present") return "now";
  const [month, year] = value.split(" ");
  const m = MONTHS.indexOf(month.slice(0, 3).toLowerCase()) + 1;
  return m > 0 && year ? `${String(m).padStart(2, "0")}/${year.slice(-2)}` : value;
}

export const education = {
  degree: "Bachelor of Computer Science & Financial Management",
  school: "University of Waterloo",
  start: "Sept 2024",
  end: "Present",
  location: "Waterloo, ON",
};
