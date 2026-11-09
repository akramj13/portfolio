import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/pill";
import { Tile } from "@/components/placeholder";

export default function NotFound() {
  return (
    <section className="shell grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <h1 className="display text-[72px] md:text-[120px]">
          4
          <Tile
            tone="violet"
            tilt={-8}
            className="mx-[0.06em] size-[0.8em] translate-y-[0.04em] animate-float rounded-[0.22em] align-baseline"
          >
            <span className="text-[0.5em]">?</span>
          </Tile>
          4
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-[18px] text-muted">
          This page doesn&apos;t exist. Maybe it&apos;s still on the build log.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Pill href="/">Back home</Pill>
          <Pill href="/projects" variant="secondary">
            See projects
            <ArrowRight className="size-4" />
          </Pill>
        </div>
      </div>
    </section>
  );
}
