/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { BniCalculator } from "./BniCalculator";
import { buildMetadata } from "@/lib/seo";

/**
 * /bni-investment-calculator
 *
 * A standalone tool built for Sarvesh Kakkeri and BNI Champions, Belgaum. It is
 * reachable by URL only — deliberately absent from the navbar, the footer, the
 * route map (`lib/routes.ts`) and the sitemap, so nothing on the site links to
 * it. To surface it later, add the path to `lib/routes.ts` + `content/seo.ts`
 * and it will flow into the sitemap on its own.
 *
 * It also renders bare, without the site's navbar and footer — see the
 * BARE_ROUTES set in `components/layout/SiteChrome.tsx`. That stays true after
 * the redesign: the tool is co-branded with BNI Champions and sits outside the
 * site's own navigation, so it carries the Cubiccode mark and the credit line
 * in a header of its own instead. Everything else is built from the site's
 * design system — same palette, type scale, radii, shadows and panels — so it
 * reads as a Cubiccode page rather than a separate product.
 *
 * It used to load Fraunces + Archivo for this route alone. Those are gone: the
 * page now uses the site's Inter/Sora pairing from the root layout, which is
 * one less type system to keep in sync and two fewer families to download.
 */

export const metadata = buildMetadata({
	path: "/bni-investment-calculator",
	title:
		"BNI Investment Calculator - Work Out What Your BNI Membership Should Return - BNI Champions, Belgaum",
	description:
		"Name the profit you want from BNI this year and this calculator reverse-solves the funnel: how many people to meet, how many 1-2-1s a week, and what every activity is worth. Built for BNI Champions, Belgaum.",
	keywords: [
		"BNI investment calculator",
		"BNI ROI calculator",
		"BNI Champions Belgaum",
		"BNI referral calculator",
		"business networking ROI",
	],
});

export default function BniInvestmentCalculatorPage() {
	return <BniCalculator />;
}
