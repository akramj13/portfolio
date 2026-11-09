import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { projects } from "@/content/projects";
import { socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Akram has built: AI tools, hackathon winners, games, and finance experiments.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="projects.">
        startups, hackathon winners, class projects that got out of hand, and a few experiments
        with money. <span className="text-faint">{projects.length} so far.</span>
      </PageHeader>

      <section className="column mt-10 grid gap-3 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 60}>
            <ProjectCard project={p} className="h-full" />
          </Reveal>
        ))}
      </section>

      <div className="column mt-8">
        <a
          href={socials.github.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
        >
          more experiments on github
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </>
  );
}
