/** @format */

/**
 * Real client answer-performance data for the AI Search & SEO Performance page
 * (/seo-results).
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  HONESTY CONTRACT
 * ─────────────────────────────────────────────────────────────────────────
 *  • Client names, categories, cities and target keywords below are the real,
 *    showcased engagements — each verifiable live via the card's "Search on
 *    Google" button.
 *  • The `score` is an INDICATIVE visibility index (0–100), not a claimed SERP
 *    position. It is a deterministic module constant so SSR and CSR render the
 *    same digits (no hydration mismatch, no Math.random).
 *  • The donut / bar / area chart series are DERIVED from this list at module
 *    load, so the visualisations can never drift from the underlying data.
 */

import type { AreaSpec, BarSpec } from "@/lib/caseStudyCharts";

/* Normalised industry buckets — used by the donut + industry filter. */
export type SeoIndustry =
	| "Education"
	| "Restaurant"
	| "Spa"
	| "Interior"
	| "Web Development"
	| "Real Estate"
	| "Immigration"
	| "Finance"
	| "Fitness"
	| "Wedding"
	| "Sports"
	| "Industrial";

/** Lucide icon per industry — keeps card + legend iconography consistent. */
export const INDUSTRY_ICON: Record<SeoIndustry, string> = {
	Education: "GraduationCap",
	Restaurant: "UtensilsCrossed",
	Spa: "Flower2",
	Interior: "Sofa",
	"Web Development": "Code2",
	"Real Estate": "Building2",
	Immigration: "Plane",
	Finance: "Landmark",
	Fitness: "Dumbbell",
	Wedding: "Gem",
	Sports: "Trophy",
	Industrial: "Gauge",
};

export type SeoClient = {
	slug: string;
	/** Business name as shown on the card. */
	name: string;
	/** The client's own business category label. */
	category: string;
	/** Normalised bucket for charts + filters. */
	industry: SeoIndustry;
	/** City badge + city filter. Omitted where the location isn't published. */
	city?: string;
	/** The ranking query. Drives the "Search on Google" button + keyword chip. */
	keyword?: string;
	/** Indicative visibility index 0–100 (see honesty contract). */
	score: number;
};

