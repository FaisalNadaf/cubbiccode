/** @format */

"use client";

import { useId, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Search, MapPin, Sparkles, Globe, BadgeCheck } from "lucide-react";
import { CountStat } from "@/components/ui/Stat";
import { Icon } from "@/components/ui/Icon";
import { GlowBorder } from "@/components/ui/GlowCard";
import { EASE_OUT } from "@/components/charts/theme";
import { INDUSTRY_ICON, clientQuery, type SeoClient } from "@/lib/seoClients";

/** Wrap every case-insensitive occurrence of `q` in `text` with a highlight. */
function highlight(text: string, q: string): ReactNode {
	const query = q.trim();
	if (!query) return text;
	const lower = text.toLowerCase();
	const ql = query.toLowerCase();
	if (!lower.includes(ql)) return text;

	const parts: ReactNode[] = [];
	let start = 0;
	let idx = lower.indexOf(ql, start);
	let key = 0;
	while (idx !== -1) {
		if (idx > start) parts.push(text.slice(start, idx));
		parts.push(
			<mark
				key={key++}
				className="rounded bg-corporate-100 px-0.5 text-corporate-800">
				{text.slice(idx, idx + ql.length)}
			</mark>,
		);
		start = idx + ql.length;
		idx = lower.indexOf(ql, start);
	}
	if (start < text.length) parts.push(text.slice(start));
	return parts;
}

/** Compact animated score ring — draws in on scroll, count-up in the centre. */
function ScoreDial({ score }: { score: number }) {
	const ref = useRef<SVGSVGElement>(null);
	const inView = useInView(ref, { once: true, margin: "-8%" });
	const reduce = useReducedMotion();
	const gradId = useId().replace(/:/g, "");

	const d = 62;
	const stroke = 5;
	const r = (d - stroke) / 2 - 1;
	const c = 2 * Math.PI * r;
	const target = c * (1 - score / 100);

	return (
		<div
			className="relative shrink-0"
			style={{ width: d, height: d }}>
			<svg
				ref={ref}
				width={d}
				height={d}
				className="block -rotate-90"
				role="img"
				aria-label={`Visibility score ${score} of 100`}>
				<defs>
					<linearGradient
						id={gradId}
						x1="0"
						y1="0"
						x2="1"
						y2="1">
						<stop
							offset="0%"
							stopColor="#1B6EC2"
						/>
						<stop
							offset="100%"
							stopColor="#0D9488"
						/>
					</linearGradient>
				</defs>
				<circle
					cx={d / 2}
					cy={d / 2}
					r={r}
					fill="none"
					stroke="#EEF2F7"
					strokeWidth={stroke}
				/>
				<motion.circle
					cx={d / 2}
					cy={d / 2}
					r={r}
					fill="none"
					stroke={`url(#${gradId})`}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={c}
					initial={{ strokeDashoffset: reduce ? target : c }}
					animate={{ strokeDashoffset: inView || reduce ? target : c }}
					transition={{ duration: 1.3, ease: EASE_OUT }}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
				<CountStat
					value={score}
					className="font-display text-base font-bold tabular-nums text-ink"
				/>
				<span className="mt-0.5 text-[7.5px] font-semibold uppercase tracking-wider text-steel-400">
					score
				</span>
			</div>
		</div>
	);
}

const BADGES = [
	{
		icon: Sparkles,
		label: "AI Search",
		cls: "border-violet-200 bg-violet-50 text-violet-700",
	},
	{
		icon: Globe,
		label: "Google",
		cls: "border-corporate-200 bg-corporate-50 text-corporate-700",
	},
	{
		icon: MapPin,
		label: "Local SEO",
		cls: "border-teal-200 bg-teal-50 text-teal-700",
	},
] as const;

export function SeoClientCard({
	client,
	query = "",
}: {
	client: SeoClient;
	query?: string;
}) {
	const reduce = useReducedMotion();
	const q = clientQuery(client);
	const chip = client.keyword ?? client.category;

	function searchGoogle() {
		window.open(
			`https://www.google.com/search?q=${encodeURIComponent(q)}`,
			"_blank",
			"noopener,noreferrer",
		);
	}

	return (
		<motion.article
			layout
			initial={{ opacity: 0, y: 18, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
			transition={{ duration: 0.4, ease: EASE_OUT }}
			whileHover={reduce ? undefined : { y: -6 }}
			className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-glow">
			{/* hover gradient wash + animated border */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-gradient-to-br from-corporate-50/0 via-corporate-50/0 to-corporate-100/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-corporate-400/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
			/>
			<GlowBorder />

			<div className="relative flex flex-1 flex-col">
				{/* top row: search glyph + ranked chip + score */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2.5">
						<span className="grid size-10 place-items-center rounded-xl border border-steel-200 bg-canvas-soft text-corporate-600 transition-colors duration-300 group-hover:border-corporate-300 group-hover:bg-white">
							<Icon
								name={INDUSTRY_ICON[client.industry]}
								className="size-[18px]"
								strokeWidth={1.75}
							/>
						</span>
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-kicker text-emerald-700">
							<BadgeCheck className="size-3" /> Ranked
						</span>
					</div>
					<ScoreDial score={client.score} />
				</div>

				{/* name + category */}
				<h3 className="mt-4 font-display text-lg font-bold leading-tight tracking-tight text-ink">
					{highlight(client.name, query)}
				</h3>
				<p className="mt-1 text-[13px] text-steel-500">{client.category}</p>

				{/* facet badges */}
				<div className="mt-3 flex flex-wrap items-center gap-2">
					<span className="inline-flex items-center gap-1 rounded-md bg-steel-100 px-2 py-0.5 text-[11px] font-medium text-steel-600">
						<Icon
							name={INDUSTRY_ICON[client.industry]}
							className="size-3"
							strokeWidth={2}
						/>
						{client.industry}
					</span>
					{client.city && (
						<span className="inline-flex items-center gap-1 rounded-md bg-steel-100 px-2 py-0.5 text-[11px] font-medium text-steel-600">
							<MapPin className="size-3" />
							{highlight(client.city, query)}
						</span>
					)}
				</div>

				{/* keyword chip */}
				<div className="mt-4 flex items-start gap-2 rounded-2xl border border-corporate-100 bg-corporate-50/60 px-3 py-2.5">
					<Search className="mt-0.5 size-3.5 shrink-0 text-corporate-500" />
					<p className="text-[13px] font-medium leading-snug text-corporate-900">
						{highlight(chip, query)}
					</p>
				</div>

				{/* capability badges */}
				<div className="mt-4 flex flex-wrap gap-1.5">
					{BADGES.map((b) => (
						<span
							key={b.label}
							className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${b.cls}`}>
							<b.icon className="size-3" />
							{b.label}
						</span>
					))}
				</div>

				{/* CTA */}
				<button
					type="button"
					onClick={searchGoogle}
					className="group/btn mt-5 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-corporate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2">
					<span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
						<span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 blur-sm transition-transform duration-700 ease-out group-hover/btn:translate-x-[420%]" />
					</span>
					<Search className="size-4" />
					Search on Google
				</button>
			</div>
		</motion.article>
	);
}
