/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
	useMotionValueEvent,
	useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { capabilities, type Capability } from "@/content/capabilities";
import { capabilityImage } from "@/content/serviceImages";

/**
 * CAPABILITIES  scroll-pinned showcase (shares the Origin·Objects motion
 * language, recoloured to the company palette).
 *
 * Intro: the words "Our" / "Capabilities" frame a row of small capability
 * cards over a hairline. On scroll the words part + fade and the scene
 * cross-dissolves into a pinned showcase: a column of portrait cards travels
 * vertically so one capability is centred at a time (neighbours peek above /
 * below). The surrounding editorial furniture  a serif title block, a feature
 * + tech panel, an `n/total` counter and the CTA  crossfades to the active
 * capability. The background cools subtly as the sequence resolves.
 *
 * One `scrollYProgress` drives every value (transform / opacity / colour only).
 * Below 1024px or under prefers-reduced-motion the pin is dropped for a stacked,
 * fully-revealed layout: the pinned scene's furniture is laid out in `vw`/`vh`
 * around a 4:5 card that is 80vh tall, so anything narrower than `lg` has the
 * title block, the feature panel and the CTA overlapping the card.
 *
 * Each card shows its capability's own artwork (see `capabilityImage`).
 */

// Showcase column geometry, in viewport-height units. Cards are near-full-height
// so the active one fills the stage while its neighbours just peek (sliding stack).
// GAP_VH must match the column's `gap-[…vh]` class or cards drift off-centre.
const CARD_VH = 80;
const GAP_VH = 6;
const STEP = CARD_VH + GAP_VH;
const START_Y = (100 - CARD_VH) / 2;
const END_Y = START_Y - (capabilities.length - 1) * STEP;

// The column holds card 1 centred until the showcase has fully faded in, then
// travels. Travel start === showcase-reveal end so slide 1 is seen centred AND
// fully visible before anything moves.
const TRAVEL_START = 0.18;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const idx = (n: number) => String(n).padStart(2, "0");
// Features are authored as "Heading — description"; the em-dash separator was
// stripped to a run of spaces in the source copy, so split on 2+ whitespace (or
// a literal dash) to recover just the heading label for the compact list.
const lead = (feature: string) => feature.split(/\s{2,}|\s[—–]\s/)[0].trim();

