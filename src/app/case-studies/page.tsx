/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CaseStudyNav } from "@/components/case-studies/CaseStudyNav";
import { CTASection } from "@/components/layout/CTASection";
import { CountStat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { caseStudies, type CaseStudy, type CaseStat } from "@/content/portfolio";
import { SIGNATURE, entryId, type SignatureSpec } from "@/lib/caseStudyMetrics";

export const metadata = {
	title: "Case Studies  Real Platforms at Scale | Cubiccode",
	description:
		"Our web apps and custom ERPs power ₹4,185M+ in transactions, manage ₹250 Cr+ in assets and run real businesses at 99.99% uptime. Explore Cubiccode's production case studies.",
};

// Aggregate figures for the closing "consolidated results" band.
const impact = [
	{ value: 250, prefix: "₹", suffix: " Cr+", label: "Assets under management" },
	{ value: 4185, prefix: "₹", suffix: "M+", label: "Transactions powered" },
	{ value: 99.99, suffix: "%", decimals: 2, label: "Platform uptime" },
	{ value: 60, suffix: "K+", label: "Users onboarded" },
];

export default function CaseStudiesPage() {
	const [lead, ...rows] = caseStudies;

	return (
		<>
			<PageHero
				kicker="Case studies"
				title="Real platforms, running real businesses at scale"
				subtitle="These aren't concept demos. They're production systems powering ₹4,185M+ in transactions  managing crores in assets, thousands of users and millions in monthly volume, every single day."
				image="/images/about/about-4.jpg"
				imageAlt="Production platforms engineered by Cubiccode"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Work" },
					{ label: "Case Studies" },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href="/portfolio"
						arrow>
						Explore the portfolio
					</Button>
					<Button
						href="/clientele"
						variant="outline">
						Our clientele
					</Button>
				</div>
			</PageHero>

			{/* Sticky contents / command bar */}
			<CaseStudyNav />

			{/* Ledger  featured lead entry 01, then numbered rows 02–06 */}
			<section className="relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative py-16 lg:py-24">
					<LeadEntry c={lead} />
					<div className="mt-4">
						{rows.map((c, i) => (
							<LedgerRow
								key={c.slug}
								c={c}
								index={i + 1}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Consolidated results  ink balance-sheet band */}
			<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
					<div className="absolute left-1/2 top-0 size-[560px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
				</div>
				<div className="container-x relative">
					<div className="mx-auto max-w-3xl text-center">
						<Reveal>
							<span className="kicker justify-center text-corporate-300">
								Consolidated results
							</span>
						</Reveal>
						<Reveal delay={0.1}>
							<h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-white sm:text-4xl lg:text-5xl">
								Software that carries real economic weight
							</h2>
						</Reveal>
						<Reveal delay={0.2}>
							<p className="mt-5 text-lg leading-relaxed text-steel-300">
								Across every platform we&apos;ve shipped, the numbers add up to
								infrastructure businesses genuinely depend on.
							</p>
						</Reveal>
					</div>

					<RevealGroup
						stagger={0.1}
						className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
						{impact.map((s) => (
							<RevealItem
								key={s.label}
								className="text-center lg:px-6">
								<CountStat
									value={s.value}
									prefix={s.prefix}
									suffix={s.suffix}
									decimals={s.decimals ?? 0}
									className="font-display text-4xl font-bold tracking-tightest tabular-nums text-white sm:text-5xl"
								/>
								<p className="mx-auto mt-3 max-w-[170px] text-sm leading-relaxed text-steel-300">
									{s.label}
								</p>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>

			<CTASection title="Build the next one with us." />
		</>
	);
}

/* ── Small "live in production" trust line ──────────────────────────────── */
function LiveTag() {
	return (
		<span className="inline-flex items-center gap-2 text-sm font-medium text-steel-500">
			<span className="size-2 animate-pulse rounded-full bg-corporate-500" />
			Live in production
		</span>
	);
}

/* ── Featured lead entry (01) ───────────────────────────────────────────── */
function LeadEntry({ c }: { c: CaseStudy }) {
	const sig = SIGNATURE[c.slug];
	const sigStat = c.stats[sig.index];
	const supporting = c.stats.filter((_, i) => i !== sig.index);

	return (
		<Reveal
			as="article"
			amount={0.2}>
			<div
				id={entryId(0)}
				className="grid scroll-mt-[132px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
				{/* Identity */}
				<div className="relative lg:col-span-6">
					<span
						aria-hidden
						className="pointer-events-none absolute -left-1 -top-14 select-none font-serif text-[6rem] italic leading-none text-steel-200/70 sm:-top-20 lg:text-[10rem]">
						01
					</span>
					<div className="relative">
						<span className="mb-5 block h-px w-12 bg-corporate-600" />
						<span className="kicker">{c.category}</span>
						<SplitReveal
							as="h2"
							className="mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tightest text-ink lg:text-6xl">
							{c.name}
						</SplitReveal>
						<p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-steel-600">
							{c.tagline}
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<Button
								href={c.link}
								external
								arrow>
								Read case study on LinkedIn
							</Button>
							<LiveTag />
						</div>
					</div>
				</div>

				{/* Featured metric card */}
				<div className="lg:col-span-6">
					<div className="relative overflow-hidden rounded-5xl border border-steel-200 bg-canvas-soft p-8 shadow-card lg:p-12">
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-blueprint [background-size:40px_40px] opacity-[0.08]"
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-corporate-400/20 blur-3xl"
						/>
						<div className="relative">
							<p className="text-[11px] font-semibold uppercase tracking-kicker text-steel-500">
								{sigStat.label}
							</p>
							<CountStat
								value={sig.value}
								prefix={sig.prefix}
								suffix={sig.suffix}
								decimals={sig.decimals ?? 0}
								className="mt-2 block font-display text-6xl font-bold tracking-tightest tabular-nums text-gradient lg:text-8xl"
							/>
							<div className="mt-8 divide-y divide-steel-200 border-t border-steel-200">
								{supporting.map((s) => (
									<LedgerLine
										key={s.label}
										s={s}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Reveal>
	);
}

/* ── One supporting stat line in the featured card ──────────────────────── */
function LedgerLine({ s }: { s: CaseStat }) {
	return (
		<div className="flex items-center gap-4 py-4">
			<span className="grid size-10 shrink-0 place-items-center rounded-xl border border-steel-200 bg-white text-corporate-600">
				<Icon
					name={s.icon}
					className="size-[18px]"
					strokeWidth={1.75}
				/>
			</span>
			<div className="min-w-0 flex-1">
				{s.value ?
					<p className="leading-tight">
						<span className="font-display text-xl font-bold tracking-tight tabular-nums text-ink">
							{s.value}
						</span>
						<span className="ml-2 text-[13px] text-steel-500">{s.label}</span>
					</p>
				:	<p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
						{s.label}
						<span className="text-[10px] font-semibold uppercase tracking-kicker text-corporate-600">
							✓ live
						</span>
					</p>
				}
			</div>
		</div>
	);
}

/* ── Numbered ledger row (02–06) ────────────────────────────────────────── */
function LedgerRow({ c, index }: { c: CaseStudy; index: number }) {
	const sig = SIGNATURE[c.slug];

	return (
		<Reveal
			as="article"
			amount={0.2}
			className="group border-t border-steel-200">
			<div
				id={entryId(index)}
				className="grid scroll-mt-[132px] grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:py-20">
				{/* Ghost index numeral */}
				<div
					aria-hidden
					className="select-none font-serif text-6xl italic leading-none text-steel-300 lg:col-span-1 lg:text-7xl">
					{String(index + 1).padStart(2, "0")}
				</div>

				{/* Identity */}
				<div className="lg:col-span-4">
					<span className="mb-4 block h-px w-8 bg-corporate-600 transition-[width] duration-300 group-hover:w-16" />
					<span className="kicker">{c.category}</span>
					<SplitReveal
						as="h2"
						className="mt-4 font-display text-2xl font-bold tracking-tightest text-ink lg:text-3xl">
						{c.name}
					</SplitReveal>
					<p className="mt-4 max-w-md text-pretty leading-relaxed text-steel-600">
						{c.tagline}
					</p>
					<div className="mt-6 flex flex-wrap items-center gap-4">
						<Button
							href={c.link}
							external
							arrow>
							Read case study on LinkedIn
						</Button>
						<LiveTag />
					</div>
				</div>

				{/* Metric figure row */}
				<RevealGroup
					stagger={0.06}
					className="grid grid-cols-2 gap-x-6 gap-y-8 lg:col-span-7 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-steel-200">
					{c.stats.map((s, i) => (
						<RevealItem
							key={s.label}
							className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
							<FigureCell
								s={s}
								isSignature={sig?.index === i}
								sig={sig}
							/>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</Reveal>
	);
}

/* ── One cell of the 4-up metric figure row ─────────────────────────────── */
function FigureCell({
	s,
	isSignature,
	sig,
}: {
	s: CaseStat;
	isSignature: boolean;
	sig?: SignatureSpec;
}) {
	return (
		<div>
			<Icon
				name={s.icon}
				className="size-4 text-steel-400"
				strokeWidth={1.5}
			/>
			{s.value ?
				<>
					<p className="mt-3 font-display text-3xl font-bold tracking-tightest tabular-nums text-ink lg:text-4xl">
						{isSignature && sig ?
							<CountStat
								value={sig.value}
								prefix={sig.prefix}
								suffix={sig.suffix}
								decimals={sig.decimals ?? 0}
							/>
						:	s.value}
					</p>
					<p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-kicker text-steel-500">
						{s.label}
					</p>
				</>
			:	<div className="mt-3">
					<p className="text-sm font-semibold leading-snug text-ink">
						{s.label}
					</p>
					<span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-kicker text-corporate-600">
						<span className="size-1.5 rounded-full bg-corporate-500" />
						Live
					</span>
				</div>
			}
		</div>
	);
}
