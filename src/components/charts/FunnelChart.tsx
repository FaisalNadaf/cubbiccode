/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountStat } from "@/components/ui/Stat";
import { CHART, EASE_OUT } from "./theme";
import type { FunnelSpec } from "@/lib/caseStudyCharts";

/**
 * Conversion funnel — centred, proportional stage bars that cascade in top-down,
 * each direct-labelled with its count and step-to-step conversion. Built in HTML
 * (not SVG) so labels stay crisp and reflow cleanly to 320px.
 */
export function FunnelChart({ spec }: { spec: FunnelSpec }) {
	const reduce = useReducedMotion();
	const maxVal = Math.max(...spec.stages.map((s) => s.value)) || 1;

	return (
		<div className="w-full select-none">
			{spec.stages.map((stage, i) => {
				const pct = Math.max((stage.value / maxVal) * 100, 8);
				const conv =
					i > 0
						? Math.round((stage.value / spec.stages[i - 1].value) * 100)
						: null;
				const tone = CHART[stage.color];
				return (
					<div key={i}>
						{conv !== null && (
							<motion.div
								initial={{ opacity: reduce ? 1 : 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: reduce ? 0 : i * 0.09 }}
								className="flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-steel-400">
								<svg
									width="10"
									height="10"
									viewBox="0 0 10 10"
									aria-hidden
									className="fill-steel-300">
									<path d="M5 8L1 3h8z" />
								</svg>
								{conv}% continue
							</motion.div>
						)}
						<div>
							<div className="mb-1.5 flex items-baseline justify-between gap-3">
								<span className="text-sm font-medium text-steel-600">
									{stage.label}
								</span>
								<span
									className="font-display text-lg font-bold tabular-nums"
									style={{ color: tone.text }}>
									<CountStat value={stage.value} suffix={spec.suffix} />
								</span>
							</div>
							<div className="flex h-9 w-full items-stretch justify-center overflow-hidden rounded-lg bg-steel-100">
								<motion.div
									className="h-full rounded-lg"
									style={{
										width: `${pct}%`,
										background: `linear-gradient(90deg, ${tone.stroke}, ${tone.deep})`,
										transformOrigin: "center",
									}}
									initial={{ scaleX: reduce ? 1 : 0 }}
									whileInView={{ scaleX: 1 }}
									viewport={{ once: true, amount: 0.4 }}
									transition={{
										duration: 0.7,
										ease: EASE_OUT,
										delay: reduce ? 0 : 0.1 + i * 0.11,
									}}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
