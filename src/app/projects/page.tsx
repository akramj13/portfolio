"use client";
import React, { useState } from "react";
import PageLayout from "@/components/utils/page-layout";
import SearchBar from "@/components/SearchBar";
import ProjectCard from "@/components/ProjectCard";
import { BlurFade } from "@/components/ui/blur-fade";
import projectsData from "./projects.json";

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
            <BlurFade key={index} delay={0.25 + index * 0.05} inView>
              <ProjectCard project={project} />
            </BlurFade>
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
