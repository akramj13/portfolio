"use client";
import React, { useState } from "react";
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
import { ExternalLink, Clock, Star } from "lucide-react";
import { Project } from "@/types";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
          <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-lg overflow-hidden bg-muted">
            {/* Loading Skeleton with Shimmer Animation */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
                </div>
                {/* Pulsing circles decoration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-muted-foreground/30 animate-pulse" />
                    <div
                      className="absolute inset-4 rounded-full bg-muted-foreground/10 animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <Image
              src={project.src || "/placeholder.svg"}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className={`object-contain transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />

            {/* Error State */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center text-muted-foreground">
                  <svg
                    className="w-16 h-16 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Image unavailable</p>
                </div>
              </div>
            )}
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
                <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                  {project.features.map((feature, index) => (
                    <li
                      key={index}
                      className="relative before:content-['•'] before:absolute before:-left-4 before:text-primary"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Development Time
                </h3>
                <p className="text-sm text-muted-foreground">{project.time}</p>
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
                <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                  {project.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="relative before:content-['•'] before:absolute before:-left-4 before:text-primary"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Challenges Overcome</h3>
                <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="relative before:content-['•'] before:absolute before:-left-4 before:text-primary"
                    >
                      {challenge}
                    </li>
                  ))}
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
