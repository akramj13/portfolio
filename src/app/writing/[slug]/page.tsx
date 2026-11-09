import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { DetailSkeleton } from "@/components/skeleton";
import { LogoMark } from "@/components/icons";
import { Pill } from "@/components/pill";
import { Tile } from "@/components/placeholder";
import { Reveal } from "@/components/motion";
import { formatDate, getPost, publishedPosts } from "@/content/posts";
import { site, socials } from "@/content/site";

export function generateStaticParams() {
  return publishedPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function PostPage({ params }: PageProps<"/writing/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PostDetail params={params} />
    </Suspense>
  );
}

async function PostDetail({ params }: { params: PageProps<"/writing/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post?.body) notFound();
  const Body = post.body;

  return (
    <article className="column pt-10 md:pt-14">
      <Link
        href="/writing"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        all writing
      </Link>

      <Reveal className="mt-8">
        <p className="font-mono text-xs text-muted">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>
        <h1 className="headline mt-4 text-[36px] md:text-[48px]">{post.title}</h1>
        <p className="mt-5 text-[19px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-8 flex items-center gap-3 border-b border-line pb-8">
          <Tile tone="ink" className="size-10 rounded-full">
            <LogoMark className="h-4 w-auto text-paper" />
          </Tile>
          <div className="text-sm">
            <p className="font-medium">{site.name}</p>
            <p className="text-muted">@{site.handle}</p>
          </div>
          <ul className="ml-auto hidden flex-wrap justify-end gap-1.5 sm:flex">
            {post.tags.map((t) => (
              <li key={t} className="rounded-full bg-pill px-2.5 py-1 text-xs font-medium text-ink-soft">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="prose-post mt-10">
        <Body />
      </Reveal>

      <Reveal className="mt-16 flex flex-col items-start gap-4 rounded-[1.75rem] bg-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div>
          <p className="text-[18px] font-semibold tracking-[-0.02em]">thanks for reading.</p>
          <p className="mt-1 text-[15px] text-muted">questions, ideas, or corrections? i&apos;d love to hear them.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Pill href={socials.email.href}>say hi</Pill>
          <Pill href="/writing" variant="secondary">
            more writing
          </Pill>
        </div>
      </Reveal>
    </article>
  );
}
