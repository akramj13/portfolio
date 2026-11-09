"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { pillClass } from "@/components/pill";
import { cn } from "@/lib/cn";

/** Hides extra rows behind a small "show N more" pill. */
export function ShowMore({ count, noun, children }: { count: number; noun: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(pillClass("secondary", "sm"), "mt-2 h-8 px-3 text-[13px]")}
      >
        {open ? "show less" : `show ${count} more ${noun}`}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
    </>
  );
}
