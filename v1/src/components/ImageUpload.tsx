"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  projectId?: string;
  currentImageSrc?: string;
  onImageSelect?: (file: File | null) => void;
}

export default function ImageUpload({
  projectId,
  currentImageSrc,
  onImageSelect,
}: ImageUploadProps) {
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

    // Notify parent component of file selection
    onImageSelect?.(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect?.(null);
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

      {!projectId && !onImageSelect && (
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
          !projectId && !onImageSelect
            ? "border-muted bg-muted/20 opacity-50"
            : isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : error
            ? "border-red-300 bg-red-50/50"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        } ${!projectId && !onImageSelect ? "pointer-events-none" : ""}`}
        onDragOver={projectId || onImageSelect ? handleDragOver : undefined}
        onDragLeave={projectId || onImageSelect ? handleDragLeave : undefined}
        onDrop={projectId || onImageSelect ? handleDrop : undefined}
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
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={!projectId && !onImageSelect}
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace Image
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearImage}
                disabled={!projectId && !onImageSelect}
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
                {!projectId && !onImageSelect
                  ? "Image uploads will be available after saving"
                  : isDragOver
                  ? "Drop your image here"
                  : "Upload a project image"}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {!projectId && !onImageSelect
                  ? "Save the project first to enable image uploads"
                  : "Drag and drop an image, or click to browse"}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!projectId && !onImageSelect}
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
