import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { projectIcons } from "@/components/icons";
import { Placeholder, Tile } from "@/components/placeholder";
import { cn } from "@/lib/cn";

/** Placeholder "screenshot" with the project's icon tile floating in the middle. */
export function ProjectArt({ project, className }: { project: Project; className?: string }) {
  const Icon = projectIcons[project.icon];
  return (
    <Placeholder tone={project.tone} label="screenshot" className={cn("grid place-items-center", className)}>
      <Tile
        tone={project.tone === "ink" ? "slate" : "ink"}
        className="size-16 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 md:size-20"
      >
        <Icon className="size-8 md:size-9" strokeWidth={1.75} />
      </Tile>
    </Placeholder>
  );
}

export function ProjectCard({
  project,
  className,
  size = "md",
}: {
  project: Project;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex flex-col rounded-[var(--radius-card)] bg-surface p-3 transition-colors duration-300 hover:bg-surface-strong",
        className,
      )}
    >
      <ProjectArt project={project} className={size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]"} />
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{project.title}</h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </div>
        <p className="mt-1 text-[15px] leading-snug text-muted">{project.tagline}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {project.badge && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-paper">
              {project.badge}
            </span>
          )}
          {project.tags.slice(0, project.badge ? 2 : 3).map((t) => (
            <span key={t} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
