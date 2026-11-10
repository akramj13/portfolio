"use client";

import { useEffect, useRef } from "react";
import { clearShape, getHeroState, setHeroLive, subscribeHero } from "./hero-store";
import type { Field } from "./field-engine";

/**
 * Mounts the WebGL dot field behind the hero. The HTML heading renders first
 * and stays as the fallback; three.js loads in its own chunk once the browser
 * is idle, then takes over the name with a crossfade. Skipped entirely for
 * reduced motion, Save-Data, or when WebGL isn't available.
 */
export function HeroField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const hero = container?.parentElement;
    const anchor = hero?.querySelector<HTMLElement>("[data-hero-name]");
    if (!container || !hero || !anchor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;

    let field: Field | null = null;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const goLive = (live: boolean) => {
      hero.dataset.field = live ? "live" : "";
      setHeroLive(live);
    };

    const boot = async () => {
      await document.fonts.ready;
      // Measure only after the hero's own entrance animation has settled.
      const settling = hero
        .getAnimations({ subtree: true })
        .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished.catch(() => undefined));
      await Promise.all(settling);
      if (cancelled) return;

      const { createField } = await import("./field-engine");
      if (cancelled) return;
      try {
        field = await createField({
          container,
          anchor,
          onLive: () => goLive(true),
          onLost: () => goLive(false),
        });
      } catch {
        return; // No WebGL: the HTML heading simply stays.
      }
      if (cancelled) {
        field.destroy();
        return;
      }
      unsubscribe = subscribeHero(() => field?.setShape(getHeroState().shape));
    };

    // On touch, tapping anywhere outside a highlighted word brings the name back.
    const onTouch = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !(e.target as Element | null)?.closest?.("[data-morph]")) clearShape();
    };
    window.addEventListener("pointerdown", onTouch, { passive: true });

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void boot(), { timeout: 1200 })
      : window.setTimeout(() => void boot(), 300);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.removeEventListener("pointerdown", onTouch);
      unsubscribe?.();
      field?.destroy();
      goLive(false);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[1280px] -translate-x-1/2"
    />
  );
}
