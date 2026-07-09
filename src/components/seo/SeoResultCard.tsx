/** @format */

import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Icon } from "@/components/ui/Icon";
import { CountStat } from "@/components/ui/Stat";
import { ChartView } from "@/components/charts/ChartView";
import { Sparkline } from "@/components/charts/Sparkline";
import { CHART } from "@/components/charts/theme";
import type { ChartSpec } from "@/lib/caseStudyCharts";
import type { SeoResult } from "@/lib/seoResults";
import { cn } from "@/lib/utils";

function plotHeight(spec: ChartSpec, hero: boolean): number | undefined {
	if (spec.kind === "area" || spec.kind === "bar") return hero ? 296 : 176;
	return undefined;
}

function ChartCard({ spec, hero = false }: { spec: ChartSpec; hero?: boolean }) {
	return (
		<div
			className={cn(
				"rounded-3xl border border-steel-200/70 bg-canvas-soft p-4 sm:p-5",
				hero && "sm:rounded-4xl sm:p-6",
			)}>
			<div className="mb-4 flex items-baseline justify-between gap-3">
				<h3
					className={cn(
						"font-semibold text-ink",
						hero ? "text-sm" : "text-xs",
					)}>
					{spec.title}
				</h3>
				{spec.caption && (
					<p className="hidden text-right text-[11px] leading-snug text-steel-500 sm:block">
						{spec.caption}
					</p>
				)}
			</div>
			<ChartView spec={spec} height={plotHeight(spec, hero)} />
		</div>
	);
}

export function SeoResultCard({
	result,
	index,
}: {
	result: SeoResult;
	index: number;
}) {
	const nn = String(index + 1).padStart(2, "0");
	const hero = result.charts[0];
	const secondary = result.charts[1];
	const flip = index % 2 === 1;

	return (
		<Reveal
			as="article"
			amount={0.15}
			className="group relative overflow-hidden rounded-4xl border border-steel-200 bg-white p-5 shadow-card transition-shadow duration-500 hover:shadow-lift sm:p-8 lg:rounded-5xl lg:p-10">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-blueprint [background-size:38px_38px] opacity-[0.05]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-corporate-400/15 blur-3xl"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -top-4 right-3 select-none font-serif text-[6rem] italic leading-none text-steel-100 sm:text-[8rem] lg:text-[11rem]">
				{nn}
			</span>

			<div className="relative">
				{/* HEADER */}
				<header className="max-w-2xl">
					<span className="mb-4 block h-px w-8 bg-corporate-600 transition-[width] duration-300 group-hover:w-16" />
					<span className="kicker">{result.sector}</span>
					<SplitReveal
						as="h2"
						className="mt-3 font-display text-2xl font-bold tracking-tightest text-ink sm:text-3xl lg:text-4xl">
						{result.title}
					</SplitReveal>
					<p className="mt-3 max-w-xl text-pretty leading-relaxed text-steel-600">
						{result.summary}
					</p>
				</header>

				<div className="my-6 hairline lg:my-8" />

				{/* BODY */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
					{/* METRICS COLUMN (leads on mobile) */}
					<div
						className={cn(
							"flex flex-col gap-4 lg:col-span-5",
							flip && "lg:order-2",
						)}>
						<div className="rounded-3xl border-[1.5px] border-corporate-200 bg-corporate-50/70 p-5 sm:p-6">
							<span className="text-[11px] font-semibold uppercase tracking-kicker text-corporate-700">
								{result.signature.label}
							</span>
							<div className="mt-2 font-display text-4xl font-bold leading-none tracking-tightest tabular-nums text-gradient sm:text-5xl">
								<CountStat
									value={result.signature.value}
									prefix={result.signature.prefix}
									suffix={result.signature.suffix}
									decimals={result.signature.decimals ?? 0}
								/>
							</div>
							<div className="mt-4 hidden sm:block">
								<Sparkline
									data={result.spark}
									color={CHART.blue.stroke}
									height={40}
								/>
							</div>
						</div>

						{result.kpis.length > 0 && (
							<div className="grid grid-cols-2 gap-3">
								{result.kpis.map((k) => (
									<div
										key={k.label}
										className="rounded-2xl border border-steel-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
										<Icon
											name={k.icon}
											className="size-4 text-steel-400"
											strokeWidth={1.75}
										/>
										<div className="mt-3 font-display text-2xl font-bold tracking-tightest tabular-nums text-ink">
											{k.value}
										</div>
										<div className="mt-1 text-[11px] font-semibold uppercase leading-snug tracking-kicker text-steel-500">
											{k.label}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* EVIDENCE COLUMN */}
					<div
						className={cn(
							"flex flex-col gap-4 lg:col-span-7",
							flip && "lg:order-1",
						)}>
						<ChartCard
							spec={hero}
							hero
						/>
						{secondary && <ChartCard spec={secondary} />}
					</div>
				</div>
			</div>
		</Reveal>
	);
}
