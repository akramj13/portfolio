import React from "react";
import PageLayout from "@/components/utils/page-layout";

function Dashboard() {
  return (
    <PageLayout variant="wide" maxWidth="full">
      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of projects, analytics, and recent activity.
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">
            New Project
          </button>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">P</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +2 from last month
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
                <span className="text-primary font-semibold">B</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+1 this week</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  GitHub Stars
                </p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">★</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">+15 this month</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contributions
                </p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">C</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">This year</p>
          </div>
        </section>

        {/* Recent Activity & Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Deployed Project Alpha v2.1
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Published new blog post</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Updated portfolio design
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <div className="font-medium">New Post</div>
                <div className="text-sm text-muted-foreground">
                  Write a blog post
                </div>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <div className="font-medium">Add Project</div>
                <div className="text-sm text-muted-foreground">
                  Showcase new work
                </div>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-muted-foreground">
                  View detailed stats
                </div>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left">
                <div className="font-medium">Settings</div>
                <div className="text-sm text-muted-foreground">
                  Manage preferences
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default Dashboard;
