/** @format */

"use client";

import type { ChartSpec } from "@/lib/caseStudyCharts";
import { AreaChart } from "./AreaChart";
import { BarChart } from "./BarChart";
import { CompareChart } from "./CompareChart";
import { RadialGauge } from "./RadialGauge";
import { DonutChart } from "./DonutChart";
import { FunnelChart } from "./FunnelChart";

/** Renders the right chart primitive for a spec. `height` applies to area/bar. */
export function ChartView({
	spec,
	height,
}: {
	spec: ChartSpec;
	height?: number;
}) {
	switch (spec.kind) {
		case "area":
			return <AreaChart spec={spec} height={height} />;
		case "bar":
			return <BarChart spec={spec} height={height} />;
		case "compare":
			return <CompareChart spec={spec} />;
		case "radial":
			return <RadialGauge spec={spec} />;
		case "donut":
			return <DonutChart spec={spec} />;
		case "funnel":
			return <FunnelChart spec={spec} />;
		default:
			return null;
	}
}
