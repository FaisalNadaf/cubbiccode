/** @format */

// One "signature" metric per platform: which stat (by index into its stats[])
// animates as a count-up, plus the exact numeric spec CountStat needs — so the
// counter is never fed a display string and can never render a fake 0/NaN.
export type SignatureSpec = {
	index: number;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
};

export const SIGNATURE: Record<string, SignatureSpec> = {
	"trader-portfolio-system": { index: 0, value: 250, prefix: "₹", suffix: " Cr+" },
	"event-ticket-hub": { index: 3, value: 99.99, suffix: "%", decimals: 2 },
	"global-hiring-hub": { index: 0, value: 5000, suffix: "+" },
	"student-branch-management": { index: 1, value: 1000, suffix: "+" },
	"industrial-inventory-platform": { index: 0, value: 5000, suffix: "+" },
	"crypto-mlm-platform": { index: 1, value: 7.5, prefix: "₹", suffix: " Cr+", decimals: 1 },
};

// Short category tokens for the sticky command-bar chips (index-aligned to caseStudies).
export const CATEGORY_TOKENS = [
	"FinTech",
	"Ticketing",
	"HR Tech",
	"EdTech",
	"Industrial",
	"Web3",
];

// Stable anchor id for the nth (0-based) case-study entry: entry-01 … entry-06.
export const entryId = (i: number) => `entry-${String(i + 1).padStart(2, "0")}`;
