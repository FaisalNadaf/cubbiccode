/** @format */

import type { Metadata } from "next";
import { Inter, Sora, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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

// Attribution comment, emitted verbatim into the HTML so it appears in
// "View Source". React strips normal JSX comments from output; the only way to
// keep a real HTML comment node is to write it via dangerouslySetInnerHTML.
const CREDIT_COMMENT =
	"<!--\n  Designed & Developed by Faisal Nadaf\n  Contact: faisalfnadaf@gmail.com\n-->";

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default:
			"Cubiccode  Top-Rated Website, Web App & ERP Development Company in India",
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
		title: "Cubiccode  We Build Top-Rated Websites & Web Apps",
		description: site.metaDescription,
	},
	twitter: {
		card: "summary_large_image",
		title: "Cubiccode  We Build Top-Rated Websites & Web Apps",
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
		<html
			lang="en"
			className={cn(
				inter.variable,
				sora.variable,
				playfair.variable,
				"font-sans",
				geist.variable,
			)}>
			<head>
				{/* Pre-paint gate for the first-load preloader: if this session has
            already seen it, flag <html> so globals.css hides the overlay
            before hydration  no flash on reloads / subsequent pages. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{if(sessionStorage.getItem("cc-preloader-seen")==="1")document.documentElement.setAttribute("data-preloader-seen","")}catch(e){}`,
					}}
				/>
				{/* Route-transition fade + preloader must never hide content when JS
            is unavailable (no-JS users + non-JS crawlers). */}
				<noscript>
					<style>{`[data-route-fade]{opacity:1 !important}[data-preloader]{display:none !important}`}</style>
				</noscript>
			</head>
			<body className="min-h-screen bg-canvas font-sans text-ink">
				{/* Emits a genuine HTML comment into the page source. */}
				<div
					hidden
					dangerouslySetInnerHTML={{ __html: CREDIT_COMMENT }}
				/>
				<Preloader />
				<SmoothScroll>
					<ScrollProgress />
					<Cursor />
					<SiteChrome>{children}</SiteChrome>
				</SmoothScroll>
			</body>
		</html>
	);
}
