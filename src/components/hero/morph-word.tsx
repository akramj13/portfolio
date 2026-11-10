"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hideShape, showShape, toggleShape, useHeroState, type HeroShape } from "./hero-store";

/**
 * A word in the intro that morphs the hero's dot field into a shape.
 * Hover it with a mouse, or tap it on touch. Until the field is live it is
 * plain highlighted text, so nothing promises an effect that isn't there.
 */
export function MorphWord({ shape, children }: { shape: HeroShape; children: ReactNode }) {
  const { shape: active, live } = useHeroState();
  const pointerType = useRef("");
  const on = live && active === shape;

  return (
    <span
      data-morph={shape}
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (live && e.pointerType !== "touch") showShape(shape);
      }}
      onPointerLeave={(e) => {
        if (live && e.pointerType !== "touch") hideShape(shape);
      }}
      onClick={() => {
        if (live && pointerType.current === "touch") toggleShape(shape);
      }}
      className={cn(
        "font-medium text-ink",
        live &&
          "cursor-default underline decoration-dotted decoration-[1.5px] underline-offset-[5px] transition-[text-decoration-color] duration-200",
        live && (on ? "decoration-ink" : "decoration-faint"),
      )}
    >
      {children}
    </span>
  );
}
