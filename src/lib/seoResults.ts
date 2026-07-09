/** @format */

/**
 * Data for the SEO Results showcase (/seo-results).
 *
 * These are REPRESENTATIVE, sector-anonymised engagement outcomes — realistic and
 * internally consistent (e.g. organic clicks ≈ sessions, funnel ratios use sane
 * CTR/CVR), framed on the page as indicative. Swap in client-specific figures as
 * they're cleared for publication. Chart series are deterministic module
 * constants (no random values) so SSR/CSR render identically.
 */

import type { ChartSpec } from "@/lib/caseStudyCharts";

export type SeoStat = {
	icon: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	label: string;
	spark: number[];
};

/* Agency-wide SEO outcomes — headline band. */
export const SEO_OVERVIEW: SeoStat[] = [
	{
		icon: "TrendingUp",
		value: 3.8,
		suffix: "x",
		decimals: 1,
		label: "Average organic traffic growth",
		spark: [1, 1.4, 1.9, 2.4, 2.9, 3.3, 3.6, 3.8],
	},
	{
		icon: "Search",
		value: 1200,
		suffix: "+",
		label: "Keywords ranked on page one",
		spark: [120, 300, 520, 720, 900, 1050, 1150, 1200],
	},
	{
		icon: "Gauge",
		value: 48,
		label: "Average domain authority",
		spark: [22, 28, 33, 38, 42, 45, 47, 48],
	},
	{
		icon: "Handshake",
		value: 60,
		suffix: "+",
		label: "SEO engagements delivered",
		spark: [8, 16, 25, 34, 42, 50, 56, 60],
	},
];

export type SeoKpi = { icon: string; value: string; label: string };

export type SeoResult = {
	slug: string;
	sector: string;
	title: string;
	summary: string;
	/** The count-up headline for this result's signature tile. */
	signature: {
		label: string;
		value: number;
		prefix?: string;
		suffix?: string;
		decimals?: number;
	};
	/** Sparkline under the signature tile; endpoint = the signature value. */
	spark: number[];
	/** Hero chart first, optional secondary second. */
	charts: ChartSpec[];
	kpis: SeoKpi[];
};

export const SEO_RESULTS: SeoResult[] = [
	{
		slug: "manufacturing-exporter",
		sector: "Manufacturing · Global exporter",
		title: "7× organic traffic in nine months",
		summary:
			"A B2B exporter stuck on page four for its core product terms. A technical rebuild plus a content-led category strategy turned search into its primary inbound channel.",
		signature: { label: "Monthly organic sessions", value: 8600 },
		spark: [1200, 2200, 3400, 4700, 5900, 6900, 7700, 8200, 8600],
		charts: [
			{
				kind: "area",
				title: "Organic sessions / month",
				caption: "Nine-month organic growth curve",
				color: "blue",
				// endpoint 8,600 = signature.
				points: [
					{ label: "M1", value: 1200 },
					{ label: "M2", value: 2200 },
					{ label: "M3", value: 3400 },
					{ label: "M4", value: 4700 },
					{ label: "M5", value: 5900 },
					{ label: "M6", value: 6900 },
					{ label: "M7", value: 7700 },
					{ label: "M8", value: 8200 },
					{ label: "M9", value: 8600 },
				],
			},
			{
				kind: "compare",
				title: "Before vs after",
				caption: "Monthly organic sessions",
				items: [
					{ label: "Before SEO", value: 1200, color: "steel" },
					{ label: "After 9 months", value: 8600, color: "blue" },
				],
			},
		],
		kpis: [
			{ icon: "Search", value: "180+", label: "Page-1 keywords" },
			{ icon: "Gauge", value: "46", label: "Domain authority" },
		],
	},
	{
		slug: "multi-city-clinic",
		sector: "Healthcare · Multi-city clinic",
		title: "Page one for 90% of priority keywords",
		summary:
			"Local-intent SEO across multiple cities lifted the clinic into the map 3-pack and page one for its highest-value treatments — the enquiry line hasn't stopped since.",
		signature: {
			label: "Priority keywords on page one",
			value: 90,
			suffix: "%",
		},
		spark: [22, 38, 52, 64, 74, 82, 88, 90],
		charts: [
			{
				kind: "donut",
				title: "Keyword position distribution",
				caption: "Share of priority keywords by SERP page",
				// Sums to 100% of priority keywords.
				segments: [
					{ label: "Page 1 (pos 1–10)", value: 90, color: "blue" },
					{ label: "Page 2 (pos 11–20)", value: 7, color: "teal" },
					{ label: "Page 3+", value: 3, color: "violet" },
				],
				center: { label: "on page one", value: 90, suffix: "%" },
			},
			{
				kind: "radial",
				title: "Local-pack visibility",
				caption: "Share of local searches surfacing the 3-pack",
				percent: 92,
				display: { value: 92, suffix: "%" },
				color: "teal",
			},
		],
		kpis: [
			{ icon: "MapPin", value: "6", label: "Cities ranked" },
			{ icon: "PhoneCall", value: "7.5x", label: "Enquiry growth" },
		],
	},
	{
		slug: "d2c-store",
		sector: "E-commerce · D2C brand",
		title: "62% of revenue now comes from organic",
		summary:
			"Non-branded category and product SEO turned search into the store's largest, lowest-CAC channel — compounding revenue without compounding ad spend.",
		signature: { label: "Organic revenue share", value: 62, suffix: "%" },
		spark: [18, 28, 37, 45, 52, 57, 60, 62],
		charts: [
			{
				kind: "bar",
				title: "Non-branded organic sessions",
				caption: "Quarterly, climbing to 42K / month",
				color: "blue",
				// endpoint 42,000 ≈ funnel clicks (internal consistency).
				points: [
					{ label: "Q1", value: 6000 },
					{ label: "Q2", value: 14000 },
					{ label: "Q3", value: 24000 },
					{ label: "Q4", value: 33000 },
					{ label: "Q5", value: 39000 },
					{ label: "Q6", value: 42000 },
				],
			},
			{
				kind: "funnel",
				title: "Organic search funnel",
				caption: "Monthly — impressions to orders",
				stages: [
					{ label: "Search impressions", value: 480000, color: "blue" },
					{ label: "Clicks to site", value: 42000, color: "blue" },
					{ label: "Product views", value: 26000, color: "teal" },
					{ label: "Orders", value: 2100, color: "teal" },
				],
			},
		],
		kpis: [
			{ icon: "ShoppingBag", value: "3.5x", label: "Organic revenue" },
			{ icon: "Search", value: "400+", label: "Ranking keywords" },
		],
	},
];
