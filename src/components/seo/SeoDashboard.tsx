/** @format */

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, X, SearchX, SlidersHorizontal } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { SeoClientCard } from "./SeoClientCard";
import {
	SEO_CLIENTS,
	INDUSTRY_SEGMENTS,
	CITY_SEGMENTS,
	TOTAL_CLIENTS,
	type SeoClient,
} from "@/lib/seoClients";

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
const ALL = "All";

type Option = { value: string; label: string; count: number };

function matches(c: SeoClient, q: string): boolean {
	if (!q) return true;
	const hay =
		`${c.name} ${c.category} ${c.industry} ${c.city ?? ""} ${c.keyword ?? ""}`.toLowerCase();
	return hay.includes(q);
}

function Chips({
	options,
	value,
	onChange,
	groupId,
}: {
	options: Option[];
	value: string;
	onChange: (v: string) => void;
	groupId: string;
}) {
	return (
		<div className="flex flex-wrap gap-2">
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						aria-pressed={active}
						className={cn(
							"relative inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
							active ?
								"border-ink text-white"
							:	"border-steel-200 bg-white text-steel-600 hover:border-corporate-300 hover:text-ink",
						)}>
						{active && (
							<motion.span
								layoutId={groupId}
								className="absolute inset-0 -z-0 rounded-full bg-ink"
								transition={SPRING}
							/>
						)}
						<span className="relative z-10">{opt.label}</span>
						<span
							className={cn(
								"relative z-10 tabular-nums",
								active ? "text-white/60" : "text-steel-400",
							)}>
							{opt.count}
						</span>
					</button>
				);
			})}
		</div>
	);
}

export function SeoDashboard() {
	const reduce = useReducedMotion();
	const [query, setQuery] = useState("");
	const [industry, setIndustry] = useState(ALL);
	const [city, setCity] = useState(ALL);

	const industryOptions: Option[] = useMemo(
		() => [
			{ value: ALL, label: "All industries", count: TOTAL_CLIENTS },
			...INDUSTRY_SEGMENTS.map((s) => ({
				value: s.label,
				label: s.label,
				count: s.value,
			})),
		],
		[],
	);

	const cityOptions: Option[] = useMemo(
		() => [
			{ value: ALL, label: "All cities", count: TOTAL_CLIENTS },
			...CITY_SEGMENTS.map((s) => ({
				value: s.label,
				label: s.label,
				count: s.value,
			})),
		],
		[],
	);

	const q = query.trim().toLowerCase();
	const filtered = useMemo(
		() =>
			SEO_CLIENTS.filter(
				(c) =>
					(industry === ALL || c.industry === industry) &&
					(city === ALL || c.city === city) &&
					matches(c, q),
			),
		[industry, city, q],
	);

	const active = query !== "" || industry !== ALL || city !== ALL;

	function clearAll() {
		setQuery("");
		setIndustry(ALL);
		setCity(ALL);
	}

	return (
		<section
			id="clients"
			className="relative overflow-hidden bg-canvas scroll-mt-24">
			<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
			<div className="container-x relative py-20 lg:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<span className="kicker justify-center">
							AI tools answer performance
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h2 className="mt-4 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
							Businesses we&apos;ve put on the map
						</h2>
					</Reveal>
					<Reveal delay={0.18}>
						<p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-steel-600">
							Every card below is a live-verifiable ranking. Filter by industry or
							city, search a keyword, then hit{" "}
							<span className="font-semibold text-ink">Search on Google</span> to
							see the result for yourself.
						</p>
					</Reveal>
				</div>

				{/* controls */}
				<Reveal delay={0.1}>
					<div className="mx-auto mt-12 max-w-2xl">
						<div className="group relative">
							<Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-steel-400 transition-colors group-focus-within:text-corporate-500" />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search a client, keyword, industry or city…"
								aria-label="Search ranked clients"
								className="h-14 w-full rounded-full border border-steel-200 bg-white pl-11 pr-11 text-[15px] text-ink shadow-soft outline-none transition-all duration-300 placeholder:text-steel-400 focus:border-corporate-400 focus:shadow-glow"
							/>
							{query && (
								<button
									type="button"
									onClick={() => setQuery("")}
									aria-label="Clear search"
									className="absolute right-3.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-steel-400 transition-colors hover:bg-steel-100 hover:text-ink">
									<X className="size-4" />
								</button>
							)}
						</div>
					</div>
				</Reveal>

				<Reveal
					delay={0.16}
					className="mt-6 space-y-3">
					<div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-kicker text-steel-400">
						<SlidersHorizontal className="size-3.5" /> Industry
					</div>
					<Chips
						options={industryOptions}
						value={industry}
						onChange={setIndustry}
						groupId="ind-pill"
					/>
					<div className="flex items-center gap-2 pt-2 text-[11px] font-semibold uppercase tracking-kicker text-steel-400">
						<SlidersHorizontal className="size-3.5" /> City
					</div>
					<Chips
						options={cityOptions}
						value={city}
						onChange={setCity}
						groupId="city-pill"
					/>
				</Reveal>

				{/* result meta */}
				<div className="mt-8 flex items-center justify-between gap-4">
					<p className="text-sm text-steel-500">
						Showing{" "}
						<span className="font-semibold tabular-nums text-ink">
							{filtered.length}
						</span>{" "}
						of {TOTAL_CLIENTS} businesses
					</p>
					<AnimatePresence>
						{active && (
							<motion.button
								type="button"
								onClick={clearAll}
								initial={{ opacity: 0, x: 8 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 8 }}
								className="inline-flex items-center gap-1.5 rounded-full border border-steel-200 bg-white px-3 py-1.5 text-[13px] font-medium text-steel-600 transition-colors hover:border-corporate-300 hover:text-ink">
								<X className="size-3.5" /> Clear filters
							</motion.button>
						)}
					</AnimatePresence>
				</div>

				{/* grid / empty state */}
				<div className="mt-6">
					{filtered.length > 0 ? (
						<motion.div
							layout={!reduce}
							className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
							<AnimatePresence mode="popLayout">
								{filtered.map((c) => (
									<SeoClientCard
										key={c.slug}
										client={c}
										query={q}
									/>
								))}
							</AnimatePresence>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-steel-300 bg-white/60 px-6 py-20 text-center">
							<motion.span
								className="grid size-16 place-items-center rounded-2xl bg-steel-100 text-steel-400"
								animate={reduce ? undefined : { y: [0, -8, 0] }}
								transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
								<SearchX className="size-7" />
							</motion.span>
							<h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
								No SEO case studies found.
							</h3>
							<p className="mt-2 max-w-sm text-sm text-steel-500">
								Nothing matches those filters yet. Try a different industry, city
								or keyword.
							</p>
							<button
								type="button"
								onClick={clearAll}
								className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-corporate-700">
								<X className="size-4" /> Reset filters
							</button>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
