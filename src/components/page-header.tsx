import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";

/** Big centered title block used at the top of inner pages. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="shell pt-16 pb-12 text-center md:pt-24 md:pb-16">
      <Reveal>
        {eyebrow && <p className="text-[15px] text-muted">{eyebrow}</p>}
        <h1 className="display mx-auto mt-4 max-w-[14ch] text-[48px] md:text-[80px]">{title}</h1>
        {children && (
          <div className="mx-auto mt-6 max-w-[34rem] text-[18px] leading-[1.45] text-muted md:text-[20px]">
            {children}
          </div>
        )}
      </Reveal>
    </header>
  );
}
