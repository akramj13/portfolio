import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Self-contained server in .next/standalone, so the Docker image needs no node_modules.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Blog posts are .mdx files imported from src/content/writing.
const withMDX = createMDX({});

export default withMDX(nextConfig);
