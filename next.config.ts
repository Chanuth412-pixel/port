import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/port" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/gh/devicons/devicon@v2.16.0/icons/**" }],
  },
};

export default nextConfig;
