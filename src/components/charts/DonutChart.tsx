/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "./useChartSize";
import { ChartSkeleton } from "./Skeleton";
import { CountStat } from "@/components/ui/Stat";
import { CHART, EASE_OUT, fmt } from "./theme";
import type { DonutSpec } from "@/lib/caseStudyCharts";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Animated donut. Segments are positioned with the SVG `pathLength={1}` trick
 * (deterministic, SSR-safe — no getTotalLength), and the whole ring spins up as
 * it materialises. Center carries a count-up; a direct-labelled legend sits
 * below so meaning never rests on colour alone.
 */
export function DonutChart({
	spec,
	max = 210,
}: {
	spec: DonutSpec;
	max?: number;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();

	const total = spec.segments.reduce((s, seg) => s + seg.value, 0) || 1;
	const d = clamp(width || max, 150, max);
	const stroke = Math.round(d * 0.15);
	const r = (d - stroke) / 2 - 2;
	const gap = spec.segments.length > 1 ? 0.012 : 0; // surface gap between arcs

	let cursor = 0;
	const arcs = spec.segments.map((seg) => {
		const frac = seg.value / total;
		const dash = Math.max(frac - gap, 0.001);
		const arc = {
			seg,
			frac,
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
			className="flex w-full flex-col items-center select-none">
			{width === 0 ? (
				<ChartSkeleton height={max} rounded="rounded-full" />
			) : (
				<>
					<div
						className="relative"
						style={{ width: d, height: d }}>
						<svg
							width={d}
							height={d}
							className="block -rotate-90"
							role="img"
							aria-label={`${spec.title}: ${spec.center.value}${
								spec.center.suffix ?? ""
							} ${spec.center.label}`}>
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
								{arcs.map((a, i) => (
									<circle
										key={i}
										cx={d / 2}
										cy={d / 2}
										r={r}
										fill="none"
										stroke={CHART[a.seg.color].stroke}
										strokeWidth={stroke}
										pathLength={1}
										strokeDasharray={`${a.dash} ${1 - a.dash}`}
										strokeDashoffset={a.offset}
										strokeLinecap="butt"
									/>
								))}
							</motion.g>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
							<span
								className="font-display font-bold leading-none tracking-tightest tabular-nums text-ink"
								style={{ fontSize: Math.round(d * 0.19) }}>
								<CountStat
									value={spec.center.value}
									prefix={spec.center.prefix}
									suffix={spec.center.suffix}
									decimals={spec.center.decimals ?? 0}
								/>
							</span>
							<span className="mt-1 text-[10px] font-semibold uppercase tracking-kicker text-steel-500">
								{spec.center.label}
							</span>
						</div>
					</div>

					{/* legend — direct-labelled rows */}
					<ul className="mt-6 w-full max-w-xs space-y-2.5">
						{arcs.map((a, i) => (
							<motion.li
								key={i}
								initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -6 }}
								animate={{
									opacity: inView || reduce ? 1 : 0,
									x: inView || reduce ? 0 : -6,
								}}
								transition={{
									duration: 0.45,
									delay: reduce || !inView ? 0 : 0.5 + i * 0.1,
								}}
								className="flex items-center gap-3 text-sm">
								<span
									className="size-2.5 shrink-0 rounded-full"
									style={{ background: CHART[a.seg.color].stroke }}
								/>
								<span className="flex-1 truncate text-steel-600">
									{a.seg.label}
								</span>
								<span className="font-semibold tabular-nums text-ink">
									{fmt(a.seg.value)}
								</span>
								<span className="w-9 text-right text-xs tabular-nums text-steel-400">
									{a.pct}%
								</span>
							</motion.li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
