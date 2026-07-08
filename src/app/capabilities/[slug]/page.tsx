/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, Check, Play, Sparkles } from "lucide-react";
import { capabilities, capabilityBySlug } from "@/content/capabilities";
import {
	capabilityFeatureImages,
	capabilityProblemImages,
} from "@/content/serviceImages";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CardStack } from "@/components/ui/card-stack";
import { BuildShowcase } from "@/sections/capabilities/BuildShowcase";
import { ProblemShowcase } from "@/sections/capabilities/ProblemShowcase";

export function generateStaticParams() {
	return capabilities.map((c) => ({ slug: c.slug }));
}

// Real Cubiccode project screenshots for the "Our Work" card stack.
// Exact matches by name; the rest cycle the available pool (swap in precise
// shots as they're added to /public/images/portfolio).
const WORK_IMAGE: Record<string, string> = {
	"Harsha & Rakesh Salon": "/images/portfolio/harsha-rakesh.jpg",
	CityIndex: "/images/portfolio/city-index.jpg",
};
const WORK_IMAGE_POOL = [
	"/images/portfolio/prions-biotech.jpg",
	"/images/portfolio/woodpecker-exotic.jpg",
	"/images/portfolio/aishwarya-cottons.png",
	"/images/portfolio/laxis-analytics.jpg",
	"/images/portfolio/city-index.jpg",
	"/images/portfolio/harsha-rakesh.jpg",
];
const workImage = (name: string, i: number) =>
	WORK_IMAGE[name] ?? WORK_IMAGE_POOL[i % WORK_IMAGE_POOL.length];

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

// Features are authored as "Title  description". Split on the em-dash so the
// card can style the lead and the detail differently; sentences without one
// become a standalone title.
function splitFeature(f: string): { title: string; detail: string } {
	const idx = f.indexOf("  ");
	return idx === -1 ?
			{ title: f, detail: "" }
		:	{ title: f.slice(0, idx), detail: f.slice(idx + 3) };
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const cap = capabilityBySlug(slug);
	if (!cap) return { title: "Capability not found" };
	return {
		title: `${cap.title}  ${site.name}`,
		description: cap.subheadline,
	};
}

export default async function CapabilityPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const cap = capabilityBySlug(slug);
	if (!cap) notFound();

	const others = capabilities.filter((c) => c.slug !== cap.slug);
	const featImages = capabilityFeatureImages(cap.slug, cap.features.length);

	return (
		<>
			<PageHero
				kicker="Capability"
				title={cap.headline}
				subtitle={cap.subheadline}
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Capabilities", href: "/capabilities/website-development" },
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
						href="/case-studies"
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
			<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
				<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.14]" />
				<div className="pointer-events-none absolute -left-24 top-1/3 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
				<div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
					<div>
						<span className="kicker !text-corporate-300">
							How we do it better
						</span>
						<p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-white lg:text-[1.6rem] lg:leading-[1.4]">
							{cap.solution}
						</p>
						<div className="mt-9">
							<Button
								href={site.proposalCta}
								external
								variant="accent"
								arrow>
								{cap.cta}
							</Button>
						</div>
					</div>

					{/* video card */}
					<div className="relative">
						<figure className="group relative overflow-hidden rounded-4xl border border-white/10 shadow-lift">
							<div className="relative aspect-video w-full">
								<video
									className="absolute inset-0 h-full w-full object-cover"
									autoPlay
									muted
									loop
									playsInline
									preload="metadata"
									poster="/images/no.png">
									<source
										src="/videos/demo.mp4"
										type="video/mp4"
									/>
								</video>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
								<span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-transform duration-300 group-hover:scale-105">
									<Play className="size-6 translate-x-0.5 fill-white text-white" />
								</span>
							</div>
						</figure>
						<span className="absolute -left-3 -top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lift">
							<Sparkles className="size-3.5 text-corporate-600" />{" "}
							{site.certification}
						</span>
					</div>
				</div>
			</section>

			{/* ============ WHAT YOU'LL BUILD (training only) ============ */}
			{cap.buildAfter && cap.buildAfter.length > 0 && (
				<section className="section relative bg-canvas">
					<div className="container-x">
						<SectionHeading
							align="center"
							kicker="Portfolio-ready outcomes"
							title="What you'll be able to build after this course"
							intro="You won't just understand code  you'll have shipped real, portfolio-ready projects."
						/>
						<RevealGroup className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
			{cap.result && (
				<section className="section relative overflow-hidden bg-canvas-soft">
					<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-50" />
					<div className="container-x relative">
						<div className="mx-auto max-w-3xl rounded-4xl border border-steel-200 bg-white p-10 text-center shadow-soft lg:p-14">
							<span className="kicker justify-center">What you get</span>
							<p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-ink lg:text-2xl">
								{cap.result}
							</p>
						</div>
					</div>
				</section>
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
								href="/portfolio"
								className="group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700">
								Explore our portfolio
								<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</div>
					</div>

					{/* Full-bleed card stack  spans the viewport so the fan isn't clipped */}
					<div className="relative mt-12 w-full">
						<CardStack
							items={cap.work.items.map((w, i) => ({
								id: w.name,
								title: w.name,
								description: w.note,
								imageSrc: workImage(w.name, i),
							}))}
							loop
							autoAdvance
							intervalMs={3200}
							pauseOnHover
							cardWidth={440}
							cardHeight={290}
						/>
					</div>

					{cap.work.caseStudies && (
						<div className="container-x mt-12">
							<Button
								href="/case-studies"
								variant="outline"
								arrow>
								View case studies
							</Button>
						</div>
					)}
				</section>
			)}
		</>
	);
}
