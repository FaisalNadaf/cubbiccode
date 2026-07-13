/** @format */

import type { Metadata, Viewport } from "next";
import { Inter, Sora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { PageLoader } from "@/components/ui/PageLoader";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

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
	"<!--\n  Designed & Developed by Faisal Nadaf\n  Email : faisalfnadaf@gmail.com\n-->";

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default:
			"Cubiccode Top-Rated Website, Web App & ERP Development Company in India",
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
		title: "Cubiccode We Build Top-Rated Websites & Web Apps",
		description: site.metaDescription,
	},
	twitter: {
		card: "summary_large_image",
		title: "Cubiccode We Build Top-Rated Websites & Web Apps",
		description: site.metaDescription,
	},
	robots: { index: true, follow: true },
};

// Desktop browsers ignore the viewport meta entirely, so none of this can move
// a pixel at >= 1024px. `viewportFit: "cover"` is what makes env(safe-area-inset-*)
// resolve to anything other than 0 on a notched iPhone. Deliberately NO
// maximumScale / userScalable: blocking pinch-zoom is a WCAG 1.4.4 failure.
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(inter.variable, sora.variable, playfair.variable, "font-sans")}>
			<head>
				{/* Two pre-paint gates, both set before first paint so nothing flashes:
            1. `data-preloader-seen` — this session already watched the intro,
               so globals.css hides the overlay before hydration.
            2. `data-anim` — JS is running AND motion is wanted, so globals.css
               may safely pre-hide JS-animated headings ([data-split-reveal]).
               Absent for no-JS visitors and reduced-motion users, who then see
               the server-rendered text immediately. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `try{var d=document.documentElement;if(sessionStorage.getItem("cc-preloader-seen")==="1")d.setAttribute("data-preloader-seen","");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-anim","")}catch(e){}`,
					}}
				/>
				{/* Route-transition fade + preloader must never hide content when JS
            is unavailable (no-JS users + non-JS crawlers). */}
				<noscript>
					<style>{`[data-route-fade]{opacity:1 !important}[data-preloader]{display:none !important}[data-split-reveal]{opacity:1 !important}`}</style>
				</noscript>
			</head>
			<body className="min-h-screen bg-canvas font-sans text-ink">
				{/* Emits a genuine HTML comment into the page source. */}
				<div
					hidden
					dangerouslySetInnerHTML={{ __html: CREDIT_COMMENT }}
				/>
				<Preloader />
				{/* Subpage route-transition splash. Lives in the layout, not in
				    app/template.tsx, because template.tsx remounts on every navigation
				    and so could never observe the pathname changing. */}
				<PageLoader />
				<SmoothScroll>
					<ScrollProgress />
					<Cursor />
					<SiteChrome>{children}</SiteChrome>
				</SmoothScroll>
			</body>
		</html>
	);
}
