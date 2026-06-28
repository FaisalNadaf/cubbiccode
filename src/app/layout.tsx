import type { Metadata } from "next";
import { Inter, Sora, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Cursor } from "@/components/ui/Cursor";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// High-contrast editorial display serif (used by the Origin·Objects showcase).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Cubiccode — Top-Rated Website, Web App & ERP Development Company in India",
    template: "%s · Cubiccode",
  },
  description: site.metaDescription,
  keywords: [
    "web development company India",
    "website designing Belgaum",
    "web application development",
    "custom ERP software",
    "Laravel React development",
    "SEO company India",
    "Cubiccode",
  ],
  authors: [{ name: site.legalName }],
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.legalName,
    title: "Cubiccode — We Build Top-Rated Websites & Web Apps",
    description: site.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cubiccode — We Build Top-Rated Websites & Web Apps",
    description: site.metaDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, sora.variable, playfair.variable, "font-sans", geist.variable)}>
      <head>
        {/* Route-transition fade must never hide content when JS is unavailable
            (no-JS users + non-JS crawlers) — force it fully visible. */}
        <noscript>
          <style>{`[data-route-fade]{opacity:1 !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
