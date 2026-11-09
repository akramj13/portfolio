import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DetailSkeleton } from "@/components/skeleton";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, Sparkles, Wrench } from "lucide-react";
import { Pill } from "@/components/pill";
import { ProjectArt } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { getProject, linkLabel, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
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
    { title: "What it does", Icon: Check, items: project.features },
    { title: "Highlights", Icon: Sparkles, items: project.highlights },
    { title: "Hard parts", Icon: Wrench, items: project.challenges },
  ].filter((s) => s.items.length > 0);

  return (
    <article>
      <header className="shell pt-10 md:pt-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          All projects
        </Link>
        <Reveal className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {project.duration}
              </span>
              {project.badge && (
                <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-paper">
                  {project.badge}
                </span>
              )}
            </div>
            <h1 className="display mt-4 text-[52px] md:text-[88px]">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-[1.5] text-muted md:text-[20px]">
              {project.description}
            </p>
          </div>
          <Pill href={project.link}>
            {linkLabel(project.link)}
            <ArrowUpRight className="size-4" />
          </Pill>
        </Reveal>
      </header>

      <Reveal className="shell mt-12 md:mt-16">
        <div className="rounded-[2.5rem] bg-surface p-3 md:p-5">
          <ProjectArt project={project} className="aspect-[16/9] rounded-[2rem]" />
        </div>
      </Reveal>

      <section className="shell mt-16 md:mt-24">
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map(({ title, Icon, items }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="h-full rounded-[var(--radius-card)] bg-surface p-7">
                <span className="grid size-10 place-items-center rounded-full bg-paper">
                  <Icon className="size-[18px]" />
                </span>
                <h2 className="mt-6 text-[20px] font-semibold tracking-[-0.02em]">{title}</h2>
                <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-faint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="text-[15px] text-muted">Built with</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full bg-pill px-3.5 py-1.5 text-sm font-medium">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Reveal className="shell mt-24 md:mt-32">
        <Link
          href={`/projects/${next.slug}`}
          className="group flex items-center justify-between gap-6 border-t border-line pt-8"
        >
          <span>
            <span className="block text-[15px] text-muted">Next project</span>
            <span className="headline mt-2 block text-[32px] md:text-[48px]">{next.title}</span>
          </span>
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="size-6" />
          </span>
        </Link>
      </Reveal>
    </article>
  );
}
