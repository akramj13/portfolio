export const site = {
  name: "Akram Jamil",
  handle: "akramj13",
  url: "https://akramj.com",
  email: "hi@akramj.com",
  title: "Akram Jamil — software, ml & markets",
  description:
    "cs & finance double major at the university of waterloo. i build startups, hack on side projects, and mess around with ai.",
  since: 2024,
} as const;

export const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
] as const;

export const socials = {
  github: { label: "GitHub", href: "https://github.com/akramj13" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/akramjamil/" },
  x: { label: "X", href: "https://twitter.com/akramj_13" },
  email: { label: "Email", href: `mailto:${site.email}` },
} as const;
