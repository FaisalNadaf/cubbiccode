/** @format */

/**
 * Chart-ready data for the Case Studies analytics dashboard.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  HONESTY CONTRACT
 * ─────────────────────────────────────────────────────────────────────────
 *  Every series below is DERIVED from the real, published headline metrics in
 *  `content/portfolio.ts` + `lib/caseStudyMetrics.ts`. The rule:
 *
 *    • The ENDPOINT / TOTAL of each derived series equals the real figure.
 *    • Intermediate points are believable, monotonic (or seasonal) trajectories
 *      — never random, never contradicting the published number.
 *    • Funnel / comparison ratios use conventional, defensible conversion rates.
 *
 *  Each block documents exactly which real anchor it reconciles to. If a figure
 *  ever changes in portfolio.ts, update the endpoint here to match.
 */

import type { ChartColor } from "@/components/charts/theme";

/* ── Chart spec types (a discriminated union the panel renders from) ─────── */

export type ChartPoint = { label: string; value: number };

type NumFmt = { prefix?: string; suffix?: string; decimals?: number };

export type AreaSpec = {
	kind: "area";
	title: string;
	caption?: string;
	unit?: string;
	color?: ChartColor;
	points: ChartPoint[];
} & NumFmt;

export type BarSpec = {
	kind: "bar";
	title: string;
	caption?: string;
	unit?: string;
	color?: ChartColor;
	points: ChartPoint[];
} & NumFmt;

export type CompareSpec = {
	kind: "compare";
	title: string;
	caption?: string;
	/** 2–3 categorical values compared as horizontal bars. */
	items: { label: string; value: number; color: ChartColor }[];
} & NumFmt;

export type RadialSpec = {
	kind: "radial";
	title: string;
	caption?: string;
	/** Arc fill 0–100. */
	percent: number;
	/** The number rendered in the centre (may differ from percent). */
	display: { value: number } & NumFmt;
	color?: ChartColor;
};

export type DonutSpec = {
	kind: "donut";
	title: string;
	caption?: string;
	segments: { label: string; value: number; color: ChartColor }[];
	center: { label: string; value: number } & NumFmt;
};

export type FunnelSpec = {
	kind: "funnel";
	title: string;
	caption?: string;
	stages: { label: string; value: number; color: ChartColor }[];
} & NumFmt;

export type ChartSpec =
	| AreaSpec
	| BarSpec
	| CompareSpec
	| RadialSpec
	| DonutSpec
	| FunnelSpec;

/* ── Per-study widgets ──────────────────────────────────────────────────── */

export type Kpi = { icon: string; value: string; label: string };
export type Capability = { icon: string; label: string };

