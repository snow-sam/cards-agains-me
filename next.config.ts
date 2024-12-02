import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    SERVER_HOST: process.env.SERVER_HOST,
    SERVER_PORT: process.env.SERVER_PORT
  },
};

export default nextConfig;
