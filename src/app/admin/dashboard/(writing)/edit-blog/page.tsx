"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLayout from "@/components/utils/page-layout";
import BlogUploadForm from "@/components/BlogUploadForm";
import { Blog, BlogInput } from "@/types";

interface BlogUploadFormData extends BlogInput {
  zipFile?: File;
}

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No blog slug provided");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await fetch(`/admin/api/blogs/${slug}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const blogData = await response.json();
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog for editing");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleSuccess = () => {
    router.push("/admin/dashboard/blogs");
  };

  const handleSubmit = async (data: BlogUploadFormData) => {
    if (!blog) return;

    try {
      console.log("Updating blog data:", data);

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
      formData.append("editMode", "true");
      formData.append("existingBlogId", blog.id.toString());

      const response = await fetch("/admin/api/blogs/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update blog");
      }

      console.log("Blog updated successfully");
      handleSuccess();
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(
        `Failed to update blog: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/blogs");
  };

  if (loading) {
    return (
      <PageLayout variant="narrow" maxWidth="2xl">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !blog) {
    return (
      <PageLayout variant="narrow" maxWidth="2xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{error || "Blog not found"}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="narrow" maxWidth="2xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-2">
            Update &ldquo;{blog.title}&rdquo;. You can edit just the metadata or
            upload a new zip file to replace the content.
          </p>
        </div>

        <BlogUploadForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          editMode={true}
          existingBlog={blog}
        />
      </div>
    </PageLayout>
  );
}

export default function EditBlogPage() {
  return (
    <Suspense
      fallback={
        <PageLayout variant="narrow" maxWidth="2xl">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </PageLayout>
      }
    >
      <EditBlogContent />
    </Suspense>
  );
}
