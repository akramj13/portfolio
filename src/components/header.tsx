"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { nav, site, socials } from "@/content/site";
import { LogoMark } from "@/components/icons";
import { cn } from "@/lib/cn";

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Floating pill navbar.
 * - Logo, links and the "say hi" button sit together in the middle.
 * - At the top of the page the bar has no background. Once you scroll it
 *   becomes a frosted pill and the logo gains a ring that fills with
 *   scroll progress.
 * - A soft gray highlight slides between links on hover. The active page is
 *   marked with a dot under its label, so link widths never change.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Which link the highlight sits behind (hovered or keyboard-focused).
  const [hovered, setHovered] = useState<string | null>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hoveredRef = useRef(hovered);
  const shownRef = useRef(false);

  // Size the highlight from the link as it is laid out right now. Measuring
  // only on mouseenter left it stale whenever the bar changed under the
  // cursor (switching pages, the name folding away on scroll, resizes).
  useLayoutEffect(() => {
    hoveredRef.current = hovered;
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    if (!indicator || !nav) return;
    const place = (animate: boolean) => {
      const link = hoveredRef.current ? linkRefs.current.get(hoveredRef.current) : undefined;
      if (!link) return;
      // When the highlight first appears, put it straight under the link
      // instead of sliding in from wherever it was last.
      if (!animate) indicator.style.transitionProperty = "opacity";
      indicator.style.left = `${link.offsetLeft}px`;
      indicator.style.width = `${link.offsetWidth}px`;
      if (!animate) {
        void indicator.offsetWidth; // commit the jump before re-enabling the slide
        indicator.style.transitionProperty = "";
      }
    };
    place(shownRef.current);
    shownRef.current = hovered !== null;
    const ro = new ResizeObserver(() => place(false));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [hovered, pathname, scrolled]);

  useEffect(() => {
    let frame = 0;
    let wasScrolled = false;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      // The ring is written straight to the SVG, so scrolling doesn't re-render
      // the header every frame. React only hears about it when the pill
      // style switches on or off.
      ringRef.current?.style.setProperty("stroke-dashoffset", String(RING_C * (1 - progress)));
      const isScrolled = y > 24;
      if (isScrolled !== wasScrolled) {
        wasScrolled = isScrolled;
        setScrolled(isScrolled);
      }
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

  const lenis = useLenis();

  // On the home page the logo glides back to the top instead of reloading the route.
  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    // Drop a leftover "#experience" so the URL matches where you end up.
    if (window.location.hash) window.history.replaceState(null, "", "/");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);


  return (
    <header className="pointer-events-none sticky top-0 z-50 h-[76px] px-3 pt-3">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex h-[52px] w-fit max-w-full animate-nav-in items-center justify-center gap-1 rounded-full pr-1.5 pl-2",
          "transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-spring)]",
          scrolled
            ? "bg-paper/85 shadow-[0_0_0_1px_var(--line),0_12px_32px_-12px_rgb(20_20_20/0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent",
        )}
      >
        {/* Logo with scroll-progress ring */}
        <Link
          href="/"
          aria-label={`${site.name}, home`}
          onClick={onLogoClick}
          className="group flex items-center gap-2 rounded-full pr-1"
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
                ref={ringRef}
                cx="20"
                cy="20"
                r={RING_R}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C}
              />
            </svg>
            <LogoMark className="h-[22px] w-auto transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-12 group-hover:scale-110" />
          </span>
          <span
            className={cn(
              "overflow-hidden text-[15px] font-semibold tracking-tight whitespace-nowrap transition-[max-width,opacity] duration-500",
              // The full name needs ~428px of bar, so phones show just the logo.
              scrolled ? "max-w-0 opacity-0" : "max-w-28 opacity-100 max-[440px]:max-w-0 max-[440px]:opacity-0",
            )}
          >
            akram jamil
          </span>
        </Link>

        {/* Links with a sliding hover highlight */}
        <nav
          ref={navRef}
          aria-label="Main"
          className="relative flex items-center"
          onMouseLeave={() => setHovered(null)}
        >
          <span
            ref={indicatorRef}
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-0 w-0 rounded-full bg-pill transition-[left,width,opacity] duration-300 ease-[var(--ease-spring)]",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  if (el) linkRefs.current.set(item.href, el);
                  else linkRefs.current.delete(item.href);
                }}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-9 items-center rounded-full px-3.5 text-[15px] font-medium transition-colors duration-200",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
                {/* Active marker: centred under the label, outside the flow so the link never resizes. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ink transition-[opacity,scale] duration-300 ease-[var(--ease-spring)]",
                    active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                  )}
                />
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
