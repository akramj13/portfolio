"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MagicCard } from "./ui/magic-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Info } from "lucide-react";
import ProjectDetailsModal from "./ProjectDetailsModal";

type Project = {
  title: string;
  description: string;
  src: string; // Video or Image
  link: string;
  tags: string[];
};

function ProjectCard({ project }: { project: Project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <MagicCard className="p-6 h-full flex flex-col rounded-3xl transition-all duration-300 hover:scale-[1.02] group">
        <div className="flex flex-col h-full">
          {/* Project Image */}
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
            <Image
              src={project.src}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Project Content */}
          <div className="flex flex-col flex-grow">
            <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            <p className="text-muted-foreground mb-4 flex-grow leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Details Button */}
              <Button
                variant="outline"
                className="w-full transition-all cursor-pointer"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Info className="w-4 h-4 mr-2" />
                View Details
              </Button>

              {/* Project Link */}
              <Button
                asChild
                className="w-full group-hover:bg-primary/90 transition-all"
                size="sm"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  View Project
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </MagicCard>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default ProjectCard;
