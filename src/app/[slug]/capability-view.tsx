/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { capabilities, type Capability } from "@/content/capabilities";
import {
	capabilityFeatureImages,
	capabilityHeroImage,
	capabilityProblemImages,
} from "@/content/serviceImages";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { withDemoShots } from "@/lib/demoShots";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CardStack } from "@/components/ui/card-stack";
import { BuildShowcase } from "@/sections/capabilities/BuildShowcase";
import { OutcomeShowcase } from "@/sections/capabilities/OutcomeShowcase";
import { ProblemShowcase } from "@/sections/capabilities/ProblemShowcase";
import { HowWeDoItBetter } from "@/sections/shared/HowWeDoItBetter";

// Distinct titlebar icons per card (Lucide names)  mirrors the reference's
// per-card icon treatment. Neutral, feature-flavoured, cycled by index.
const FEATURE_ICONS = [
	"Code2",
	"Layers",
	"SlidersHorizontal",
	"Zap",
	"ShieldCheck",
	"Gauge",
	"Boxes",
	"Sparkles",
];
const featureIcon = (i: number) => FEATURE_ICONS[i % FEATURE_ICONS.length];

// Per-capability floating chips + badges for THE PROBLEM scene  each set is
// written to echo that capability's specific pain (Lucide names / short tags).
const PROBLEM_META: Record<string, { icons: string[]; badges: string[] }> = {
	"website-development": {
		icons: ["Gauge", "Smartphone", "TrendingDown"],
		badges: ["Slow load", "Dated on mobile", "Ranks nowhere", "Lost leads"],
	},
	"web-application-development": {
		icons: ["Table2", "Network", "Hourglass"],
		badges: ["Manual work", "Data silos", "Won't scale", "Spreadsheet chaos"],
	},
	"custom-erp": {
		icons: ["Network", "EyeOff", "Clock"],
		badges: [
			"Data silos",
			"No visibility",
			"Manual entry",
			"Month-end guesswork",
		],
	},
	"workflow-automation": {
		icons: ["ClipboardList", "Clock", "AlertTriangle"],
		badges: [
			"Manual tasks",
			"Wasted hours",
			"Human error",
			"Chasing approvals",
		],
	},
	seo: {
		icons: ["EyeOff", "Search", "TrendingDown"],
		badges: ["Invisible", "No traffic", "Page 2+", "Losing buyers"],
	},
};

// Features are authored as "Title description". Split on the em-dash so the
// card can style the lead and the detail differently; sentences without one
// become a standalone title.
function splitFeature(f: string): { title: string; detail: string } {
	const idx = f.indexOf("  ");
	return idx === -1 ?
			{ title: f, detail: "" }
		:	{ title: f.slice(0, idx), detail: f.slice(idx + 3) };
}

/**
 * Where a capability sends people to see the work that proves it.
 *
 * Each capability is proven by different evidence: web apps and custom ERP by
 * the case studies (`work.caseStudies`), SEO by its rankings, and everything
 * else by the website portfolio. Sending them all to the portfolio put web-app
 * visitors on a page of marketing sites.
 */
function workDestination(cap: Capability): { href: string; label: string } {
	if (cap.slug === "seo")
		return { href: routes.seoResults, label: "See SEO results" };
	if (cap.work?.caseStudies)
		return { href: routes.caseStudies, label: "View case studies" };
	return { href: routes.portfolio, label: "Explore our portfolio" };
}


