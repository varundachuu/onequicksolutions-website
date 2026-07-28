import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/solution-blueprints",
        permanent: true,
      },
      {
        source: "/hr-consultancy",
        destination: "/hr-consulting",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
