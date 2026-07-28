import type { NextConfig } from "next";

// Note: locally, `.next` is an NTFS junction pointing outside this Dropbox-
// synced folder (see project setup) to avoid Dropbox's file watcher locking
// build-cache files (Next.js requires distDir to stay under the project
// root, so redirecting at the filesystem level is the only option).
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;
