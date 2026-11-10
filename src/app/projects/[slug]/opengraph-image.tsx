import { getProject, projects } from "@/content/projects";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Project by Akram Jamil";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return ogImage({ eyebrow: "projects", title: project?.title ?? "projects", subtitle: project?.tagline });
}
