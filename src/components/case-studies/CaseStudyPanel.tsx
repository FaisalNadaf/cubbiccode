/** @format */

import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CountStat } from "@/components/ui/Stat";
import { ChartView } from "@/components/charts/ChartView";
import { Sparkline } from "@/components/charts/Sparkline";
import { CHART } from "@/components/charts/theme";
import type { CaseStudy } from "@/content/portfolio";
import type { CaseChartData, ChartSpec } from "@/lib/caseStudyCharts";
import { entryId, type SignatureSpec } from "@/lib/caseStudyMetrics";
import { cn } from "@/lib/utils";

/** Fixed plot height for the cartesian charts (others self-size). */
function plotHeight(spec: ChartSpec, hero: boolean): number | undefined {
	if (spec.kind === "area" || spec.kind === "bar") return hero ? 296 : 176;
	return undefined;
}

function LiveTag() {
	return (
		<span className="inline-flex items-center gap-2 text-sm font-medium text-steel-500">
			<span className="size-2 animate-pulse rounded-full bg-corporate-500" />
			Live in production
		</span>
	);
}

function ChartCard({
	spec,
	hero = false,
}: {
	spec: ChartSpec;
	hero?: boolean;
}) {
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

export function CaseStudyPanel({
	c,
	data,
	sig,
	index,
}: {
	c: CaseStudy;
	data: CaseChartData;
	sig: SignatureSpec;
	index: number;
}) {
	const nn = String(index + 1).padStart(2, "0");
	const hero = data.charts[0];
	const secondary = data.charts[1];
	const sigStat = c.stats[sig.index];
	const flip = index % 2 === 1; // even panels mirror the split

	return (
		<div
			id={entryId(index)}
			className="scroll-mt-28">
		<Reveal
			as="article"
			amount={0.15}
			className="group relative overflow-hidden rounded-4xl border border-steel-200 bg-white p-5 shadow-card transition-shadow duration-500 hover:shadow-lift sm:p-8 lg:rounded-5xl lg:p-10">
			{/* ambient chrome */}
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
				<header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
					<div className="max-w-xl">
						<span className="mb-4 block h-px w-8 bg-corporate-600 transition-[width] duration-300 group-hover:w-16" />
						<span className="kicker">{c.category}</span>
						<SplitReveal
							as="h2"
							className="mt-3 font-display text-2xl font-bold tracking-tightest text-ink sm:text-3xl lg:text-4xl">
							{c.name}
						</SplitReveal>
						<p className="mt-3 max-w-md text-pretty leading-relaxed text-steel-600">
							{c.tagline}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end lg:gap-3">
						<LiveTag />
						<Button
							href={c.link}
							external
							arrow
							variant="outline"
							size="sm">
							Read on LinkedIn
						</Button>
					</div>
				</header>

				<div className="my-6 hairline lg:my-8" />

				{/* BODY — metrics + evidence, sides alternate per panel */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
					{/* METRICS COLUMN (DOM-first → leads on mobile) */}
					<div
						className={cn(
							"flex flex-col gap-4 lg:col-span-5",
							flip && "lg:order-2",
						)}>
						{/* signature tile */}
						<div className="rounded-3xl border-[1.5px] border-corporate-200 bg-corporate-50/70 p-5 sm:p-6">
							<span className="text-[11px] font-semibold uppercase tracking-kicker text-corporate-700">
								{sigStat.label}
							</span>
							<div className="mt-2 font-display text-4xl font-bold leading-none tracking-tightest tabular-nums text-gradient sm:text-5xl">
								<CountStat
									value={sig.value}
									prefix={sig.prefix}
									suffix={sig.suffix}
									decimals={sig.decimals ?? 0}
								/>
							</div>
							<div className="mt-4 hidden sm:block">
								<Sparkline
									data={data.spark}
									color={CHART.blue.stroke}
									height={40}
								/>
							</div>
						</div>

						{/* supporting KPI tiles */}
						{data.kpis.length > 0 && (
							<div
								className={cn(
									"grid gap-3",
									data.kpis.length === 1 ? "grid-cols-1" : "grid-cols-2",
								)}>
								{data.kpis.map((k) => (
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
						{data.note && (
							<p className="text-[11px] leading-relaxed text-steel-400">
								{data.note}
							</p>
						)}
						{secondary && <ChartCard spec={secondary} />}
						{data.capabilities && data.capabilities.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{data.capabilities.map((cap) => (
									<span
										key={cap.label}
										className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-3 py-1.5 text-xs font-medium text-steel-600">
										<Icon
											name={cap.icon}
											className="size-3.5 text-corporate-600"
											strokeWidth={1.75}
										/>
										{cap.label}
										<span className="size-1.5 rounded-full bg-corporate-500" />
									</span>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</Reveal>
		</div>
	);
}
