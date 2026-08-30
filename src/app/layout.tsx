import type { Metadata, Viewport } from "next";
import { portfolioData } from "@/data/portfolio";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
