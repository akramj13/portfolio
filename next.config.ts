import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/admin/api/projects/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/admin/api/projects/**",
      },
    ],
  },
};

export default nextConfig;
