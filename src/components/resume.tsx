import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";

/** A labelled resume block: "studying at", "experience", "building"… */
export function Section({
  id,
  label,
  count,
  action,
  delay = 0,
  children,
}: {
  id?: string;
  label: string;
  count?: number;
  action?: { href: string; label: string };
  delay?: number;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id ?? label}-label`} className="column mt-12 scroll-mt-24">
      <Reveal delay={delay}>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 id={`${id ?? label}-label`} className="text-[15px] font-medium text-muted">
            {label}
            {count !== undefined && <span className="ml-1.5 text-faint">{count}</span>}
          </h2>
          {action && (
            <Link
              href={action.href}
              className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
            >
              {action.label}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>
        {children}
      </Reveal>
    </section>
  );
}

/**
 * One resume line: icon on the left, title + subtitle, and meta on the right.
 * Rendered as a link (with a soft gray hover surface) when `href` is set.
 */
export function Row({
  href,
  icon,
  title,
  badge,
  subtitle,
  metaTop,
  metaBottom,
}: {
  href?: string;
  icon: ReactNode;
  title: ReactNode;
  badge?: string;
  subtitle: ReactNode;
  metaTop?: ReactNode;
  metaBottom?: ReactNode;
}) {
  const body = (
    <>
      {icon}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[16px] leading-snug font-semibold tracking-[-0.01em]">
          <span className="truncate">{title}</span>
          {href && (
            <ArrowUpRight className="size-3.5 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
          )}
          {badge && (
            <span className="ml-0.5 shrink-0 rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold tracking-normal text-paper max-sm:hidden">
              {badge}
            </span>
          )}
        </p>
        <p className="mt-0.5 truncate text-[14px] text-muted">{subtitle}</p>
      </div>
      {(metaTop || metaBottom) && (
        <div className="shrink-0 text-right text-[13px] leading-snug text-muted tabular-nums">
          {metaTop && <p className="max-sm:hidden">{metaTop}</p>}
          {metaBottom && <p className={cn(Boolean(metaTop) && "sm:mt-0.5")}>{metaBottom}</p>}
        </div>
      )}
    </>
  );

  const base = "-mx-3 flex items-center gap-3.5 rounded-2xl px-3 py-2.5";
  if (!href) return <div className={base}>{body}</div>;

  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(base, "group transition-colors hover:bg-surface")}>
      {body}
    </a>
  ) : (
    <Link href={href} className={cn(base, "group transition-colors hover:bg-surface")}>
      {body}
    </Link>
  );
}
