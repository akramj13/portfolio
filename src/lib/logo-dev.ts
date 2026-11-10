/**
 * Company logos from the logo.dev CDN (https://www.logo.dev/docs/logo-images/introduction).
 *
 * By default a logo is looked up by company name, so adding a role only needs
 * the company's name. Name lookups return the closest brand match; if that
 * picks the wrong company, pin it with the company's domain instead, which is
 * exact. Requires NEXT_PUBLIC_LOGO_DEV_KEY (a publishable pk_ key, safe to
 * expose); without it, no logo URL is produced and callers show a fallback.
 */

/** How to find a company's logo: by brand name (default) or by exact domain. */
export type LogoSource = { name: string } | { domain: string };

const token = process.env.NEXT_PUBLIC_LOGO_DEV_KEY;

export function logoUrl(source: LogoSource, size: number): string | null {
  if (!token) return null;
  const path =
    "domain" in source ? encodeURIComponent(source.domain) : `name/${encodeURIComponent(source.name)}`;
  const params = new URLSearchParams({
    token,
    size: String(size),
    retina: "true",
    format: "webp",
    // Return 404 instead of logo.dev's generated monogram, so we can show our own.
    fallback: "404",
  });
  return `https://img.logo.dev/${path}?${params}`;
}
