import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  ChartCandlestick,
  CodeXml,
  Cpu,
  Sigma,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { LogoMark } from "@/components/icons";
import { Pill } from "@/components/pill";
import { Placeholder, Tile } from "@/components/placeholder";
import { Reveal, ScrollWords, Typewriter } from "@/components/motion";
import { education, roles } from "@/content/experience";
import { getProject } from "@/content/projects";
import { socials } from "@/content/site";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Statement                                                           */
/* ------------------------------------------------------------------ */

export function Statement() {
  return (
    <section className="shell pb-24 md:pb-36">
      <Reveal>
        <h2 className="headline text-[36px] md:text-[56px]">
          School takes four years.
          <br />
          Shipping takes a weekend.
        </h2>
      </Reveal>
      <ScrollWords
        className="headline mt-10 max-w-[22ch] text-[32px] md:mt-14 md:text-[56px]"
        text="Hackathon winners, a two-player Tetris in C++, an autocomplete that never leaves your Mac, and a robo-advisor that tried to beat the S&P. I like building things people actually use."
      />
      <Reveal className="mt-14 md:mt-20">
        <p className="flex items-center gap-3 text-[28px] font-semibold tracking-[-0.03em] md:gap-4 md:text-[44px]">
          <Sparkles className="size-7 shrink-0 md:size-10" strokeWidth={2} aria-hidden />
          <Typewriter
            phrases={[
              "currently building cotabby",
              "shipping ml at illuminex ai",
              "studying cs & finance",
              "probably trading something",
            ]}
          />
        </p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Three pillars: software / ml / markets                              */
/* ------------------------------------------------------------------ */

function StackedTiles() {
  return (
    <div className="relative h-28 w-[260px] scale-90 sm:scale-100">
      <Tile tone="ink" tilt={-10} className="absolute top-2 left-0 size-24 pr-3 text-2xl font-bold">
        C++
      </Tile>
      <Tile tone="blue" className="absolute top-0 left-[74px] z-10 size-28 text-3xl font-bold">
        TS
      </Tile>
      <Tile tone="orange" tilt={10} className="absolute top-2 left-[164px] size-24 pl-4 text-xl font-bold">
        Swift
      </Tile>
    </div>
  );
}

function TerminalMock() {
  return (
    <div className="w-full max-w-[17rem] rounded-2xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-white/80 shadow-xl">
      <div className="mb-3 flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
      </div>
      <p>
        <span className="text-white/40">$</span> python train.py --model rf
      </p>
      <p className="text-white/50">loading 2,400 scans…</p>
      <p className="text-white/50">epoch 12/12 ━━━━━━━━━━ done</p>
      <p>
        accuracy <span className="text-lime-300">0.94</span>
      </p>
    </div>
  );
}

function CandleMock() {
  // Hand-placed candles: [open, close, high, low] in a 0–100 range.
  const candles = [
    [30, 42, 48, 26], [42, 38, 46, 34], [38, 52, 56, 36], [52, 49, 58, 44],
    [49, 61, 66, 47], [61, 57, 64, 52], [57, 70, 74, 55], [70, 78, 84, 66],
  ];
  return (
    <svg viewBox="0 0 200 110" className="h-32 w-full max-w-[16rem]" aria-hidden>
      <path d="M0 100 H200" stroke="currentColor" className="text-line" />
      {candles.map(([o, c, h, l], i) => {
        const x = 14 + i * 24;
        const up = c >= o;
        const y = (v: number) => 104 - v;
        return (
          <g key={i} className={up ? "text-emerald-500" : "text-rose-400"}>
            <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect
              x={x - 7}
              width="14"
              y={y(Math.max(o, c))}
              height={Math.max(4, Math.abs(c - o))}
              rx="3"
              fill="currentColor"
            />
          </g>
        );
      })}
    </svg>
  );
}

const pillars = [
  { title: "Software", body: "Full-stack web, native macOS, and systems C++.", visual: <StackedTiles /> },
  { title: "ML & AI", body: "Models, agents, and on-device inference.", visual: <TerminalMock /> },
  { title: "Markets", body: "Portfolio theory, quant tools, and fintech.", visual: <CandleMock /> },
];

export function Pillars() {
  return (
    <section className="shell pb-24 md:pb-36">
      <Reveal>
        <h2 className="headline text-center text-[36px] md:text-[48px]">
          One brain,
          <br />
          three tabs open.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 90}>
            <div className="flex h-full flex-col items-center rounded-[var(--radius-card)] bg-surface px-6 pt-8 pb-10 text-center">
              <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-1 text-[15px] text-muted">{p.body}</p>
              <div className="mt-10 flex min-h-36 w-full flex-1 items-center justify-center">{p.visual}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight: Cotabby                                                   */
/* ------------------------------------------------------------------ */

export function Spotlight() {
  const cotabby = getProject("cotabby")!;
  return (
    <section className="shell grid items-center gap-12 pb-24 md:grid-cols-2 md:gap-16 md:pb-36">
      <Reveal>
        <p className="text-[15px] text-muted">Spotlight · {cotabby.title}</p>
        <h2 className="headline mt-3 text-[36px] md:text-[48px]">
          Autocomplete that never leaves your Mac.
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
          Inline ghost-text suggestions in the apps you already use, powered by Apple
          Intelligence or local GGUF models. Open source, free, and every keystroke stays on
          your machine.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Pill href={cotabby.link} variant="secondary">
            Visit cotabby.app
            <ArrowUpRight className="size-4" />
          </Pill>
          <Link href="/projects/cotabby" className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
            Read the case study
          </Link>
        </div>
        <dl className="mt-12 flex gap-10">
          {[
            ["6,000+", "downloads"],
            ["750+", "GitHub stars"],
            ["100%", "on-device"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="text-[28px] font-semibold tracking-[-0.03em]">{n}</dd>
              <dd className="text-sm text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={120}>
        <Placeholder tone="slate" label="screenshot · cotabby" className="grid aspect-square place-items-center p-6 md:p-10">
          <div className="w-full max-w-sm rounded-2xl bg-paper p-5 shadow-[0_24px_60px_-20px_rgb(20_20_20/0.35)]">
            <div className="flex items-center gap-1.5 pb-4" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-auto text-[11px] text-faint">Notes</span>
            </div>
            <p className="text-[17px] leading-relaxed">
              hey! running a bit late, i&apos;ll be there
              <span className="text-faint"> in about ten minutes</span>
              <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-blink bg-ink" />
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted">
              <kbd className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[11px] text-ink shadow-[0_1px_0_var(--line)]">
                tab
              </kbd>
              accept word
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-surface px-2 py-1 font-mono text-[10px]">
                <Cpu className="size-3" /> on-device
              </span>
            </div>
          </div>
        </Placeholder>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 bg-surface py-24 md:py-32">
      <div className="shell">
        <Reveal className="text-center">
          <h2 className="headline text-[36px] md:text-[48px]">
            Some places
            <br />
            i&apos;ve worked.
          </h2>
          <div className="mt-6 flex justify-center">
            <Pill href={socials.linkedin.href} variant="secondary" size="sm">
              Full history on LinkedIn
              <ArrowUpRight className="size-4" />
            </Pill>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-3 md:mt-16 md:grid-cols-2">
          {roles.map((r, i) => {
            const current = r.end === "Present";
            return (
              <li key={`${r.company}-${r.start}`}>
                <Reveal delay={(i % 2) * 80} className="h-full">
                  <article
                    className={cn(
                      "flex h-full flex-col rounded-[var(--radius-card)] p-6 md:p-8",
                      current ? "bg-ink text-paper" : "bg-paper",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Tile tone={current ? "slate" : r.tone} className="size-12 rounded-[14px] text-[15px] font-bold">
                        {r.monogram}
                      </Tile>
                      <p className={cn("font-mono text-xs", current ? "text-white/55" : "text-muted")}>
                        {r.start} — {r.end}
                      </p>
                    </div>
                    <h3 className="mt-10 text-[22px] leading-tight font-semibold tracking-[-0.02em]">{r.title}</h3>
                    <p className={cn("mt-1 text-[16px]", current ? "text-white/75" : "text-ink-soft")}>{r.company}</p>
                    {(r.location || r.mode) && (
                      <p className={cn("mt-4 text-sm", current ? "text-white/45" : "text-muted")}>
                        {[r.location, r.mode].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Pull quote from the blog */}
        <Reveal className="mt-24 grid items-end gap-10 md:mt-32 md:grid-cols-[1fr_auto]">
          <blockquote className="headline max-w-[24ch] text-[30px] md:text-[44px]">
            <span aria-hidden className="mb-4 block text-[56px] leading-none text-faint md:text-[72px]">
              &ldquo;
            </span>
            i built my portfolio because i&apos;m lazy lol. i wanted a site that never needs a full
            redeploy.
          </blockquote>
          <Link href="/writing/building-my-portfolio" className="group flex items-center gap-3">
            <Tile tone="ink" className="size-12 rounded-full">
              <LogoMark className="h-5 w-auto text-paper" />
            </Tile>
            <span>
              <span className="block text-[15px] font-medium">Akram Jamil</span>
              <span className="flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-ink">
                on building portfolio v1
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

const floaters = [
  { side: "left", tone: "violet", Icon: CodeXml, cls: "top-0 left-[8%] size-16", tilt: -8, delay: "0s" },
  { side: "left", tone: "ink", Icon: Sigma, cls: "top-24 left-[16%] size-20", tilt: 6, delay: "-1.5s" },
  { side: "left", tone: "sky", Icon: BrainCircuit, cls: "top-52 left-[4%] size-24", tilt: -4, delay: "-3s" },
  { side: "right", tone: "lime", Icon: ChartCandlestick, cls: "top-2 right-[10%] size-16", tilt: 8, delay: "-2s" },
  { side: "right", tone: "orange", Icon: TrendingUp, cls: "top-52 right-[5%] size-24", tilt: -6, delay: "-4s" },
] as const;

export function Education() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 max-lg:hidden">
        {floaters.map(({ tone, Icon, cls, tilt, delay }, i) => (
          <Tile key={i} tone={tone} tilt={tilt} className={cn("absolute animate-float", cls)} style={{ animationDelay: delay }}>
            <Icon className="size-1/2" strokeWidth={2} />
          </Tile>
        ))}
        <span
          className="absolute top-20 right-[18%] block size-20 animate-float overflow-hidden rounded-[var(--radius-tile)] shadow-[0_8px_24px_-8px_rgb(20_20_20/0.35)] ring-1 ring-black/5"
          style={{ ["--tilt" as string]: "-5deg", animationDelay: "-1s" }}
        >
          <Image src="/uwaterloo.jpeg" alt="" width={80} height={80} className="size-full object-cover" />
        </span>
      </div>

      <Reveal className="shell relative text-center">
        <h2 className="headline text-[36px] md:text-[56px]">
          <span className="text-faint">Computer science or finance?</span>
          <br />
          Why not both.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-muted">
          {education.degree}
          <br />
          {education.school} · {education.start} – {education.end} · {education.location}
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 lg:hidden" aria-hidden>
          <span className="size-12 overflow-hidden rounded-[14px] ring-1 ring-black/5">
            <Image src="/uwaterloo.jpeg" alt="" width={48} height={48} className="size-full object-cover" />
          </span>
          {floaters.slice(0, 4).map(({ tone, Icon }, i) => (
            <Tile key={i} tone={tone} className="size-12 rounded-[14px]">
              <Icon className="size-6" strokeWidth={2} />
            </Tile>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                          */
/* ------------------------------------------------------------------ */

export function ClosingCta() {
  return (
    <section className="shell py-24 text-center md:py-36">
      <Reveal>
        <h2 className="display text-[44px] md:text-[72px]">
          Got an idea?
          <br />
          Let&apos;s build it.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-muted">
          Always up for internships, interesting projects, and long conversations about AI or
          markets.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
          <Pill href={socials.email.href}>Say hi</Pill>
          <Pill href={socials.linkedin.href} variant="secondary">
            LinkedIn
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Pill>
        </div>
      </Reveal>
    </section>
  );
}
