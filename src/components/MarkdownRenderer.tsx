"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  blogSlug?: string; // Add blogSlug prop to help resolve relative image paths
}

export default function MarkdownRenderer({
  content,
  className = "",
  blogSlug,
}: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom components for better styling
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-6 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-4 mt-8 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => <li className="text-foreground">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic bg-muted/50 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`${className} block bg-muted p-4 rounded-lg overflow-x-auto`}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline hover:text-primary/80 transition-colors"
              target={href?.startsWith("http") ? "_blank" : "_self"}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, title }) => {
            if (!src || typeof src !== "string") {
              return (
                <div className="bg-muted p-4 rounded-lg text-muted-foreground">
                  Image not found
                </div>
              );
            }

            // Handle relative paths by converting them to absolute CDN URLs
            let imageSrc = src;

            // If it's a relative path (starts with ./ or just a filename),
            // we need to construct the proper CDN URL
            if (
              src.startsWith("./") ||
              (!src.startsWith("/") && !src.startsWith("http"))
            ) {
              // Extract the filename from the path
              const filename = src.replace("./", "");

              if (blogSlug) {
                // Construct the CDN URL: http://localhost:3001/blogs/[slug]/[filename]
                imageSrc = `http://localhost:3001/blogs/${blogSlug}/${filename}`;
              } else {
                // Fallback: try to extract slug from URL if available
                if (typeof window !== "undefined") {
                  const currentPath = window.location.pathname;
                  const slugMatch = currentPath.match(/\/writing\/([^\/]+)/);
                  const extractedSlug = slugMatch ? slugMatch[1] : null;

                  if (extractedSlug) {
                    imageSrc = `http://localhost:3001/blogs/${extractedSlug}/${filename}`;
                  } else {
                    console.warn(
                      "Could not determine blog slug for image:",
                      src
                    );
                    // Try to render anyway, might work if the path is actually valid
                    imageSrc = src;
                  }
                } else {
                  console.warn(
                    "Relative image path detected without blogSlug prop:",
                    src
                  );
                  imageSrc = src;
                }
              }
            }

            try {
              // Validate URL before passing to Next.js Image
              new URL(
                imageSrc,
                imageSrc.startsWith("/") ? "http://localhost" : undefined
              );

              return (
                <Image
                  src={imageSrc}
                  alt={alt || ""}
                  title={title}
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg shadow-md my-4"
                  loading="lazy"
                />
              );
            } catch {
              console.error(
                "Invalid image URL:",
                imageSrc,
                "Original src:",
                src
              );
              return (
                <div className="bg-muted p-4 rounded-lg text-muted-foreground">
                  <p>Invalid image URL: {src}</p>
                  <p className="text-xs">Processed as: {imageSrc}</p>
                </div>
              );
            }
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">{children}</td>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
