import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Placeholder } from "@/components/placeholder";
import { Reveal } from "@/components/motion";
import { formatDate, posts, publishedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building software, side projects, and whatever Akram is figuring out.",
};

export default function WritingPage() {
  const [featured] = publishedPosts;
  const others = posts.filter((p) => p !== featured);

  return (
    <>
      <PageHeader eyebrow="Writing" title="Notes from the build log.">
        Short posts on what i&apos;m building, why, and what broke along the way.
      </PageHeader>

      <section className="shell">
        {featured && (
          <Reveal>
            <Link
              href={`/writing/${featured.slug}`}
              className="group grid gap-3 rounded-[2.5rem] bg-surface p-3 transition-colors hover:bg-surface-strong md:grid-cols-[1.1fr_1fr] md:p-4"
            >
              <Placeholder tone="slate" label="cover image" className="aspect-[16/10] rounded-[2rem]" />
              <div className="flex flex-col p-5 md:p-8">
                <p className="font-mono text-xs text-muted">
                  {formatDate(featured.date)} · {featured.readingTime} min read
                </p>
                <h2 className="headline mt-4 text-[28px] md:text-[36px]">{featured.title}</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-muted">{featured.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <ul className="flex flex-wrap gap-1.5">
                    {featured.tags.map((t) => (
                      <li key={t} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        <ul className="mt-16 divide-y divide-line border-y border-line">
          {others.map((post) => {
            const row = (
              <div className="flex flex-col gap-2 py-7 md:flex-row md:items-baseline md:gap-10">
                <p className="w-32 shrink-0 font-mono text-xs text-muted">
                  {post.soon ? "Coming soon" : formatDate(post.date)}
                </p>
                <div className="flex-1">
                  <h3
                    className={`text-[22px] font-semibold tracking-[-0.02em] ${post.soon ? "text-ink/40" : "group-hover:underline"}`}
                  >
                    {post.title}
                  </h3>
                  <p className={`mt-1 text-[15px] ${post.soon ? "text-faint" : "text-muted"}`}>{post.excerpt}</p>
                </div>
                {post.soon ? (
                  <span className="self-start rounded-full bg-pill px-2.5 py-1 text-xs font-medium text-muted md:self-center">
                    Draft
                  </span>
                ) : (
                  <ArrowUpRight className="size-5 text-faint transition-colors group-hover:text-ink" />
                )}
              </div>
            );
            return (
              <li key={post.slug}>
                <Reveal>
                  {post.soon ? (
                    row
                  ) : (
                    <Link href={`/writing/${post.slug}`} className="group block">
                      {row}
                    </Link>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
