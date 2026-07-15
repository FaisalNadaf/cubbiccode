/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { CTASection } from "@/components/layout/CTASection";
import { PageHero } from "@/components/layout/PageHero";
import { SeoDashboard } from "@/components/seo/SeoDashboard";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.seoResults);

export default function SeoResultsPage() {
	return (
		<>
			<PageHero
				kicker="SEO results"
				title="Ranked where your buyers are already searching."
				subtitle="Google Search, AI answer engines and the local map-pack every ranking below is live-verifiable in one click."
				image="/images/Headerimages/_DSC9850.JPG"
				imageAlt="A Cubiccode strategist presenting a search analytics dashboard"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "SEO Results" },
				]}
			/>
			<SeoDashboard />
	
		</>
	);
}
