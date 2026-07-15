/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CaseStudyPanel } from "@/components/case-studies/CaseStudyPanel";
import { CountStat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Sparkline } from "@/components/charts/Sparkline";
import { CHART } from "@/components/charts/theme";
import { caseStudies } from "@/content/portfolio";
import { CASE_CHARTS, AGGREGATE_STATS } from "@/lib/caseStudyCharts";
import { SIGNATURE } from "@/lib/caseStudyMetrics";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.caseStudies);

// On-dark sparkline hues for the closing balance-sheet band.
const AGG_COLORS = [
	CHART.blue.onDark,
	CHART.teal.onDark,
	CHART.amber.onDark,
	CHART.violet.onDark,
];

export default function CaseStudiesPage() {
	return (
		<>
			<PageHero
				kicker="Case studies"
				title="Real platforms, running real businesses at scale"
				subtitle="These aren't concept demos. They're production systems powering ₹4,185M+ in transactions managing crores in assets, thousands of users and millions in monthly volume, every single day."
				image="/images/Headerimages/_DSC9803.jpg"
				imageAlt="A Cubiccode engineer building a production web application"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Work" },
					{ label: "Case Studies" },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href={routes.portfolio}
						arrow>
						Explore the portfolio
					</Button>
					<Button
						href={routes.clientele}
						variant="outline">
						Our clientele
					</Button>
				</div>
			</PageHero>

			{/* Analytics dashboard — one live panel per production system */}
			<section className="relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative py-16 lg:py-24">
					<div className="mb-12 max-w-3xl lg:mb-16">
						<Reveal>
							<span className="kicker">Production telemetry</span>
						</Reveal>
						<Reveal delay={0.1}>
							<h2 className="mt-4 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
								Six platforms, measured by what they move
							</h2>
						</Reveal>
						<Reveal delay={0.18}>
							<p className="mt-4 max-w-2xl text-lg leading-relaxed text-steel-600">
								Every panel below is a live system. The numbers are real
								production figures; the charts trace how each platform grew into
								them.
							</p>
						</Reveal>
					</div>

					<div className="space-y-10 sm:space-y-14 lg:space-y-20">
						{caseStudies.map((c, i) => (
							<CaseStudyPanel
								key={c.slug}
								c={c}
								data={CASE_CHARTS[c.slug]}
								sig={SIGNATURE[c.slug]}
								index={i}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Consolidated results  ink balance-sheet band */}
			<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
					<div className="absolute left-1/2 top-0 size-[560px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
				</div>
				<div className="container-x relative">
					<div className="mx-auto max-w-3xl text-center">
						<Reveal>
							<span className="kicker justify-center text-corporate-300">
								Consolidated results
							</span>
						</Reveal>
						<Reveal delay={0.1}>
							<h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-white sm:text-4xl lg:text-5xl">
								Software that carries real economic weight
							</h2>
						</Reveal>
						<Reveal delay={0.2}>
							<p className="mt-5 text-lg leading-relaxed text-steel-300">
								Across every platform we&apos;ve shipped, the numbers add up to
								infrastructure businesses genuinely depend on.
							</p>
						</Reveal>
					</div>

					<RevealGroup
						stagger={0.1}
						className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
						{AGGREGATE_STATS.map((s, i) => (
							<RevealItem
								key={s.label}
								className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-center lg:p-6">
								<span className="mx-auto grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-corporate-300">
									<Icon
										name={s.icon}
										className="size-[18px]"
										strokeWidth={1.75}
									/>
								</span>
								<CountStat
									value={s.value}
									prefix={s.prefix}
									suffix={s.suffix}
									decimals={s.decimals ?? 0}
									className="mt-4 block font-display text-4xl font-bold tracking-tightest tabular-nums text-white sm:text-5xl"
								/>
								<p className="mx-auto mt-2 max-w-[170px] text-sm leading-relaxed text-steel-300">
									{s.label}
								</p>
								<div className="mt-4 opacity-80">
									<Sparkline
										data={s.spark}
										color={AGG_COLORS[i % AGG_COLORS.length]}
										height={36}
										strokeWidth={2}
									/>
								</div>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>
		</>
	);
}
