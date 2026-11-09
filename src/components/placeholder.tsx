import type { CSSProperties, ReactNode } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type Tone =
  | "ink"
  | "slate"
  | "violet"
  | "blue"
  | "sky"
  | "green"
  | "lime"
  | "orange"
  | "red";

// Each tone is a soft two-stop gradient plus a solid used for tiles.
export const tones: Record<Tone, { from: string; to: string; solid: string; text: string }> = {
  ink: { from: "#2a2a2a", to: "#0d0d0d", solid: "#141414", text: "#ffffff" },
  slate: { from: "#e9eaee", to: "#cfd2da", solid: "#5b6170", text: "#141414" },
  violet: { from: "#c9b8ff", to: "#7b5cff", solid: "#6a46ff", text: "#ffffff" },
  blue: { from: "#8fb0ff", to: "#2f5bff", solid: "#2f5bff", text: "#ffffff" },
  sky: { from: "#d4ecff", to: "#7cc2ff", solid: "#3aa2ff", text: "#0b2540" },
  green: { from: "#c7f0d4", to: "#38c172", solid: "#1fa35b", text: "#0a2b18" },
  lime: { from: "#f0ffc2", to: "#b8f04a", solid: "#9bd923", text: "#1d2a05" },
  orange: { from: "#ffd2a8", to: "#ff7a1a", solid: "#ff6a00", text: "#2b1200" },
  red: { from: "#ffc0c0", to: "#ff4d4d", solid: "#f03a3a", text: "#2b0505" },
};

export function toneGradient(tone: Tone, angle = 145) {
  const t = tones[tone];
  return `linear-gradient(${angle}deg, ${t.from}, ${t.to})`;
}

/**
 * Stand-in for a real screenshot. Tinted gradient, faint dot grid and a
 * small label so it's obvious what image belongs here.
 */
export function Placeholder({
  tone = "slate",
  label,
  className,
  children,
}: {
  tone?: Tone;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const t = tones[tone];
  const dark = tone === "ink" || tone === "violet" || tone === "blue";
  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-3xl", className)}
      style={{ background: toneGradient(tone) }}
      role="img"
      aria-label={label ? `Placeholder image: ${label}` : "Placeholder image"}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `radial-gradient(${dark ? "rgb(255 255 255 / 0.18)" : "rgb(20 20 20 / 0.12)"} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
        }}
      />
      {children}
      {label && (
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] backdrop-blur-md"
          style={{
            background: dark ? "rgb(255 255 255 / 0.12)" : "rgb(255 255 255 / 0.6)",
            color: dark ? "rgb(255 255 255 / 0.8)" : t.text,
          }}
        >
          <ImageIcon className="size-3" aria-hidden />
          {label}
        </span>
      )}
    </div>
  );
}

/** A small "app icon" tile, used inline in headlines and as logos. */
export function Tile({
  tone,
  children,
  className,
  tilt = 0,
  style,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
  tilt?: number;
  style?: CSSProperties;
}) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_8px_24px_-8px_rgb(20_20_20/0.35)] ring-1 ring-black/5",
        // Callers can pass their own radius; otherwise use the default tile radius.
        !className?.includes("rounded-") && "rounded-[var(--radius-tile)]",
        className,
      )}
      style={{
        background: toneGradient(tone),
        color: t.text,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ["--tilt" as string]: `${tilt}deg`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
