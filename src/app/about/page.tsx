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

export const metadata = {
	title: "About Us Transforming Businesses Since 2016 | Cubiccode",
	description:
		"Cubiccode Digital Media LLP is a full-stack ITES company born in Belagavi, now serving 500+ clients nationwide from offices in Belagavi and Bengaluru.",
};

export default function AboutPage() {
	return (
		<>
			{/* ───────────────────────── Hero (header banner) ───────────────────────── */}
			<PageHero
				kicker={aboutCopy.eyebrow}
				title={aboutCopy.headline}
				subtitle={aboutCopy.intro}
				image="/images/about/parallax-1.jpg"
				imageAlt="The Cubiccode team building websites and web apps"
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
						href="/journey"
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
