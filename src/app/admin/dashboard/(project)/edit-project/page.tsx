"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLayout from "@/components/utils/page-layout";
import ProjectForm from "@/components/ProjectForm";

interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  time: string;
  tags: string[];
  highlights: string[];
  challenges: string[];
  link: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  features: string[];
  time: string;
  tags: string[];
  highlights: string[];
  challenges: string[];
  link: string;
}

export default function EditProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError("No project ID provided");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`/admin/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (data: ProjectFormData) => {
    if (!projectId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/admin/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      // Redirect to projects management page on success
      router.push("/admin/dashboard/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/projects");
  };

  if (loading) {
    return (
      <PageLayout variant="wide" maxWidth="2xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </PageLayout>
    );
  }

  if (error && !project) {
    return (
      <PageLayout variant="wide" maxWidth="2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">Update project information.</p>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="wide" maxWidth="2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Update information for &quot;{project?.title}&quot;
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {project && (
          <div className="bg-card border border-border rounded-lg p-6">
            <ProjectForm
              initialData={project}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              submitButtonText="Update Project"
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
