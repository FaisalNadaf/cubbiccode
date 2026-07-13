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

/**
 * ORIGIN · OBJECTS  scroll-pinned editorial object showcase.
 *
 * Intro: the words "Origin" / "Objects" frame a row of four small object cards
 * over a hairline. As scrolling begins the words part + fade and the scene
 * cross-dissolves into a pinned showcase: a tall column of portrait cards
 * translates vertically so one object is centred at a time (the neighbours peek
 * above / below). Around it sit fixed editorial furniture  three narrative
 * lines, a per-object serif caption, an `n/total` counter, a line flourish, and
 * the "Explore Objects" button. The background warms as the sequence resolves.
 *
 * One `scrollYProgress` drives every value (transform / opacity / colour only
 * GPU-composited). Below `lg` or under prefers-reduced-motion the pin is
 * dropped for a stacked, fully-revealed layout.
 *
 * Assets: cards fall back to a tinted gradient placeholder. Drop real artwork in
 * `public/images/objects/*` and set `src` on each entry in CARDS to swap them.
 */

type Card = {
	roman: string;
	name: string;
	from: string;
	to: string;
	src?: string;
};

const CARDS: Card[] = [
	{ roman: "I", name: "The Rabbit Keeper", from: "#9aa0a3", to: "#54595d" },
	{ roman: "II", name: "The Wanderer", from: "#bdae96", to: "#7e745e" },
	{ roman: "III", name: "The Guardian", from: "#8d9398", to: "#4d5258" },
	{ roman: "IV", name: "The Fox Spirit", from: "#c4b69f", to: "#897c66" },
];

const NARRATIVE = {
	topLeft: "These items are formed within the places themselves.",
	right:
		"Each originates on site, shaped by material, process, and circumstance.",
	lowerLeft:
		"Once completed, they leave their point of origin and circulate independently.",
};

