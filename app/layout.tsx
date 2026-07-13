import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { ViewportMode } from "./components/ViewportMode";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} | Canada Based Coaching`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["coaching institute", "PCM coaching", "IELTS coaching", "French classes", "Canada"],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Canada Based Coaching`,
    description: siteConfig.description,
    url: "/",
    images: [{ url: "/logo.png", alt: `${siteConfig.name} logo` }],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} | Canada Based Coaching`,
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <TooltipProvider>
          <ViewportMode />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
