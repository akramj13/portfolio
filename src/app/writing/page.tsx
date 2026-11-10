import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PenLine } from "lucide-react";
import { Reveal } from "@/components/motion";
import { PageHeader } from "@/components/page-header";
import { Tile } from "@/components/placeholder";
import { formatDate, publishedPosts, type Post } from "@/content/posts";
import { baseOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "writing",
  description: "Thoughts, rants, and the occasional thing Akram actually figured out.",
  alternates: { canonical: "/writing" },
  openGraph: { ...baseOpenGraph, url: "/writing" },
};

/** One post: cover on the left (on top on phones), details on the right. */
function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group -mx-3 flex flex-col gap-4 rounded-[1.5rem] p-3 transition-colors duration-300 hover:bg-surface sm:flex-row sm:items-center sm:gap-6"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl bg-surface-strong ring-1 ring-black/10 sm:w-[240px]">
        {post.cover ? (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes="(min-width: 640px) 240px, calc(100vw - 48px)"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <Tile tone="slate" className="size-12 rounded-[14px]">
              <PenLine className="size-5" strokeWidth={2} />
            </Tile>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs text-muted">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>
        <h2 className="mt-2 text-[19px] leading-snug font-semibold tracking-[-0.02em] text-balance">
          {post.title}
          {/* Inline, so it follows the last word when the title wraps. */}
          <ArrowUpRight className="ml-1 inline size-4 -translate-y-px align-middle text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </h2>
        <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <li key={t} className="rounded-full bg-pill px-2.5 py-1 text-xs font-medium text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default function WritingPage() {
  // Newest year first; posts are already sorted newest first.
  const years = [...new Set(publishedPosts.map((p) => p.date.slice(0, 4)))];

  return (
    <>
      <PageHeader title="writing.">
        thoughts, rants, and the occasional thing i actually figured out. mostly written for future
        me, but you&apos;re welcome to read along.
      </PageHeader>

      {years.map((year, i) => {
        const inYear = publishedPosts.filter((p) => p.date.startsWith(year));
        return (
          <section key={year} aria-labelledby={`year-${year}`} className="column mt-12">
            <Reveal delay={i * 60}>
              <h2 id={`year-${year}`} className="mb-3 flex items-baseline gap-3 text-[15px] font-medium text-muted">
                {year}
                <span className="text-faint">{inYear.length}</span>
                <span className="h-px flex-1 self-center bg-line" />
              </h2>
              <div className="flex flex-col gap-2">
                {inYear.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}
    </>
  );
}
