import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

/**
 * How Markdown elements render inside posts. Typography comes from
 * `.prose-post` in globals.css; this file only swaps in smarter elements.
 */
const components = {
  // Internal links use the router; external ones open in a new tab.
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  // Images from /public, sized to the column and served responsively.
  img: ({ src = "", alt = "" }) => (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="(min-width: 720px) 672px, calc(100vw - 48px)"
      className="h-auto w-full rounded-2xl ring-1 ring-black/10"
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
