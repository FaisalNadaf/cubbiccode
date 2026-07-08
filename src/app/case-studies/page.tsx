/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CountStat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { caseStudies } from "@/content/portfolio";
import { cn } from "@/lib/utils";

export const metadata = {
	title: "Case Studies  Real Platforms at Scale | Cubiccode",
	description:
		"Our web apps and custom ERPs power ₹4,185M+ in transactions, manage ₹250 Cr+ in assets and run real businesses at 99.99% uptime. Explore Cubiccode's production case studies.",
};

const impact = [
	{ value: 250, prefix: "₹", suffix: " Cr+", label: "Assets under management" },
	{ value: 4185, prefix: "₹", suffix: "M+", label: "Transactions powered" },
	{ value: 99.99, suffix: "%", decimals: 2, label: "Platform uptime" },
	{ value: 60, suffix: "K+", label: "Users onboarded" },
];

export default function CaseStudiesPage() {
	return (
		<>
			<PageHero
				kicker="Case studies"
				title="Real platforms, running real businesses at scale"
				subtitle="These aren't concept demos. They're production systems powering ₹4,185M+ in transactions  managing crores in assets, thousands of users and millions in monthly volume, every single day."
				image="/images/about/about-4.jpg"
				imageAlt="Production platforms engineered by Cubiccode"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Work" },
					{ label: "Case Studies" },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href="/portfolio"
						arrow>
						Explore the portfolio
					</Button>
					<Button
						href="/clientele"
						variant="outline">
						Our clientele
					</Button>
				</div>
			</PageHero>

			{/* Feature blocks  zig-zag */}
			<section className="relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative space-y-20 py-20 lg:space-y-28 lg:py-28">
					{caseStudies.map((c, i) => {
						const dark = i % 2 === 1;
						return (
							<Reveal
								key={c.slug}
								amount={0.2}>
								<article
									className={cn(
										"grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14",
										dark && "lg:[&>*:first-child]:order-2",
									)}>
									{/* Copy side */}
									<div className={cn(dark && "lg:pl-4")}>
										<span className="kicker">{c.category}</span>
										<h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-[2.75rem]">
											{c.name}
										</h2>
										<p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-steel-600">
											{c.tagline}
										</p>
										<div className="mt-8 flex flex-wrap items-center gap-4">
											<Button
												href={c.link}
												external
												arrow>
												Read on LinkedIn
											</Button>
											<span className="inline-flex items-center gap-2 text-sm font-medium text-steel-500">
												<span className="flex size-2 items-center justify-center">
													<span className="size-2 animate-pulse rounded-full bg-corporate-500" />
												</span>
												Live in production
											</span>
										</div>
									</div>

									{/* Metric grid side */}
									<MetricGrid
										stats={c.stats}
										index={i}
										dark={dark}
									/>
								</article>
							</Reveal>
						);
					})}
				</div>
			</section>

			{/* Combined impact band  ink/navy */}
			<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
					<div className="absolute left-1/2 top-0 size-[560px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
				</div>
				<div className="container-x relative">
					<div className="mx-auto max-w-3xl text-center">
						<Reveal>
							<span className="kicker justify-center text-corporate-300">
								Combined impact
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
						className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
						{impact.map((s) => (
							<RevealItem
								key={s.label}
								className="text-center">
								<CountStat
									value={s.value}
									prefix={s.prefix}
									suffix={s.suffix}
									decimals={s.decimals ?? 0}
									className="font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl"
								/>
								<p className="mx-auto mt-3 max-w-[170px] text-sm leading-relaxed text-steel-300">
									{s.label}
								</p>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>
		</>
	);
}

function MetricGrid({
	stats,
	index,
	dark,
}: {
	stats: { icon: string; label: string }[];
	index: number;
	dark: boolean;
}) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-4xl p-6 shadow-card sm:p-8",
				dark ?
					"border border-white/10 bg-ink text-white"
				:	"border border-steel-200 bg-canvas-soft text-ink",
			)}>
			{/* texture */}
			<div
				className={cn(
					"pointer-events-none absolute inset-0 [background-size:36px_36px]",
					dark ? "bg-blueprint opacity-[0.14]" : "bg-grid-steel opacity-70",
				)}
			/>
			<div
				className={cn(
					"pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl",
					dark ? "bg-corporate-500/25" : "bg-corporate-400/15",
				)}
			/>

			<div className="relative">
				<div className="flex items-center justify-between">
					<span
						className={cn(
							"font-display text-sm font-bold tracking-tightest",
							dark ? "text-steel-400" : "text-steel-400",
						)}>
						{String(index + 1).padStart(2, "0")} / Key results
					</span>
					<span
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider",
							dark ?
								"bg-white/10 text-corporate-200"
							:	"bg-corporate-50 text-corporate-700",
						)}>
						In production
					</span>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{stats.map((s, i) => (
						<div
							key={i}
							className={cn(
								"flex items-start gap-3 rounded-2xl border p-4 transition-colors",
								dark ?
									"border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
								:	"border-steel-200 bg-white hover:border-corporate-200",
							)}>
							<span className="text-2xl leading-none">{s.icon}</span>
							<span
								className={cn(
									"text-[13.5px] font-medium leading-snug",
									dark ? "text-steel-200" : "text-steel-700",
								)}>
								{s.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
