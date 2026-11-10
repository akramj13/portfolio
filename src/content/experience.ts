// Roles live in src/config/roles.json so they can be edited without touching code.
//
// Logos load from logo.dev by company name, so a new role only needs its
// `company`. If the name matches the wrong brand, set `logo: { domain }` to
// pin it; set `logo: false` to skip the lookup (Stealth Startup uses this: its
// name matches an unrelated brand, and a stealth company has no logo anyway).
// While a logo loads, or if there isn't one, the row shows a tile built from
// `monogram` + `tone`.

import type { Tone } from "@/components/placeholder";
import rolesData from "@/config/roles.json";
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

// Edit roles in src/config/roles.json; they're listed newest first.
export const roles = rolesData as Role[];

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
