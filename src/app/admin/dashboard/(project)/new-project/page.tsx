"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/utils/page-layout";
import ProjectForm from "@/components/ProjectForm";

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

export default function NewProject() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/admin/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      // Redirect to dashboard on success
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard");
  };

  return (
    <PageLayout variant="wide" maxWidth="2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Add a new project to your portfolio.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Create Project"
          />
        </div>
      </div>
    </PageLayout>
  );
}
