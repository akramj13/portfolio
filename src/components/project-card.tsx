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
        className="size-14 rounded-[16px] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
      >
        <Icon className="size-7" strokeWidth={1.75} />
      </Tile>
    </Placeholder>
  );
}

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group flex flex-col rounded-[1.75rem] bg-surface p-2.5 transition-colors duration-300 hover:bg-surface-strong",
        className,
      )}
    >
      <ProjectArt project={project} className="aspect-[16/10] rounded-[1.25rem]" />
      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-semibold tracking-[-0.02em]">{project.title}</h2>
          {project.badge && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-paper">
              {project.badge}
            </span>
          )}
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </div>
        <p className="mt-1 text-[14px] leading-snug text-muted">{project.tagline}</p>
        <p className="mt-auto pt-3 text-[12px] text-faint">
          {project.tags.slice(0, 3).join(" · ")} · {project.duration}
        </p>
      </div>
    </Link>
  );
}
