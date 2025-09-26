export type Experience = {
  image: string;
  title: string;
  company: string;
  employment_type: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
};

export type Project = {
  id?: string; // Optional for new projects
  title: string;
  description: string;
  src?: string | null; // Updated to match Prisma schema (string | null)
  features: string[];
  time: string;
  tags: string[];
  highlights: string[];
  challenges: string[];
  link: string;
};
