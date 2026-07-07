/**
 * BrandSplash  full-screen brand "gate" for the Cubiccode group companies.
 *
 * Recreates the cubiccode.in entry splash: a textured coloured field with
 * floating capability pills orbiting a centred wordmark card, a serif-accented
 * headline, subtext, a single primary CTA and a stat row. The whole field is a
 * click-to-visit surface (like "click anywhere to enter").
 *
 * The pills are mouse-interactive: the cursor drives a depth-parallax drift
 * across the whole field, and each pill lifts + brightens on hover while still
 * routing to the brand's site on click. Gaps between pills fall through to the
 * click-anywhere overlay beneath them.
 *
 * @format
 */

"use client";

import Link from "next/link";
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	useReducedMotion,
	type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type {
	GroupCompany,
	SplashPill,
	SplashTheme,
} from "@/content/groupCompanies";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Anchor slots for the orbiting pills, ordered to mirror the reference layout. */
const PILL_SLOTS = [
	"left-1/2 top-[6%] -translate-x-1/2",
	"left-[6%] top-[16%]",
	"right-[6%] top-[13%]",
	"left-[3%] top-[39%]",
	"right-[3%] top-[39%]",
	"left-[8%] top-[63%]",
	"right-[7%] top-[62%]",
	"right-[11%] bottom-[15%]",
];

