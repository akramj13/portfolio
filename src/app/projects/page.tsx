import React from "react";
import PageLayout from "@/components/utils/page-layout";

function Projects() {
  return (
    <PageLayout variant="wide" maxWidth="xl">
      <div className="space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work, experiments, and contributions to the
            developer community.
          </p>
        </section>

        {/* Projects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Card 1 */}
          <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Project Alpha</h3>
            <p className="text-muted-foreground mb-4">
              A modern web application built with Next.js and TypeScript
              featuring responsive design and dark mode support.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                React
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                Tailwind
              </span>
            </div>
            <div className="flex gap-3">
              <button className="text-sm text-primary hover:underline">
                View Demo
              </button>
              <button className="text-sm text-primary hover:underline">
                Source Code
              </button>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Project Beta</h3>
            <p className="text-muted-foreground mb-4">
              An API service built with Node.js and Express, featuring
              authentication, rate limiting, and comprehensive documentation.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                Node.js
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                Express
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                MongoDB
              </span>
            </div>
            <div className="flex gap-3">
              <button className="text-sm text-primary hover:underline">
                View Demo
              </button>
              <button className="text-sm text-primary hover:underline">
                Source Code
              </button>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Project Gamma</h3>
            <p className="text-muted-foreground mb-4">
              A mobile-first progressive web app with offline capabilities and
              push notifications.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                PWA
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                Service Worker
              </span>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                IndexedDB
              </span>
            </div>
            <div className="flex gap-3">
              <button className="text-sm text-primary hover:underline">
                View Demo
              </button>
              <button className="text-sm text-primary hover:underline">
                Source Code
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Interested in collaborating?
          </h2>
          <p className="text-muted-foreground mb-6">
            I&apos;m always open to discussing new opportunities and interesting
            projects.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Contact Me
          </button>
        </section>
      </div>
    </PageLayout>
  );
}

export default Projects;
