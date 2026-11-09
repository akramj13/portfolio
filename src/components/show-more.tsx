"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Hides extra rows behind a small "show N more" pill.
 * - The hidden rows slide open smoothly and fade in one after another.
 * - The button label rolls to the new text while the pill resizes to fit it.
 */
export function ShowMore({ count, noun, children }: { count: number; noun: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Only animate the label after the first click, so it doesn't roll in on page load.
  const [toggled, setToggled] = useState(false);
  const [labelWidth, setLabelWidth] = useState<number>();
  const id = useId();

  // Track the current label's width so the pill can animate between sizes.
  const measureLabel = useCallback((el: HTMLSpanElement | null) => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setLabelWidth(Math.ceil(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rows = Children.toArray(children);

  return (
    <>
      <div
        id={id}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        {/* Negative margin keeps row hover backgrounds from being clipped. */}
        <div className="-mx-3 min-h-0 overflow-hidden px-3">
          {rows.map((row, i) => (
            <div
              key={isValidElement(row) ? row.key : i}
              style={{ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" }}
              className={cn(
                "transition-[opacity,translate,filter] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                open
                  ? "translate-y-0 opacity-100 blur-none duration-500"
                  : "-translate-y-2 opacity-0 blur-[2px] duration-200",
              )}
            >
              {row}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          setOpen((v) => !v);
          setToggled(true);
        }}
        className="group mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-pill px-3 text-[13px] font-semibold tracking-[0.01em] whitespace-nowrap text-ink transition-[background-color,scale] duration-300 ease-[var(--ease-spring)] hover:bg-pill-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-95"
      >
        <span
          className="inline-flex overflow-hidden transition-[width] duration-500 ease-[var(--ease-spring)]"
          style={{ width: labelWidth }}
        >
          <span
            key={open ? "less" : "more"}
            ref={measureLabel}
            className={cn("w-max", toggled && "animate-label-in")}
            style={{ "--label-from": open ? "100%" : "-100%" } as CSSProperties}
          >
            {open ? "show less" : `show ${count} more ${noun}`}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 transition-[rotate,translate] duration-500 ease-[var(--ease-spring)]",
            open ? "rotate-180 group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5",
          )}
        />
      </button>
    </>
  );
}