// Showcase column geometry, in viewport-height units.
const CARD_VH = 72;
const GAP_VH = 4;
const STEP = CARD_VH + GAP_VH; // travel per card
const START_Y = (100 - CARD_VH) / 2; // y that centres the first card
const END_Y = START_Y - (CARDS.length - 1) * STEP;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function OriginObjects() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduce = useReducedMotion();
	const [isMobile, setIsMobile] = useState(false);
	const [active, setActive] = useState(0);

	useEffect(() => {
		// The pinned scene's furniture (the nowrap serif caption, the side narrative
		// columns) is positioned in vw against a wide stage; below lg it overlaps the
		// card column, so the whole pin is swapped for the stacked layout there.
		const mq = window.matchMedia("(max-width: 1023.98px)");
		const sync = () => setIsMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	// Active card index (drives caption + counter), updated discretely.
	useMotionValueEvent(scrollYProgress, "change", (v) => {
		const t = clamp01((v - 0.12) / (1 - 0.12));
		const i = Math.round(t * (CARDS.length - 1));
		setActive((prev) => (prev === i ? prev : i));
	});

	// Intro → showcase cross-dissolve + word split.
	const introOpacity = useTransform(
		scrollYProgress,
		[0, 0.07, 0.14],
		[1, 1, 0],
	);
	const introXLeft = useTransform(scrollYProgress, [0, 0.14], [0, -200]);
	const introXRight = useTransform(scrollYProgress, [0, 0.14], [0, 200]);
	const showcaseOpacity = useTransform(scrollYProgress, [0.09, 0.18], [0, 1]);

	// The card column travels up so each object passes through centre.
	const columnY = useTransform(
		scrollYProgress,
		[0.12, 1],
		[`${START_Y}vh`, `${END_Y}vh`],
	);

	// Background warms as the sequence resolves.
	const bgColor = useTransform(
		scrollYProgress,
		[0.55, 0.85],
		["#F4F0EA", "#EAE3D8"],
	);

	if (isMobile || reduce) {
		return <OriginObjectsStatic animated={isMobile && !reduce} />;
	}

	return (
		<section
			ref={sectionRef}
			className="relative w-full"
			style={{ height: `${CARDS.length * 100 + 60}vh` }}>
			<motion.div
				style={{ backgroundColor: bgColor }}
				className="noise sticky top-0 h-screen w-full overflow-hidden text-[#151415]">
				{/* Paper light */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-[-12%] z-0"
					style={{
						background:
							"radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,0.7), transparent 70%)",
					}}
				/>

				<h2 className="sr-only">Origin Objects</h2>

				{/* ── Showcase (fades in) ─────────────────────────────────────── */}
				<motion.div
					style={{ opacity: showcaseOpacity }}
					className="absolute inset-0">
					{/* Decorative line flourish behind the cards */}
					<Flourish className="absolute left-1/2 top-[50%] z-0 w-[78vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 text-[#151415]/30" />

					{/* Centre hairline */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-[5vw] top-[52vh] z-10 h-px bg-[#151415]/15"
					/>

					{/* Card column */}
					<div className="absolute inset-x-0 top-0 z-20 flex justify-center">
						<motion.div
							style={{ y: columnY }}
							className="flex flex-col items-center gap-[4vh] [will-change:transform]">
							{CARDS.map((card, i) => (
								<ObjectCard
									key={card.name}
									card={card}
									priority={i === 0}
									className="aspect-[7/10] h-[72vh]"
									watermark
								/>
							))}
						</motion.div>
					</div>

					{/* Per-object serif caption (on the hairline, left) */}
					<div className="pointer-events-none absolute left-[6vw] top-[52vh] z-30 -translate-y-1/2">
						<AnimatePresence mode="wait">
							<motion.p
								key={active}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
								className="whitespace-nowrap font-serif text-[clamp(1.4rem,2.6vw,2.5rem)] font-normal tracking-[-0.01em] text-[#151415]">
								<span className="text-[#151415]/55">
									({CARDS[active].roman})
								</span>{" "}
								{CARDS[active].name}
							</motion.p>
						</AnimatePresence>
					</div>

					{/* Counter (on the hairline, right) */}
					<div className="pointer-events-none absolute right-[10vw] top-[52vh] z-30 -translate-y-1/2 font-serif text-[clamp(1.4rem,2.2vw,2rem)] tabular-nums text-[#151415]">
						<AnimatePresence mode="wait">
							<motion.span
								key={active}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.3 }}
								className="inline-block">
								{active + 1}
							</motion.span>
						</AnimatePresence>
						<span className="text-[#151415]/40">/{CARDS.length}</span>
					</div>

					{/* Fixed narrative furniture */}
					<p className="pointer-events-none absolute left-[3vw] top-[16vh] z-30 max-w-[26ch] font-sans text-[clamp(14px,1.05vw,20px)] font-normal uppercase leading-[1.3] tracking-[0.01em] text-[#151415]">
						{NARRATIVE.topLeft}
					</p>
					<p className="pointer-events-none absolute right-[3vw] top-[40vh] z-30 max-w-[24ch] text-right font-sans text-[clamp(14px,1.05vw,20px)] font-normal uppercase leading-[1.3] tracking-[0.01em] text-[#151415]">
						{NARRATIVE.right}
					</p>
					<p className="pointer-events-none absolute bottom-[24vh] left-[9vw] z-30 max-w-[22ch] font-sans text-[clamp(13px,0.95vw,16px)] font-normal leading-[1.4] text-[#151415]/90">
						{NARRATIVE.lowerLeft}
					</p>

					{/* Explore Objects button */}
					<Link
						href="/portfolio"
						className="group absolute bottom-[8vh] right-[6vw] z-40 flex h-[92px] w-[268px] flex-col justify-between rounded-2xl bg-white p-5 shadow-[0_20px_50px_-24px_rgba(21,20,21,0.45)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
						<span className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[#151415]">
							Explore Objects
						</span>
						<span className="size-2.5 self-end rounded-full bg-[#151415] transition-transform duration-300 group-hover:scale-125" />
					</Link>
				</motion.div>

				{/* ── Intro: split words + 4-card row (fades out) ─────────────── */}
				<motion.div
					style={{ opacity: introOpacity }}
					className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
					<div className="flex flex-col items-center">
						<div className="flex items-center justify-center gap-[clamp(0.5rem,1.6vw,1.5rem)]">
							<motion.span
								aria-hidden
								style={{ x: introXLeft }}
								className="select-none whitespace-nowrap font-serif text-[clamp(3rem,9vw,9rem)] font-normal leading-none tracking-[-0.02em] text-[#151415] [will-change:transform]">
								Origin
							</motion.span>

							<div className="flex items-center gap-[clamp(6px,0.9vw,14px)]">
								{CARDS.map((card) => (
									<ObjectCard
										key={card.name}
										card={card}
										className="aspect-[5/7] w-[clamp(58px,7.5vw,124px)]"
									/>
								))}
							</div>

							<motion.span
								aria-hidden
								style={{ x: introXRight }}
								className="select-none whitespace-nowrap font-serif text-[clamp(3rem,9vw,9rem)] font-normal leading-none tracking-[-0.02em] text-[#151415] [will-change:transform]">
								Objects
							</motion.span>
						</div>
						<div className="mt-8 h-px w-[min(60vw,720px)] bg-[#151415]/20" />
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function ObjectCard({
	card,
	className = "",
	priority = false,
	watermark = false,
}: {
	card: Card;
	className?: string;
	priority?: boolean;
	watermark?: boolean;
}) {
	return (
		<div
			className={`relative shrink-0 overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(21,20,21,0.55)] ring-1 ring-black/5 ${className}`}>
			{card.src ?
				<Image
					src={card.src}
					alt={card.name}
					fill
					priority={priority}
					sizes="(max-width: 1024px) 60vw, 560px"
					className="object-cover"
				/>
			:	<div
					className="absolute inset-0"
					style={{
						backgroundImage: `linear-gradient(155deg, ${card.from}, ${card.to})`,
					}}>
					{watermark && (
						// 26vh is scaled for the 72vh pinned card; in the stacked layout
						// below lg the card is a fraction of that, so the glyph is stepped
						// down to stay inside it.
						<span
							aria-hidden
							className="absolute inset-0 flex items-center justify-center font-serif text-[14vh] leading-none text-white/[0.08] select-none lg:text-[26vh]">
							{card.roman}
						</span>
					)}
				</div>
			}
		</div>
	);
}

/* ── Decorative line flourish ────────────────────────────────────────────── */

function Flourish({ className = "" }: { className?: string }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 1000 360"
			fill="none"
			className={`pointer-events-none ${className}`}>
			<path
				d="M30 200 C120 60 300 60 380 200 C440 305 300 340 270 250 C240 150 470 120 600 220 C700 296 840 280 930 170"
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
			/>
			<path
				d="M70 250 C200 120 360 360 540 240 C660 160 760 300 880 210"
				stroke="currentColor"
				strokeWidth="0.8"
				strokeLinecap="round"
				opacity="0.6"
			/>
		</svg>
	);
}

/* ── Static / mobile fallback ────────────────────────────────────────────── */

function OriginObjectsStatic({ animated }: { animated: boolean }) {
	const fade =
		animated ?
			{
				initial: { opacity: 0, y: 40 },
				whileInView: { opacity: 1, y: 0 },
				viewport: { once: true, amount: 0.3 },
				transition: { duration: 0.8, ease: [0.35, 0.35, 0, 1] as const },
			}
		:	{};

	return (
		<section className="noise relative w-full overflow-hidden bg-[#F4F0EA] py-24 text-[#151415]">
			<div className="container-x flex flex-col items-center gap-12 text-center">
				<h2 className="sr-only">Origin Objects</h2>

				<motion.div
					{...fade}
					className="flex flex-col items-center"
					aria-hidden>
					<span className="font-serif text-[3.25rem] font-normal leading-none tracking-[-0.02em]">
						Origin
					</span>
					<span className="font-serif text-[3.25rem] font-normal leading-none tracking-[-0.02em]">
						Objects
					</span>
				</motion.div>

				<p className="max-w-[34ch] font-sans text-[15px] uppercase leading-[1.4] tracking-wide">
					{NARRATIVE.topLeft} {NARRATIVE.right}
				</p>

				<div className="grid w-full max-w-md grid-cols-2 gap-4">
					{CARDS.map((card) => (
						<motion.div
							key={card.name}
							{...fade}
							className="flex flex-col gap-3">
							<ObjectCard
								card={card}
								className="aspect-[5/7] w-full"
								watermark
							/>
							<span className="font-serif text-lg">
								<span className="text-[#151415]/55">({card.roman})</span>{" "}
								{card.name}
							</span>
						</motion.div>
					))}
				</div>

				<p className="max-w-[30ch] font-sans text-[14px] leading-[1.5] text-[#151415]/90">
					{NARRATIVE.lowerLeft}
				</p>

				<motion.div {...fade}>
					<Link
						href="/portfolio"
						className="group flex h-[92px] w-[268px] flex-col justify-between rounded-2xl bg-white p-5 text-left shadow-[0_20px_50px_-24px_rgba(21,20,21,0.45)] ring-1 ring-black/5">
						<span className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[#151415]">
							Explore Objects
						</span>
						<span className="size-2.5 self-end rounded-full bg-[#151415]" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
