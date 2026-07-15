/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RecognitionStack } from "@/components/achievements/RecognitionStack";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.achievements);

export default function AchievementsPage() {
	return (
		<>
			{/* ───────────────────────── Hero (header banner) ───────────────────────── */}
			<PageHero
				kicker="Recognition"
				title="Recognised by the industry. Trusted by the market."
				subtitle="Awards are nice. What they really represent is a decade of clients who got results."
				image="/images/Headerimages/acchiveements.JPG"
				imageAlt="Awards, trophies and press coverage on the wall at the Cubiccode studio"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: routes.about },
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
						href={routes.contact}
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
						intro="From national start-up rankings to global excellence awards and the TEDx stage the milestones that mark the way we work."
					/>
				</div>
			</section>

			{/* Scroll-pinned slideshow  kept OUTSIDE any overflow-hidden ancestor so
          the sticky viewport works (same as the Journey timeline). */}
			<section className="relative bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [-webkit-mask-image:radial-gradient(80%_50%_at_50%_0%,#000,transparent)] [mask-image:radial-gradient(80%_50%_at_50%_0%,#000,transparent)] opacity-50" />
				<RecognitionStack />
			</section>
		</>
	);
}
