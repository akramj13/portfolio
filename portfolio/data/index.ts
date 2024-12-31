import { link } from "fs";

export const navItems = [
  { name: "about", link: "#about" },
  {name: "technologies", link: "#technologies"},
  { name: "projects", link: "#projects" },
  { name: "contact", link: "#contact" },
  { name: "resume", target: '_blank', link: "/Akram_Jamil_CV.pdf" },
];

export const gridItems = [
  {
    id: 1,
    title: "hey! my name is akram and i'm a software developer",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/pc.jpg",
    spareImg: "",
  },
  {
    id: 2,
    title: "im building software to connect the world",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "my tech stack",
    description: "i constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "currently trying ai/ml applications in fintech",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "currently double majoring in computer science and finance",
    description: "who am I...",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/uwlogo.png",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "send me an email so we can connect!",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "AlzGuard - Alzheimer's Detection",
    quickDes: "AlzGuard",
    des: "Engineered the front-end and AI model for an Alzheimer’s detection tool for physicians, which won a $1,000 prize at YIC",
    img: "/alzguard.png",
    tech: "React, Python, Tensorflow, JavaScript, CSS",
    link: "https://github.com/sahilalamgir/AlzGuard",
  },
  {
    id: 2,
    title: "RoboAdvisor - Stock Market Prediction",
    quickDes: "RoboAdvisor",
    des: "Developed a tool which builds a comprehensive portfolio to beat the S&P500 returns using modern portfolio theory and stochastic optimization.",
    img: "/stockadvisor.png",
    tech: "Jupyter Notebook, Python, pandas, yfinance, NumPy, matplotlib",
    link: "https://github.com/akramj13/Stock-Robo-Advisor",
  },
  {
    id: 3,
    title: "Personal Portfolio - Akram's Space",
    quickDes: "Portfolio",
    des: "Designed and developed a personal portfolio website to showcase my work and projects. Actually, you're on it right now!",
    img: "/portfolio.png",
    tech: "React, TypeScript, Tailwind CSS, Three.js, Vercel, Framer Motion, Next.js",
    link: "/", // change to github link
  }
];

export const workExperience = [
  {
    id: 1,
    title: "Software Developer - Stealth Startup",
    desc: "Assisted in building the front-end in React, Next.js and TailwindCSS, of a stealth startup, which is currently in the pre-seed stage.",
    className: "md:col-span-2",
    thumbnail: "/stealth.png",
  },
  {
    id: 2,
    title: "Telecommunications Consultant Intern - Canada Cartage",
    desc: "Managed server-side telecommunications systems (with over 5000+ devices), optimizing network performance and ensuring seamless communication across multiple departments.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/cartage.png",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/akramj13"
  },
  {
    id: 2,
    img: "/twit.svg",
    link: "https://x.com/akrxmj"
  },
  {
    id: 3,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/akramjamil/"
  },
];

export const languages = [
  {
    name: "JavaScript",
    img: "/javascript.png"
  },
  {
    name: "TypeScript",
    img: "/typescript.png"
  },
  {
    name: "C",
    img: "/c.png",
  },
  {
    name: "C++",
    img: "/cpp.png",
  },
  {
    name: "Python",
    img: "/python.png"
  },
  {
    name: "Java",
    img: "/java.png"
  },
  {
    name: "Dart",
    img: "/dart.png"
  },
  {
    name: "Racket",
    img: "/racket.png"
  },
  {
    name: "HTML5",
    img: "/html.png"
  },
  {
    name: "CSS3",
    img: "/css.png"
  }
]

export const frameworks = [
  {
    name: "React", 
    img: "/react.png"
  },
  {
    name: "Tailwind CSS",
    img: "/tailwind.png"
  },
  {
    name: "Next.js",
    img: "/nextjs.svg"
  },
  {
    name: "Node.js",
    img: "/node.png"
  },
  {
    name: "Flutter",
    img: "/flutter.png"
  },
  {
    name: "Tensorflow",
    img: "/tensorflow.png"
  },
  {
    name: "NumPy",
    img: "/numpy.svg"
  },
  {
    name: "pandas",
    img: "/pandas.png"
  },
]

export const tech = [
  {
    name: "GitHub",
    img: "/git.svg"
  },
  {
    name: "Vercel",
    img: "/vercel.svg"
  },
  {
    name: "Figma",
    img: "/figma.png"
  },
  {
    name: "Blender",
    img: "/blender.png"
  },
  {
    name: "Three.js",
    img: "/three.svg"
  },
  {
    name: "Jupyter Notebook",
    img: "/jupyter.png"
  },
  {
    name: "Xcode",
    img: "/xcode.png"
  },
  {
    name: "Android Studio",
    img: "/android.png"
  },
]