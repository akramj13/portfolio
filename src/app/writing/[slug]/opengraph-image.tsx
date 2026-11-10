import { getPost, publishedPosts } from "@/content/posts";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Writing by Akram Jamil";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedPosts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({ eyebrow: "writing", title: post?.title ?? "writing", subtitle: post?.excerpt });
}
