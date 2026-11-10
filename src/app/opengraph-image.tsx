import { site } from "@/content/site";
import { ogImage, ogSize } from "@/lib/og";

export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "akramj.com", title: "hey, i'm akram.", subtitle: site.description });
}
