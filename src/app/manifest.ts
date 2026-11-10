import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** /manifest.webmanifest — name and icons for "add to home screen". */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "akram",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
