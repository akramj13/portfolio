"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, FileText } from "lucide-react";
import { BlogInput } from "@/types";

interface BlogUploadFormData extends BlogInput {
  zipFile?: File;
}

interface BlogUploadFormProps {
  onSubmit: (data: BlogUploadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  editMode?: boolean;
  existingBlog?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    readingTime: number;
    tags: string[];
    published: boolean;
  };
}

export default function BlogUploadForm({
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText,
  editMode = false,
  existingBlog,
}: BlogUploadFormProps) {
  const [formData, setFormData] = useState<BlogUploadFormData>(() => ({
    title: existingBlog?.title || "",
    slug: existingBlog?.slug || "",
    excerpt: existingBlog?.excerpt || "",
    readingTime: existingBlog?.readingTime || 5,
    tags: existingBlog?.tags || [],
    published: existingBlog?.published || false,
    zipFile: undefined,
  }));

  const [newTag, setNewTag] = useState("");
  const [slugManuallySet, setSlugManuallySet] = useState(!!existingBlog?.slug);
  const [dragOver, setDragOver] = useState(false);

  const defaultSubmitText = editMode ? "Update Blog" : "Upload Blog";
  const buttonText = submitButtonText || defaultSubmitText;

  // Auto-generate slug from title if not manually set
  useEffect(() => {
    if (!slugManuallySet && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, slugManuallySet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In create mode, zip file is required. In edit mode, it's optional.
    if (!editMode && !formData.zipFile) {
      alert("Please select a zip file to upload");
      return;
    }

    await onSubmit(formData);
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".zip")) {
      alert("Please select a .zip file");
      return;
    }
    setFormData((prev) => ({ ...prev, zipFile: file }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find((file) => file.name.endsWith(".zip"));

    if (zipFile) {
      handleFileSelect(zipFile);
    } else {
      alert("Please drop a .zip file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Zip File Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Zip File {editMode ? "(Optional)" : "*"}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {formData.zipFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{formData.zipFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(formData.zipFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, zipFile: undefined }))
                }
              >
                Remove
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop your zip file here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {editMode
                  ? "Upload a new zip file to update the blog content and images. Leave empty to only update metadata."
                  : "Zip should contain a main.md file and any images referenced in the markdown"}
              </p>
              <input
                type="file"
                accept=".zip"
                className="hidden"
                id="zip-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("zip-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {editMode
            ? "Optional: Upload a zip file only if you want to update the blog content or images"
            : "The zip file should contain a main.md file with your blog content and any referenced images"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter blog post title"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Slug *
          </label>
          <input
            id="slug"
            type="text"
            required
            value={formData.slug}
            onChange={(e) => {
              setSlugManuallySet(true);
              setFormData((prev) => ({ ...prev, slug: e.target.value }));
            }}
            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="url-friendly-slug"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL slug for the blog post (auto-generated from title)
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt *
        </label>
        <textarea
          id="excerpt"
          required
          rows={3}
          value={formData.excerpt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Brief description of the blog post"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This will be shown in the blog post preview
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeTag(index);
                }}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTag)}
            className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Add a tag"
          />
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <input
            id="published"
            type="checkbox"
            checked={formData.published}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, published: e.target.checked }))
            }
            className="rounded border-border"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Publish immediately
          </label>
        </div>

        <div>
          <label
            htmlFor="readingTime"
            className="block text-sm font-medium mb-2"
          >
            Reading Time (minutes)
          </label>
          <input
            id="readingTime"
            type="number"
            min="1"
            value={formData.readingTime}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                readingTime: parseInt(e.target.value) || 1,
              }))
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Uploading..." : buttonText}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
