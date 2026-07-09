/** @format */

"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "./useChartSize";
import { ChartSkeleton } from "./Skeleton";
import { CHART, AXIS, EASE_OUT, fmt } from "./theme";
import type { BarSpec } from "@/lib/caseStudyCharts";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Top-rounded bar path anchored to a baseline. */
function barPath(x: number, top: number, w: number, h: number, r: number) {
	const rr = Math.min(r, w / 2, h);
	const bottom = top + h;
	return `M ${x} ${bottom} L ${x} ${top + rr} Q ${x} ${top} ${x + rr} ${top} L ${
		x + w - rr
	} ${top} Q ${x + w} ${top} ${x + w} ${top + rr} L ${x + w} ${bottom} Z`;
}

/** Animated vertical bar chart — bars grow from the baseline, hover for values. */
export function BarChart({
	spec,
	height = 236,
}: {
	spec: BarSpec;
	height?: number;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();
	const [active, setActive] = useState<number | null>(null);

	const tone = CHART[spec.color ?? "blue"];
	const fmtOpts = {
		prefix: spec.prefix,
		suffix: spec.suffix,
		decimals: spec.decimals,
	};
	const pts = spec.points;
	const n = pts.length;

	const padT = 22;
	const padR = 12;
	const padB = 28;
	const padL = 12;
	const innerW = Math.max(0, width - padL - padR);
	const innerH = Math.max(0, height - padT - padB);
	const baseY = padT + innerH;

	const values = pts.map((p) => p.value);
	const yMax = Math.max(...values) * 1.14 || 1;
	const band = innerW / n;
	const barW = Math.min(band * 0.62, 44);
	const grid = [0, 0.5, 1].map((f) => padT + innerH * f);

	return (
		<div
			ref={ref}
			className="relative w-full select-none"
			style={{ height }}>
			{width === 0 ? (
				<ChartSkeleton height={height} />
			) : (
				<>
					<svg
						width={width}
						height={height}
						className="block"
						role="img"
						aria-label={spec.title}>
						{grid.map((gy, i) => (
							<line
								key={i}
								x1={padL}
								x2={padL + innerW}
								y1={gy}
								y2={gy}
								stroke={AXIS.grid}
								strokeWidth={1}
								strokeDasharray={i === 2 ? undefined : "3 4"}
							/>
						))}

						{pts.map((p, i) => {
							const h = innerH * (p.value / yMax);
							const top = baseY - h;
							const cx = padL + band * (i + 0.5);
							const bx = cx - barW / 2;
							const isActive = active === i;
							return (
								<motion.path
									key={i}
									d={barPath(bx, top, barW, h, 6)}
									fill={isActive ? tone.deep : tone.stroke}
									style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
									initial={{ scaleY: reduce ? 1 : 0 }}
									animate={{ scaleY: inView || reduce ? 1 : 0 }}
									transition={{
										duration: 0.7,
										ease: EASE_OUT,
										delay: reduce || !inView ? 0 : i * (n > 8 ? 0.04 : 0.07),
									}}
								/>
							);
						})}
					</svg>

					{/* x labels — thinned when dense so they never collide */}
					{pts.map((p, i) =>
						i % Math.ceil(n / 7) === 0 ? (
							<span
								key={i}
								className="pointer-events-none absolute -translate-x-1/2 text-[10px] font-medium tabular-nums text-steel-400"
								style={{ left: padL + band * (i + 0.5), top: baseY + 9 }}>
								{p.label}
							</span>
						) : null,
					)}

					{/* tooltip */}
					{active !== null &&
						(() => {
							const h = innerH * (values[active] / yMax);
							const top = baseY - h;
							const cx = padL + band * (active + 0.5);
							const above = top > 42;
							return (
								<div
									className="pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-steel-200 bg-white px-2.5 py-1.5 text-center shadow-md"
									style={{
										left: clamp(cx, 44, width - 44),
										top: above ? top - 8 : top + h + 8,
										transform: `translate(-50%, ${above ? "-100%" : "0"})`,
									}}>
									<div className="text-[10px] font-medium uppercase tracking-wide text-steel-400">
										{pts[active].label}
									</div>
									<div
										className="text-sm font-bold tabular-nums"
										style={{ color: tone.text }}>
										{fmt(values[active], fmtOpts)}
									</div>
								</div>
							);
						})()}

					{/* per-bar hover targets */}
					<div
						className="absolute inset-0"
						onPointerLeave={() => setActive(null)}>
						{pts.map((_, i) => (
							<div
								key={i}
								className="absolute top-0 h-full cursor-pointer"
								style={{ left: padL + band * i, width: band }}
								onPointerEnter={() => setActive(i)}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
