import {NextConfig} from "next";
import {INFINITE_CACHE} from "next/dist/lib/constants";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    dynamicIO: true,
    cacheLife: {
      biweekly: {
        stale: 60 * 60 * 24 * 14,
        revalidate: 60 * 60 * 24 * 14,
        expire: INFINITE_CACHE,
      },
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
