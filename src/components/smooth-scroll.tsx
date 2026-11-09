"use client";

import { ReactLenis } from "lenis/react";

/**
 * Site-wide smooth scrolling with Lenis, driven off the page's own scroll.
 * - `anchors` smoothly scrolls same-page links like "#experience", and
 *   honours each target's `scroll-margin-top`.
 * - `stopInertiaOnNavigate` kills leftover momentum when a link opens another
 *   page, so the new page starts at the top.
 * Lenis turns smoothing off by itself for people who prefer reduced motion.
 */
export function SmoothScroll() {
  return <ReactLenis root options={{ anchors: true, stopInertiaOnNavigate: true }} />;
}
