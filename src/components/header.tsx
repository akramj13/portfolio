"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, socials } from "@/content/site";
import { LogoMark } from "@/components/icons";
import { cn } from "@/lib/cn";

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Floating pill navbar.
 * - At the top of the page it sits flat and spans the reading column.
 * - Once you scroll it shrinks into a frosted pill and the logo gains a
 *   ring that fills with scroll progress.
 * - A soft gray highlight slides between links on hover.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);
  const [lastHover, setLastHover] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 24);
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const highlight = (el: HTMLAnchorElement) => {
    const { offsetLeft: left, offsetWidth: width } = el;
    setHover({ left, width });
    setLastHover({ left, width });
  };

  // The highlight keeps its last position while hidden, so the next hover slides in from there.
  const indicator = hover ?? lastHover;

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-[76px] px-3 pt-3">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-[52px] w-full animate-nav-in items-center gap-2 rounded-full pr-1.5 pl-2",
          "transition-[max-width,background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-spring)]",
          scrolled
            ? "max-w-[392px] bg-paper/85 shadow-[0_0_0_1px_var(--line),0_12px_32px_-12px_rgb(20_20_20/0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "max-w-[696px] bg-transparent",
        )}
      >
        {/* Logo with scroll-progress ring */}
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          className="group mr-auto flex items-center gap-2 rounded-full"
        >
          <span className="relative grid size-10 place-items-center">
            <svg
              viewBox="0 0 40 40"
              className={cn(
                "absolute inset-0 -rotate-90 transition-opacity duration-500",
                scrolled ? "opacity-100" : "opacity-0",
              )}
              aria-hidden
            >
              <circle cx="20" cy="20" r={RING_R} fill="none" stroke="var(--line)" strokeWidth="2" />
              <circle
                cx="20"
                cy="20"
                r={RING_R}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - progress)}
              />
            </svg>
            <LogoMark className="h-[22px] w-auto transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110" />
          </span>
          <span
            className={cn(
              "overflow-hidden text-[15px] font-semibold tracking-tight whitespace-nowrap transition-[max-width,opacity] duration-500",
              scrolled ? "max-w-0 opacity-0" : "max-w-20 opacity-100 max-[380px]:max-w-0 max-[380px]:opacity-0",
            )}
          >
            akram
          </span>
        </Link>

        {/* Links with a sliding hover highlight */}
        <nav aria-label="Main" className="relative flex items-center" onMouseLeave={() => setHover(null)}>
          <span
            aria-hidden
            className={cn(
              "absolute inset-y-0 rounded-full bg-pill transition-[left,width,opacity] duration-300 ease-[var(--ease-spring)]",
              hover ? "opacity-100" : "opacity-0",
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => highlight(e.currentTarget)}
                onFocus={(e) => highlight(e.currentTarget)}
                onBlur={() => setHover(null)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[15px] font-medium transition-colors duration-200",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {active && <span aria-hidden className="size-1.5 rounded-full bg-ink" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={socials.email.href}
          className="group ml-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-ink pr-3.5 pl-3 text-[14px] font-semibold text-paper transition-[background-color,transform] duration-300 ease-[var(--ease-spring)] hover:scale-[1.04] hover:bg-ink-soft active:scale-95"
        >
          <span aria-hidden className="inline-block origin-[70%_70%] group-hover:animate-wave">
            👋
          </span>
          say hi
        </a>
      </div>
    </header>
  );
}
