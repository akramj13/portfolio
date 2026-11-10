"use client";
import React, { useState } from "react";
import PageLayout from "@/components/utils/page-layout";
import SearchBar from "@/components/SearchBar";
import ProjectCard from "@/components/ProjectCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { Project } from "@/types";

interface ProjectsClientProps {
  projects: Project[];
}

function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on search term
  const filteredProjects = projects.filter(
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
            articles={projects.map((project) => ({
              title: project.title,
              excerpt: project.description,
              tags: project.tags,
            }))}
          />
        </div>

        {/* Projects List */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">nothing so far.</p>
              <p className="text-muted-foreground mt-2">
                check back later for projects and builds.
              </p>
            </div>
          ) : filteredProjects.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects found matching &quot;{searchTerm}&quot;
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Try searching for different keywords or technologies
              </p>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <BlurFade
                key={project.id || index}
                delay={0.25 + index * 0.05}
                inView
              >
                <ProjectCard project={project} />
              </BlurFade>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default ProjectsClient;