"use client";
import React, { useState } from "react";
import PageLayout from "@/components/utils/page-layout";
import SearchBar from "@/components/SearchBar";
import ProjectCard from "@/components/ProjectCard";

// Dummy project data
const projectsData = [
  {
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform with user authentication, payment processing, and admin dashboard. Built with modern web technologies for optimal performance and user experience.",
    src: "/projects/ecommerce.svg",
    link: "https://github.com/akramj13/ecommerce-platform",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features. Perfect for agile development teams.",
    src: "/projects/task-manager.svg",
    link: "https://github.com/akramj13/task-manager",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "Material-UI"],
  },
  {
    title: "Weather Dashboard",
    description:
      "An interactive weather dashboard that provides real-time weather data, forecasts, and location-based weather alerts. Features beautiful data visualizations and responsive design.",
    src: "/projects/weather-app.svg",
    link: "https://github.com/akramj13/weather-dashboard",
    tags: ["Vue.js", "OpenWeather API", "Chart.js", "Vuetify", "PWA"],
  },
  {
    title: "Social Media App",
    description:
      "A mobile-first social media application with photo sharing, real-time messaging, and social features. Built with React Native for cross-platform compatibility.",
    src: "/projects/social-app.svg",
    link: "https://github.com/akramj13/social-media-app",
    tags: ["React Native", "Firebase", "Redux", "Expo", "AsyncStorage"],
  },
  {
    title: "AI Chat Bot",
    description:
      "An intelligent chatbot powered by AI that can answer questions, provide recommendations, and assist with various tasks. Features natural language processing and machine learning.",
    src: "/projects/ai-chatbot.svg",
    link: "https://github.com/akramj13/ai-chatbot",
    tags: ["Python", "OpenAI", "FastAPI", "Docker", "Redis"],
  },
  {
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects and skills. Features smooth animations, dark/light mode, and optimized performance for excellent user experience.",
    src: "/projects/portfolio.svg",
    link: "https://github.com/akramj13/portfolio",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Vercel"],
  },
];

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on search term
  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <PageLayout variant="wide" maxWidth="xl">
      <div className="text-center space-y-4">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          projects
        </h1>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search projects..."
            articles={projectsData.map((project) => ({
              title: project.title,
              excerpt: project.description,
              tags: project.tags,
            }))}
          />
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found matching &quot;{searchTerm}&quot;
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Try searching for different keywords or technologies
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Projects;
