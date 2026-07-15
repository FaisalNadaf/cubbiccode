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
import { CollectChat } from "@/components/ui/CollectChat";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { COLLECT_ID } from "@/lib/collectchat";
import { site } from "@/content/site";
import { pageSeo } from "@/content/seo";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
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

// Every page writes its own full <title> in the keyword-first house style, so
// there is deliberately no `template` here — a "· Cubiccode" suffix would push
// the tail of already-long titles past what Google renders. `pageSeo.home`
// supplies the default for anything that forgets to set one.
export const metadata: Metadata = {
	...buildMetadata(pageSeo.home),
	metadataBase: new URL(site.url),
	title: { default: pageSeo.home.title, template: "%s" },
	applicationName: site.legalName,
	authors: [{ name: site.legalName }],
	creator: site.legalName,
	publisher: site.legalName,
	category: "Web Design & Development",
	icons: { icon: "/favicon.png", apple: "/favicon.png" },
	formatDetection: { telephone: true, address: true, email: true },
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
			// The inline <head> script below sets data-preloader-seen / data-anim on
			// <html> before hydration, so the client tree intentionally differs from
			// the server HTML on this element. suppressHydrationWarning silences that
			// one expected mismatch; it applies only one level deep, so real
			// mismatches anywhere inside the tree are still reported.
			suppressHydrationWarning
			className={cn(
				inter.variable,
				sora.variable,
				playfair.variable,
				"font-sans",
			)}>
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
				{/* Collect.chat's bot id. `launcher.js` reads this global once, at
				    execution time, and never polls or retries — if it is missing at that
				    instant the bot silently never loads, forever. So it is set here, in
				    the head, before anything else can run. (next/script's
				    `beforeInteractive` defers to Next's own bootstrap queue; this is the
				    same guarantee without the indirection, and it matches the preloader
				    gate above.) The launcher itself loads late — see ui/CollectChat.tsx. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.CollectId=${JSON.stringify(COLLECT_ID)};`,
					}}
				/>
				{/* Company + site graph, on every page. Individual pages add their own
				    Service / BreadcrumbList nodes that point back at these @ids. */}
				<JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
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
					{/* Every page, including the bare brand gates: the dock and the bot are
					    site-wide. Mounted here rather than in template.tsx, which remounts on
					    every navigation and would replay the entrance each time. */}
					<FloatingContact />
					<SiteChrome>{children}</SiteChrome>
				</SmoothScroll>
				<CollectChat />
			</body>
		</html>
	);
}
