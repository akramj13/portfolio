"use client";
import React, { useState, useMemo } from "react";
import PageLayout from "@/components/utils/page-layout";
import ArticlePreview from "@/components/ArticlePreview";
import SearchBar from "@/components/SearchBar";
import { BlurFade } from "@/components/ui/blur-fade";

interface Blog {
  id: number;
  title: string;
  slug: string;
  date: Date;
  readingTime: number;
  excerpt: string;
  tags: string[];
  published: boolean;
}

interface WritingClientProps {
  blogs: Blog[];
}

export default function WritingClient({ blogs }: WritingClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Reset pagination when search term changes
  React.useEffect(() => {
    if (searchTerm) {
      setShowAll(false); // Reset to collapsed state when searching
    }
  }, [searchTerm]);

  // Generate intelligent search recommendations from excerpts and tags
  const enhancedArticles = useMemo(() => {
    return blogs.map((blog) => {
      // Extract meaningful phrases from excerpts (2-4 words)
      const excerptPhrases = blog.excerpt
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .reduce((phrases: string[], _, index, words) => {
          // Create 2-word phrases
          if (index < words.length - 1) {
            const twoWordPhrase = `${words[index]} ${words[index + 1]}`;
            phrases.push(twoWordPhrase);
          }
          // Create 3-word phrases
          if (index < words.length - 2) {
            const threeWordPhrase = `${words[index]} ${words[index + 1]} ${
              words[index + 2]
            }`;
            phrases.push(threeWordPhrase);
          }
          return phrases;
        }, [])
        .filter((phrase) => {
          // Filter out common stopword phrases
          const stopPhrases = [
            "the",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "this",
            "that",
            "these",
            "those",
          ];
          return !stopPhrases.some(
            (stop) =>
              phrase.startsWith(stop + " ") || phrase.endsWith(" " + stop)
          );
        })
        .slice(0, 5); // Limit excerpt phrases per article

      return {
        title: blog.title,
        excerpt: blog.excerpt,
        tags: blog.tags || [],
        excerptPhrases,
      };
    });
  }, [blogs]);

  // Filter blogs based on search term with improved matching
  const filteredBlogs = useMemo(() => {
    if (!searchTerm) return blogs;

    const searchLower = searchTerm.toLowerCase().trim();
    const searchWords = searchLower
      .split(/\s+/)
      .filter((word) => word.length > 0);

    return blogs.filter((blog) => {
      // Exact phrase matching in title, excerpt, or tags
      const titleMatch = blog.title.toLowerCase().includes(searchLower);
      const excerptMatch = blog.excerpt.toLowerCase().includes(searchLower);
      const tagMatch =
        blog.tags &&
        blog.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // If exact phrase matches, prioritize
      if (titleMatch || excerptMatch || tagMatch) {
        return true;
      }

      // Multi-word search: all words must appear somewhere
      if (searchWords.length > 1) {
        const allText = `${blog.title} ${blog.excerpt} ${(blog.tags || []).join(
          " "
        )}`.toLowerCase();
        return searchWords.every((word) => allText.includes(word));
      }

      return false;
    });
  }, [blogs, searchTerm]);

  // Apply pagination logic - show top 4 by default, all when expanded or searching
  const displayedBlogs = useMemo(() => {
    // Always show all blogs when searching
    if (searchTerm) return filteredBlogs;

    // When not searching, apply pagination
    return showAll ? blogs : blogs.slice(0, 4);
  }, [filteredBlogs, blogs, searchTerm, showAll]);

  // Check if we should show the "Show All" button
  const shouldShowExpandButton = !searchTerm && blogs.length > 4 && !showAll;

  // Check if we should show the "Show Less" button
  const shouldShowCollapseButton = !searchTerm && blogs.length > 4 && showAll;

  return (
    <PageLayout variant="wide" maxWidth="xl">
      <div className="text-center space-y-4">
        {/* Header */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          writing
        </h1>
        {!searchTerm && blogs.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {showAll
              ? `Showing all ${blogs.length} articles`
              : `Showing ${Math.min(4, blogs.length)} of ${
                  blogs.length
                } articles`}
          </p>
        )}
        <div className="max-w-md mx-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search articles by title, content, or tags..."
            articles={enhancedArticles}
          />
        </div>
        {/* If no blogs, show message here for consistent spacing */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">nothing so far.</p>
            <p className="text-muted-foreground mt-2">
              check back later for articles and thoughts.
            </p>
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <section className="text-center">
          <p className="text-muted-foreground">
            {filteredBlogs.length === 0
              ? `No articles found for "${searchTerm}"`
              : `Found ${filteredBlogs.length} article${
                  filteredBlogs.length !== 1 ? "s" : ""
                } for "${searchTerm}"`}
          </p>
        </section>
      )}

      {/* Articles */}
      {blogs.length > 0 && (
        <section className="space-y-8 my-10">
          {displayedBlogs.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles match your search criteria.
              </p>
              <p className="text-muted-foreground mt-2">
                Try searching for different keywords or browse all articles.
              </p>
            </div>
          ) : (
            displayedBlogs.map((blog, index) => (
              <BlurFade key={blog.id} delay={0.25 + index * 0.05}>
                <ArticlePreview
                  article={{
                    title: blog.title,
                    date: blog.date.toISOString().split("T")[0],
                    readingTime: blog.readingTime,
                    excerpt: blog.excerpt,
                    tags: blog.tags || [],
                  }}
                  slug={blog.slug}
                />
              </BlurFade>
            ))
          )}
        </section>
      )}

      {/* Show All/Show Less Button */}
      {shouldShowExpandButton && (
        <section className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-foreground font-medium"
          >
            Show All Articles ({blogs.length})
          </button>
        </section>
      )}

      {shouldShowCollapseButton && (
        <section className="text-center">
          <button
            onClick={() => setShowAll(false)}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-foreground font-medium"
          >
            Show Less
          </button>
        </section>
      )}
    </PageLayout>
  );
}
