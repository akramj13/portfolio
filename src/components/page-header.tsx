import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";

/** Compact, left-aligned title block for inner pages. */
export function PageHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <header className="column pt-12 md:pt-20">
      <Reveal>
        <h1 className="display text-[48px] md:text-[64px]">{title}</h1>
        {children && <div className="mt-4 text-[18px] leading-[1.55] text-muted">{children}</div>}
      </Reveal>
    </header>
  );
}
