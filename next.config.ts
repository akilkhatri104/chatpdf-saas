import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    'https://812568c68320af.lhr.life'
  ]
};

export default nextConfig;
