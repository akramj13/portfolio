import Link from "next/link";
import { cacheLife } from "next/cache";
import { nav, site, socials } from "@/content/site";
import { GitHubIcon, LinkedInIcon, LogoMark, XIcon } from "@/components/icons";

async function CopyrightYears() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  return <>{site.since === year ? year : `${site.since}–${year}`}</>;
}

const columns = [
  {
    title: "Site",
    links: [{ href: "/", label: "Home" }, ...nav],
  },
  {
    title: "Elsewhere",
    links: [socials.github, socials.linkedin, socials.x],
  },
  {
    title: "Contact",
    links: [{ href: socials.email.href, label: site.email }],
  },
];

export function Footer() {
  return (
    <footer className="relative -mt-10 overflow-hidden bg-night pt-10 text-paper">
      <div className="mx-auto max-w-[1148px] px-6 pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_auto]">
          <div className="max-w-xs">
            <LogoMark className="h-8 w-auto" />
            <p className="mt-5 text-[15px] leading-relaxed text-white/55">
              cs &amp; finance at waterloo. building software, shipping ml, trading markets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm text-white/45">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => {
                    const external = /^(https?:|mailto:)/.test(l.href);
                    const cls = "text-[16px] text-white/90 transition-colors hover:text-white";
                    return (
                      <li key={l.href}>
                        {external ? (
                          <a
                            href={l.href}
                            className={cls}
                            {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link href={l.href} className={cls}>
                            {l.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse gap-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYears /> {site.name}. Built with Next.js.
          </p>
          <div className="flex items-center gap-1">
            {[
              { ...socials.github, Icon: GitHubIcon },
              { ...socials.x, Icon: XIcon },
              { ...socials.linkedin, Icon: LinkedInIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized, cropped wordmark */}
      <p
        aria-hidden
        className="pointer-events-none mt-10 -mb-[0.32em] select-none whitespace-nowrap text-center text-[25vw] leading-[0.8] font-bold tracking-[-0.06em] text-night-soft"
      >
        akram
      </p>
    </footer>
  );
}
