import React from "react";
import { Badge } from "@/components/ui/badge";

type Article = {
  title: string;
  date: string;
  readingTime: number;
  excerpt: string;
  tags: string[];
};

function ArticlePreview({ article }: { article: Article }) {
  return (
    <article className="border-b border-border pb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>
        <h2 className="text-2xl font-semibold hover:text-primary transition-colors cursor-pointer">
          {article.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex gap-2">
          {article.tags.map((tag, id) => {
            return (
              <Badge key={id} variant="secondary">
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default ArticlePreview;
