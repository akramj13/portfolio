"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  projectId?: string;
  currentImageSrc?: string;
  onImageUpdate?: () => void;
}

export default function ImageUpload({
  projectId,
  currentImageSrc,
  onImageUpdate,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, or SVG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload if we have a project ID
    if (projectId) {
      uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    if (!projectId) return;

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(`/admin/api/projects/${projectId}/image`, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      onImageUpdate?.();
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      // Reset preview on error
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const displaySrc = preview || currentImageSrc;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Project Image</label>

      {!projectId && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm">
          Note: Save the project first to enable image uploads.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          !projectId
            ? "border-muted bg-muted/20 opacity-50"
            : isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : error
            ? "border-red-300 bg-red-50/50"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        } ${uploading || !projectId ? "pointer-events-none" : ""}`}
        onDragOver={projectId ? handleDragOver : undefined}
        onDragLeave={projectId ? handleDragLeave : undefined}
        onDrop={projectId ? handleDrop : undefined}
      >
        {displaySrc ? (
          <div className="relative">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={displaySrc}
                alt="Project preview"
                fill
                className="object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-sm font-medium">
                    Uploading...
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !projectId}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Replace Image"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearImage}
                disabled={uploading || !projectId}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon
              className={`w-12 h-12 mx-auto transition-colors ${
                isDragOver ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div>
              <p
                className={`mb-2 transition-colors ${
                  isDragOver ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {!projectId
                  ? "Image uploads will be available after saving"
                  : isDragOver
                  ? "Drop your image here"
                  : "Upload a project image"}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {!projectId
                  ? "Save the project first to enable image uploads"
                  : "Drag and drop an image, or click to browse"}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !projectId}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Recommended: 16:9 aspect ratio, max 5MB. Supports JPG, PNG, WebP, and
        SVG.
      </p>
    </div>
  );
}
