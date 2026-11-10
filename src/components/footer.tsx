import { cacheLife } from "next/cache";
import { site, socials } from "@/content/site";
import { GitHubIcon, LinkedInIcon, LogoMark, XIcon } from "@/components/icons";

async function CopyrightYears() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  return <>{site.since === year ? year : `${site.since}–${year}`}</>;
}

const icons = [
  { ...socials.github, Icon: GitHubIcon },
  { ...socials.linkedin, Icon: LinkedInIcon },
  { ...socials.x, Icon: XIcon },
];

export function Footer() {
  return (
    <footer className="relative -mt-8 overflow-hidden bg-night pt-8 text-paper">
      <div className="column flex flex-wrap items-center gap-x-6 gap-y-4 pt-10">
        <LogoMark className="h-6 w-auto" />
        <p className="mr-auto text-sm text-white/50">
          © <CopyrightYears /> {site.name}
        </p>
        <div className="flex items-center gap-1">
          {icons.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-[17px]" />
            </a>
          ))}
        </div>
      </div>

      {/* Cropped wordmark */}
      <p
        aria-hidden
        className="pointer-events-none mt-6 -mb-[0.34em] select-none text-center text-[clamp(6rem,19vw,15rem)] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-night-soft"
      >
        akram
      </p>
    </footer>
  );
}
