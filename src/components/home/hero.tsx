import Link from "next/link";
import { ArrowRight, ChartCandlestick, CodeXml, Search } from "lucide-react";
import { LogoMark } from "@/components/icons";
import { Pill } from "@/components/pill";
import { Tile } from "@/components/placeholder";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion";
import { projects } from "@/content/projects";
import { roles } from "@/content/experience";

// Sized relative to the headline so they scale with it.
const inlineTile =
  "mx-[0.14em] size-[0.86em] rounded-[0.24em] translate-y-[0.06em] align-baseline animate-float transition-transform duration-300 hover:scale-110";

export function Hero() {
  const current = roles[0];
  return (
    <section className="shell pt-16 pb-14 text-center md:pt-24 md:pb-20">
      <Reveal>
        <Link
          href="/#experience"
          className="inline-flex items-center gap-2 rounded-full bg-pill py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-pill-hover"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Now: {current.title.toLowerCase()} @ {current.company}
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="display mx-auto mt-8 max-w-[12ch] text-[44px] sm:max-w-none sm:text-[64px] md:text-[84px]">
          hey, i&apos;m
          <Tile tone="ink" tilt={-6} className={inlineTile}>
            <LogoMark className="h-[0.42em] w-auto text-paper" />
          </Tile>
          akram.
          <br className="max-sm:hidden" /> i build
          <Tile tone="violet" tilt={5} className={inlineTile} style={{ animationDelay: "-2s" }}>
            <CodeXml className="size-[0.46em]" strokeWidth={2.25} />
          </Tile>
          software
          <br className="max-sm:hidden" /> &amp; trade
          <Tile tone="lime" tilt={-4} className={inlineTile} style={{ animationDelay: "-4s" }}>
            <ChartCandlestick className="size-[0.46em]" strokeWidth={2.25} />
          </Tile>
          markets.
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mx-auto mt-7 max-w-[36rem] text-[18px] leading-[1.45] text-muted md:text-[20px]">
          cs &amp; finance double major at the university of waterloo. outside of classes i build
          startups, hack on side projects, and mess around with ai.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
          <Pill href="/projects">See my work</Pill>
          <Pill href="/writing" variant="secondary">
            Read the blog
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Pill>
        </div>
      </Reveal>
    </section>
  );
}

/** "Trusted by"-style strip of past teams, scrolling forever. */
export function WorkedAt() {
  const items = [...roles, ...roles];
  return (
    <section aria-labelledby="worked-at" className="pb-16 md:pb-24">
      <p id="worked-at" className="shell text-center text-[15px] text-muted">
        Places i&apos;ve shipped code
      </p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
          {items.map((r, i) => (
            <li
              key={`${r.company}-${i}`}
              aria-hidden={i >= roles.length}
              className="flex items-center gap-3 text-[22px] font-semibold tracking-[-0.03em] whitespace-nowrap text-ink/80"
            >
              <Tile tone={r.tone} className="size-8 rounded-[10px] text-[12px] font-bold tracking-normal">
                {r.monogram}
              </Tile>
              {r.company}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const stack = [
  { label: "Languages", items: ["TypeScript", "Python", "Swift", "C++", "SQL"] },
  { label: "Frameworks", items: ["Next.js", "React", "SwiftUI", "Flask", "FastAPI"] },
  { label: "ML & AI", items: ["TensorFlow", "llama.cpp", "Gemini", "ElevenLabs", "OCR"] },
  { label: "Infra", items: ["Docker", "AWS", "Nginx", "Cloudflare", "PostgreSQL"] },
];

/** A big framed "app window" showing the stack and three projects. */
export function Showcase() {
  const featured = projects.slice(0, 3);
  return (
    <section className="shell pb-24 md:pb-32">
      <Reveal>
        <div className="rounded-[2.5rem] bg-surface p-3 sm:p-6 md:p-10">
          <div className="rounded-[1.75rem] bg-paper p-5 shadow-[0_1px_2px_rgb(20_20_20/0.04)] md:p-7">
            {/* Window chrome */}
            <div className="flex items-center gap-4">
              <LogoMark className="h-5 w-auto" />
              <span className="text-sm font-semibold">Projects</span>
              <Link href="/writing" className="text-sm text-muted transition-colors hover:text-ink">
                Writing
              </Link>
              <Link
                href="/projects"
                className="ml-auto flex h-10 w-full max-w-[22rem] items-center gap-2.5 rounded-full bg-surface px-4 text-sm text-faint transition-colors hover:bg-surface-strong max-sm:hidden"
              >
                <Search className="size-4 text-ink-soft" />
                Browse {projects.length} projects…
                <kbd className="ml-auto rounded-md bg-paper px-1.5 py-0.5 font-mono text-[11px] text-muted">⌘K</kbd>
              </Link>
              <span className="ml-auto grid size-8 place-items-center rounded-full bg-ink text-[11px] font-bold text-paper sm:ml-0">
                AJ
              </span>
            </div>

            {/* Stack columns */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-10 md:grid-cols-4">
              {stack.map((col) => (
                <div key={col.label}>
                  <p className="text-xs text-muted">{col.label}</p>
                  <ul className="mt-2 space-y-0.5">
                    {col.items.map((item) => (
                      <li key={item} className="text-[17px] font-medium tracking-[-0.01em] md:text-[19px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-10 flex items-center gap-5 border-b border-line text-sm" aria-hidden>
              <span className="-mb-px border-b-2 border-ink pb-3 font-semibold">Latest</span>
              <span className="pb-3 text-faint">Hackathon winners</span>
              <span className="pb-3 text-faint max-sm:hidden">Open source</span>
              <span className="pb-3 text-faint max-md:hidden">Finance</span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {featured.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
