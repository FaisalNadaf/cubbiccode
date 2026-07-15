/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { StoryStack } from "@/components/about/StoryStack";
import { VisionMissionShowcase } from "@/components/about/VisionMissionShowcase";
import { aboutCopy } from "@/content/company";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.about);

export default function AboutPage() {
	return (
		<>
			{/* ───────────────────────── Hero (header banner) ───────────────────────── */}
			<PageHero
				kicker={aboutCopy.eyebrow}
				title={aboutCopy.headline}
				subtitle={aboutCopy.intro}
				image="/images/Headerimages/_DSC9794.JPG"
				imageAlt="The Cubiccode team building websites and web apps in the Belgaum studio"
				breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						Get a Proposal
					</Button>
					<Button
						href={routes.journey}
						variant="outline">
						Our journey
					</Button>
				</div>
			</PageHero>

			{/* ────────────── Who we are (2016 · story · 2026 — pointer-driven stack) ────────────── */}
			<StoryStack />

			{/* ───────────────────────── Vision & Mission ───────────────────────── */}
			<VisionMissionShowcase />
		</>
	);
}
