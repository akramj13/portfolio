"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { logoUrl, type LogoSource } from "@/lib/logo-dev";

/**
 * A company's logo from logo.dev, drawn over a fallback (usually a monogram
 * tile). The fallback shows while the logo loads and stays if there's no
 * logo, so rows never show a broken image or shift when the logo arrives.
 */
export function CompanyLogo({
  source,
  alt,
  size = 40,
  className,
  fallback,
}: {
  /** Where to look the logo up; `false` skips the lookup and keeps the fallback. */
  source: LogoSource | false;
  alt: string;
  size?: number;
  className?: string;
  fallback: ReactNode;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const src = source ? logoUrl(source, size) : null;

  return (
    <span className={cn("relative block shrink-0 overflow-hidden", className)} style={{ width: size, height: size }}>
      {fallback}
      {src && status !== "failed" && (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          // logo.dev already sizes and compresses the image, so skip Next's optimizer.
          unoptimized
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
          className={cn(
            "absolute inset-0 size-full bg-paper object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
