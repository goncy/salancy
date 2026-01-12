import {NextConfig} from "next";
import {INFINITE_CACHE} from "next/dist/lib/constants";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    cacheLife: {
      months: {
        stale: 60 * 60 * 24 * 30,
        revalidate: 60 * 60 * 24 * 30,
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
