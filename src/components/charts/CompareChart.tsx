/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountStat } from "@/components/ui/Stat";
import { CHART, EASE_OUT } from "./theme";
import type { CompareSpec } from "@/lib/caseStudyCharts";

/**
 * Horizontal comparison bars — for two-value stories (e.g. capital deployed vs
 * paid out). Each bar is direct-labelled; amber never carries meaning alone.
 */
export function CompareChart({ spec }: { spec: CompareSpec }) {
	const reduce = useReducedMotion();
	const maxVal = Math.max(...spec.items.map((it) => it.value)) || 1;
	const fmtOpts = {
		prefix: spec.prefix,
		suffix: spec.suffix,
		decimals: spec.decimals,
	};

	return (
		<div className="w-full space-y-6 select-none">
			{spec.items.map((it, i) => {
				const pct = Math.max((it.value / maxVal) * 100, 6);
				const tone = CHART[it.color];
				return (
					<div key={i}>
						<div className="mb-2 flex items-baseline justify-between gap-3">
							<span className="text-sm font-medium text-steel-600">
								{it.label}
							</span>
							<span
								className="font-display text-xl font-bold tabular-nums lg:text-2xl"
								style={{ color: tone.text }}>
								<CountStat
									value={it.value}
									prefix={fmtOpts.prefix}
									suffix={fmtOpts.suffix}
									decimals={fmtOpts.decimals ?? 0}
								/>
							</span>
						</div>
						<div className="h-11 w-full overflow-hidden rounded-xl bg-steel-100">
							<motion.div
								className="h-full rounded-xl"
								style={{
									width: `${pct}%`,
									background: `linear-gradient(90deg, ${tone.stroke}, ${tone.deep})`,
									transformOrigin: "left",
								}}
								initial={{ scaleX: reduce ? 1 : 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{
									duration: 0.8,
									ease: EASE_OUT,
									delay: reduce ? 0 : i * 0.15,
								}}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
