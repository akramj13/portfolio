"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { HERO_PREFIX } from "./hero-copy";
import { useHeroState } from "./hero-store";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz<>/@$%#*";
const STEP_MS = 45; // how often scrambling letters change
const SPREAD_MS = 320; // left-to-right spread of when letters settle

type Glyph = { ch: string; done: boolean };

const settled = (text: string): Glyph[] => [...text].map((ch) => ({ ch, done: true }));

/**
 * The "hey, i'm" part of the heading. When the dot field morphs into a shape,
 * this decodes into a phrase that fits it ("i write", "i trade"…): letters
 * scramble and settle left to right, in step with the dots sweeping across.
 *
 * The real text stays in place (transparent) so the heading's layout and its
 * accessible name never change; the animated copy is an overlay on top.
 */
export function HeroPrefix() {
  const { shape, live } = useHeroState();
  const target = HERO_PREFIX[shape ?? "name"];
  const [glyphs, setGlyphs] = useState(() => settled(HERO_PREFIX.name));
  const shown = useRef(HERO_PREFIX.name);

  useEffect(() => {
    if (!live || shown.current === target) return;
    shown.current = target;
    const settleAt = [...target].map((_, i) => (i / target.length) * SPREAD_MS + Math.random() * 90);
    const end = Math.max(...settleAt);
    const start = performance.now();
    let lastStep = -1;
    let raf = 0;

    const tick = (now: number) => {
      const t = now - start;
      const stepIndex = Math.floor(t / STEP_MS);
      if (stepIndex !== lastStep || t >= end) {
        lastStep = stepIndex;
        setGlyphs(
          [...target].map((ch, i) =>
            t >= settleAt[i] || ch === " "
              ? { ch, done: true }
              : { ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], done: false },
          ),
        );
      }
      if (t < end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, live]);

  return (
    <span className="relative whitespace-nowrap">
      <span className={cn(live && "opacity-0")}>{HERO_PREFIX.name}</span>
      {live && (
        // Absolutely placed, so a longer or shorter phrase never reflows the heading.
        <span aria-hidden className="absolute top-0 left-0 leading-[normal] whitespace-pre">
          {glyphs.map((g, i) => (
            <span key={i} className={g.done ? undefined : "text-faint"}>
              {g.ch}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
