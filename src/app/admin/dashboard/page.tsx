"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/utils/page-layout";
import LogoutButton from "@/components/LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Plus,
  Edit,
  Trash,
  RefreshCw,
  FileText,
  Folder,
  Upload,
} from "lucide-react";

function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [stats, setStats] = useState({ projects: "...", blogPosts: "..." });
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadMessage, setResumeUploadMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/admin/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const handleRefreshLinkedIn = async () => {
    setIsRefreshing(true);
    setRefreshMessage("");

    try {
      const response = await fetch("/admin/api/refresh-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.ok) {
        setRefreshMessage("LinkedIn experience data refreshed successfully!");
      } else {
        setRefreshMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setRefreshMessage("Failed to refresh LinkedIn data");
      console.error("Error refreshing LinkedIn cache:", error);
    } finally {
      setIsRefreshing(false);
      // Clear message after 5 seconds
      setTimeout(() => setRefreshMessage(""), 5000);
    }
  };

  const handleNewBlogPost = () => {
    window.location.href = "/admin/dashboard/new-blog";
  };

  const handleEditBlogPost = () => {
    window.location.href = "/admin/dashboard/blogs";
  };

  const handleDeleteBlogPost = () => {
    window.location.href = "/admin/dashboard/blogs";
  };

  const handleNewProject = () => {
    window.location.href = "/admin/dashboard/new-project";
  };

  const handleEditProject = () => {
    window.location.href = "/admin/dashboard/projects";
  };

  const handleDeleteProject = () => {
    window.location.href = "/admin/dashboard/projects";
  };

  const handleResumeUpload = async (file: File) => {
    setIsUploadingResume(true);
    setResumeUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/admin/api/resume/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setResumeUploadMessage("Resume uploaded successfully!");
      } else {
        setResumeUploadMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setResumeUploadMessage("Failed to upload resume");
      console.error("Error uploading resume:", error);
    } finally {
      setIsUploadingResume(false);
      // Clear message after 5 seconds
      setTimeout(() => setResumeUploadMessage(""), 5000);
    }
  };

  const triggerFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleResumeUpload(file);
      }
    };
    input.click();
  };

  return (
    <PageLayout variant="wide" maxWidth="full">
      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your portfolio content and settings.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LogoutButton />
            {(refreshMessage || resumeUploadMessage) && (
              <div className="space-y-2">
                {refreshMessage && (
                  <div
                    className={`px-4 py-2 rounded-md text-sm ${
                      refreshMessage.includes("Error")
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {refreshMessage}
                  </div>
                )}
                {resumeUploadMessage && (
                  <div
                    className={`px-4 py-2 rounded-md text-sm ${
                      resumeUploadMessage.includes("Error")
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {resumeUploadMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <p className="text-2xl font-bold">{stats.projects}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">📁</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showcase projects
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Blog Posts
                </p>
                <p className="text-2xl font-bold">{stats.blogPosts}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">📝</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Published articles
            </p>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleRefreshLinkedIn}
                disabled={isRefreshing}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium flex items-center gap-2">
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing..." : "Update Experience Section"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Fetch latest LinkedIn data
                </div>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                    <div className="font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Blog Posts
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manage blog content
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleNewBlogPost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditBlogPost}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteBlogPost}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                    <div className="font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        Projects
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manage portfolio projects
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleNewProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditProject}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteProject}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                    <div className="font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Configure Resume
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Upload or view your resume
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      if (!isUploadingResume) triggerFileUpload();
                    }}
                    disabled={isUploadingResume}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingResume ? "Uploading..." : "Upload Resume"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_CDN_URL
                      }/resume.pdf?${Date.now()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Current Resume
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Inspirational Quote Card */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center items-center h-full">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Inspiration
            </h2>
            <blockquote className="italic text-xl text-center text-muted-foreground max-w-md">
              &ldquo;Success is not the key to happiness. Happiness is the key
              to success. If you love what you are doing, you will be
              successful.&rdquo;
            </blockquote>
            <span className="mt-4 text-sm text-muted-foreground">
              — Albert Schweitzer
            </span>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default Dashboard;
