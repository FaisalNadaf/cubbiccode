/** @format */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
	useMotionValueEvent,
	useReducedMotion,
	type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * SOLUTIONS SEQUENCE — a cinematic, scroll-driven carousel for "How we help".
 *
 * One tall wrapper with a `sticky` viewport inside. Scrolling maps `scrollYProgress`
 * to a discrete active step; each step cross-dissolves a central arch-framed image,
 * a curved SVG title, and a caption. An arched thumbnail rail + prev/next arrows let
 * you jump around. Under `prefers-reduced-motion` it falls back to a static grid.
 */

const IMAGE_POOL = [
	"/images/portfolio/laxis-analytics.jpg",
	"/images/portfolio/city-index.jpg",
	"/images/portfolio/prions-biotech.jpg",
	"/images/portfolio/woodpecker-exotic.jpg",
	"/images/portfolio/harsha-rakesh.jpg",
	"/images/portfolio/aishwarya-cottons.png",
];

const EASE = [0.22, 1, 0.36, 1] as const;
const ARCH_ID = "solutions-arch-curve";

type Item = { text: string; label: string; image: string };

/** Derive a short, curved-title label from a full solution sentence. */
function shortLabel(s: string): string {
	const lead = s
		.split(/\s+(?:—|–|that|so|for|with|to|connecting)\s+|[,—–:(]/i)[0]
		.trim();
	const base = lead.length > 1 ? lead : s;
	const words = base.split(/\s+/);
	return words.length > 4 ? words.slice(0, 4).join(" ") : base;
}

export function SolutionsSequence({
	title,
	icon,
	solutions,
	images,
}: {
	title: string;
	icon: string;
	solutions: string[];
	/** Per-solution artwork, index-aligned to `solutions`. Falls back to the pool. */
	images?: string[];
}) {
	const reduce = useReducedMotion();
	const items: Item[] = solutions.map((text, i) => ({
		text,
		label: shortLabel(text),
		image: images?.[i] ?? IMAGE_POOL[i % IMAGE_POOL.length],
	}));

	if (reduce)
		return (
			<StaticSolutions
				title={title}
				icon={icon}
				items={items}
			/>
		);
	return (
		<PinnedSolutions
			title={title}
			icon={icon}
			items={items}
		/>
	);
}

/* ── Scroll-pinned sequence ──────────────────────────────────────────────── */

function PinnedSolutions({
	title,
	icon,
	items,
}: {
	title: string;
	icon: string;
	items: Item[];
}) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const total = items.length;
	const [active, setActive] = useState(0);

	const { scrollYProgress } = useScroll({
		target: wrapRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		const idx = Math.max(0, Math.min(total - 1, Math.floor(v * total)));
		setActive(idx);
	});

	// Scroll the page so step `i` lands at its center.
	const jumpTo = (i: number) => {
		const el = wrapRef.current;
		if (!el) return;
		const rectTop = el.getBoundingClientRect().top + window.scrollY;
		const travel = el.offsetHeight - window.innerHeight;
		const p = (i + 0.5) / total;
		window.scrollTo({ top: rectTop + p * travel, behavior: "smooth" });
	};

	const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
	const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

	const cur = items[active];
	const count = `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

	return (
		<section
			ref={wrapRef}
			className="relative bg-ink text-white"
			style={{ height: `${total * 85}vh` }}>
			<div className="sticky top-0 h-screen overflow-hidden">
				<Backdrop progress={scrollYProgress} />

				{/* top progress bar */}
				<motion.div
					style={{ scaleX: barScaleX }}
					className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-corporate-500 via-corporate-300 to-corporate-500"
				/>

				{/* eyebrow */}
				<div className="absolute inset-x-0 top-[7%] z-30 flex justify-center px-6">
					<span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-corporate-200/90">
						<span className="h-px w-7 bg-corporate-300/60" />
						How we help
						<span className="h-px w-7 bg-corporate-300/60" />
					</span>
				</div>

				{/* curved title */}
				<ArchedTitle label={cur.label} />

				{/* center stage */}
				<div className="absolute inset-0 z-20 flex items-center justify-center px-6">
					<div className="relative flex w-full max-w-5xl flex-col items-center">
						<div className="relative flex items-center justify-center">
							{/* giant faint index behind */}
							<AnimatePresence>
								<motion.span
									key={active}
									initial={{ opacity: 0 }}
									animate={{ opacity: 0.06 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.6 }}
									className="pointer-events-none absolute select-none font-display font-black leading-none tracking-tightest text-white"
									style={{ fontSize: "clamp(11rem, 28vw, 24rem)" }}>
									{String(active + 1).padStart(2, "0")}
								</motion.span>
							</AnimatePresence>

							{/* stone shadow */}
							<div className="pointer-events-none absolute bottom-3 h-16 w-[68%] rounded-[50%] bg-black/55 blur-2xl" />

							{/* arch-framed image */}
							<div className="relative h-[clamp(293px,52vh,440px)] w-[clamp(280px,44vw,760px)]">
								<AnimatePresence>
									<motion.div
										key={active}
										initial={{ opacity: 0, scale: 1.06, y: 16 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.98, y: -12 }}
										transition={{ duration: 0.8, ease: EASE }}
										className="absolute inset-0 overflow-hidden shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/15"
										style={{ borderRadius: "46% 46% 18px 18px" }}>
										<Image
											src={cur.image}
											alt=""
											fill
											sizes="336px"
											priority={active === 0}
											className="object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						{/* caption */}
						<div className="relative z-10 -mt-10 w-full max-w-xl">
							<AnimatePresence mode="wait">
								<motion.div
									key={active}
									initial={{ opacity: 0, y: 22 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -12 }}
									transition={{ duration: 0.5, ease: EASE }}
									className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-md lg:p-7">
									<div className="flex items-center justify-center gap-2.5 text-corporate-200">
										<span className="flex size-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
											<Icon
												name={icon}
												className="size-4"
											/>
										</span>
										<span className="text-[11px] font-semibold uppercase tracking-[0.22em] tabular-nums">
											{count}
										</span>
									</div>
									<p className="mt-3 text-pretty text-[15px] leading-relaxed text-steel-100 lg:text-base">
										{cur.text}
									</p>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>

				{/* prev / next arrows */}
				<div className="pointer-events-none absolute inset-0 z-30 hidden items-center justify-between px-6 lg:flex xl:px-14">
					<ArrowButton
						dir="prev"
						disabled={active === 0}
						onClick={() => jumpTo(active - 1)}
					/>
					<ArrowButton
						dir="next"
						disabled={active === total - 1}
						onClick={() => jumpTo(active + 1)}
					/>
				</div>

				{/* arched thumbnail rail */}
				<div className="absolute inset-x-0 bottom-5 z-30 flex items-end justify-center gap-2.5 px-6 lg:bottom-7 lg:gap-3.5">
					{items.map((it, i) => {
						const center = (total - 1) / 2;
						const d = center === 0 ? 0 : (i - center) / center;
						const lift = d * d * 22; // arch: center sits highest
						const on = i === active;
						return (
							<button
								key={i}
								type="button"
								onClick={() => jumpTo(i)}
								aria-label={`View solution ${i + 1}`}
								style={{ transform: `translateY(${lift}px)` }}
								className={cn(
									"relative shrink-0 overflow-hidden rounded-xl ring-1 transition-all duration-500",
									on ?
										"h-16 w-24 scale-105 ring-2 ring-corporate-400 lg:h-[74px] lg:w-28"
									:	"h-12 w-20 opacity-50 grayscale ring-white/15 hover:opacity-90 hover:grayscale-0 lg:h-14 lg:w-24",
								)}>
								<Image
									src={it.image}
									alt=""
									fill
									sizes="112px"
									className="object-cover"
								/>
								{!on && <span className="absolute inset-0 bg-ink/40" />}
							</button>
						);
					})}
				</div>

				{/* scroll hint */}
				<motion.div
					style={{ opacity: hintOpacity }}
					className="pointer-events-none absolute inset-x-0 bottom-[calc(2.5rem+90px)] z-20 hidden justify-center lg:flex">
					<span className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-white/40">
						Scroll to explore
					</span>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Curved SVG title ────────────────────────────────────────────────────── */

function ArchedTitle({ label }: { label: string }) {
	return (
		<div className="pointer-events-none absolute inset-x-0 top-[11%] z-30 flex justify-center lg:top-[12%]">
			<svg
				viewBox="0 0 1000 560"
				className="w-[min(88vw,760px)] overflow-visible"
				aria-hidden>
				<defs>
					<path
						id={ARCH_ID}
						d="M40 560 L40 300 Q40 40 500 40 Q960 40 960 300 L960 560"
						fill="none"
					/>
				</defs>
				<text
					className="fill-[#F1EADE] font-display"
					style={{ fontWeight: 700, fontSize: 70, letterSpacing: "0.4px" }}>
					<AnimatePresence initial={false}>
						<motion.textPath
							key={label}
							href={`#${ARCH_ID}`}
							textAnchor="middle"
							initial={{ startOffset: "100%", opacity: 0 }}
							animate={{ startOffset: "50%", opacity: 1 }}
							exit={{ startOffset: "0%", opacity: 0 }}
							transition={{
								startOffset: { duration: 1.15, ease: EASE },
								opacity: { duration: 0.7, ease: "easeInOut" },
							}}>
							{label}
						</motion.textPath>
					</AnimatePresence>
				</text>
			</svg>
		</div>
	);
}

