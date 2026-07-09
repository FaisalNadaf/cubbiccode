/** @format */

"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "./useChartSize";
import { CountStat } from "@/components/ui/Stat";
import { CHART, EASE_OUT } from "./theme";
import type { RadialSpec } from "@/lib/caseStudyCharts";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Animated circular progress gauge with a count-up value in the centre. */
export function RadialGauge({
	spec,
	max = 220,
}: {
	spec: RadialSpec;
	max?: number;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();
	const gradId = useId().replace(/:/g, "");

	const tone = CHART[spec.color ?? "blue"];
	const d = clamp(width || max, 132, max);
	const stroke = Math.round(d * 0.085);
	const r = (d - stroke) / 2 - 2;
	const c = 2 * Math.PI * r;
	const pct = clamp(spec.percent, 0, 100);
	const target = c * (1 - pct / 100);

	return (
		<div
			ref={ref}
			className="relative flex w-full justify-center select-none"
			style={{ minHeight: 132 }}>
			<div
				className="relative"
				style={{ width: d, height: d }}>
				<svg
					width={d}
					height={d}
					className="block -rotate-90"
					role="img"
					aria-label={`${spec.title}: ${spec.display.value}${
						spec.display.suffix ?? ""
					}`}>
					<defs>
						<linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
							<stop offset="0%" stopColor={tone.stroke} />
							<stop offset="100%" stopColor={tone.deep} />
						</linearGradient>
					</defs>
					<circle
						cx={d / 2}
						cy={d / 2}
						r={r}
						fill="none"
						stroke="#EEF2F7"
						strokeWidth={stroke}
					/>
					<motion.circle
						cx={d / 2}
						cy={d / 2}
						r={r}
						fill="none"
						stroke={`url(#${gradId})`}
						strokeWidth={stroke}
						strokeLinecap="round"
						strokeDasharray={c}
						initial={{ strokeDashoffset: reduce ? target : c }}
						animate={{ strokeDashoffset: inView || reduce ? target : c }}
						transition={{ duration: 1.4, ease: EASE_OUT }}
					/>
				</svg>
				<div
					className="absolute inset-0 flex items-center justify-center text-center leading-none"
					style={{ fontSize: Math.round(d * 0.2) }}>
					<CountStat
						value={spec.display.value}
						prefix={spec.display.prefix}
						suffix={spec.display.suffix}
						decimals={spec.display.decimals ?? 0}
						className="font-display font-bold tracking-tightest tabular-nums text-ink"
					/>
				</div>
			</div>
		</div>
	);
}