export function CapabilitiesShowcase() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduce = useReducedMotion();
	const [isCompact, setIsCompact] = useState(false);
	const [active, setActive] = useState(0);

	// Matches the `lg` breakpoint: the pinned scene's geometry only resolves at
	// >= 1024px, so everything below it takes the stacked layout.
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 1023.98px)");
		const sync = () => setIsCompact(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		const t = clamp01((v - TRAVEL_START) / (1 - TRAVEL_START));
		const i = Math.round(t * (capabilities.length - 1));
		setActive((prev) => (prev === i ? prev : i));
	});

	const introOpacity = useTransform(
		scrollYProgress,
		[0, 0.07, 0.14],
		[1, 1, 0],
	);
	const introXLeft = useTransform(scrollYProgress, [0, 0.14], [0, -200]);
	const introXRight = useTransform(scrollYProgress, [0, 0.14], [0, 200]);
	const showcaseOpacity = useTransform(scrollYProgress, [0.09, 0.18], [0, 1]);

	const columnY = useTransform(
		scrollYProgress,
		[TRAVEL_START, 1],
		[`${START_Y}vh`, `${END_Y}vh`],
	);

	const bgColor = useTransform(
		scrollYProgress,
		[0.5, 0.85],
		["#F7F8FA", "#EEF2F7"],
	);

	if (isCompact || reduce) {
		return <CapabilitiesStatic animated={isCompact && !reduce} />;
	}

	const cap = capabilities[active];

	return (
		<section
			ref={sectionRef}
			className="relative w-full"
			style={{ height: `${capabilities.length * 90 + 40}vh` }}>
			<motion.div
				style={{ backgroundColor: bgColor }}
				className="sticky top-0 h-screen w-full overflow-hidden text-ink">
				{/* Brand texture */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-0 bg-blueprint opacity-[0.5] [background-size:34px_34px]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -left-24 top-1/2 z-0 size-[36rem] -translate-y-1/2 rounded-full bg-corporate-500/10 blur-3xl"
				/>

				<h2 className="sr-only">Our Capabilities</h2>

				{/* ── Showcase (fades in) ─────────────────────────────────────── */}
				<motion.div
					style={{ opacity: showcaseOpacity }}
					className="absolute inset-0">
					{/* Card column */}
					<div className="absolute inset-x-0 top-0 z-20 flex justify-center">
						<motion.div
							style={{ y: columnY }}
							className="flex flex-col items-center gap-[6vh] [will-change:transform]">
							{capabilities.map((c, i) => (
								<CapabilityCard
									key={c.slug}
									cap={c}
									priority={i === 0}
									className="aspect-[4/5] h-[80vh]"
								/>
							))}
						</motion.div>
					</div>

					{/* Static kicker on the hairline, left */}
					<span className="pointer-events-none absolute left-[5vw] top-[52vh] z-30 -translate-y-1/2 bg-canvas-soft pr-3 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-corporate-600">
						What we do
					</span>

					{/* Dynamic title block, top-left */}
					<div className="absolute left-[4vw] top-[13vh] z-30 w-[clamp(240px,27vw,440px)]">
						<AnimatePresence mode="wait">
							<motion.div
								key={active}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
								<span className="font-serif text-[clamp(1rem,1.4vw,1.4rem)] text-corporate-500">
									({idx(active + 1)})
								</span>
								<h3 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,3.2rem)] font-normal leading-[1.05] tracking-[-0.01em] text-ink">
									{cap.title}
								</h3>
								<p className="mt-4 max-w-[34ch] font-sans text-[clamp(13px,0.95vw,15.5px)] leading-relaxed text-steel-600">
									{cap.short}
								</p>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Dynamic feature panel, right-centre */}
					<div className="absolute right-[4vw] top-1/2 z-30 w-[clamp(210px,20vw,330px)] -translate-y-1/2">
						<span className="mb-4 flex items-center gap-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-corporate-600">
							<span className="h-px w-6 bg-corporate-300" />
							What&rsquo;s included
						</span>
						<AnimatePresence mode="wait">
							<motion.ul
								key={active}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
								className="flex flex-col divide-y divide-steel-200/70">
								{cap.features.slice(0, 4).map((f) => (
									<li
										key={f}
										className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 font-sans text-[clamp(13px,0.95vw,15px)] font-medium leading-snug text-steel-700">
										<span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
											<Check className="size-3" strokeWidth={2.75} />
										</span>
										{lead(f)}
									</li>
								))}
							</motion.ul>
						</AnimatePresence>
					</div>

					{/* CTA button, bottom-right */}
					<Link
						href={cap.path}
						aria-label={`View ${cap.title}`}
						className="group absolute bottom-[8vh] right-[6vw] z-40 flex w-[300px] items-center justify-between gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-steel-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-corporate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2">
						{/* Blue sweep fills the card on hover */}
						<span
							aria-hidden
							className="absolute inset-0 z-0 translate-y-full bg-corporate-600 transition-transform duration-300 ease-out group-hover:translate-y-0"
						/>
						<span className="relative z-10 flex flex-col">
							<span className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] text-corporate-600 transition-colors duration-300 group-hover:text-white/70">
								Explore
							</span>
							<span className="mt-1 font-sans text-[15px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-300 group-hover:text-white">
								View capability
							</span>
						</span>
						<span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 transition-colors duration-300 group-hover:bg-white group-hover:ring-white">
							<ArrowUpRight
								className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								strokeWidth={2}
							/>
						</span>
					</Link>
				</motion.div>

				{/* ── Intro: split words + card row (fades out) ───────────────── */}
				<motion.div
					style={{ opacity: introOpacity }}
					className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
					<div className="flex flex-col items-center">
						<div className="flex items-center justify-center gap-[clamp(0.5rem,1.4vw,1.25rem)]">
							<motion.span
								aria-hidden
								style={{ x: introXLeft }}
								className="select-none whitespace-nowrap font-serif text-[clamp(2.5rem,7vw,7rem)] font-normal leading-none tracking-[-0.02em] text-ink [will-change:transform]">
								Our
							</motion.span>

							<div className="flex items-center gap-[clamp(5px,0.7vw,12px)]">
								{capabilities.map((c) => (
									<CapabilityCard
										key={c.slug}
										cap={c}
										className="aspect-[4/5] w-[clamp(46px,5.5vw,90px)]"
									/>
								))}
							</div>

							<motion.span
								aria-hidden
								style={{ x: introXRight }}
								className="select-none whitespace-nowrap font-serif text-[clamp(2.5rem,7vw,7rem)] font-normal leading-none tracking-[-0.02em] text-ink [will-change:transform]">
								Capabilities
							</motion.span>
						</div>
						<div className="mt-8 h-px w-[min(62vw,760px)] bg-steel-300/70" />
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function CapabilityCard({
	cap,
	className = "",
	priority = false,
}: {
	cap: Capability;
	className?: string;
	priority?: boolean;
}) {
	// Full-bleed image card  the capability's own artwork fills the whole frame.
	return (
		<div
			className={`relative shrink-0 overflow-hidden rounded-3xl bg-steel-100 ring-1 ring-steel-200/80 shadow-lift ${className}`}>
			<Image
				src={capabilityImage(cap.slug)}
				alt={cap.title}
				fill
				priority={priority}
				sizes="(max-width: 1024px) 70vw, 720px"
				className="object-cover"
			/>
		</div>
	);
}

