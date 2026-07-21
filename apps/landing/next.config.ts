import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal workspace packages ship raw TS/TSX; Next compiles them in-app.
  transpilePackages: ["@barrena/ui"],
};

export default nextConfig;
