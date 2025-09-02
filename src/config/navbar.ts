import { Icons } from "@/config";

export const navdata = {
  navbar: [
    { href: "/", icon: Icons.home, label: "home" },
    { href: "/writing", icon: Icons.writing, label: "writing" },
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
        name: "X",
        url: "https://twitter.com/akramj_13",
        icon: Icons.x,
      },
      email: {
        name: "email",
        url: "mailto:akram.jamil@uwaterloo.ca",
        icon: Icons.email,
      },
    },
  },
};
