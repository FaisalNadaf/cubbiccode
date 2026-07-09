/** @format */

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "@/components/charts/useChartSize";
import { ChartSkeleton } from "@/components/charts/Skeleton";
import { CountStat } from "@/components/ui/Stat";
import { EASE_OUT } from "@/components/charts/theme";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ICON, type SeoIndustry } from "@/lib/seoClients";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Distinct, on-brand hue per segment — a blue→indigo→violet sweep. Colour is
 * never load-bearing (every legend row is direct-labelled with name + count), so
 * an analogous ramp keeps the ring cohesive while staying legible.
 */
function hueFor(i: number, n: number): string {
	const t = n <= 1 ? 0 : i / (n - 1);
	const h = 202 + t * 86; // 202 (corporate blue) → 288 (violet)
	const l = 56 - t * 12; // deepen slightly along the sweep
	return `hsl(${Math.round(h)}, 70%, ${Math.round(l)}%)`;
}

export type DonutDatum = { label: string; value: number };

export function IndustryDonut({
	segments,
	total,
	centerLabel = "clients ranked",
	max = 260,
}: {
	segments: DonutDatum[];
	total: number;
	centerLabel?: string;
	max?: number;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();
	const [active, setActive] = useState<number | null>(null);

	const sum = segments.reduce((s, seg) => s + seg.value, 0) || 1;
	const d = clamp(width || max, 180, max);
	const stroke = Math.round(d * 0.13);
	const r = (d - stroke) / 2 - 2;
	const gap = 0.008;

	let cursor = 0;
	const arcs = segments.map((seg, i) => {
		const frac = seg.value / sum;
		const dash = Math.max(frac - gap, 0.001);
		const arc = {
			seg,
			i,
			color: hueFor(i, segments.length),
			dash,
			offset: -cursor,
			pct: Math.round(frac * 100),
		};
		cursor += frac;
		return arc;
	});

	return (
		<div
			ref={ref}
			className="grid w-full grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr]">
			{width === 0 ? (
				<ChartSkeleton
					height={max}
					rounded="rounded-full"
				/>
			) : (
				<>
					<div
						className="relative mx-auto"
						style={{ width: d, height: d }}>
						<svg
							width={d}
							height={d}
							className="block -rotate-90"
							role="img"
							aria-label={`Industry distribution: ${total} clients across ${segments.length} industries`}>
							<motion.g
								style={{ transformOrigin: `${d / 2}px ${d / 2}px` }}
								initial={{ rotate: reduce ? 0 : -110, opacity: reduce ? 1 : 0 }}
								animate={{
									rotate: inView || reduce ? 0 : -110,
									opacity: inView || reduce ? 1 : 0,
								}}
								transition={{ duration: 1, ease: EASE_OUT }}>
								<circle
									cx={d / 2}
									cy={d / 2}
									r={r}
									fill="none"
									stroke="#EEF2F7"
									strokeWidth={stroke}
								/>
								{arcs.map((a) => (
									<circle
										key={a.i}
										cx={d / 2}
										cy={d / 2}
										r={r}
										fill="none"
										stroke={a.color}
										strokeWidth={active === a.i ? stroke + 4 : stroke}
										pathLength={1}
										strokeDasharray={`${a.dash} ${1 - a.dash}`}
										strokeDashoffset={a.offset}
										strokeLinecap="butt"
										style={{
											opacity:
												active === null || active === a.i ? 1 : 0.28,
											transition: "opacity 0.25s, stroke-width 0.25s",
										}}
									/>
								))}
							</motion.g>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
							<span
								className="font-display font-bold leading-none tracking-tightest tabular-nums text-gradient"
								style={{ fontSize: Math.round(d * 0.2) }}>
								<CountStat
									value={active === null ? total : segments[active].value}
									suffix={active === null ? "+" : ""}
								/>
							</span>
							<span className="mt-1 max-w-[68%] text-[10px] font-semibold uppercase leading-tight tracking-kicker text-steel-500">
								{active === null ? centerLabel : segments[active].label}
							</span>
						</div>
					</div>

					{/* direct-labelled legend */}
					<ul className="grid grid-cols-1 gap-x-5 gap-y-1.5 sm:grid-cols-2">
						{arcs.map((a) => (
							<motion.li
								key={a.i}
								initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -6 }}
								animate={{
									opacity: inView || reduce ? 1 : 0,
									x: inView || reduce ? 0 : -6,
								}}
								transition={{
									duration: 0.4,
									delay: reduce || !inView ? 0 : 0.4 + a.i * 0.05,
								}}
								onPointerEnter={() => setActive(a.i)}
								onPointerLeave={() => setActive(null)}
								className="flex cursor-default items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm transition-colors hover:bg-canvas-soft">
								<span
									className="grid size-6 shrink-0 place-items-center rounded-md"
									style={{ background: a.color, color: "#fff" }}>
									<Icon
										name={INDUSTRY_ICON[a.seg.label as SeoIndustry] ?? "Circle"}
										className="size-3.5"
										strokeWidth={2}
									/>
								</span>
								<span className="flex-1 truncate text-steel-700">
									{a.seg.label}
								</span>
								<span className="font-semibold tabular-nums text-ink">
									{a.seg.value}
								</span>
							</motion.li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
