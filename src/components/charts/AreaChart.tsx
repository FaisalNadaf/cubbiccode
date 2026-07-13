/** @format */

"use client";

import { useId, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "./useChartSize";
import { ChartSkeleton } from "./Skeleton";
import { CHART, AXIS, EASE_OUT, fmt, smoothPath } from "./theme";
import type { AreaSpec } from "@/lib/caseStudyCharts";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Animated area + line chart. Draws with a left→right clip wipe on scroll-in,
 * carries a persistent end-point value chip and a hover crosshair + tooltip.
 */
export function AreaChart({
	spec,
	height = 236,
}: {
	spec: AreaSpec;
	height?: number;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();
	const clipId = useId().replace(/:/g, "");
	const gradId = `${clipId}-g`;
	const [active, setActive] = useState<number | null>(null);

	const tone = CHART[spec.color ?? "blue"];
	const fmtOpts = {
		prefix: spec.prefix,
		suffix: spec.suffix,
		decimals: spec.decimals,
	};
	const pts = spec.points;
	const n = pts.length;

	const padT = 18;
	const padR = 20;
	const padB = 30;
	const padL = 16;
	const innerW = Math.max(0, width - padL - padR);
	const innerH = Math.max(0, height - padT - padB);

	const values = pts.map((p) => p.value);
	const yMax = Math.max(...values) * 1.12 || 1;
	const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
	const y = (v: number) => padT + innerH * (1 - v / yMax);
	const baseY = padT + innerH;

	const coords = pts.map((p, i) => ({ x: x(i), y: y(p.value) }));
	const linePath = smoothPath(coords);
	const areaPath =
		coords.length > 0
			? `${linePath} L ${coords[n - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`
			: "";

	const grid = [0, 0.5, 1].map((f) => padT + innerH * f);
	const last = coords[n - 1];

	/** Resolve a pointer x to a data index. Wired to `pointerdown` as well as
	 *  `pointermove` so a tap reaches the tooltip on touch, where there is no
	 *  hover to move. A mouse always emits `pointermove` at the same coordinates
	 *  first, so the extra `pointerdown` only re-sets the index it already holds. */
	const pick = (e: PointerEvent<HTMLDivElement>) => {
		const r = e.currentTarget.getBoundingClientRect();
		const rel = (e.clientX - r.left) / (innerW || 1);
		setActive(clamp(Math.round(rel * (n - 1)), 0, n - 1));
	};

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
						className="block overflow-visible"
						role="img"
						aria-label={`${spec.title}: ${fmt(values[n - 1], fmtOpts)}`}>
						<defs>
							<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor={tone.stroke} stopOpacity={0.28} />
								<stop offset="100%" stopColor={tone.stroke} stopOpacity={0.02} />
							</linearGradient>
							<clipPath id={clipId}>
								<motion.rect
									x={0}
									y={0}
									height={height}
									initial={{ width: reduce ? width : 0 }}
									animate={{ width: inView || reduce ? width : 0 }}
									transition={{ duration: 1.1, ease: EASE_OUT }}
								/>
							</clipPath>
						</defs>

						{/* gridlines */}
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

						<g clipPath={`url(#${clipId})`}>
							<path d={areaPath} fill={`url(#${gradId})`} />
							<path
								d={linePath}
								fill="none"
								stroke={tone.stroke}
								strokeWidth={2.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							{coords.map((c, i) => (
								<circle
									key={i}
									cx={c.x}
									cy={c.y}
									r={i === n - 1 ? 4.5 : 2.5}
									fill={i === n - 1 ? tone.stroke : "#fff"}
									stroke={tone.stroke}
									strokeWidth={i === n - 1 ? 2.5 : 1.5}
								/>
							))}
						</g>

						{/* hover crosshair */}
						{active !== null && (
							<g pointerEvents="none">
								<line
									x1={coords[active].x}
									x2={coords[active].x}
									y1={padT}
									y2={baseY}
									stroke={tone.stroke}
									strokeWidth={1}
									strokeDasharray="3 3"
									opacity={0.5}
								/>
								<circle
									cx={coords[active].x}
									cy={coords[active].y}
									r={5.5}
									fill="#fff"
									stroke={tone.stroke}
									strokeWidth={2.5}
								/>
							</g>
						)}
					</svg>

					{/* x-axis labels */}
					{pts.map((p, i) => (
						<span
							key={i}
							className="pointer-events-none absolute -translate-x-1/2 text-[10px] font-medium tabular-nums text-steel-400"
							style={{ left: x(i), top: baseY + 9 }}>
							{p.label}
						</span>
					))}

					{/* persistent end-point chip */}
					{last && (
						<motion.span
							initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 4 }}
							animate={{ opacity: inView || reduce ? 1 : 0, y: 0 }}
							transition={{ delay: reduce ? 0 : 0.9, duration: 0.4 }}
							className="pointer-events-none absolute z-10 rounded-lg border border-steel-200 bg-white px-2 py-1 text-[11px] font-bold tabular-nums shadow-sm"
							style={{
								left: clamp(last.x, padL + 28, width - 8),
								top: last.y,
								transform: "translate(-100%, -132%)",
								color: tone.text,
							}}>
							{fmt(values[n - 1], fmtOpts)}
						</motion.span>
					)}

					{/* hover tooltip */}
					{active !== null && (
						<div
							className="pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-steel-200 bg-white px-2.5 py-1.5 text-center shadow-md"
							style={{
								left: clamp(coords[active].x, 44, width - 44),
								top: coords[active].y - 12,
								transform: "translate(-50%, -100%)",
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
					)}

					{/* pointer capture overlay */}
					<div
						className="absolute cursor-crosshair"
						style={{ left: padL, top: padT, width: innerW, height: innerH }}
						onPointerDown={pick}
						onPointerMove={pick}
						// A touch that turns into a page scroll is cancelled, not "left" —
						// without this the crosshair sticks after the gesture.
						onPointerCancel={() => setActive(null)}
						onPointerLeave={() => setActive(null)}
					/>
				</>
			)}
		</div>
	);
}
