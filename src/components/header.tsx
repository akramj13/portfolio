"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { nav, site, socials } from "@/content/site";
import { GitHubIcon, LinkedInIcon, LogoMark, XIcon } from "@/components/icons";
import { pillClass } from "@/components/pill";
import { cn } from "@/lib/cn";

const iconLinks = [
  { ...socials.github, Icon: GitHubIcon },
  { ...socials.linkedin, Icon: LinkedInIcon },
  { ...socials.x, Icon: XIcon },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes (including back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // On the home page the "Say hi" pill slides in once you scroll; elsewhere it's always there.
  const showCta = pathname !== "/" || scrolled;

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-paper/90 backdrop-blur-xl transition-[box-shadow] duration-300",
          scrolled && "shadow-[0_1px_0_var(--line)]",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1148px] items-center gap-8 px-6">
          <Link href="/" aria-label={`${site.name}, home`} className="-m-1 flex items-center gap-2.5 p-1">
            <LogoMark className="h-7 w-auto" />
            <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">akram</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[16px] font-medium transition-colors hover:text-ink",
                  isActive(item.href) ? "text-ink" : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            {iconLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-pill"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
            <span aria-hidden className="mx-3 h-6 w-px bg-line" />
            <a href={socials.email.href} className={pillClass("ghost", "md")}>
              Email
            </a>
            <div
              className={cn(
                "grid transition-[grid-template-columns,opacity] duration-500 ease-out",
                showCta ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <a
                  href={socials.email.href}
                  tabIndex={showCta ? 0 : -1}
                  className={cn(pillClass("primary", "md"), "ml-1")}
                >
                  Say hi
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto grid size-10 place-items-center rounded-full bg-pill md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-paper px-6 pb-10 md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col pt-6">
          {[{ href: "/", label: "Home" }, ...nav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-[32px] font-semibold tracking-[-0.03em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-wrap gap-2">
          {iconLinks.map(({ href, label, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className={pillClass("secondary", "md")}>
              <Icon className="size-4" />
              {label}
              <ArrowUpRight className="size-4 text-muted" />
            </a>
          ))}
        </div>
        <a href={socials.email.href} className={cn(pillClass("primary", "md"), "mt-6 w-full")}>
          Say hi — {site.email}
        </a>
      </div>
    </>
  );
}
