import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // The Fibonacci-sphere archive (public/demos/kumail-sphere.html) is the
      // portfolio now - it carries every project, a working contact form, and
      // a resume link, so the old React homepage at app/page.tsx is retired.
      // This rewrite serves the static sphere file straight at "/" without
      // changing the URL, and runs before the filesystem/page routes so it
      // wins over app/page.tsx.
      beforeFiles: [
        {
          source: "/",
          destination: "/demos/kumail-sphere.html",
        },
      ],
    };
  },
};

export default nextConfig;
