import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Three.js can compile and bundle correctly
  transpilePackages: ["three"],
};

export default nextConfig;
