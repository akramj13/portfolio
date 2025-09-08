"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import ImageUpload from "./ImageUpload";

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

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData & { id?: string; src?: string }>;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export default function ProjectForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Save Project",
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData.title || "",
    description: initialData.description || "",
    features: initialData.features || [],
    time: initialData.time || "",
    tags: initialData.tags || [],
    highlights: initialData.highlights || [],
    challenges: initialData.challenges || [],
    link: initialData.link || "",
  });

  const [newFeature, setNewFeature] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newChallenge, setNewChallenge] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addItem = (
    type: "features" | "tags" | "highlights" | "challenges",
    value: string,
    setValue: (value: string) => void
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
      setValue("");
    }
  };

  const removeItem = (
    type: "features" | "tags" | "highlights" | "challenges",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <ImageUpload
        projectId={initialData?.id}
        currentImageSrc={initialData?.src}
      />

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Project Title *
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
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium mb-2">
            Development Time
          </label>
          <input
            id="time"
            type="text"
            value={formData.time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, time: e.target.value }))
            }
            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., 2 months"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description *
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Describe your project"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium mb-2">
          Project Link *
        </label>
        <input
          id="link"
          type="url"
          required
          value={formData.link}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, link: e.target.value }))
          }
          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="https://github.com/username/project"
        />
      </div>

      {/* Dynamic Arrays */}
      {[
        {
          key: "tags" as const,
          label: "Technologies/Tags",
          value: newTag,
          setValue: setNewTag,
          useBadges: true,
        },
        {
          key: "features" as const,
          label: "Key Features",
          value: newFeature,
          setValue: setNewFeature,
          useBadges: false,
        },
        {
          key: "highlights" as const,
          label: "Project Highlights",
          value: newHighlight,
          setValue: setNewHighlight,
          useBadges: false,
        },
        {
          key: "challenges" as const,
          label: "Challenges Overcome",
          value: newChallenge,
          setValue: setNewChallenge,
          useBadges: false,
        },
      ].map(({ key, label, value, setValue, useBadges }) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-2">{label}</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={`Add ${label.toLowerCase()}`}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem(key, value, setValue);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addItem(key, value, setValue)}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Conditional rendering based on useBadges */}
          {useBadges ? (
            <div className="flex flex-wrap gap-2">
              {formData[key].map((item: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeItem(key, index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {formData[key].map((item: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-muted/50 rounded-md border"
                >
                  <div className="flex-1 text-sm leading-relaxed">{item}</div>
                  <button
                    type="button"
                    onClick={() => removeItem(key, index)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 mt-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitButtonText}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