/* ── Arrow button ────────────────────────────────────────────────────────── */

function ArrowButton({
	dir,
	disabled,
	onClick,
}: {
	dir: "prev" | "next";
	disabled: boolean;
	onClick: () => void;
}) {
	const Glyph = dir === "prev" ? ArrowLeft : ArrowRight;
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={dir === "prev" ? "Previous solution" : "Next solution"}
			className={cn(
				"pointer-events-auto flex size-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-[#F1EADE] backdrop-blur transition-all duration-300",
				disabled ?
					"cursor-not-allowed opacity-20"
				:	"hover:scale-105 hover:border-white/55 hover:bg-white/10",
			)}>
			<Glyph className="size-5" />
		</button>
	);
}

/* ── Backdrop (glow drift + drawn principle path) ────────────────────────── */

function Backdrop({ progress }: { progress: MotionValue<number> }) {
	const glowY = useTransform(progress, [0, 1], ["-12%", "14%"]);
	const glowX = useTransform(progress, [0, 1], ["-8%", "10%"]);
	const pathDraw = useTransform(progress, [0, 1], [0, 1]);

	return (
		<div className="pointer-events-none absolute inset-0">
			<div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_8%,#13284f_0%,#0B1B3A_45%,#050d1c_100%)]" />
			<div className="absolute inset-0 bg-blueprint [background-size:46px_46px] opacity-[0.10]" />

			{/* flowing principle path, drawn on scroll */}
			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 1440 1080"
				preserveAspectRatio="none"
				aria-hidden>
				<linearGradient
					id="sol-path-grad"
					x1="0"
					y1="0"
					x2="0"
					y2="1">
					<stop
						offset="0"
						stopColor="#0B1B3A"
					/>
					<stop
						offset="0.5"
						stopColor="#1B6EC2"
					/>
					<stop
						offset="1"
						stopColor="#6FA6DF"
					/>
				</linearGradient>
				<motion.path
					d="M517,1080c246-232.9,804.3-242.7,752-429.1-27.9-99.7-412.5-154.2-649-29.3-228.9,120.8-467.4,88.3-462,49.5,15.1-108.4,394,337.4,527,133.9C924.6,438.3,14,694.9,250,0"
					fill="none"
					stroke="url(#sol-path-grad)"
					strokeWidth="1"
					vectorEffect="non-scaling-stroke"
					style={{ pathLength: pathDraw, opacity: 0.4 }}
				/>
			</svg>

			<motion.div
				style={{ y: glowY, x: glowX }}
				className="absolute left-1/2 top-1/2 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-500/15 blur-[150px]"
			/>
			<div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(5,13,28,0.75)_100%)]" />
		</div>
	);
}