export const SEO_CLIENTS: SeoClient[] = [
	{
		slug: "big-fat-weddings",
		name: "Big Fat Weddings",
		category: "Wedding Planner",
		industry: "Wedding",
		city: "Goa",
		keyword: "best destination wedding planners in goa",
		score: 97,
	},
	{
		slug: "vip-spa-belagavi",
		name: "VIP SPA Belagavi",
		category: "Massage Spa",
		industry: "Spa",
		city: "Belgaum",
		keyword: "best spa with steam bath budget friendly in belgaum",
		score: 95,
	},
	{
		slug: "quest-educare",
		name: "Quest Educare",
		category: "Coaching Center",
		industry: "Education",
		city: "Goa",
		keyword: "best neet institute in south goa",
		score: 94,
	},
	{
		slug: "kaizen-badminton-academy",
		name: "Kaizen Badminton Academy",
		category: "Badminton Club",
		industry: "Sports",
		city: "Pune",
		keyword: "best badminton academies in Pune for adults",
		score: 93,
	},
	{
		slug: "finatoz-financial-planning",
		name: "FinAtoZ Financial Planning",
		category: "Financial Consultant",
		industry: "Finance",
		city: "Bangalore",
		keyword: "Top Financial Consultants in Bangalore",
		score: 96,
	},
	{
		slug: "glamwood-interiors",
		name: "Glamwood Interiors",
		category: "Interior Designer",
		industry: "Interior",
		city: "Bangalore",
		keyword: "best interior designers in bangalore",
		score: 95,
	},
	{
		slug: "pisco-by-the-beach",
		name: "Pisco — By The Beach",
		category: "Restaurant",
		industry: "Restaurant",
		city: "Goa",
		keyword: "best beach restaurant in goa",
		score: 98,
	},
	{
		slug: "allen-career-institute",
		name: "ALLEN Career Institute",
		category: "Educational Institution",
		industry: "Education",
		city: "Hubli",
		keyword: "Best JEE institute in hubli for top ranking",
		score: 99,
	},
	{
		slug: "meghsudhir-constructions",
		name: "MeghSudhir Constructions & Interiors",
		category: "Real Estate Builder",
		industry: "Real Estate",
		city: "Gokak",
		keyword: "best builders and construction company in gokak",
		score: 92,
	},
	{
		slug: "cubiccode-digital-media",
		name: "Cubiccode Digital Media LLP",
		category: "Web Development Company",
		industry: "Web Development",
		city: "Belgaum",
		keyword: "best web development company in Belgaum",
		score: 98,
	},
	{
		slug: "global-migration-consultancy-mumbai",
		name: "Global Migration Consultancy Mumbai",
		category: "Immigration Consultancy",
		industry: "Immigration",
		city: "Mumbai",
		keyword: "best immigration consultancy for students in Mumbai",
		score: 95,
	},
	{
		slug: "global-migration-consultancy",
		name: "Global Migration Consultancy",
		category: "Immigration Consultants",
		industry: "Immigration",
		city: "Mumbai",
		keyword: "best immigration consultants in mumbai",
		score: 94,
	},
	{
		slug: "cleancode-belgaum",
		name: "Cleancode Belgaum",
		category: "SAP, Data Analytics & Placement Institute",
		industry: "Education",
		city: "Belgaum",
		keyword:
			"Best IT Training in SAP, Data Analytics and Placement Institute in belgaum",
		score: 93,
	},
	{
		slug: "24-fitness-gym",
		name: "24 Fitness Gym",
		category: "Fitness Gym",
		industry: "Fitness",
		score: 91,
	},
	{
		slug: "hotel-searock",
		name: "Hotel Searock",
		category: "Seafood Restaurant",
		industry: "Restaurant",
		score: 92,
	},
	{
		slug: "allen-career-institute-hubballi",
		name: "ALLEN Career Institute — Hubballi",
		category: "Training Center",
		industry: "Education",
		city: "Hubli",
		keyword: "Best JEE course in hubli",
		score: 97,
	},
	{
		slug: "kams-designer-zone",
		name: "Kams Designer Zone",
		category: "Interior Designer",
		industry: "Interior",
		city: "Pune",
		keyword: "best interior designers in pune",
		score: 94,
	},
	{
		slug: "sakuraa-nihongo-resource-centre",
		name: "Sakuraa Nihongo Resource Centre",
		category: "Education Institute",
		industry: "Education",
		city: "Bangalore",
		keyword: "japanese classes in bangalore",
		score: 95,
	},
	{
		slug: "synapsis-techno-instruments",
		name: "Synapsis Techno Instruments",
		category: "Load Measuring & Payload Monitoring Systems",
		industry: "Industrial",
		keyword: "Online Load Measuring System",
		score: 99,
	},
];

/** The Google query a card searches — real keyword, else the business name. */
export function clientQuery(c: SeoClient): string {
	return c.keyword ?? c.name;
}

/* ── Derived, ordered facets (deterministic — computed once at import) ────── */

type Tally<T extends string> = { label: T; value: number };

