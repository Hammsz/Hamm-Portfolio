import type { Metadata, Viewport } from "next";
import GlobalInteractions from "@/components/interactions/GlobalInteractions";
import MotionProvider from "@/components/motion/MotionProvider";
import { portfolioData } from "@/data/portfolio";
import "lenis/dist/lenis.css";
import "./globals.css";

const HERO_MOTION_BOOTSTRAP = `
  (() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.dataset.motion = reduceMotion ? "reduced" : "loading";
    root.dataset.loader = reduceMotion ? "reduced" : "pending";

    if (reduceMotion) return;

    window.setTimeout(() => {
      if (
        root.dataset.motion === "loading" &&
        root.dataset.heroMotionMounted !== "true"
      ) {
        root.dataset.heroMotionFallback = "visible";
      }
    }, 2000);

    window.setTimeout(() => {
      if (root.dataset.loader === "pending" || root.dataset.loader === "active") {
        root.dataset.loader = "fallback";
        root.dataset.heroMotionFallback = "visible";
      }
    }, 2450);
  })();
`;

export const metadata: Metadata = {
  title: portfolioData.fullName + " - Portfolio Draft",
  description: "Static portfolio draft for " + portfolioData.fullName + ".",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=gambarino@400&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: HERO_MOTION_BOOTSTRAP }} />
      </head>
      <body>
        <MotionProvider>
          <GlobalInteractions />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
