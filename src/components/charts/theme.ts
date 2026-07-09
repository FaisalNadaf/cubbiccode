/** @format */

/**
 * Chart colour tokens — a small categorical palette validated CVD-safe against
 * the dataviz six-checks (light surface #F7F8FA). Corporate blue is the
 * sequential/primary hue; amber is always direct-labelled (it sits below the
 * 3:1 fill-contrast floor on light surfaces, so it never carries meaning alone).
 */

export type ChartColor = "blue" | "amber" | "teal" | "violet" | "steel";

export type ChartTone = {
	/** Solid line / bar / arc colour. */
	stroke: string;
	/** Darker step for gradients & emphasis. */
	deep: string;
	/** Light tint for tracks / hovered fills. */
	soft: string;
	/** Ink-safe colour for text labels on a light surface (≥4.5:1). */
	text: string;
	/** Brighter step for use on the dark ink surface. */
	onDark: string;
};

export const CHART: Record<ChartColor, ChartTone> = {
	blue: {
		stroke: "#1B6EC2",
		deep: "#0F4C81",
		soft: "#A7C9ED",
		text: "#0F4C81",
		onDark: "#6FA6DF",
	},
	amber: {
		stroke: "#D97706",
		deep: "#B45309",
		soft: "#FCD9A5",
		text: "#B45309",
		onDark: "#F59E0B",
	},
	teal: {
		stroke: "#0D9488",
		deep: "#0F766E",
		soft: "#99E6DD",
		text: "#0F766E",
		onDark: "#2DD4BF",
	},
	violet: {
		stroke: "#7C3AED",
		deep: "#6D28D9",
		soft: "#D6BCFA",
		text: "#6D28D9",
		onDark: "#A78BFA",
	},
	steel: {
		stroke: "#64748B",
		deep: "#475569",
		soft: "#CBD5E1",
		text: "#475569",
		onDark: "#94A3B8",
	},
};

export const AXIS = {
	grid: "#E1E7EF", // steel-200
	tick: "#94A3B8", // steel-400
	label: "#64748B", // steel-500
	baseline: "#CBD5E1", // steel-300
};

/** Shared easing for chart draw-in (matches the site's Reveal curve). */
export const EASE_OUT = [0.21, 0.47, 0.32, 0.98] as const;

/** Format a number for labels/tooltips (Indian grouping). */
export function fmt(
	v: number,
	o: { prefix?: string; suffix?: string; decimals?: number } = {},
): string {
	const { prefix = "", suffix = "", decimals = 0 } = o;
	return (
		prefix +
		v.toLocaleString("en-IN", {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}) +
		suffix
	);
}

/** Build an SVG path `d` for a smooth (Catmull-Rom → cubic) line through pts. */
export function smoothPath(pts: { x: number; y: number }[]): string {
	if (pts.length === 0) return "";
	if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
	const d: string[] = [`M ${pts[0].x} ${pts[0].y}`];
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		// Catmull-Rom to Bezier, tension 1/6.
		const c1x = p1.x + (p2.x - p0.x) / 6;
		const c1y = p1.y + (p2.y - p0.y) / 6;
		const c2x = p2.x - (p3.x - p1.x) / 6;
		const c2y = p2.y - (p3.y - p1.y) / 6;
		d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`);
	}
	return d.join(" ");
}
