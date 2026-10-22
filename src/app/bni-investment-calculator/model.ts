/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

/**
 * BNI Investment Calculator — the maths, lifted out of the view.
 *
 * Reverse-solves a networking funnel: you name the profit you want out of BNI
 * this year, and `solve` returns how many people you have to meet to get it,
 * broken into weekly commitments and per-activity economics.
 *
 *   Profit = P × c1 × c2 × c3 × ATV × M × [ d + (1 − d) × R × cr ]
 *
 * so P = goal ÷ everything else. The four conversion rates and the referral
 * behaviour are fixed chapter benchmarks (`BENCHMARKS`); only the member's own
 * deal size, margin and membership fee are adjustable.
 *
 * This module is deliberately pure and view-free: every number the page shows
 * comes from `solve`, so the UI can be reworked without the arithmetic moving —
 * as it has been, twice, with these figures untouched.
 */

/** Chapter benchmarks. Deliberately conservative, and deliberately not tunable. */
export const BENCHMARKS = {
	/** People met → first 1-2-1. */
	c1: 0.5,
	/** First 1-2-1 → detailed second meeting. */
	c2: 0.4,
	/** Second meeting → a relationship that produces. */
	c3: 0.5,
	/** Share of those relationships who buy directly; the rest refer. */
	d: 0.4,
	/** Referrals one partner sends per year. */
	R: 4,
	/** Close rate on a referral. */
	cr: 0.4,
	/** Working weeks in a BNI year. */
	wk: 48,
} as const;

export const DEFAULTS = {
	goal: "600000",
	inv: "100000",
	atv: "50000",
	marg: 30,
};

export const GOAL_CHIPS = [300000, 600000, 1000000, 2500000, 5000000];

const grouped = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Indian digit grouping — 1,00,000 rather than 100,000. */
export const num = (n: number) => grouped.format(Math.round(n));
export const inr = (n: number) => `₹${num(n)}`;

export const toNum = (s: string) => {
	const n = parseFloat(s);
	return Number.isFinite(n) ? n : 0;
};

/** 600000 → "6 Lakh", 25000000 → "2.50 Crore". */
export function words(n: number) {
	if (n >= 10000000) {
		const c = n / 10000000;
		return `${c % 1 ? c.toFixed(2) : c} Crore`;
	}
	if (n >= 100000) {
		const l = n / 100000;
		return `${l % 1 ? l.toFixed(2) : l} Lakh`;
	}
	if (n >= 1000) return `${n / 1000} Thousand`;
	return num(n);
}

export type Solved = {
	/** People to meet across the year — the answer the whole page hangs off. */
	P: number;
	m1: number;
	m2: number;
	conv: number;
	direct: number;
	partners: number;
	refs: number;
	revDirect: number;
	revRef: number;
	revenue: number;
	profit: number;
	roi: number;
	perWeekPeople: number;
	perWeek121: number;
	perWeek2nd: number;
	visitorsPerMonth: number;
	wk: number;
};

/**
 * Returns null when the inputs cannot produce an answer — a zero deal size,
 * margin or goal makes the division meaningless rather than merely large.
 */
export function solve(
	goalN: number,
	atvN: number,
	invN: number,
	marg: number,
): Solved | null {
	const { c1, c2, c3, d, cr, R, wk } = BENCHMARKS;
	const M = marg / 100;
	const mult = d + (1 - d) * R * cr;
	const perPerson = c1 * c2 * c3 * atvN * M * mult;

	if (perPerson <= 0 || atvN <= 0 || goalN <= 0) return null;

	const P = Math.ceil(goalN / perPerson);
	const m1 = P * c1;
	const m2 = m1 * c2;
	const conv = m2 * c3;

	const direct = conv * d;
	const partners = conv * (1 - d);
	const refs = partners * R;
	const refDeals = refs * cr;

	const revDirect = direct * atvN;
	const revRef = refDeals * atvN;
	const revenue = revDirect + revRef;
	const profit = revenue * M;

	return {
		P,
		m1,
		m2,
		conv,
		direct,
		partners,
		refs,
		revDirect,
		revRef,
		revenue,
		profit,
		roi: invN > 0 ? profit / invN : 0,
		perWeekPeople: P / wk,
		perWeek121: m1 / wk,
		perWeek2nd: m2 / wk,
		visitorsPerMonth: (P * 0.3) / 12,
		wk,
	};
}
