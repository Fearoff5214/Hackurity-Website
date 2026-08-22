import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure Three.js can compile and bundle correctly
  transpilePackages: ["three"],
};

export default nextConfig;
