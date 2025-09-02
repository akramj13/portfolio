"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  recommendations?: string[];
  articles?: Array<{
    title: string;
    excerpt: string;
    tags: string[];
  }>;
}

function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search articles...",
  articles = [],
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate recommendations based on articles
  const recommendations = useMemo(() => {
    if (!articles.length) return [];

    // Get all unique tags
    const allTags = [...new Set(articles.flatMap((article) => article.tags))];

    // Get common words from titles (filter out common words)
    const stopWords = new Set([
      "the",
      "a",
      "an",
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
    ]);
    const titleWords = articles.flatMap((article) =>
      article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .filter((word) => word.length > 2 && !stopWords.has(word))
    );

    const uniqueTitleWords = [...new Set(titleWords)];

    // Combine and sort by relevance
    return [...allTags, ...uniqueTitleWords].slice(0, 8);
  }, [articles]);

  // Filter recommendations based on search term
  const filteredRecommendations = useMemo(() => {
    if (!searchTerm) {
      return recommendations.slice(0, 5); // Show top 5 when no search term
    }

    const searchLower = searchTerm.toLowerCase();
    return recommendations
      .filter((rec) => rec.toLowerCase().includes(searchLower))
      .slice(0, 5);
  }, [searchTerm, recommendations]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredRecommendations.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onSearchChange(filteredRecommendations[highlightedIndex]);
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    onSearchChange(recommendation);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => {
              onSearchChange("");
              setIsOpen(false);
              setHighlightedIndex(-1);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Recommendations Dropdown */}
      {isOpen && filteredRecommendations.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              {searchTerm ? "Suggested searches" : "Popular topics"}
            </div>
            {filteredRecommendations.map((recommendation, index) => (
              <button
                key={recommendation}
                onClick={() => handleRecommendationClick(recommendation)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  index === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {recommendation}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
