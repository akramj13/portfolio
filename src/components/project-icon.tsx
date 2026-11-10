"use client";

import Image from "next/image";
import { useState } from "react";
import { FolderCode } from "lucide-react";
import { Tile, type Tone } from "@/components/placeholder";
import { cn } from "@/lib/cn";

const tileLook =
  "shrink-0 shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_8px_24px_-8px_rgb(20_20_20/0.35)] ring-1 ring-black/5";

/**
 * A project's app icon. `src` is an image path (e.g. "/projects/cotabby.svg"
 * in /public) or a full URL. SVG is best (sharp at any size, tiny files);
 * PNG or WebP at 128×128 or larger also work. With no `src`, or if the file
 * fails to load, it shows a placeholder tile in the project's colour.
 */
export function ProjectIcon({
  src,
  tone,
  size,
  className,
}: {
  src?: string;
  tone: Tone;
  /** Rendered width and height in pixels. */
  size: number;
  /** Extra classes, usually a `rounded-[…]` radius to match the context. */
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <Tile tone={tone} className={cn("shrink-0", className)} style={{ width: size, height: size }}>
        <FolderCode style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={2} aria-hidden />
      </Tile>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      // Icons are tiny and often SVG, so serve the file as-is.
      unoptimized
      onError={() => setFailed(true)}
      className={cn(tileLook, "object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
