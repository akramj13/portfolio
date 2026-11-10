import Image from "next/image";
import { ArrowRight, PenLine } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import { JsonLd } from "@/components/json-ld";
import { HeroField } from "@/components/hero/hero-field";
import { HeroPrefix } from "@/components/hero/hero-prefix";
import { MorphWord } from "@/components/hero/morph-word";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { Pill } from "@/components/pill";
import { ProjectIcon } from "@/components/project-icon";
import { Tile } from "@/components/placeholder";
import { Row, Section } from "@/components/resume";
import { ShowMore } from "@/components/show-more";
import { education, roleLogo, roles, shortDate, type Role } from "@/content/experience";
import { formatDate, publishedPosts } from "@/content/posts";
import { projects } from "@/content/projects";
import { site, socials } from "@/content/site";

const VISIBLE_ROLES = 5;
const VISIBLE_PROJECTS = 3;

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
        <CompanyLogo
          source={roleLogo(role)}
          alt=""
          className="rounded-[12px] ring-1 ring-black/12 shadow-[0_1px_2px_rgb(20_20_20/0.08)]"
          fallback={
            <Tile tone={role.tone} className="size-10 rounded-[12px] text-[13px] font-bold">
              {role.monogram}
            </Tile>
          }
        />
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          alternateName: site.handle,
          url: site.url,
          image: `${site.url}/icon-512.png`,
          email: `mailto:${site.email}`,
          description: site.description,
          jobTitle: current.title,
          worksFor: { "@type": "Organization", name: current.company },
          alumniOf: { "@type": "CollegeOrUniversity", name: education.school, url: "https://uwaterloo.ca" },
          sameAs: [socials.github.href, socials.linkedin.href, socials.x.href],
        }}
      />
      {/*
        Intro. The HTML name renders first; once WebGL loads, HeroField redraws it as a dot
        field that reacts to the cursor and morphs when the dotted words are hovered.
      */}
      <section className="group/hero relative pt-12 md:pt-20">
        <HeroField />
        {/* CSS-only entrance: the intro shouldn't wait for JavaScript to show up. */}
        <div className="column relative animate-rise-in">
          {/* One sentence at one size; on narrow screens "akram." drops to its own line. */}
          <h1 className="display text-[clamp(3.5rem,11vw,5.75rem)] leading-[1.02]">
            <HeroPrefix />{" "}
            <span
              data-hero-name
              className="transition-opacity duration-500 group-data-[field=live]/hero:opacity-0"
            >
              akram.
            </span>
          </h1>
          <p className="mt-5 text-[18px] leading-[1.55] text-muted">
            i&apos;m a <span className="font-medium text-ink">cs &amp; finance</span> double major at
            the <MorphWord shape="waterloo">university of waterloo</MorphWord> who spends way too much
            time <MorphWord shape="code">coding</MorphWord> and{" "}
            <MorphWord shape="markets">trading</MorphWord>. outside of classes i build startups, hack
            on side projects, and mess around with <MorphWord shape="ai">ai</MorphWord>.
          </p>

          {/* Plain <a> so Lenis handles the smooth in-page scroll instead of the router. */}
          <a
            href="#experience"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pill py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-pill-hover"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            now: {current.title.toLowerCase()} @ {current.company}
          </a>

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
        </div>
      </section>

      <div className="column mt-10">
        <hr className="border-line" />
      </div>

      <Section label="studying at" delay={60}>
        <Row
          icon={
            <span className="size-10 shrink-0 overflow-hidden rounded-[12px] ring-1 ring-black/12 shadow-[0_1px_2px_rgb(20_20_20/0.08)]">
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
        {projects.slice(0, VISIBLE_PROJECTS).map((p) => (
          <Row
            key={p.slug}
            href={`/projects/${p.slug}`}
            icon={<ProjectIcon src={p.icon} tone={p.tone} size={40} className="rounded-[12px]" />}
            title={p.title}
            badge={p.badge}
            subtitle={p.tagline}
            metaBottom={p.duration}
          />
        ))}
        {projects.length > VISIBLE_PROJECTS && (
          <Pill href="/projects" variant="secondary" size="sm" className="mt-2 h-8 px-3 text-[13px]">
            see more projects
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Pill>
        )}
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
