import type { Metadata } from "next";
/*
  Fonts are self-hosted from npm rather than next/font/google.

  next/font/google also self-hosts, but it downloads the files from
  fonts.googleapis.com at build time, so the build needs network access to
  Google and fails in an offline or restricted CI environment. The
  @fontsource-variable packages ship the woff2 files in node_modules, which
  makes the build hermetic and reproducible. Same two families, same CSS
  variable names, nothing downstream changes.
*/
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kumail Rizvi, Software Engineer",
    template: "%s - Kumail Rizvi",
  },
  description:
    "Software engineer building AI-integrated products end to end. Live, working demos of every project, not screenshots.",
  openGraph: {
    title: "Kumail Rizvi, Software Engineer",
    description:
      "Software engineer building AI-integrated products end to end. Live, working demos of every project, not screenshots.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
