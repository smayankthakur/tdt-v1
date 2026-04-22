import path from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(fileURLToPath(import.meta.url), "src");
    return config;
  },
};

export default nextConfig;