/* ── Reduced-motion / fallback: static image grid ────────────────────────── */

function StaticSolutions({
	title,
	icon,
	items,
}: {
	title: string;
	icon: string;
	items: Item[];
}) {
	return (
		<section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
			<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:46px_46px] opacity-[0.10]" />
			<div className="pointer-events-none absolute left-1/2 top-0 size-[560px] -translate-x-1/2 rounded-full bg-corporate-600/15 blur-3xl" />
			<div className="container-x relative">
				<div className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-corporate-200">
						<span className="h-px w-7 bg-corporate-300/60" /> How we help
					</span>
					<h2 className="mt-4 font-display text-3xl font-bold tracking-tightest sm:text-4xl">
						{title}
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((it, i) => (
						<article
							key={i}
							className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
							<div className="relative aspect-[16/10] w-full overflow-hidden">
								<Image
									src={it.image}
									alt=""
									fill
									sizes="(min-width:1024px) 33vw, 100vw"
									className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
								<span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
									<Icon
										name={icon}
										className="size-4"
									/>
								</span>
								<span className="absolute bottom-2 left-4 font-display text-4xl font-black tracking-tightest text-white/90">
									{String(i + 1).padStart(2, "0")}
								</span>
							</div>
							<div className="p-6">
								<h3 className="font-display text-lg font-semibold leading-snug">
									{it.label}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-steel-200">
									{it.text}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
