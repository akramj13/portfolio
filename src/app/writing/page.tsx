"use client";
import React, { useState, useMemo } from "react";
import PageLayout from "@/components/utils/page-layout";
import ArticlePreview from "@/components/ArticlePreview";
import SearchBar from "@/components/SearchBar";
import { BlurFade } from "@/components/magicui/blur-fade";

const data = [
  {
    title: "Building Scalable React Applications: Lessons Learned",
    date: "2024-01-15",
    readingTime: 5,
    excerpt: "After working on several large-scale React applications.",
    tags: ["React", "Architecture", "Performance"],
  },
  {
    title: "The Modern Developer's Guide to TypeScript",
    date: "2024-01-08",
    readingTime: 3,
    excerpt:
      "TypeScript has revolutionized JavaScript development by adding static type checking.",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
  },
  {
    title: "Mastering CSS Grid: A Comprehensive Guide",
    date: "2024-01-01",
    readingTime: 4,
    excerpt: "CSS Grid has become an essential tool for modern web design.",
    tags: ["CSS", "Grid", "Web Design"],
  },
];

function Writing() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return data;

    const searchLower = searchTerm.toLowerCase();
    return data.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }, [searchTerm]);

  return (
    <PageLayout variant="narrow" maxWidth="lg">
      <div className="space-y-10">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            writing
          </h1>
          {/* <p className="text-lg text-muted-foreground">
            i like to write sometimes
          </p> */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search articles by title, content, or tags..."
            articles={data}
          />
        </section>

        {/* Search Results Info */}
        {searchTerm && (
          <section className="text-center">
            <p className="text-muted-foreground">
              {filteredArticles.length === 0
                ? `No articles found for "${searchTerm}"`
                : `Found ${filteredArticles.length} article${
                    filteredArticles.length !== 1 ? "s" : ""
                  } for "${searchTerm}"`}
            </p>
          </section>
        )}

        {/* Articles */}
        <section className="space-y-8">
          {filteredArticles.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles match your search criteria.
              </p>
              <p className="text-muted-foreground mt-2">
                Try searching for different keywords or browse all articles.
              </p>
            </div>
          ) : (
            filteredArticles.map((article, index) => (
              <BlurFade key={index} delay={0.25 + index * 0.05}>
                <ArticlePreview article={article} />
              </BlurFade>
            ))
          )}
        </section>

        {/* Newsletter Signup */}
        {/* <section className="bg-muted/50 rounded-lg p-6 text-center">
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
        </section> */}
      </div>
    </PageLayout>
  );
}

export default Writing;
