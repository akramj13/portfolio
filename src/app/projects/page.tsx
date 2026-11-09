import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { projects } from "@/content/projects";
import { socials } from "@/content/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things Akram has built: AI tools, hackathon winners, games, and finance experiments.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="projects.">
        startups, hackathon winners, class projects that got out of hand, and a few experiments
        with money.{" "}
        <span className="text-faint">
          {projects.length} favorites below, plenty more on{" "}
          <a
            href={socials.github.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-faint/60 underline-offset-3 transition-colors hover:text-ink hover:decoration-ink"
          >
            github
          </a>
          .
        </span>
      </PageHeader>

      <section className="column mt-10 grid gap-3 sm:grid-cols-2">
        {projects.map((p, i) => {
          // With an odd count, the last card sits alone on its row, so center it at the usual card width.
          const loneLast = projects.length % 2 === 1 && i === projects.length - 1;
          return (
            <Reveal
              key={p.slug}
              delay={(i % 2) * 60}
              className={cn(loneLast && "sm:col-span-2 sm:w-[calc(50%-0.375rem)] sm:justify-self-center")}
            >
              <ProjectCard project={p} className="h-full" />
            </Reveal>
          );
        })}
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