export function BrandSplash({ brand }: { brand: GroupCompany }) {
	const reduce = useReducedMotion();
	const { theme } = brand;

	// Normalised cursor offset from the field centre, in [-1, 1] on each axis.
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
	const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

	function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
		if (reduce) return;
		const r = e.currentTarget.getBoundingClientRect();
		px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
		py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
	}

	function resetMouse() {
		px.set(0);
		py.set(0);
	}

	return (
		<section
			onMouseMove={handleMouseMove}
			onMouseLeave={resetMouse}
			className="relative flex min-h-[100svh] w-full flex-col overflow-hidden text-white"
			style={{ backgroundColor: "#0a1730", backgroundImage: theme.background }}>
			{/* ── Field texture: blueprint grid + film grain ──────────────────────── */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 bg-blueprint [background-size:44px_44px] opacity-[0.14]"
			/>
			<div
				aria-hidden
				className="noise pointer-events-none absolute inset-0 z-0 opacity-100"
			/>
			{/* vignette so the centre reads clearly */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(120%_90%_at_50%_45%,transparent_0%,transparent_45%,rgba(3,7,18,0.55)_100%)]"
			/>

			{/* ── Brand-tinted glows ──────────────────────────────────────────────── */}
			{theme.glows.map((g, i) => (
				<div
					key={i}
					aria-hidden
					className={`pointer-events-none absolute z-0 rounded-full blur-[110px] ${g.className}`}
					style={{ backgroundColor: g.color }}
				/>
			))}

			{/* ── Click-anywhere-to-visit surface (sits above field, below content) ─ */}
			<Link
				href={brand.cta.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={brand.cta.label}
				className="absolute inset-0 z-[1]"
			/>

			{/* ── Floating capability pills (interactive, non-blocking gaps) ──────── */}
			<div className="pointer-events-none absolute inset-0 z-[2] hidden lg:block">
				{brand.pills.slice(0, PILL_SLOTS.length).map((pill, i) => (
					<FloatingPill
						key={pill.label}
						pill={pill}
						slot={PILL_SLOTS[i]}
						index={i}
						sx={sx}
						sy={sy}
						theme={theme}
						href={brand.cta.href}
						label={brand.cta.label}
						reduce={!!reduce}
					/>
				))}
			</div>

			{/* ── Top bar: back to Cubiccode ──────────────────────────────────────── */}
			<div className="container-x relative z-20 flex items-center justify-between pt-6">
				<Link
					href="/"
					className="group inline-flex items-center gap-2 rounded-full bg-white py-2.5 pl-4 pr-5 text-[15px] font-bold text-ink shadow-lift ring-1 ring-black/5 transition-colors duration-300 hover:bg-corporate-600 hover:text-white">
					<ArrowLeft className="size-5 transition-transform duration-300 group-hover:-translate-x-1" />
					Back to Cubiccode
				</Link>
				<span className="hidden text-xs font-semibold uppercase tracking-kicker text-white/40 sm:block">
					Group Company
				</span>
			</div>

			{/* ── Centre content ──────────────────────────────────────────────────── */}
			<div className="container-x pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center py-14 text-center">
				{/* wordmark card */}
				<motion.div
					initial={{ opacity: 0, y: 18, scale: 0.96 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.7, ease: EASE }}
					className="inline-flex items-center gap-3 rounded-3xl bg-white px-7 py-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
					<span
						className="size-3 shrink-0 rounded-md"
						style={{ backgroundColor: theme.mark }}
					/>
					<span className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
						{brand.wordmark.map((w, i) => (
							<span
								key={i}
								style={w.accent ? { color: theme.mark } : undefined}>
								{w.text}
							</span>
						))}
					</span>
				</motion.div>

				{/* kicker */}
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
					className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 sm:text-xs">
					{brand.kicker}
				</motion.p>

				{/* headline */}
				<motion.h1
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
					className="mx-auto mt-5 max-w-4xl text-balance font-display text-[2.15rem] font-bold leading-[1.08] tracking-tightest text-white [text-shadow:0_2px_28px_rgba(3,7,18,0.5)] sm:text-5xl lg:text-[3.9rem]">
					{brand.headline.map((seg, i) =>
						seg.em ?
							<span
								key={i}
								className="relative whitespace-nowrap px-1">
								<span
									aria-hidden
									className="absolute inset-x-0 inset-y-[0.12em] -z-10 rounded-lg"
									style={{ backgroundColor: theme.highlightBg }}
								/>
								<span
									className="font-serif italic"
									style={{ color: theme.accentText }}>
									{seg.text}
								</span>
							</span>
						:	<span key={i}>{seg.text}</span>,
					)}
				</motion.h1>

				{/* subtitle */}
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
					className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
					{brand.subtitle}
				</motion.p>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
					className="pointer-events-auto mt-9">
					<Link
						href={brand.cta.href}
						target="_blank"
						rel="noopener noreferrer"
						className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-ink shadow-[0_14px_40px_-14px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5">
						{brand.cta.label}
						<span
							className="inline-flex size-9 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-0.5"
							style={{ backgroundColor: theme.mark }}>
							<ArrowRight className="size-4" />
						</span>
					</Link>
				</motion.div>

				{/* stats */}
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
					className="mt-12 flex items-center gap-6 sm:gap-10">
					{brand.stats.map((s, i) => (
						<div
							key={s.label}
							className="flex items-center gap-6 sm:gap-10">
							{i > 0 && <span className="h-9 w-px bg-white/15" />}
							<div className="text-center">
								<div className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
									{s.value}
								</div>
								<div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
									{s.label}
								</div>
							</div>
						</div>
					))}
				</motion.div>
			</div>

			{/* ── Bottom rail ─────────────────────────────────────────────────────── */}
			<div className="container-x relative z-20 flex items-center justify-between pb-6 text-[10px] font-semibold uppercase tracking-kicker text-white/45 sm:text-[11px]">
				<span className="pointer-events-none inline-flex items-center gap-2">
					Click anywhere to visit <ArrowRight className="size-3.5" />
				</span>
				<span className="pointer-events-none hidden text-white/35 md:block">
					Cubiccode Group of Companies
				</span>
			</div>
		</section>
	);
}

/* ----------------------------------------------------------------------- */
/* Floating pill  cursor-parallax drift + hover magnetism                  */
/* ----------------------------------------------------------------------- */

function FloatingPill({
	pill,
	slot,
	index,
	sx,
	sy,
	theme,
	href,
	label,
	reduce,
}: {
	pill: SplashPill;
	slot: string;
	index: number;
	sx: MotionValue<number>;
	sy: MotionValue<number>;
	theme: SplashTheme;
	href: string;
	label: string;
	reduce: boolean;
}) {
	// Alternating depth so nearer pills travel further than distant ones.
	const depth = 14 + (index % 4) * 10;
	const tilt = 3 + (index % 3);
	const x = useTransform(sx, (v) => v * depth);
	const y = useTransform(sy, (v) => v * depth);
	const rotate = useTransform(sx, (v) => v * tilt);

	return (
		<motion.div
			className={`absolute ${slot}`}
			style={reduce ? undefined : { x, y, rotate }}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.07 }}>
			{/* idle float wrapper */}
			<motion.div
				animate={reduce ? undefined : { y: [0, -9, 0] }}
				transition={{
					duration: 5 + (index % 4),
					repeat: Infinity,
					ease: "easeInOut",
					delay: index * 0.35,
				}}>
				<motion.a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${label}  ${pill.label}`}
					whileHover={{ scale: 1.14, y: -5 }}
					whileTap={{ scale: 0.97 }}
					transition={{ type: "spring", stiffness: 420, damping: 18 }}
					className="pointer-events-auto inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[filter] duration-300 hover:text-white hover:brightness-125"
					style={{
						backgroundColor: theme.pillGlass,
						boxShadow: `inset 0 0 0 1px ${theme.pillRing}`,
					}}>
					<Icon
						name={pill.icon}
						className="size-4 opacity-90"
					/>
					{pill.label}
				</motion.a>
			</motion.div>
		</motion.div>
	);
}
