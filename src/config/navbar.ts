import { Icons } from "@/config";

export const navdata = {
  navbar: [
    { href: "/", icon: Icons.home, label: "home" },
    { href: "/projects", icon: Icons.projects, label: "projects" },
    { href: "/writing", icon: Icons.writing, label: "writing" },
    { href: "/admin/dashboard", icon: Icons.dashboard, label: "dashboard" },
  ],
  contact: {
    social: {
      github: {
        name: "github",
        url: "https://github.com/akramj13",
        icon: Icons.github,
      },
      linkedIn: {
        name: "linkedIn",
        url: "https://www.linkedin.com/in/akramjamil/",
        icon: Icons.linkedin,
      },
      X: {
        name: "twitter",
        url: "https://twitter.com/akramj_13",
        icon: Icons.x,
      },
      email: {
        name: "email",
        url: "mailto:hi@akramj.com",
        icon: Icons.email,
      },
    },
  },
};
