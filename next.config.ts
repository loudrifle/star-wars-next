import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "akabab.github.io" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.starwars.com" },
      { protocol: "https", hostname: "**.wikia.nocookie.net" },
      { protocol: "https", hostname: "**.nocookie.net" },
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      { protocol: "https", hostname: "vignette.wikia.nocookie.net" },
    ],
  },
};

export default nextConfig;
