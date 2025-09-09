"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import PageLayout from "@/components/utils/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  time: string;
  sortOrder: number;
}

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/admin/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/admin/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    // Reorder projects locally first
    const reorderedProjects = Array.from(projects);
    const [removed] = reorderedProjects.splice(sourceIndex, 1);
    reorderedProjects.splice(destinationIndex, 0, removed);

    setProjects(reorderedProjects);
    setReordering(true);

    try {
      // Send the new order to the server
      const projectIds = reorderedProjects.map((project) => project.id);
      const response = await fetch("/admin/api/projects/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder projects");
      }
    } catch (err) {
      // Revert the local change if the server update failed
      fetchProjects();
      setError(
        err instanceof Error ? err.message : "Failed to reorder projects"
      );
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <PageLayout variant="wide" maxWidth="2xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="wide" maxWidth="2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Projects
            </h1>
            <p className="text-muted-foreground">
              Edit, delete, or create new projects for your portfolio.
              {reordering && (
                <span className="text-primary font-medium"> Reordering...</span>
              )}
            </p>
          </div>
          <Button onClick={() => router.push("/admin/dashboard/new-project")}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground text-lg">No projects found</p>
            <p className="text-muted-foreground mt-2">
              Create your first project to get started.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/admin/dashboard/new-project")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid gap-4"
                >
                  {projects.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold mb-2">
                                  {project.title}
                                </h3>
                                <p className="text-muted-foreground mb-3 line-clamp-2">
                                  {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {project.tags.slice(0, 5).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {project.tags.length > 5 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{project.tags.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {project.time && (
                                    <span>Duration: {project.time}</span>
                                  )}
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    View Project →
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/edit-project?id=${project.id}`
                                  )
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                                disabled={deletingId === project.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </PageLayout>
  );
}
