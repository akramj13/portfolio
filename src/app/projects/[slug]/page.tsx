import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Pill } from "@/components/pill";
import { ProjectIcon } from "@/components/project-icon";
import { ProjectArt } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { DetailSkeleton } from "@/components/skeleton";
import { getProject, linkLabel, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.title, description: project.tagline, url: `/projects/${slug}`, type: "website" },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

async function ProjectDetail({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const sections = [
    { title: "what it does", items: project.features },
    { title: "highlights", items: project.highlights },
    { title: "hard parts", items: project.challenges },
  ].filter((s) => s.items.length > 0);

  return (
    <article className="column pt-10 md:pt-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        all projects
      </Link>

      <Reveal className="mt-8">
        <div className="flex items-center gap-3">
          <ProjectIcon src={project.icon} tone={project.tone} size={48} className="rounded-[14px]" />
          <div className="text-sm text-muted">
            <p>{project.duration}</p>
            {project.badge && <p className="font-medium text-ink">{project.badge}</p>}
          </div>
        </div>
        <h1 className="display mt-6 text-[48px] md:text-[64px]">{project.title}</h1>
        <p className="mt-4 text-[18px] leading-[1.55] text-muted">{project.description}</p>
        <div className="mt-6">
          <Pill href={project.link} size="sm" className="h-9">
            {linkLabel(project.link).toLowerCase()}
            <ArrowUpRight className="size-4" />
          </Pill>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <ProjectArt project={project} className="aspect-[16/10] rounded-[1.75rem]" />
      </Reveal>

      <div className="mt-12 space-y-10">
        {sections.map(({ title, items }) => (
          <Reveal key={title}>
            <h2 className="text-[15px] font-medium text-muted">{title}</h2>
            <ul className="mt-3 space-y-2.5 text-[16px] leading-relaxed text-ink-soft">
              {items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal>
          <h2 className="text-[15px] font-medium text-muted">built with</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full bg-pill px-3 py-1 text-[13px] font-medium">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <Link
          href={`/projects/${next.slug}`}
          className="group -mx-3 flex items-center justify-between gap-6 rounded-2xl px-3 py-4 transition-colors hover:bg-surface"
        >
          <span>
            <span className="block text-sm text-muted">next project</span>
            <span className="mt-0.5 block text-[22px] font-semibold tracking-[-0.02em]">{next.title}</span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="size-5" />
          </span>
        </Link>
      </Reveal>
    </article>
  );
}
