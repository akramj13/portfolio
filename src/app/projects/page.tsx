import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Pill } from "@/components/pill";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { projects } from "@/content/projects";
import { socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Akram has built: AI tools, hackathon winners, games, and finance experiments.",
};

export default function ProjectsPage() {
  const [first, second, ...rest] = projects;
  const tagCount = new Set(projects.flatMap((p) => p.tags)).size;

  return (
    <>
      <PageHeader eyebrow={`${projects.length} projects · ${tagCount} technologies`} title="Things i've built.">
        Startups, hackathon winners, class projects that got out of hand, and a few experiments
        with money.
      </PageHeader>

      <section className="shell">
        <div className="grid gap-4 md:grid-cols-2">
          {[first, second].map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProjectCard project={p} size="lg" className="h-full" />
            </Reveal>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 80}>
              <ProjectCard project={p} className="h-full" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-24 rounded-[2.5rem] bg-surface px-6 py-16 text-center md:py-20">
          <h2 className="headline text-[32px] md:text-[44px]">More on GitHub.</h2>
          <p className="mx-auto mt-4 max-w-sm text-[17px] text-muted">
            Smaller experiments, coursework, and the occasional half-finished idea.
          </p>
          <div className="mt-8 flex justify-center">
            <Pill href={socials.github.href}>
              github.com/akramj13
              <ArrowUpRight className="size-4" />
            </Pill>
          </div>
        </Reveal>
      </section>
    </>
  );
}
