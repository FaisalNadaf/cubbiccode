/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { CTASection } from "@/components/layout/CTASection";
import { PageHero } from "@/components/layout/PageHero";
import { SeoProcess } from "@/components/seo/SeoProcess";
import { SeoStats } from "@/components/seo/SeoStats";
import { SeoAnalytics } from "@/components/seo/SeoAnalytics";
import { SeoDashboard } from "@/components/seo/SeoDashboard";

export const metadata = {
	title: "AI Search & SEO Performance | Cubiccode",
	description:
		"See the local businesses Cubiccode ranks across Google Search, AI answer engines and the local map-pack — 18+ clients, 11 industries and 7 cities, each ranking live-verifiable in one click.",
};

export default function SeoResultsPage() {
	return (
		<>
			<PageHero
				kicker="SEO results"
				title="Ranked where your buyers are already searching."
				subtitle="Google Search, AI answer engines and the local map-pack  every ranking below is live-verifiable in one click."
				imageAlt="Cubiccode SEO and search visibility results"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "SEO Results" },
				]}
			/>
			<SeoProcess />
			<SeoStats />
			<SeoAnalytics />
			<SeoDashboard />
			<CTASection
				title="Want your business ranking for the searches that matter?"
				subtitle="Tell us your service and target city — we'll audit your Google, local and AI-search visibility and come back with a clear, prioritised plan to get you ranked."
			/>
		</>
	);
}
