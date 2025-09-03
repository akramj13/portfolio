"use client";
import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Calendar, Clock, Star } from "lucide-react";

type Project = {
  title: string;
  description: string;
  src: string;
  link: string;
  tags: string[];
};

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
            <Image
              src={project.src}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Key Features
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Modern, responsive design</li>
                  <li>Optimized performance</li>
                  <li>User-friendly interface</li>
                  <li>Cross-platform compatibility</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Project Timeline
                </h3>
                <p className="text-sm text-muted-foreground">
                  Development period: 2-3 months
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Development Time
                </h3>
                <p className="text-sm text-muted-foreground">
                  Approximately 200+ hours of development
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Project Highlights</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    This project showcases modern web development practices and
                    demonstrates proficiency in full-stack development.
                  </p>
                  <p>
                    Built with scalability and maintainability in mind,
                    following industry best practices and design patterns.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Challenges Overcome</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Performance optimization</li>
                  <li>Cross-browser compatibility</li>
                  <li>Responsive design implementation</li>
                  <li>State management complexity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button asChild className="flex-1">
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
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDetailsModal;