export function CapabilityView({ cap }: { cap: Capability }) {
	const featImages = capabilityFeatureImages(cap.slug, cap.features.length);
	const workLink = workDestination(cap);

	// The fan's cards, built once and shared by both breakpoint branches of the
	// OUR WORK stack below.
	const work = cap.work;
	const workCards =
		work ?
			withDemoShots(work.items, cap.slug).map((w) => ({
				id: w.name,
				title: w.name,
				description: w.note,
				// Projects we have no shot of borrow a generic dashboard from
				// the demo pool — distinct per card — rather than showing the
				// flat placeholder art or another client's site.
				imageSrc: w.image,
				tag: work.tag,
			}))
		:	[];

	return (
		<>
			<PageHero
				kicker="Capability"
				title={cap.headline}
				subtitle={cap.subheadline}
				image={capabilityHeroImage(cap.slug)}
				imageAlt={`The Cubiccode team at work on ${cap.title}`}
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Capabilities", href: capabilities[0].path },
					{ label: cap.title },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href={site.proposalCta}
						external
						arrow
						variant="accent"
						size="lg">
						{cap.cta}
					</Button>
					<Button
						href={workLink.href}
						variant="outline"
						size="lg">
						See Our Work
					</Button>
				</div>
			</PageHero>

			{/* ============ THE PROBLEM ============ */}
			<section className="section relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative">
					<ProblemShowcase
						problem={cap.problem}
						images={capabilityProblemImages(cap.slug)}
						icons={PROBLEM_META[cap.slug]?.icons}
						badges={PROBLEM_META[cap.slug]?.badges}
					/>
				</div>
			</section>

			{/* ============ WHAT WE BUILD / DO ============ */}
			<section className="relative flex min-h-[85vh] items-center overflow-hidden bg-canvas-soft py-16">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(60%_55%_at_50%_40%,#000,transparent)] opacity-40" />
				<div className="container-x relative w-full">
					<BuildShowcase
						buildHeading={cap.buildHeading}
						items={cap.features.map((f, i) => {
							const { title, detail } = splitFeature(f);
							return {
								title,
								detail,
								image: featImages[i],
								icon: featureIcon(i),
							};
						})}
					/>
				</div>
			</section>

			{/* ============ HOW WE DO IT BETTER ============ */}
			<HowWeDoItBetter
				blocks={cap.solution}
				cta={cap.cta}
			/>

			{/* ============ WHAT YOU'LL BUILD (training only) ============ */}
			{cap.buildAfter && cap.buildAfter.length > 0 && (
				<section className="section relative bg-canvas">
					<div className="container-x">
						<SectionHeading
							align="center"
							kicker="Portfolio-ready outcomes"
							title="What you'll be able to build after this course"
							intro="You won't just understand code you'll have shipped real, portfolio-ready projects."
						/>
						<RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{cap.buildAfter.map((b, i) => (
								<RevealItem key={b.title}>
									<article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift">
										<span className="font-display text-5xl font-bold leading-none text-steel-100 transition-colors duration-300 group-hover:text-corporate-100">
											{String(i + 1).padStart(2, "0")}
										</span>
										<h3 className="mt-5 text-xl font-semibold text-ink">
											{b.title}
										</h3>
										<p className="mt-3 text-[15px] leading-relaxed text-steel-600">
											{b.text}
										</p>
									</article>
								</RevealItem>
							))}
						</RevealGroup>
					</div>
				</section>
			)}

			{/* ============ RESULT / WHAT YOU GET ============ */}
			{cap.result && cap.results && cap.results.length > 0 && (
				<OutcomeShowcase
					lead={cap.result}
					outcomes={cap.results}
					cta={
						cap.slug === "seo" ?
							{ href: routes.seoResults, label: "See our SEO results" }
						:	undefined
					}
				/>
			)}

			{/* ============ OUR WORK ============ */}
			{cap.work && cap.work.items.length > 0 && (
				<section className="section relative overflow-hidden bg-canvas">
					<div className="container-x">
						<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
							<SectionHeading
								kicker="Our work"
								title={cap.work.heading}
							/>
							<Link
								href={routes.portfolio}
								className="tap-target group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700">
								Explore our portfolio
								<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</div>
					</div>

					{/* Full-bleed card stack  spans the viewport so the fan isn't clipped */}
					<div className="relative mt-12 w-full">
						{/* A 440px card is wider than a phone, so the active card's tag and
						    title fall off both edges. Under sm the same fan runs on a
						    phone-sized card: 288px clears a 320px screen, and 288+80 still
						    fills the stack's 380px stage, so no dead space opens above it.
						    From sm up — every width the 440px card already fits, desktop
						    included — the original stack renders untouched. */}
						<div className="sm:hidden">
							<CardStack
								items={workCards}
								loop
								autoAdvance
								intervalMs={3200}
								pauseOnHover
								cardWidth={288}
								cardHeight={300}
								cta={{ label: workLink.label, href: workLink.href }}
							/>
						</div>
						<div className="hidden sm:block">
							<CardStack
								items={workCards}
								loop
								autoAdvance
								intervalMs={3200}
								pauseOnHover
								cardWidth={440}
								cardHeight={290}
								cta={{ label: workLink.label, href: workLink.href }}
							/>
						</div>
					</div>

				</section>
			)}
		</>
	);
}
