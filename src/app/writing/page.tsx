import type { Metadata } from "next";
import { PenLine } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Tile } from "@/components/placeholder";
import { Row, Section } from "@/components/resume";
import { formatDate, posts, publishedPosts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building software, side projects, and whatever Akram is figuring out.",
};

const icon = (
  <Tile tone="slate" className="size-10 rounded-[12px]">
    <PenLine className="size-[18px]" strokeWidth={2} />
  </Tile>
);

export default function WritingPage() {
  const drafts = posts.filter((p) => p.soon);

  return (
    <>
      <PageHeader title="writing.">
        short posts on what i&apos;m building, why, and what broke along the way.
      </PageHeader>

      <Section label="posts" count={publishedPosts.length}>
        {publishedPosts.map((post) => (
          <Row
            key={post.slug}
            href={`/writing/${post.slug}`}
            icon={icon}
            title={post.title}
            subtitle={post.excerpt}
            metaTop={`${post.readingTime} min read`}
            metaBottom={formatDate(post.date)}
          />
        ))}
      </Section>

      {drafts.length > 0 && (
        <Section label="coming soon">
          <div className="opacity-55">
            {drafts.map((post) => (
              <Row key={post.slug} icon={icon} title={post.title} subtitle={post.excerpt} metaBottom="draft" />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
