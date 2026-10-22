/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./calculator.module.css";

/**
 * Presentational pieces for the BNI calculator. Nothing here computes anything
 * — every value arrives already solved by `model.ts`, so the arithmetic has one
 * home and these stay dumb enough to rearrange freely.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Shared card shell, matching the site's `.panel` component class. */
export function Panel({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"rounded-3xl border border-steel-200 bg-white shadow-soft",
				className,
			)}>
			{children}
		</div>
	);
}

/** Section label in the site's kicker style, scoped down a size for the tool. */
export function Kicker({
	children,
	light = false,
}: {
	children: React.ReactNode;
	light?: boolean;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-kicker",
				light ? "text-corporate-200" : "text-corporate-600",
			)}>
			<span
				className={cn(
					"h-px w-6",
					light ? "bg-corporate-300/60" : "bg-corporate-500/60",
				)}
			/>
			{children}
		</span>
	);
}

/**
 * Headline metric. `emphasis` promotes the tile to the filled treatment — used
 * once, on the number the whole page exists to produce.
 */
export function KpiTile({
	value,
	label,
	hint,
	emphasis = false,
	delay = 0,
}: {
	value: string;
	label: string;
	hint?: string;
	emphasis?: boolean;
	delay?: number;
}) {
	const reduce = useReducedMotion();
	return (
		<motion.div
			initial={reduce ? false : { opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: EASE, delay }}
			className={cn(
				"group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5",
				emphasis ?
					"border-transparent bg-gradient-to-br from-corporate-600 to-corporate-800 text-white shadow-glow"
				:	"border-steel-200 bg-white shadow-soft hover:-translate-y-0.5 hover:border-corporate-200 hover:shadow-card",
			)}>
			<div
				className={cn(
					"font-display text-[1.6rem] font-semibold leading-none tracking-tightest tabular-nums sm:text-[2rem]",
					emphasis ? "text-white" : "text-ink",
				)}>
				{value}
			</div>
			<div
				className={cn(
					"mt-2 text-[11px] font-semibold uppercase tracking-[0.14em]",
					emphasis ? "text-corporate-100" : "text-steel-500",
				)}>
				{label}
			</div>
			{hint && (
				<div
					className={cn(
						"mt-1.5 text-[12.5px] leading-snug",
						emphasis ? "text-white/70" : "text-steel-500",
					)}>
					{hint}
				</div>
			)}
		</motion.div>
	);
}

/**
 * One rung of the funnel. The bar tapers with the step's share of the top of
 * the funnel, so the drop-off is legible at a glance rather than only in the
 * numbers.
 */
export function FunnelStep({
	width,
	value,
	label,
	rate,
	tone,
	delay = 0,
}: {
	width: string;
	value: string;
	label: string;
	rate: string;
	tone: "top" | "mid" | "low" | "end";
	delay?: number;
}) {
	const reduce = useReducedMotion();
	const fill = {
		top: "bg-gradient-to-r from-ink to-corporate-800",
		mid: "bg-gradient-to-r from-corporate-800 to-corporate-600",
		low: "bg-gradient-to-r from-corporate-600 to-corporate-500",
		end: "bg-gradient-to-r from-corporate-500 to-corporate-400",
	}[tone];

	return (
		<div className="flex items-center gap-3">
			<motion.div
				initial={reduce ? false : { width: 0, opacity: 0 }}
				animate={{ width, opacity: 1 }}
				transition={{ duration: 0.7, ease: EASE, delay }}
				className={cn(
					"flex min-w-0 items-baseline gap-2.5 overflow-hidden rounded-xl px-3.5 py-2.5 text-white sm:px-4",
					fill,
				)}>
				<span className="font-display text-base font-semibold tabular-nums sm:text-lg">
					{value}
				</span>
				<span className="truncate text-[11.5px] text-white/70 sm:text-xs">
					{label}
				</span>
			</motion.div>
			<span className="shrink-0 text-[11px] font-semibold tabular-nums text-steel-400">
				{rate}
			</span>
		</div>
	);
}

/** Money field with a rupee affix and a live in-words readout. */
export function MoneyField({
	id,
	label,
	hint,
	value,
	onChange,
	readout,
	min = 0,
	step = 5000,
}: {
	id: string;
	label: string;
	hint?: string;
	value: string;
	onChange: (v: string) => void;
	readout: string;
	min?: number;
	step?: number;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
				<span>{label}</span>
				<span className="text-[12.5px] font-semibold tabular-nums text-corporate-600">
					{readout}
				</span>
			</label>
			<div className="mt-2 flex items-center rounded-xl border border-steel-200 bg-canvas-soft transition-colors duration-200 focus-within:border-corporate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-corporate-500/15">
				<span className="pl-3.5 pr-1 text-base font-semibold text-steel-400">
					₹
				</span>
				<input
					id={id}
					type="number"
					className={cn(
						styles.numInput,
						"w-full bg-transparent py-2.5 pr-3.5 text-[15px] font-semibold tabular-nums text-ink outline-none",
					)}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					min={min}
					step={step}
					inputMode="numeric"
				/>
			</div>
			{hint && <p className="mt-1.5 text-[12px] text-steel-500">{hint}</p>}
		</div>
	);
}

/** Percentage slider with a filled track that tracks the value. */
export function MarginSlider({
	id,
	label,
	hint,
	value,
	onChange,
	min = 5,
	max = 80,
}: {
	id: string;
	label: string;
	hint?: string;
	value: number;
	onChange: (v: number) => void;
	min?: number;
	max?: number;
}) {
	const pct = ((value - min) / (max - min)) * 100;
	return (
		<div>
			<label
				htmlFor={id}
				className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
				<span>{label}</span>
				<span className="text-[12.5px] font-semibold tabular-nums text-corporate-600">
					{value}%
				</span>
			</label>
			<input
				id={id}
				type="range"
				className={cn(styles.range, "mt-3 w-full")}
				style={{ "--fill": `${pct}%` } as React.CSSProperties}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				min={min}
				max={max}
				step={1}
			/>
			<div className="mt-1 flex justify-between text-[11px] tabular-nums text-steel-400">
				<span>{min}%</span>
				<span>{max}%</span>
			</div>
			{hint && <p className="mt-1.5 text-[12px] text-steel-500">{hint}</p>}
		</div>
	);
}

/** Small stat card used by the plan's economics and sources grids. */
export function MiniCard({
	value,
	label,
	caption,
}: {
	value: string;
	label: string;
	caption: string;
}) {
	return (
		<div className="rounded-2xl border border-steel-200 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-corporate-200 hover:shadow-card">
			<div className="font-display text-xl font-semibold tabular-nums text-ink sm:text-2xl">
				{value}
			</div>
			<div className="mt-1.5 text-[12.5px] font-semibold text-ink">{label}</div>
			<div className="mt-1 text-[12px] leading-snug text-steel-500">
				{caption}
			</div>
		</div>
	);
}
