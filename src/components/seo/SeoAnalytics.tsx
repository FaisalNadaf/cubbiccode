/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { BarChart } from "@/components/charts/BarChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { EASE_OUT } from "@/components/charts/theme";
import { IndustryDonut } from "./IndustryDonut";
import {
	INDUSTRY_SEGMENTS,
	TOTAL_CLIENTS,
	CITY_BAR,
	PERFORMANCE_AREA,
	SEO_WORKFLOW,
} from "@/lib/seoClients";
import { cn } from "@/lib/utils";

function ChartPanel({
	title,
	caption,
	badge,
	className,
	children,
}: {
	title: string;
	caption?: string;
	badge?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<Reveal
			amount={0.2}
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-4xl border border-steel-200 bg-white p-5 shadow-card transition-shadow duration-500 hover:shadow-lift sm:p-6",
				className,
			)}>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-corporate-400/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
			/>
			<div className="relative mb-5 flex items-start justify-between gap-3">
				<div>
					<h3 className="font-display text-base font-bold tracking-tight text-ink">
						{title}
					</h3>
					{caption && (
						<p className="mt-1 text-xs leading-snug text-steel-500">{caption}</p>
					)}
				</div>
				{badge && (
					<span className="shrink-0 rounded-full border border-corporate-200 bg-corporate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-kicker text-corporate-700">
						{badge}
					</span>
				)}
			</div>
			<div className="relative flex-1">{children}</div>
		</Reveal>
	);
}

/** Vertical answer-engine workflow — a spine that draws in, nodes stagger up. */
function WorkflowTimeline() {
	const reduce = useReducedMotion();

	return (
		<ol className="relative pl-2">
			{/* animated spine */}
			<span className="pointer-events-none absolute bottom-4 left-[22px] top-4 w-px overflow-hidden">
				<motion.span
					className="block h-full w-full origin-top bg-gradient-to-b from-corporate-300 via-corporate-500 to-corporate-300"
					initial={{ scaleY: reduce ? 1 : 0 }}
					whileInView={{ scaleY: 1 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 1.1, ease: EASE_OUT }}
				/>
			</span>

			{SEO_WORKFLOW.map((node, i) => (
				<motion.li
					key={node.label}
					initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -10 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.45, delay: i * 0.12, ease: EASE_OUT }}
					className="relative flex items-center gap-4 py-2.5">
					<span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-corporate-200 bg-white text-corporate-600 shadow-soft">
						<Icon
							name={node.icon}
							className="size-4"
							strokeWidth={1.9}
						/>
						{!reduce && (
							<motion.span
								className="absolute inset-0 rounded-full ring-2 ring-corporate-400/50"
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: [0, 0.8, 0], scale: [0.8, 1.5, 1.8] }}
								viewport={{ once: true }}
								transition={{
									duration: 1.2,
									delay: i * 0.12 + 0.2,
									ease: "easeOut",
								}}
							/>
						)}
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-[10px] font-semibold tabular-nums text-steel-400">
							{String(i + 1).padStart(2, "0")}
						</span>
						<span className="font-display text-sm font-bold tracking-tight text-ink">
							{node.label}
						</span>
					</div>
				</motion.li>
			))}
		</ol>
	);
}

export function SeoAnalytics() {
	return (
		<section className="relative overflow-hidden bg-canvas-soft">
			<div className="container-x relative py-20 lg:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<span className="kicker justify-center">The data behind it</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h2 className="mt-4 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
							Rankings, visualised
						</h2>
					</Reveal>
					<Reveal delay={0.18}>
						<p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-steel-600">
							Where our ranked clients sit across industries and cities — and how
							search visibility compounds month over month.
						</p>
					</Reveal>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
					<ChartPanel
						title="Industry distribution"
						caption={`${TOTAL_CLIENTS} clients across ${INDUSTRY_SEGMENTS.length} industries`}
						badge="Doughnut"
						className="lg:col-span-7">
						<IndustryDonut
							segments={INDUSTRY_SEGMENTS}
							total={TOTAL_CLIENTS}
						/>
					</ChartPanel>

					<ChartPanel
						title="City distribution"
						caption={CITY_BAR.caption}
						badge="Bar"
						className="lg:col-span-5">
						<BarChart
							spec={CITY_BAR}
							height={264}
						/>
					</ChartPanel>

					<ChartPanel
						title="Performance overview"
						caption={PERFORMANCE_AREA.caption}
						badge="Growth"
						className="lg:col-span-8">
						<AreaChart
							spec={PERFORMANCE_AREA}
							height={288}
						/>
					</ChartPanel>

					<ChartPanel
						title="SEO workflow"
						caption="Research → Ranking"
						badge="Flow"
						className="lg:col-span-4">
						<WorkflowTimeline />
					</ChartPanel>
				</div>

				<Reveal delay={0.1}>
					<p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-steel-400">
						Industry and city splits are derived directly from the showcased
						clients below. The performance curve is an indicative aggregate of
						tracked page-one and AI-answer placements; every individual ranking is
						verifiable live via each client&apos;s “Search on Google” button.
					</p>
				</Reveal>
			</div>
		</section>
	);
}
