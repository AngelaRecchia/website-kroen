import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com" },
      { protocol: "https", hostname: "a2.storyblok.com" },
      { protocol: "https", hostname: "c.animaapp.com" },
    ],
  },
};

export default nextConfig;
