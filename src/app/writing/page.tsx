import React from "react";
import PageLayout from "@/components/utils/page-layout";

function Writing() {
  return (
    <PageLayout variant="narrow" maxWidth="lg">
      <div className="space-y-10">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            writing
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on technology, development, and the ever-evolving world of
            software.
          </p>
        </section>

        {/* Articles */}
        <section className="space-y-8">
          {/* Article 1 */}
          <article className="border-b border-border pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2024-01-15">January 15, 2024</time>
                <span>•</span>
                <span>5 min read</span>
              </div>
              <h2 className="text-2xl font-semibold hover:text-primary transition-colors cursor-pointer">
                Building Scalable React Applications: Lessons Learned
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                After working on several large-scale React applications,
                I&apos;ve learned valuable lessons about architecture, state
                management, and performance optimization. Here are the key
                insights that transformed how I approach React development.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  React
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Architecture
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Performance
                </span>
              </div>
            </div>
          </article>

          {/* Article 2 */}
          <article className="border-b border-border pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2024-01-08">January 8, 2024</time>
                <span>•</span>
                <span>3 min read</span>
              </div>
              <h2 className="text-2xl font-semibold hover:text-primary transition-colors cursor-pointer">
                The Modern Developer&apos;s Guide to TypeScript
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                TypeScript has revolutionized JavaScript development by adding
                static type checking. Explore advanced TypeScript patterns and
                best practices that will make your code more maintainable and
                bug-free.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  JavaScript
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Best Practices
                </span>
              </div>
            </div>
          </article>

          {/* Article 3 */}
          <article className="border-b border-border pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime="2023-12-22">December 22, 2023</time>
                <span>•</span>
                <span>7 min read</span>
              </div>
              <h2 className="text-2xl font-semibold hover:text-primary transition-colors cursor-pointer">
                Optimizing Web Performance: A Comprehensive Guide
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Web performance directly impacts user experience and business
                metrics. Learn about the latest techniques for optimizing
                loading times, Core Web Vitals, and creating lightning-fast web
                applications.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Performance
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Web Vitals
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  Optimization
                </span>
              </div>
            </div>
          </article>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-muted/50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
          <p className="text-muted-foreground mb-4">
            Get notified when I publish new articles about web development and
            technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

export default Writing;