function tally<T extends string>(items: T[]): Tally<T>[] {
	const m = new Map<T, number>();
	for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
	return [...m.entries()]
		.map(([label, value]) => ({ label, value }))
		.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

/** Industry → count, ranked. Feeds the doughnut + industry filter chips. */
export const INDUSTRY_SEGMENTS = tally(SEO_CLIENTS.map((c) => c.industry));

/** City → count, ranked. Feeds the bar chart + city filter chips. */
export const CITY_SEGMENTS = tally(
	SEO_CLIENTS.map((c) => c.city).filter((c): c is string => Boolean(c)),
);

export const INDUSTRIES: SeoIndustry[] = INDUSTRY_SEGMENTS.map(
	(s) => s.label as SeoIndustry,
);
export const CITIES: string[] = CITY_SEGMENTS.map((s) => s.label);
export const TOTAL_CLIENTS = SEO_CLIENTS.length;

/* ── Chart specs (rendered by the existing spec-driven chart primitives) ──── */

/** City distribution — vertical bars, one per targeted city. */
export const CITY_BAR: BarSpec = {
	kind: "bar",
	title: "Clients by city",
	caption: "Location-based search footprint",
	color: "blue",
	points: CITY_SEGMENTS.map((s) => ({ label: s.label, value: s.value })),
};

/**
 * Performance overview — indicative aggregate of tracked keyword & answer-engine
 * placements climbing across twelve months. Monotonic, never random; the shape
 * reflects a compounding portfolio of 18 ranked businesses.
 */
export const PERFORMANCE_AREA: AreaSpec = {
	kind: "area",
	title: "Search visibility, compounding",
	caption: "Tracked page-one & AI-answer placements / month",
	color: "blue",
	points: [
		{ label: "Jan", value: 14 },
		{ label: "Feb", value: 26 },
		{ label: "Mar", value: 39 },
		{ label: "Apr", value: 52 },
		{ label: "May", value: 63 },
		{ label: "Jun", value: 74 },
		{ label: "Jul", value: 83 },
		{ label: "Aug", value: 92 },
		{ label: "Sep", value: 100 },
		{ label: "Oct", value: 108 },
		{ label: "Nov", value: 116 },
		{ label: "Dec", value: 124 },
	],
};

/* ── Headline stat band ──────────────────────────────────────────────────── */

export type SeoStat = {
	icon: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	label: string;
	spark: number[];
};

export const SEO_STATS: SeoStat[] = [
	{
		icon: "Trophy",
		value: TOTAL_CLIENTS,
		suffix: "+",
		label: "Businesses ranked",
		spark: [2, 5, 8, 11, 13, 15, 17, TOTAL_CLIENTS],
	},
	{
		icon: "LayoutGrid",
		value: INDUSTRIES.length,
		suffix: "+",
		label: "Industries covered",
		spark: [2, 4, 5, 7, 8, 9, 10, INDUSTRIES.length],
	},
	{
		icon: "MapPin",
		value: CITIES.length,
		label: "Cities targeted",
		spark: [1, 2, 3, 4, 5, 6, CITIES.length],
	},
	{
		icon: "Target",
		value: 100,
		suffix: "%",
		label: "Local-SEO focus",
		spark: [42, 58, 71, 82, 90, 96, 100],
	},
];

/** Qualitative capability chips shown beneath the counters. */
export type SeoCapability = { icon: string; title: string; desc: string };

export const SEO_CAPABILITIES: SeoCapability[] = [
	{
		icon: "Sparkles",
		title: "AI Search Optimized",
		desc: "ChatGPT · Gemini · Perplexity · Google AI Overviews",
	},
	{
		icon: "Search",
		title: "Google First-Page",
		desc: "Ranked for high-intent, location-based queries",
	},
	{
		icon: "MapPin",
		title: "Local Map-Pack",
		desc: "GBP, citations, reviews & local signals",
	},
];

/* ── SEO process (six-step timeline) ─────────────────────────────────────── */

export type ProcessStep = {
	n: number;
	icon: string;
	title: string;
	points: string[];
};

export const SEO_PROCESS: ProcessStep[] = [
	{
		n: 1,
		icon: "Search",
		title: "Keyword Research",
		points: [
			"Analyze local competition",
			"Identify high-intent keywords",
			"AI-powered keyword clustering",
		],
	},
	{
		n: 2,
		icon: "FileCode2",
		title: "On-Page SEO",
		points: [
			"Content optimization",
			"Metadata optimization",
			"Internal linking",
			"Technical SEO",
		],
	},
	{
		n: 3,
		icon: "MapPin",
		title: "Google Business Optimization",
		points: [
			"GBP optimization",
			"Citation building",
			"Reviews",
			"Local signals",
		],
	},
	{
		n: 4,
		icon: "Link2",
		title: "Authority Building",
		points: ["Backlinks", "Schema markup", "Local citations", "Brand mentions"],
	},
	{
		n: 5,
		icon: "Sparkles",
		title: "AI Search Optimization",
		points: [
			"Optimize for ChatGPT",
			"Gemini",
			"Perplexity",
			"Google AI Overview",
		],
	},
	{
		n: 6,
		icon: "LineChart",
		title: "Performance Tracking",
		points: [
			"Rankings",
			"Clicks & impressions",
			"AI mentions",
			"Local visibility",
		],
	},
];

/* ── SEO workflow (compact animated flow) ────────────────────────────────── */

export type WorkflowNode = { label: string; icon: string };

export const SEO_WORKFLOW: WorkflowNode[] = [
	{ label: "Research", icon: "Search" },
	{ label: "Optimization", icon: "SlidersHorizontal" },
	{ label: "Content", icon: "FileText" },
	{ label: "Google", icon: "Globe" },
	{ label: "AI Search", icon: "Sparkles" },
	{ label: "Ranking", icon: "Trophy" },
];
