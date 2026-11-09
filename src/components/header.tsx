"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, socials } from "@/content/site";
import { LogoMark } from "@/components/icons";
import { pillClass } from "@/components/pill";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-paper/85 backdrop-blur-xl transition-[box-shadow] duration-300",
        scrolled && "shadow-[0_1px_0_var(--line)]",
      )}
    >
      <div className="column flex h-16 items-center gap-5">
        <Link href="/" aria-label={`${site.name}, home`} className="-m-1 mr-auto flex items-center gap-2 p-1">
          <LogoMark className="h-6 w-auto" />
          <span className="text-[15px] font-semibold tracking-tight max-[380px]:hidden">akram</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-ink",
                isActive(item.href) ? "text-ink" : "text-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={socials.email.href} className={cn(pillClass("primary", "sm"), "h-8 px-3 text-[13px]")}>
          say hi
        </a>
      </div>
    </header>
  );
}
