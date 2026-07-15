/** @format */

import Image from "next/image";
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
import { routes } from "@/lib/routes";

/** Fixed plot height for the cartesian charts (others self-size). The chart card
 *  spans the full panel now, so the plot can afford to be taller. */
function plotHeight(spec: ChartSpec): number | undefined {
	if (spec.kind === "area" || spec.kind === "bar") return 240;
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

function ChartCard({ spec }: { spec: ChartSpec }) {
	return (
		<div className="rounded-3xl border border-steel-200/70 bg-canvas-soft p-4 sm:p-5">
			<div className="mb-4 flex items-baseline justify-between gap-3">
				<h3 className="text-xs font-semibold text-ink sm:text-sm">
					{spec.title}
				</h3>
				{spec.caption && (
					<p className="hidden text-right text-[11px] leading-snug text-steel-500 sm:block">
						{spec.caption}
					</p>
				)}
			</div>
			<ChartView
				spec={spec}
				height={plotHeight(spec)}
			/>
		</div>
	);
}

/** Product screenshot — takes the lead slot of the evidence column.
 *
 *  The shot renders at its own intrinsic ratio (`h-auto`, no aspect box, no
 *  `object-cover`) so the whole interface stays visible — the six platforms are
 *  captured at ratios from 1.47 to 1.83, and any shared crop box would slice UI
 *  off the tall ones. Over it sit three passive layers: an ink gradient anchored
 *  to the foot for depth against the white card, a brand wash that recedes on
 *  panel hover, and an inset hairline that keeps the screenshot's own white
 *  chrome from bleeding into the card. */
function ShotCard({
	src,
	alt,
	width,
	height,
}: {
	src: string;
	alt: string;
	width: number;
	height: number;
}) {
	return (
		<div className="overflow-hidden rounded-3xl border border-steel-200/70 bg-canvas-soft p-2 sm:rounded-4xl sm:p-3">
			<div className="relative overflow-hidden rounded-[1.15rem] bg-white sm:rounded-[1.4rem]">
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					sizes="(min-width: 1024px) 58vw, 100vw"
					className="h-auto w-full"
				/>

				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-corporate-700/15 transition-opacity duration-500 ease-out group-hover:opacity-0"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 rounded-[1.15rem] ring-1 ring-inset ring-ink/10 sm:rounded-[1.4rem]"
				/>
			</div>
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
					className={cn(
						"pointer-events-none absolute -top-24 size-72 rounded-full bg-corporate-400/15 blur-3xl",
						flip ? "-left-24" : "-right-24",
					)}
				/>
				{/* The watermark sits opposite the title, which is now full-width and
				    always left-aligned — so unlike the columns below it, it doesn't flip. */}
				<span
					aria-hidden
					className="pointer-events-none absolute -top-4 right-3 select-none font-serif text-[6rem] italic leading-none text-steel-100 sm:text-[8rem] lg:text-[11rem]">
					{nn}
				</span>

				{/* BODY — three bands.
				    The identity block used to live inside the metrics column, so that
				    column carried three small blocks (identity, signature, KPIs) against a
				    tall screenshot AND a chart on the other side. It came up hundreds of
				    pixels short every time, and whichever trick absorbed the slack — a
				    stretched tile, spread-out gaps — just moved the hole around.
				    Splitting the panel into bands removes the mismatch at the source: the
				    header and the chart each span the full width, and the middle band pairs
				    the screenshot with a stats stack of comparable height. */}
				<div className="relative flex flex-col gap-6 lg:gap-8">
					{/* HEADER — full width */}
					<div>
						<span className="mb-4 block h-px w-8 bg-corporate-600 transition-[width] duration-300 group-hover:w-16" />
						<span className="kicker">{c.category}</span>
						<SplitReveal
							as="h2"
							className="mt-3 font-display text-2xl font-bold tracking-tightest text-ink sm:text-3xl lg:text-4xl">
							{c.name}
						</SplitReveal>
						<div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
							<div>
								<p className="max-w-xl text-pretty leading-relaxed text-steel-600">
									{c.tagline}
								</p>
								<div className="mt-4">
									<LiveTag />
								</div>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Button
									href={routes.contact}
									arrow
									variant="accent"
									size="sm">
									Request a Demo
								</Button>
								<Button
									href={c.link}
									external
									arrow
									variant="outline"
									size="sm">
									Read on LinkedIn
								</Button>
							</div>
						</div>
					</div>

					<div className="hairline" />

					{/* SCREENSHOT + STATS — the two sides alternate per panel. */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
						<div className={cn("lg:col-span-7", flip && "lg:order-2")}>
							{c.image && (
								<ShotCard
									src={c.image.src}
									alt={`${c.name} platform interface`}
									width={c.image.width}
									height={c.image.height}
								/>
							)}
						</div>

						<div
							className={cn(
								"flex flex-col gap-4 lg:col-span-5 lg:justify-between",
								flip && "lg:order-1",
							)}>
							{/* Signature tile. */}
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
								<div className="mt-5 hidden sm:block">
									<Sparkline
										data={data.spark}
										color={CHART.blue.stroke}
										height={48}
									/>
								</div>
							</div>

							{/* supporting KPI tiles.
							    A `tracking-kicker` label (0.22em of extra letter-spacing on an
							    11px font) needs ~140px of tile to set without breaking words
							    mid-syllable. Two columns inside the panel's own padding leave
							    ~78px of that on a 320px phone, so they pair from sm up — which
							    is what the lg column split inherits, leaving desktop as-is. */}
							{data.kpis.length > 0 && (
								<div
									className={cn(
										"grid gap-3",
										data.kpis.length === 1 ?
											"grid-cols-1"
										:	"grid-cols-1 sm:grid-cols-2",
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

							{/* Capability chips — qualitative wins, no number attached. */}
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

					{/* CHART — full width, so the funnel/bars/donut get room to breathe. */}
					<div className="flex flex-col gap-2">
						<ChartCard spec={data.chart} />
						{data.note && (
							<p className="text-[11px] leading-relaxed text-steel-400">
								{data.note}
							</p>
						)}
					</div>
				</div>
			</Reveal>
		</div>
	);
}
