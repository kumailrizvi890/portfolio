import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    The "/" rewrite to public/demos/kumail-sphere.html has been removed.

    That static file was serving as the homepage, which meant the React app
    underneath it was unreachable: the work grid, the skills and experience
    sections, the contact form and every live demo route were all built and
    shipped but could only be found by typing the URL. It also shipped its own
    Playfair Display and Inter from Google Fonts, so the site loaded two font
    families that the rest of the app does not use, and 1.7MB of JPEGs for
    thumbnails that never render wider than ~180px.

    The sphere itself was the good part, so it has been rebuilt in WebGL as the
    hero of the real homepage instead (see components/project-sphere.tsx). The
    original file is still served at /demos/kumail-sphere.html if you want to
    compare them side by side.
  */
};

export default nextConfig;
