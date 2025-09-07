"use client";

import React, { useState } from "react";
import PageLayout from "@/components/utils/page-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDownIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RefreshCwIcon,
  FileTextIcon,
  FolderIcon,
} from "lucide-react";

function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");

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
    // TODO: Implement blog post creation
    alert("Blog post creation coming soon!");
  };

  const handleEditBlogPost = () => {
    // TODO: Implement blog post editing
    alert("Blog post editing coming soon!");
  };

  const handleDeleteBlogPost = () => {
    // TODO: Implement blog post deletion
    alert("Blog post deletion coming soon!");
  };

  const handleNewProject = () => {
    // TODO: Implement project creation
    alert("Project creation coming soon!");
  };

  const handleEditProject = () => {
    // TODO: Implement project editing
    alert("Project editing coming soon!");
  };

  const handleDeleteProject = () => {
    // TODO: Implement project deletion
    alert("Project deletion coming soon!");
  };

  const handleUpdateHomePage = () => {
    // TODO: Implement home page text update
    alert("Home page text update coming soon!");
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
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">8</p>
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
                  <RefreshCwIcon
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
                        <FileTextIcon className="h-4 w-4" />
                        Blog Posts
                      </span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manage blog content
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleNewBlogPost}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditBlogPost}>
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteBlogPost}
                    className="text-red-600"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                    <div className="font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FolderIcon className="h-4 w-4" />
                        Projects
                      </span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manage portfolio projects
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleNewProject}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditProject}>
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteProject}
                    className="text-red-600"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={handleUpdateHomePage}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="font-medium">Update Home Page</div>
                <div className="text-sm text-muted-foreground">
                  Edit main content
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Dashboard updated with new functionality
                  </p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    LinkedIn API integration added
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Portfolio design improvements
                  </p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Admin dashboard created</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default Dashboard;
