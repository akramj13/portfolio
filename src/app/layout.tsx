import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/content/site";
import { baseOpenGraph } from "@/lib/metadata";
import "lenis/dist/lenis.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.title}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Akram Jamil",
    "akramj13",
    "University of Waterloo",
    "computer science",
    "financial management",
    "software engineer",
    "machine learning",
    "portfolio",
  ],
  // No canonical or share URL here: they'd be inherited by every page without
  // its own, including the 404. Each page sets its own.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  // Share titles and descriptions come from each page's own metadata.
  openGraph: baseOpenGraph,
  twitter: { card: "summary_large_image", creator: "@akramj_13" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // No CSS `scroll-behavior: smooth` here: Lenis does the smoothing, and the two fight each other.
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <SmoothScroll />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main
          id="content"
          className="relative z-10 flex-1 rounded-b-[2rem] bg-paper pb-20"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
