"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/utils/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, EyeOff, Edit, Globe } from "lucide-react";
import { Blog } from "@/types";

export default function BlogsManagement() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/admin/api/blogs", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/admin/api/blogs?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Remove from local state
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/admin/api/blogs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          published: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog status");
      }

      // Update local state
      setBlogs(
        blogs.map((blog) =>
          blog.id === id ? { ...blog, published: !currentStatus } : blog
        )
      );
    } catch (error) {
      console.error("Error updating blog status:", error);
      alert("Failed to update blog status");
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/admin/dashboard/edit-blog?slug=${slug}`);
  };

  const handleNewBlog = () => {
    router.push("/admin/dashboard/new-blog");
  };

  if (loading) {
    return (
      <PageLayout variant="narrow" maxWidth="2xl">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout variant="narrow" maxWidth="2xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="default" maxWidth="2xl">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage Blogs</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all blog posts
            </p>
          </div>

          <Button onClick={handleNewBlog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Blog
          </Button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No blogs found</p>
            <Button onClick={handleNewBlog} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Blog
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header with status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {blog.excerpt}
                    </p>
                  </div>
                  <div className="ml-3">
                    {blog.published ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-600"
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Meta information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                    <span>{blog.readingTime} min read</span>
                  </div>

                  <div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {blog.slug}
                    </code>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  {/* Publish/Unpublish button */}
                  <Button
                    variant={blog.published ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleTogglePublish(blog.id, blog.published)}
                    className="flex-1"
                  >
                    {blog.published ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-1" />
                        Publish
                      </>
                    )}
                  </Button>

                  {/* Edit button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(blog.slug)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* View button (only for published blogs) */}
                  {blog.published && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/writing/${blog.slug}`, "_blank")
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Delete button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog.id, blog.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
