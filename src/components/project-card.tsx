import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { Placeholder } from "@/components/placeholder";
import { ProjectIcon } from "@/components/project-icon";
import { cn } from "@/lib/cn";

/**
 * The project's screenshot, or placeholder art with its icon floating in the
 * middle when there isn't one yet.
 */
export function ProjectArt({
  project,
  className,
  sizes,
}: {
  project: Project;
  className?: string;
  /** Rendered width hint for next/image, so phones don't download the full file. */
  sizes: string;
}) {
  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-strong ring-1 ring-black/5", className)}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes={sizes}
          // Crop from the top by default so headers and hero text stay in view.
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: project.imagePosition ?? "top" }}
        />
      </div>
    );
  }
  return (
    <Placeholder tone={project.tone} label="screenshot" className={cn("grid place-items-center", className)}>
      <ProjectIcon
        src={project.icon}
        // The placeholder sits on the project's colour, so use a contrasting tile.
        tone={project.tone === "ink" ? "slate" : "ink"}
        size={56}
        // A light rim lifts the icon off art that shares its colour.
        className="rounded-[16px] ring-2 ring-white/70 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
      />
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
      <ProjectArt
        project={project}
        sizes="(min-width: 720px) 330px, calc(100vw - 68px)"
        className="aspect-[16/10] rounded-[1.25rem]"
      />
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