export type CaseChartData = {
	slug: string;
	/**
	 * The one visualization rendered beside the product screenshot.
	 *
	 * It is deliberately never an `area`/line: the signature tile already draws
	 * this platform's growth as a sparkline, so a line chart here restates the
	 * same series in the same form — the panel ends up showing one curve twice.
	 * Each study therefore picks the shape its data actually wants (funnel,
	 * donut, comparison, bars), which also keeps the six panels from reading as
	 * one chart repeated six times.
	 */
	chart: ChartSpec;
	/** Small stat tiles beside the charts. */
	kpis: Kpi[];
	/** Qualitative capability chips (for platforms whose value isn't a number). */
	capabilities?: Capability[];
	/** Sparkline under the signature KPI tile; endpoint = the signature value. */
	spark: number[];
	/** Honest framing shown once under the panel. */
	note?: string;
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 1 · TRADER PORTFOLIO SYSTEM
 * Real anchors: ₹250 Cr+ AUM · 3,500+ clients · ₹5 Cr+/mo payouts.
 * AUM is cumulative → an 8-quarter compounding growth curve that lands on 250.
 * Monthly payouts → 6-month run-rate that lands on 5.
 * ══════════════════════════════════════════════════════════════════════════ */
const traderPortfolio: CaseChartData = {
	slug: "trader-portfolio-system",
	// AUM growth is the sparkline; the chart shows the payout engine instead.
	chart: {
		kind: "bar",
		title: "Monthly payouts automated",
		caption: "Payout run-rate to ₹5 Cr+ / month",
		unit: "₹ Cr",
		prefix: "₹",
		suffix: " Cr",
		decimals: 1,
		color: "teal",
		// endpoint = 5 (real ₹5 Cr+/mo).
		points: [
			{ label: "Jan", value: 3.6 },
			{ label: "Feb", value: 4.0 },
			{ label: "Mar", value: 4.3 },
			{ label: "Apr", value: 4.6 },
			{ label: "May", value: 4.8 },
			{ label: "Jun", value: 5.0 },
		],
	},
	kpis: [
		{ icon: "Users", value: "3,500+", label: "Clients served" },
		{ icon: "Banknote", value: "₹5 Cr+", label: "Monthly payouts" },
	],
	capabilities: [{ icon: "Server", label: "Core business platform" }],
	spark: [42, 68, 96, 128, 162, 198, 228, 250], // → ₹250 Cr
	note: "Growth trajectories are indicative; endpoints match published production figures.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 2 · EVENT TICKET HUB
 * Real anchors: 99.99% uptime (signature) · ₹1.5 Cr+/mo txns · 10K+ listings/mo
 * · 20K+ secure payments.
 * Uptime → radial gauge at 99.99. Transactions → 6-month ramp to ₹1.5 Cr.
 * ══════════════════════════════════════════════════════════════════════════ */
const eventTicket: CaseChartData = {
	slug: "event-ticket-hub",
	// Uptime (99.99%) is the signature tile — a radial gauge of it would just
	// print the same number twice — so the chart carries the transaction volume,
	// as bars rather than a line so it doesn't echo the uptime sparkline.
	chart: {
		kind: "bar",
		title: "Monthly transaction volume",
		caption: "Run-rate to ₹1.5 Cr+ / month",
		unit: "₹ Cr",
		prefix: "₹",
		suffix: " Cr",
		decimals: 2,
		color: "blue",
		// endpoint = 1.5 (real ₹1.5 Cr+/mo).
		points: [
			{ label: "M1", value: 0.9 },
			{ label: "M2", value: 1.05 },
			{ label: "M3", value: 1.18 },
			{ label: "M4", value: 1.3 },
			{ label: "M5", value: 1.42 },
			{ label: "M6", value: 1.5 },
		],
	},
	kpis: [
		{ icon: "Ticket", value: "10K+", label: "Listings / month" },
		{ icon: "ShieldCheck", value: "20K+", label: "Secure payments" },
	],
	spark: [99.9, 99.93, 99.95, 99.97, 99.98, 99.99], // → 99.99%
	note: "The monthly transaction ramp is indicative; the 99.99% uptime and volume endpoints are production figures.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 3 · GLOBAL HIRING HUB
 * Real anchors: 5,000+ verified applications (signature) · 100+ clinics ·
 * 1,500+ apps/mo · 60% faster employer review.
 * A hiring funnel where the VERIFIED stage = 5,000 (real); received/shortlisted/
 * placed use conventional cross-border nursing conversion rates. Review speed →
 * radial at 60.
 * ══════════════════════════════════════════════════════════════════════════ */
const globalHiring: CaseChartData = {
	slug: "global-hiring-hub",
	chart: {
		kind: "funnel",
		title: "Cross-border hiring funnel",
		caption: "Verified stage = 5,000+ real applications",
		suffix: "",
		stages: [
			// received ≈ verified / 0.60 (≈60% pass document verification)
			{ label: "Applications received", value: 8300, color: "blue" },
			{ label: "Verified applications", value: 5000, color: "blue" },
			// ~48% of verified reach clinic shortlist
			{ label: "Shortlisted by clinics", value: 2400, color: "teal" },
			// ~48% of shortlisted placed
			{ label: "Placed in German clinics", value: 1150, color: "teal" },
		],
	},
	kpis: [
		{ icon: "Building2", value: "100+", label: "German clinics" },
		{ icon: "FileText", value: "1,500+", label: "Applications / month" },
	],
	spark: [1200, 2100, 2900, 3600, 4200, 4650, 5000], // cumulative verified → 5,000
	note: "Received / shortlisted / placed use standard funnel conversion rates; verified applications (5,000+) and review-speed gain are real.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 4 · STUDENT & BRANCH MANAGEMENT
 * Real anchors: 30+ centers · 1,000+ students/mo (signature) · automated fees ·
 * QR certs. Centers → expansion timeline to 30. Students → monthly ramp to 1,000.
 * ══════════════════════════════════════════════════════════════════════════ */
const studentBranch: CaseChartData = {
	slug: "student-branch-management",
	// The enrolment ramp is the sparkline; the donut shows how those students
	// distribute across the centre network instead.
	chart: {
		kind: "donut",
		title: "Students across the network",
		caption: "Indicative distribution across 30+ centers",
		// Segments sum to 1,000 (real 1,000+ students/mo). Split by centre tier.
		segments: [
			{ label: "Flagship centers", value: 420, color: "blue" },
			{ label: "Growth centers", value: 360, color: "teal" },
			{ label: "Emerging centers", value: 220, color: "violet" },
		],
		center: { label: "students / mo", value: 1000, suffix: "+" },
	},
	// students/mo is the signature (shown in its own tile) — KPIs list the rest.
	kpis: [{ icon: "Building2", value: "30+", label: "Active centers" }],
	capabilities: [
		{ icon: "ReceiptText", label: "Automated fee tracking & reminders" },
		{ icon: "QrCode", label: "QR-verified certificates" },
	],
	spark: [520, 640, 750, 840, 930, 1000], // enrolment → 1,000/mo
	note: "Centre distribution and enrolment curve are indicative; endpoints match the 30+ centers and 1,000+ students/mo figures.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 5 · INDUSTRIAL INVENTORY & FIELD SERVICE
 * Real anchors: 5,000+ service visits/yr (signature) · inventory movements ·
 * travel/allowance visibility · real-time dashboards.
 * 12 monthly service-visit bars that SUM to exactly 5,000 (mild seasonality).
 * ══════════════════════════════════════════════════════════════════════════ */
const industrialInventory: CaseChartData = {
	slug: "industrial-inventory-platform",
	chart: {
		kind: "bar",
		title: "Field-service visits per month",
		caption: "12 months summing to 5,000+ visits / year",
		suffix: "",
		color: "violet",
		// Σ = 5000 exactly (real 5,000+/yr). Mild mid-year seasonality.
		points: [
			{ label: "Jan", value: 360 },
			{ label: "Feb", value: 380 },
			{ label: "Mar", value: 400 },
			{ label: "Apr", value: 420 },
			{ label: "May", value: 440 },
			{ label: "Jun", value: 450 },
			{ label: "Jul", value: 460 },
			{ label: "Aug", value: 445 },
			{ label: "Sep", value: 430 },
			{ label: "Oct", value: 415 },
			{ label: "Nov", value: 400 },
			{ label: "Dec", value: 400 },
		],
	},
	// visits/yr is the signature (shown in its own tile) — the rest are qualitative.
	kpis: [],
	capabilities: [
		{ icon: "Package", label: "Inventory movements tracked" },
		{ icon: "Route", label: "Travel & allowance visibility" },
		{ icon: "LayoutDashboard", label: "Real-time dashboards" },
	],
	// cumulative visits → 5,000/yr
	spark: [360, 740, 1140, 1560, 2000, 2450, 2910, 3355, 3785, 4200, 4600, 5000],
	note: "Monthly split is indicative and sums to the published 5,000+ annual visits.",
};

/* ═══════════════════════════════════════════════════════════════════════════
 * 6 · CRYPTO PAYMENTS PLATFORM
 * Real anchors: ₹7.5 Cr+ crypto investments (signature) · ₹1.7 Cr+ ROI/commissions
 * paid · 3,000+ users · 15K+ commission txns.
 * Investments → growth curve to 7.5. Capital vs payouts → donut (1.7 of 7.5 ≈ 22.7%).
 * ══════════════════════════════════════════════════════════════════════════ */
const cryptoPayments: CaseChartData = {
	slug: "crypto-mlm-platform",
	// Investment volume is the sparkline; the chart weighs capital against what
	// the platform has actually paid back out.
	chart: {
		kind: "compare",
		title: "Capital deployed vs paid out",
		caption: "₹1.7 Cr ROI & commissions returned on ₹7.5 Cr capital (≈23%)",
		prefix: "₹",
		suffix: " Cr",
		decimals: 1,
		// Both values real (₹7.5 Cr invested, ₹1.7 Cr paid out).
		items: [
			{ label: "Capital deployed", value: 7.5, color: "blue" },
			{ label: "ROI & commissions paid", value: 1.7, color: "amber" },
		],
	},
	kpis: [
		{ icon: "Users", value: "3,000+", label: "Users onboarded" },
		{ icon: "Repeat", value: "15K+", label: "Commission transactions" },
	],
	spark: [1.2, 2.4, 3.7, 5.0, 6.3, 7.5], // investment volume → ₹7.5 Cr
	note: "ROI ratio derives from the real ₹1.7 Cr paid against ₹7.5 Cr capital; the growth curve is indicative.",
};

export const CASE_CHARTS: Record<string, CaseChartData> = {
	"trader-portfolio-system": traderPortfolio,
	"event-ticket-hub": eventTicket,
	"global-hiring-hub": globalHiring,
	"student-branch-management": studentBranch,
	"industrial-inventory-platform": industrialInventory,
	"crypto-mlm-platform": cryptoPayments,
};

/* ═══════════════════════════════════════════════════════════════════════════
 * CONSOLIDATED RESULTS — aggregate KPI board (closing dark band).
 * Values match the existing `impact` array; each carries a sparkline whose
 * endpoint equals the headline (indicative trend only).
 * ══════════════════════════════════════════════════════════════════════════ */
export type AggregateStat = {
	icon: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	label: string;
	spark: number[];
};

export const AGGREGATE_STATS: AggregateStat[] = [
	{
		icon: "Landmark",
		value: 250,
		prefix: "₹",
		suffix: " Cr+",
		label: "Assets under management",
		spark: [42, 68, 96, 128, 162, 198, 228, 250],
	},
	{
		icon: "TrendingUp",
		value: 4185,
		prefix: "₹",
		suffix: "M+",
		label: "Transactions powered",
		spark: [900, 1500, 2100, 2700, 3200, 3600, 3950, 4185],
	},
	{
		icon: "Activity",
		value: 99.99,
		suffix: "%",
		decimals: 2,
		label: "Platform uptime",
		spark: [99.9, 99.94, 99.92, 99.97, 99.95, 99.98, 99.99, 99.99],
	},
	{
		icon: "Users",
		value: 60,
		suffix: "K+",
		label: "Users onboarded",
		spark: [12, 20, 28, 36, 44, 51, 56, 60],
	},
];
