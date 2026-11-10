"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/utils/page-layout";
import BlogUploadForm from "@/components/BlogUploadForm";
import { BlogInput } from "@/types";

interface BlogUploadFormData extends BlogInput {
  zipFile?: File;
}

export default function NewBlog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BlogUploadFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting blog data:", data);

      // Create FormData for file upload
      const formData = new FormData();

      if (data.zipFile) {
        formData.append("zipFile", data.zipFile);
      }

      // Add blog metadata
      const blogData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        readingTime: data.readingTime,
        tags: data.tags,
        published: data.published,
      };

      formData.append("blogData", JSON.stringify(blogData));
      formData.append("editMode", "false");

      const response = await fetch("/admin/api/blogs/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to upload blog");
      }

      const result = await response.json();
      console.log("Success result:", result);

      // Redirect to blogs list or dashboard
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error uploading blog:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard");
  };

  return (
    <PageLayout variant="narrow" maxWidth="2xl">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Upload New Blog</h1>
            <p className="text-muted-foreground mt-2">
              Upload a zip file containing markdown content and images
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            <p className="font-medium">Error uploading blog:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <BlogUploadForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Upload Blog"
          />
        </div>
      </div>
    </PageLayout>
  );
}
