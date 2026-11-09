import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  secondary: "bg-pill text-ink hover:bg-pill-hover",
  ghost: "text-ink hover:bg-pill",
  inverse: "bg-paper text-ink hover:bg-surface-strong",
};

const sizes = {
  md: "h-11 px-4 text-[15px]",
  sm: "h-9 px-3.5 text-sm",
};

export function pillClass(variant: Variant = "primary", size: keyof typeof sizes = "md") {
  return cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-semibold tracking-[0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    sizes[size],
    variants[variant],
  );
}

/** Pill-shaped link. External URLs open in a new tab. */
export function Pill({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href">) {
  const external = /^(https?:|mailto:)/.test(href);
  const cls = cn(pillClass(variant, size), "group", className);
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
