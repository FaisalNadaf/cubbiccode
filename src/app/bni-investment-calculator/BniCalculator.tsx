/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
	ArrowRight,
	Sigma,
	Handshake,
	Printer,
	RotateCcw,
	TriangleAlert,
	Users,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import {
	BENCHMARKS,
	DEFAULTS,
	GOAL_CHIPS,
	inr,
	num,
	solve,
	toNum,
	words,
} from "./model";
import {
	FunnelStep,
	Kicker,
	KpiTile,
	MarginSlider,
	MiniCard,
	MoneyField,
	Panel,
} from "./parts";
import styles from "./calculator.module.css";

/**
 * BNI INVESTMENT CALCULATOR — Sarvesh Kakkeri, BNI Champions Belgaum.
 *
 * Name the profit you want out of BNI this year and the page reverse-solves the
 * funnel: how many people to meet, how many 1-2-1s a week, when the membership
 * pays for itself, and what each activity is worth. The arithmetic lives in
 * `model.ts`; this file is layout and interaction only.
 *
 * Reading order is deliberate — goal, then the answer, then the evidence:
 *
 *   1  GOAL      the one question, on a dark band so it reads as the input
 *   2  ANSWER    full width: the sentence, then four KPI tiles, headline filled
 *   3  FUNNEL    where the number came from
 *   4  ECONOMICS what one conversation costs, and what it earns back
 *   5  TUNE      the three levers, sticky beside 3-4 on desktop
 *   6  PLAN      the week-by-week commitments, revealed on request
 *
 * 2 spans the full width rather than sitting in a column, so the number the
 * whole tool exists to produce is never below the fold on a phone. 3-6 and 5
 * then split into a two-column grid whose DOM order is evidence-then-inputs —
 * correct for desktop, where 5 is a sticky rail and a member can watch every
 * number move while dragging the margin. Below `lg` that order is flipped with
 * `order`, because once the answer has been stated the next thing a phone
 * reader wants is the levers that move it, not two more panels of evidence.
 *
 * 4 used to live inside the collapsed plan. It sits in the open column now: it
 * is the natural follow-on from the funnel — that one says how many people,
 * this one says what each is worth — and it gives the left column enough
 * height to run past the sticky rail instead of stopping short of it.
 *
 * The numeric fields are held as strings, not numbers, so a field can be
 * emptied mid-typing — a controlled `value={0}` makes the "0" impossible to
 * delete. Parsing happens once, in the memo.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function BniCalculator() {
	const reduce = useReducedMotion();

	const [goal, setGoal] = useState(DEFAULTS.goal);
	const [inv, setInv] = useState(DEFAULTS.inv);
	const [atv, setAtv] = useState(DEFAULTS.atv);
	const [marg, setMarg] = useState(DEFAULTS.marg);

	const [planOpen, setPlanOpen] = useState(false);
	/** Bumped on every CTA press so the plan re-mounts and replays its entrance. */
	const [revealKey, setRevealKey] = useState(0);
	const planRef = useRef<HTMLElement>(null);

	const goalN = toNum(goal);
	const invN = toNum(inv);
	const atvN = toNum(atv);

	const r = useMemo(
		() => solve(goalN, atvN, invN, marg),
		[goalN, atvN, invN, marg],
	);

	// The site body is #FFFFFF (`bg-canvas`); this page sits on canvas-soft.
	// Painting the body to match stops white showing through in the iOS
	// overscroll gutter and behind a viewport taller than the content.
	useEffect(() => {
		const { body } = document;
		const previous = body.style.backgroundColor;
		body.style.backgroundColor = "#F7F8FA";
		return () => {
			body.style.backgroundColor = previous;
		};
	}, []);

	// Scroll the plan into view once it has actually rendered. Lenis owns the
	// scroll position site-wide, so hand it the target rather than letting native
	// smooth-scroll fight the rAF loop.
	useEffect(() => {
		if (revealKey === 0) return;
		const el = planRef.current;
		if (!el) return;

		const prefersReduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const lenis = (
			window as unknown as {
				lenis?: {
					scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void;
				};
			}
		).lenis;

		if (lenis && !prefersReduce) lenis.scrollTo(el, { offset: -20 });
		else
			el.scrollIntoView({
				behavior: prefersReduce ? "auto" : "smooth",
				block: "start",
			});
	}, [revealKey]);

	function reset() {
		setGoal(DEFAULTS.goal);
		setInv(DEFAULTS.inv);
		setAtv(DEFAULTS.atv);
		setMarg(DEFAULTS.marg);
	}

	/** Bars taper from 100% down to 46% of the row, proportional to the top step. */
	const barWidth = (n: number) => (r ? `${46 + 54 * (n / r.P)}%` : "100%");

	const overloaded = r ? r.perWeek121 > 6 : false;

	const acts: [string | number, string, React.ReactNode][] =
		r ?
			[
				[
					Math.ceil(r.perWeek121),
					"one-2-ones every week",
					`Non-negotiable. This is the engine — ${num(r.m1)} meetings across the year.`,
				],
				[
					r.perWeek2nd < 1 ? r.perWeek2nd.toFixed(1) : Math.ceil(r.perWeek2nd),
					"detailed second meetings a week",
					`Where business fit actually gets established — ${num(r.m2)} a year.`,
				],
				[
					Math.ceil(r.visitorsPerMonth),
					"visitors you engage every month",
					"Invite them, sit with them, follow up. Grows the chapter and your pool together.",
				],
				[
					8,
					"trainings attended a year",
					"MSP, leadership, advanced. Every session is a fresh room of members.",
				],
				[
					4,
					"conclaves attended a year",
					"All of them. The highest number of new people per hour you will ever get.",
				],
				[
					num(r.partners),
					"referral partners to build",
					`They produce ${inr(r.revRef)} — more than your direct clients, and they keep producing next year.`,
				],
			]
		:	[];

	const econ: [string, string, string][] =
		r ?
			[
				[
					inr(invN / r.P),
					"Cost of meeting one person",
					`${inr(invN)} ÷ ${num(r.P)} people`,
				],
				[
					inr(invN / r.m1),
					"Cost of one 1-2-1",
					`${inr(invN)} ÷ ${num(r.m1)} meetings`,
				],
				[
					inr(r.profit / r.P),
					"Profit value of one person met",
					`${inr(r.profit)} ÷ ${num(r.P)} people`,
				],
				[
					inr(r.profit / r.m1),
					"Profit value of one 1-2-1",
					`${inr(r.profit)} ÷ ${num(r.m1)} meetings`,
				],
			]
		:	[];

	const sources: [number, string, string][] =
		r ?
			[
				[r.P * 0.15, "Chapter members", "Your own room, every week"],
				[r.P * 0.3, "Visitors", "Strangers who already opted in"],
				[r.P * 0.25, "Trainings", "Members from other chapters"],
				[r.P * 0.3, "1-2-1 conclave", "Structured speed networking"],
			]
		:	[];

	return (
		<div className="relative min-h-screen bg-canvas-soft text-ink">
			{/* Brand texture, matching the site's section treatment. */}
			<div
				aria-hidden
				className={cn(
					styles.noPrint,
					"pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-blueprint opacity-[0.5] [background-size:34px_34px]",
				)}
			/>
			<div
				aria-hidden
				className={cn(
					styles.noPrint,
					"pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-radial-fade",
				)}
			/>

			<div className="container-x relative pb-20 pt-8 sm:pt-12">
				{/* ═══════════════════ HEADER ═══════════════════ */}
				<header className="flex flex-col gap-6 border-b border-steel-200 pb-8 sm:pb-10">
					<div className="flex items-center justify-between gap-4">
						<Logo
							priority
							className="[&_img]:h-9 sm:[&_img]:h-10"
						/>
						<span className="text-right text-[11px] font-semibold uppercase tracking-kicker text-steel-400">
							BNI Champions
							<span className="hidden sm:inline"> · Belgaum</span>
						</span>
					</div>

					<div className="max-w-3xl">
						<Kicker>Investment Calculator</Kicker>
						<h1 className="mt-4 text-pretty font-display text-[2rem] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[2.75rem] lg:text-[3.2rem]">
							What should your BNI membership actually return?
						</h1>
						<p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-steel-600 sm:text-base">
							Name the profit you want this year. The calculator reverse-solves
							the funnel — how many people you need to meet, how many 1-2-1s
							that is every week, and the month your fee pays for itself.
						</p>
						<p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-steel-500">
							<span>
								Created by{" "}
								<a
									href="https://www.linkedin.com/in/sarveshkakkeri/"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-corporate-600 underline decoration-corporate-300 underline-offset-2 transition-colors hover:text-corporate-700">
									Sarvesh Kakkeri
								</a>
							</span>
							<span className="size-1 rounded-full bg-steel-300" />
							<span>BNI Champions, Belgaum</span>
							<span className="size-1 rounded-full bg-steel-300" />
							<span>Cubiccode Digital Media LLP</span>
						</p>
					</div>
				</header>

				{/* ═══════════════════ 1 · GOAL ═══════════════════ */}
				<motion.section
					initial={reduce ? false : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: EASE }}
					className={cn(
						styles.printPanel,
						"relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-corporate-900 to-corporate-800 p-6 shadow-lift sm:rounded-4xl sm:p-9 lg:p-11",
					)}>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.16] [background-size:38px_38px]"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -right-24 -top-24 size-[26rem] rounded-full bg-corporate-500/20 blur-3xl"
					/>

					<div className="relative">
						<Kicker light>Step 1 — your target</Kicker>
						<h2 className="mt-4 max-w-2xl text-balance font-display text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.75rem]">
							How much profit do you want to make from BNI this year?
						</h2>

						<div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-3">
							<div className="flex min-w-0 flex-1 items-center gap-1 border-b-2 border-white/25 pb-1 transition-colors duration-200 focus-within:border-corporate-300 sm:gap-2">
								<span className="font-display text-2xl font-semibold text-white/50 sm:text-4xl">
									₹
								</span>
								<input
									type="number"
									id="bni-goal"
									className={cn(
										styles.numInput,
										"w-full min-w-0 bg-transparent font-display text-3xl font-bold tabular-nums tracking-tightest text-white outline-none placeholder:text-white/30 sm:text-5xl",
									)}
									value={goal}
									onChange={(e) => setGoal(e.target.value)}
									min={0}
									step={50000}
									inputMode="numeric"
									aria-label="Profit you want this year in rupees"
								/>
							</div>
							<span
								aria-hidden
								className="shrink-0 pb-2 font-display text-base font-semibold text-corporate-200 sm:text-lg">
								{words(goalN)}
							</span>
						</div>

						<div
							className={cn(
								styles.noPrint,
								"mt-5 flex flex-wrap gap-2",
							)}>
							{GOAL_CHIPS.map((v) => {
								const on = v === goalN;
								return (
									<button
										key={v}
										type="button"
										aria-pressed={on}
										onClick={() => setGoal(String(v))}
										className={cn(
											"rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold tabular-nums transition-all duration-200",
											on ?
												"border-transparent bg-white text-ink shadow-soft"
											:	"border-white/20 text-white/70 hover:-translate-y-0.5 hover:border-white/50 hover:text-white",
										)}>
										₹{words(v)}
									</button>
								);
							})}
						</div>
					</div>
				</motion.section>

				{/* ═══════════════════ 2 · THE ANSWER ═══════════════════ */}
				{r && (
					<Panel
						className={cn(styles.printPanel, "p-5 sm:p-7")}>
						<Kicker>The answer</Kicker>
						<p className="mt-4 text-pretty font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-[1.6rem]">
							To make{" "}
							<span className="text-corporate-600">
								₹{words(goalN)}
							</span>{" "}
							of profit, meet{" "}
							<span className="text-corporate-600">
								{num(r.P)} people
							</span>{" "}
							this year.
						</p>
						<p className="mt-2 text-[14px] leading-relaxed text-steel-600">
							That is {r.perWeekPeople.toFixed(1)} new people and{" "}
							{r.perWeek121.toFixed(1)} one-2-ones every week, across{" "}
							{r.wk} working weeks.
						</p>

						<div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
							<KpiTile
								emphasis
								value={num(r.P)}
								label="People to meet"
								hint="Across the year"
								delay={0}
							/>
							<KpiTile
								value={inr(r.revenue)}
								label="Revenue"
								hint="Direct + referred"
								delay={0.06}
							/>
							<KpiTile
								value={inr(r.profit)}
								label="Profit"
								hint={`At ${marg}% margin`}
								delay={0.12}
							/>
							<KpiTile
								value={`${r.roi.toFixed(1)}×`}
								label="Return"
								hint={`On ${inr(invN)}`}
								delay={0.18}
							/>
						</div>

						{overloaded && (
							<motion.div
								initial={reduce ? false : { opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, ease: EASE }}
								className="mt-4 flex gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4">
								<TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
								<p className="text-[13px] leading-relaxed text-amber-900">
									<b className="font-semibold">
										That is {r.perWeek121.toFixed(1)} one-2-ones a week.
									</b>{" "}
									Realistically most members sustain three or four. The
									better lever for a goal this size is a bigger average
									deal size — raise it in the panel and watch the number
									of people you need drop.
								</p>
							</motion.div>
						)}
					</Panel>
				)}

				{/* ═══════════════════ RESULTS + INPUTS ═══════════════════ */}
				<div className="mt-6 grid gap-6 lg:grid-cols-12">
					{/* ── Inputs rail. Second in the DOM so the supporting detail leads
					    on desktop, but pulled above it on mobile via `order`: with the
					    answer already stated full-width above, the next thing a phone
					    reader wants is the levers that move it — not two more panels
					    of evidence first. ── */}
					<aside className="order-1 lg:order-2 lg:col-span-4">
						<div className="lg:sticky lg:top-6">
							<Panel className={cn(styles.printPanel, "overflow-hidden")}>
								<div className="border-b border-steel-200 bg-canvas-soft px-5 py-4">
									<Kicker>Step 2 — your numbers</Kicker>
									<p className="mt-2 text-[12.5px] leading-snug text-steel-500">
										Three levers. Everything on this page recalculates as you
										move them.
									</p>
								</div>

								<div className="space-y-5 p-5">
									<MoneyField
										id="bni-atv"
										label="Average deal size"
										hint="What one closed client is worth to you, on average."
										value={atv}
										onChange={setAtv}
										readout={inr(atvN)}
										min={1000}
									/>
									<MoneyField
										id="bni-inv"
										label="Annual BNI investment"
										hint="Membership, meeting fees, travel — your all-in cost."
										value={inv}
										onChange={setInv}
										readout={inr(invN)}
									/>
									<MarginSlider
										id="bni-marg"
										label="Net profit margin"
										hint="What you keep from each rupee of revenue, after costs."
										value={marg}
										onChange={setMarg}
									/>

									<button
										type="button"
										onClick={reset}
										className={cn(
											styles.noPrint,
											"group flex w-full items-center justify-center gap-2 rounded-xl border border-steel-200 bg-white py-2.5 text-[13px] font-semibold text-steel-600 transition-all duration-200 hover:border-ink hover:text-ink",
										)}>
										<RotateCcw className="size-3.5 transition-transform duration-300 group-hover:-rotate-90" />
										Reset to chapter defaults
									</button>
								</div>
							</Panel>

							{/* Benchmarks are fixed, but a member should be able to see
							    exactly what is being assumed on their behalf. */}
							<Panel className={cn(styles.printPanel, "mt-4 p-5")}>
								<h3 className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-steel-500">
									Chapter benchmarks
								</h3>
								<dl className="mt-3 space-y-2 text-[12.5px]">
									{[
										["People met → 1-2-1", `${BENCHMARKS.c1 * 100}%`],
										["1-2-1 → second meeting", `${BENCHMARKS.c2 * 100}%`],
										["Second meeting → relationship", `${BENCHMARKS.c3 * 100}%`],
										["Referrals per partner, a year", String(BENCHMARKS.R)],
										["Close rate on a referral", `${BENCHMARKS.cr * 100}%`],
										["Working weeks", String(BENCHMARKS.wk)],
									].map(([k, v]) => (
										<div
											key={k}
											className="flex items-baseline justify-between gap-3 border-b border-dashed border-steel-200 pb-2 last:border-0 last:pb-0">
											<dt className="text-steel-500">{k}</dt>
											<dd className="shrink-0 font-semibold tabular-nums text-ink">
												{v}
											</dd>
										</div>
									))}
								</dl>
							</Panel>
						</div>
					</aside>

					{/* ── Results ── */}
					<div className="order-2 space-y-6 lg:order-1 lg:col-span-8">
						{!r ?
							<Panel className="p-6 sm:p-8">
								<h2 className="font-display text-xl font-semibold text-ink">
									Set a profit goal to begin
								</h2>
								<p className="mt-2 text-[15px] leading-relaxed text-steel-600">
									Enter the profit you want above, and make sure your deal size
									and margin are not zero — the funnel divides by both.
								</p>
							</Panel>
						:	<>
								{/* ── 3 · FUNNEL ── */}
								<Panel className={cn(styles.printPanel, "p-5 sm:p-7")}>
									<Kicker>Where the number comes from</Kicker>
									<h3 className="mt-3 font-display text-lg font-semibold text-ink sm:text-xl">
										Your funnel, step by step
									</h3>

									<div className="mt-5 space-y-2.5">
										<FunnelStep
											tone="top"
											width="100%"
											value={num(r.P)}
											label="people met across BNI"
											rate={`${BENCHMARKS.c1 * 100}% →`}
											delay={0}
										/>
										<FunnelStep
											tone="mid"
											width={barWidth(r.m1)}
											value={num(r.m1)}
											label="first 1-2-1 meetings"
											rate={`${BENCHMARKS.c2 * 100}% →`}
											delay={0.08}
										/>
										<FunnelStep
											tone="low"
											width={barWidth(r.m2)}
											value={num(r.m2)}
											label="detailed second meetings"
											rate={`${BENCHMARKS.c3 * 100}% →`}
											delay={0.16}
										/>
										<FunnelStep
											tone="end"
											width={barWidth(r.conv)}
											value={num(r.conv)}
											label="relationships that produce"
											rate="splits →"
											delay={0.24}
										/>
									</div>

									<div className="mt-5 grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-steel-200 bg-canvas-soft p-4">
											<div className="flex items-center gap-2">
												<Users className="size-4 text-corporate-600" />
												<h4 className="font-display text-[15px] font-semibold text-ink">
													{num(r.direct)} direct clients
												</h4>
											</div>
											<p className="mt-1.5 text-[12.5px] leading-snug text-steel-500">
												They buy from you themselves. One sales cycle each.
											</p>
											<div className="mt-3 font-display text-lg font-semibold tabular-nums text-corporate-700">
												{inr(r.revDirect)}
											</div>
										</div>
										<div className="rounded-2xl border border-steel-200 bg-canvas-soft p-4">
											<div className="flex items-center gap-2">
												<Handshake className="size-4 text-corporate-600" />
												<h4 className="font-display text-[15px] font-semibold text-ink">
													{num(r.partners)} referral partners
												</h4>
											</div>
											<p className="mt-1.5 text-[12.5px] leading-snug text-steel-500">
												{num(r.refs)} referrals a year, and you close{" "}
												{BENCHMARKS.cr * 100}%.
											</p>
											<div className="mt-3 font-display text-lg font-semibold tabular-nums text-corporate-700">
												{inr(r.revRef)}
											</div>
										</div>
									</div>

									<div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl bg-ink px-5 py-4 text-white">
										<span className="font-display text-[15px] font-semibold tabular-nums sm:text-lg">
											{inr(r.revenue)} revenue → {inr(r.profit)} profit
										</span>
										<span className="text-[12.5px] font-medium tabular-nums text-corporate-200">
											{r.roi.toFixed(1)}× return on your {inr(invN)}
										</span>
									</div>
								</Panel>

								{/* ── 4 · UNIT ECONOMICS ── */}
								<Panel className={cn(styles.printPanel, "p-5 sm:p-7")}>
									<Kicker>Unit economics</Kicker>
									<h3 className="mt-3 font-display text-lg font-semibold text-ink sm:text-xl">
										What each activity is worth
									</h3>
									<p className="mt-2 max-w-xl text-[13px] leading-relaxed text-steel-600">
										Your fee and your profit, divided across the funnel — what
										one conversation costs you, and what it earns back.
									</p>
									<div className="mt-5 grid gap-3 sm:grid-cols-2">
										{econ.map(([v, k, c]) => (
											<MiniCard
												key={k}
												value={v}
												label={k}
												caption={c}
											/>
										))}
									</div>
								</Panel>

								{/* ── CTA ── */}
								<div
									className={cn(
										styles.noPrint,
										"flex flex-col items-center gap-2 py-2 text-center",
									)}>
									<button
										type="button"
										onClick={() => {
											setPlanOpen(true);
											setRevealKey((k) => k + 1);
										}}
										className="group inline-flex items-center justify-center gap-2 rounded-full bg-corporate-600 px-7 py-3 text-[15px] font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-corporate-500 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2">
										{planOpen ? "Update my plan" : "Show me what to do"}
										<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
									</button>
									<small className="text-[12.5px] text-steel-500">
										Your week-by-week plan, built from your own numbers
									</small>
								</div>
							</>
						}
					</div>
				</div>

				{/* ═══════════════════ 6 · PLAN ═══════════════════ */}
				{r && (
					<motion.section
						key={revealKey}
						ref={planRef}
						hidden={!planOpen}
						initial={reduce ? false : { opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: EASE }}
						className={cn(styles.printOpen, "mt-6 scroll-mt-6 space-y-6")}>
						<Panel className={cn(styles.printPanel, "p-5 sm:p-7")}>
							<Kicker>Your plan for the year</Kicker>
							<h2 className="mt-3 font-display text-xl font-semibold text-ink sm:text-2xl">
								Six commitments
							</h2>
							<p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-steel-600">
								Put them in your calendar today and the arithmetic takes care of
								itself.
							</p>

							<div className="mt-5 grid gap-3 sm:grid-cols-2">
								{acts.map(([q, title, body]) => (
									<div
										key={title}
										className="flex gap-4 rounded-2xl border border-steel-200 bg-canvas-soft p-4 transition-colors duration-300 hover:border-corporate-200 hover:bg-white">
										<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white font-display text-lg font-bold tabular-nums text-corporate-700 shadow-soft ring-1 ring-steel-200">
											{q}
										</div>
										<div className="min-w-0">
											<h4 className="font-display text-[14.5px] font-semibold leading-snug text-ink">
												{title}
											</h4>
											<p className="mt-1 text-[12.5px] leading-relaxed text-steel-500">
												{body}
											</p>
										</div>
									</div>
								))}
							</div>
						</Panel>

						<Panel className={cn(styles.printPanel, "p-5 sm:p-7")}>
							<Kicker>Sourcing</Kicker>
							<h3 className="mt-3 font-display text-lg font-semibold text-ink sm:text-xl">
								Where you will find these people
							</h3>
							<p className="mt-2 text-[13px] leading-relaxed text-steel-600">
								Four BNI touchpoints. Not one of them is a cold call.
							</p>
							<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
								{sources.map(([v, k, c]) => (
									<MiniCard
										key={k}
										value={num(v)}
										label={k}
										caption={c}
									/>
								))}
							</div>
						</Panel>

						{/* The formula, stated plainly. */}
						<Panel
							className={cn(
								styles.printPanel,
								"border-steel-300 bg-canvas-soft p-5 sm:p-7",
							)}>
							<div className="flex items-center gap-2">
								<Sigma className="size-4 text-corporate-600" />
								<h3 className="font-display text-[15px] font-semibold text-ink">
									The formula behind every number on this page
								</h3>
							</div>
							<p className="mt-4 overflow-x-auto rounded-xl border border-steel-200 bg-white px-4 py-3 font-mono text-[13px] text-corporate-800">
								Profit = P × c1 × c2 × c3 × ATV × M × [ d + (1 − d) × R × cr ]
							</p>
							<p className="mt-4 text-[13.5px] leading-relaxed text-steel-600">
								P is the people you meet in a year, and the bracket is the
								referral multiplier — the reason BNI works at all. Turned
								around:{" "}
								<b className="font-semibold text-ink">
									P = your profit goal ÷ (c1·c2·c3 × ATV × M × [d + (1−d)·R·cr])
								</b>
								.
							</p>
							<p className="mt-3 text-[13.5px] leading-relaxed text-steel-600">
								The conversion rates built into this page are conservative BNI
								benchmarks: half the people you meet will sit down for a 1-2-1,
								40% of those go to a second meeting, half of those become real
								relationships, and a referral partner gives you four referrals a
								year of which you close 40%. Business is subjective and no two
								trades convert the same way, so track your own numbers for a
								quarter and compare.
							</p>
						</Panel>
					</motion.section>
				)}

				{/* ═══════════════════ FOOTER ═══════════════════ */}
				<footer className="mt-12 border-t border-steel-200 pt-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1 text-[12.5px] text-steel-500">
							<p>
								<b className="font-semibold text-ink">
									BNI Investment Calculator
								</b>{" "}
								· Created by{" "}
								<a
									href="https://www.linkedin.com/in/sarveshkakkeri/"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-corporate-600 hover:text-corporate-700">
									Sarvesh Kakkeri
								</a>{" "}
								· BNI Champions, Belgaum
							</p>
							<p>
								Designed and developed by{" "}
								<a
									href="https://www.cubiccode.in"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-corporate-600 hover:text-corporate-700">
									Cubiccode
								</a>{" "}
								· Givers Gain
							</p>
						</div>
						<button
							type="button"
							onClick={() => window.print()}
							className={cn(
								styles.noPrint,
								"inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-steel-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:shadow-soft",
							)}>
							<Printer className="size-4" />
							Print this page
						</button>
					</div>
				</footer>
			</div>
		</div>
	);
}
