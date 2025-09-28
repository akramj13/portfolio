import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/utils/page-layout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";

// Use ISR with on-demand revalidation
export const revalidate = 3600; // Revalidate every hour, but can be triggered on-demand

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug: slug,
        published: true,
      },
    });

    return blog;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${blog.title} | Blog`,
    description: blog.excerpt,
  };
}

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
      },
    });

    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function BlogPost({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  if (!blog) {
    notFound();
  }

  return (
    <PageLayout variant="narrow" maxWidth="2xl">
      <BlurFade delay={0.25}>
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            {/* Back button (goes to /writing*/}
            <Link href="/writing">
              <Button variant="link" className="px-0 cursor-pointer">
                &larr; back to writing
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span>•</span>
              <span>{blog.readingTime} min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {blog.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose-divider">
            <hr className="border-border" />
          </div>

          <MarkdownRenderer content={blog.content} blogSlug={blog.slug} />
        </article>
      </BlurFade>
    </PageLayout>
  );
}
