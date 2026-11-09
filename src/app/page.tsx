import Image from "next/image";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { GitHubIcon, LinkedInIcon, LogoMark, XIcon, projectIcons } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { Pill } from "@/components/pill";
import { Tile } from "@/components/placeholder";
import { Row, Section } from "@/components/resume";
import { ShowMore } from "@/components/show-more";
import { education, roles, shortDate, type Role } from "@/content/experience";
import { formatDate, publishedPosts } from "@/content/posts";
import { projects } from "@/content/projects";
import { site, socials } from "@/content/site";

const VISIBLE_ROLES = 5;
const VISIBLE_PROJECTS = 5;

/** Full date range on wider screens, MM/YY on phones. */
function DateRange({ start, end }: { start: string; end: string }) {
  return (
    <>
      <span className="sm:hidden">
        {shortDate(start)} – {shortDate(end)}
      </span>
      <span className="max-sm:hidden">
        {start} – {end}
      </span>
    </>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <Row
      icon={
        <Tile tone={role.tone} className="size-10 rounded-[12px] text-[13px] font-bold">
          {role.monogram}
        </Tile>
      }
      title={role.company}
      subtitle={role.title}
      metaTop={[role.location, role.mode].filter(Boolean).join(" · ") || undefined}
      metaBottom={<DateRange start={role.start} end={role.end} />}
    />
  );
}

export default function HomePage() {
  const current = roles[0];
  const shownRoles = roles.slice(0, VISIBLE_ROLES);
  const extraRoles = roles.slice(VISIBLE_ROLES);

  return (
    <>
      {/* Intro */}
      <section className="column pt-12 md:pt-20">
        <Reveal>
          <h1 className="display text-[48px] md:text-[64px]">
            hey, i&apos;m
            <Tile
              tone="ink"
              tilt={-6}
              className="mx-[0.14em] size-[0.86em] translate-y-[0.06em] animate-float rounded-[0.24em] align-baseline"
            >
              <LogoMark className="h-[0.42em] w-auto text-paper" />
            </Tile>
            akram.
          </h1>
          <p className="mt-5 text-[18px] leading-[1.55] text-muted">
            i&apos;m a <span className="font-medium text-ink">cs &amp; finance</span> double major at
            the <span className="font-medium text-ink">university of waterloo</span> who spends way
            too much time coding and trading. outside of classes i build startups, hack on side
            projects, and mess around with ai.
          </p>

          <Link
            href="#experience"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pill py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-pill-hover"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            now: {current.title.toLowerCase()} @ {current.company}
          </Link>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {[
              { ...socials.email, label: site.email, Icon: null },
              { ...socials.linkedin, Icon: LinkedInIcon },
              { ...socials.github, Icon: GitHubIcon },
              { ...socials.x, Icon: XIcon },
            ].map(({ href, label, Icon }) => (
              <li key={href}>
                <Pill href={href} variant="secondary" size="sm" className="h-8 px-3 text-[13px]">
                  {Icon && <Icon className="size-3.5" />}
                  {label}
                </Pill>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <div className="column mt-10">
        <hr className="border-line" />
      </div>

      <Section label="studying at" delay={60}>
        <Row
          icon={
            <span className="size-10 shrink-0 overflow-hidden rounded-[12px] ring-1 ring-black/5">
              <Image src="/uwaterloo.jpeg" alt="" width={40} height={40} className="size-full object-cover" />
            </span>
          }
          title={education.school}
          subtitle={education.degree}
          metaTop={education.location}
          metaBottom={<DateRange start={education.start} end={education.end} />}
        />
      </Section>

      <Section id="experience" label="experience" count={roles.length} delay={60}>
        {shownRoles.map((r) => (
          <RoleRow key={`${r.company}-${r.start}`} role={r} />
        ))}
        {extraRoles.length > 0 && (
          <ShowMore count={extraRoles.length} noun="roles">
            {extraRoles.map((r) => (
              <RoleRow key={`${r.company}-${r.start}`} role={r} />
            ))}
          </ShowMore>
        )}
      </Section>

      <Section
        label="building"
        count={projects.length}
        action={{ href: "/projects", label: "all projects" }}
        delay={60}
      >
        {projects.slice(0, VISIBLE_PROJECTS).map((p) => {
          const Icon = projectIcons[p.icon];
          return (
            <Row
              key={p.slug}
              href={`/projects/${p.slug}`}
              icon={
                <Tile tone={p.tone} className="size-10 rounded-[12px]">
                  <Icon className="size-[18px]" strokeWidth={2} />
                </Tile>
              }
              title={p.title}
              badge={p.badge}
              subtitle={p.tagline}
              metaBottom={p.duration}
            />
          );
        })}
      </Section>

      <Section label="writing" action={{ href: "/writing", label: "all writing" }} delay={60}>
        {publishedPosts.map((post) => (
          <Row
            key={post.slug}
            href={`/writing/${post.slug}`}
            icon={
              <Tile tone="slate" className="size-10 rounded-[12px]">
                <PenLine className="size-[18px]" strokeWidth={2} />
              </Tile>
            }
            title={post.title}
            subtitle={post.excerpt}
            metaBottom={formatDate(post.date)}
          />
        ))}
      </Section>

      <section className="column mt-14">
        <Reveal className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div>
            <p className="text-[18px] font-semibold tracking-[-0.02em]">want to build something together?</p>
            <p className="mt-1 text-[15px] text-muted">
              open to internships, interesting projects, and long chats about ai or markets.
            </p>
          </div>
          <Pill href={socials.email.href} className="shrink-0">
            say hi
          </Pill>
        </Reveal>
      </section>
    </>
  );
}
