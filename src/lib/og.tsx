import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/** Shared look for every social share image: white card, AJ mark, big title. */
export const ogSize = { width: 1200, height: 630 };

export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          color: "#141414",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="38" height="40" viewBox="150 160 630 675" fill="#ffffff">
              <path
                fillRule="evenodd"
                d="M168 815 455 180h133l147 330c17 38 23 75 23 115 0 105-88 190-198 190h-30v-98h25c55 0 97-45 97-102 0-30-12-63-30-97l-102 42c-90 38-155 80-190 160l-52 95Zm262-330 89-194 60 131Z"
              />
            </svg>
          </div>
          <div style={{ fontSize: 30, color: "#707070" }}>{eyebrow}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 34, color: "#707070", lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a3a3a3" }}>
          <div>{site.name}</div>
          <div>{site.url.replace("https://", "")}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