/* ── Static / mobile fallback ────────────────────────────────────────────── */

function CapabilitiesStatic({ animated }: { animated: boolean }) {
	const fade =
		animated ?
			{
				initial: { opacity: 0, y: 40 },
				whileInView: { opacity: 1, y: 0 },
				viewport: { once: true, amount: 0.3 },
				transition: { duration: 0.7, ease: [0.35, 0.35, 0, 1] as const },
			}
		:	{};

	return (
		<section className="section relative w-full overflow-hidden bg-canvas-soft text-ink">
			<div className="container-x">
				<span className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-corporate-600">
					What we do
				</span>
				<h2 className="mt-3 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em]">
					Our Capabilities
				</h2>

				<div className="mt-10 flex flex-col gap-10">
					{capabilities.map((cap, i) => (
						<motion.div
							key={cap.slug}
							{...fade}
							className="flex flex-col gap-5 border-t border-steel-200 pt-8 first:border-t-0 sm:flex-row sm:gap-7">
							<CapabilityCard
								cap={cap}
								className="aspect-[4/5] w-full max-w-[200px] shrink-0"
							/>
							<div>
								<span className="font-serif text-base text-corporate-500">
									({idx(i + 1)})
								</span>
								<h3 className="mt-1 font-serif text-2xl font-normal leading-tight">
									{cap.title}
								</h3>
								<p className="mt-3 max-w-prose text-[15px] leading-relaxed text-steel-600">
									{cap.short}
								</p>
								<ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
									{cap.features.slice(0, 4).map((f) => (
										<li
											key={f}
											className="flex items-start gap-2 text-[13.5px] text-steel-700">
											<Check className="mt-0.5 size-4 shrink-0 text-corporate-500" />
											{lead(f)}
										</li>
									))}
								</ul>
								<Link
									href={cap.path}
									className="group tap-target-h mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700">
									View capability
									<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
