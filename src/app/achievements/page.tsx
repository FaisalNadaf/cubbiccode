/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RecognitionZigzag } from "@/components/achievements/RecognitionZigzag";
import { site } from "@/content/site";

export const metadata = {
	title: "Achievements  Awards & Recognition | Cubiccode",
	description:
		"Recognised by the industry and trusted by the market  the awards and honours that mark Cubiccode's track record.",
};

export default function AchievementsPage() {
	return (
		<>
			{/* ───────────────────────── Hero (header banner) ───────────────────────── */}
			<PageHero
				kicker="Recognition"
				title="Recognised by the industry. Trusted by the market."
				subtitle="Awards are nice. What they really represent is a decade of clients who got results."
				image="/images/Moments/award-bg.jpg"
				imageAlt="Cubiccode receiving industry awards and recognition"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: "/about" },
					{ label: "Achievements" },
				]}>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						Get a Proposal
					</Button>
					<Button
						href="/contact"
						variant="outline">
						Get in touch
					</Button>
				</div>
			</PageHero>

			{/* ───────────────────────── Recognition  heading ───────────────────────── */}
			<section className="relative overflow-hidden bg-canvas pt-16 sm:pt-20 lg:pt-24">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative">
					<SectionHeading
						kicker="Awards & Honours"
						title="A decade of recognition"
						intro="From national start-up rankings to global excellence awards and the TEDx stage  the milestones that mark the way we work."
					/>
				</div>
			</section>

			{/* Scroll-pinned slideshow  kept OUTSIDE any overflow-hidden ancestor so
          the sticky viewport works (same as the Journey timeline). */}
			<RecognitionZigzag />
		</>
	);
}
