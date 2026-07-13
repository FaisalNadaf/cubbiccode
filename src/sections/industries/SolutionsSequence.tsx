/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
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
 * SOLUTIONS SEQUENCE  a cinematic, scroll-driven carousel for "How we help".
 *
 * One tall wrapper with a `sticky` viewport inside. Scrolling maps `scrollYProgress`
 * to a discrete active step; each step cross-dissolves a central arch-framed image,
 * a curved SVG title, and a caption. An arched thumbnail rail + prev/next arrows let
 * you jump around. Under `prefers-reduced-motion` it falls back to a static grid.
 */

const IMAGE_POOL = [
	"/images/portfolio/positron.jpeg",
	"/images/portfolio/city-index.jpg",
	"/images/portfolio/prionsbiotec.jpg",
	"/images/portfolio/woodpeckerexotic.jpg",
	"/images/portfolio/harsharakes.jpg",
	"/images/portfolio/aishwaryacotton.jpg",
];

const EASE = [0.22, 1, 0.36, 1] as const;
const ARCH_ID = "solutions-arch-curve";

type Item = { text: string; label: string; image: string };

/** Derive a short, curved-title label from a full solution sentence. */
function shortLabel(s: string): string {
	const lead = s
		.split(/\s+(?:|–|that|so|for|with|to|connecting)\s+|[,–:(]/i)[0]
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
	const railRef = useRef<HTMLDivElement>(null);
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

	// Below lg the thumbnail rail is a horizontal swipe strip (7-8 thumbnails cannot
	// fit a phone), so the active thumbnail has to be brought into its own scrollport.
	// At >= lg the rail is `overflow: visible` and every thumbnail is already on
	// screen, so this bails out before touching anything.
	useEffect(() => {
		const rail = railRef.current;
		if (!rail) return;
		if (window.matchMedia("(min-width: 1024px)").matches) return;
		const thumb = rail.children[active] as HTMLElement | undefined;
		if (!thumb) return;
		rail.scrollTo({
			left: thumb.offsetLeft - (rail.clientWidth - thumb.offsetWidth) / 2,
			behavior: "smooth",
		});
	}, [active]);

	// Scroll the page so step `i` lands at its center.
	const jumpTo = (i: number) => {
		const el = wrapRef.current;
		if (!el) return;
		const rectTop = el.getBoundingClientRect().top + window.scrollY;
		const travel = el.offsetHeight - window.innerHeight;
		const p = (i + 0.5) / total;
		const top = rectTop + p * travel;

		// Below lg the thumbnail rail is the ONLY way to move between steps (the
		// prev/next arrows are `hidden lg:flex`), so this path has to actually work
		// on touch: a native `behavior: "smooth"` runs its own animation while Lenis
		// keeps writing its own scroll position every rAF, and the two cancel each
		// other. Hand the target to Lenis instead when it is present. The >= lg
		// branch is left on the exact native call it has always used, so desktop
		// scroll choreography is unchanged.
		const lenis = (
			window as unknown as { lenis?: { scrollTo: (target: number) => void } }
		).lenis;
		if (lenis && !window.matchMedia("(min-width: 1024px)").matches) {
			lenis.scrollTo(top);
			return;
		}
		window.scrollTo({ top, behavior: "smooth" });
	};

	const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
	const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

	const cur = items[active];
	const count = `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

	return (
		<section
			ref={wrapRef}
			className="relative bg-canvas text-ink"
			style={{ height: `${total * 85}vh` }}>
			{/* On mobile Safari `100vh` is the *large* viewport (URL bar hidden), so a
			    100vh pin overshoots what is actually visible: the thumbnail rail falls
			    below the fold and the pin releases before progress reaches 1. `100dvh`
			    tracks the visible viewport; the @supports gate keeps the 100vh fallback
			    for pre-dvh browsers. On desktop 100dvh === 100vh. */}
			<div className="sticky top-0 h-screen overflow-hidden supports-[height:100dvh]:h-[100dvh]">
				<Backdrop progress={scrollYProgress} />

				{/* top progress bar */}
				<motion.div
					style={{ scaleX: barScaleX }}
					className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-corporate-500 via-corporate-300 to-corporate-500"
				/>

				{/* eyebrow */}
				<div className="absolute inset-x-0 top-[7%] z-30 flex justify-center px-6">
					<span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-corporate-600">
						<span className="h-px w-7 bg-corporate-400/60" />
						How we help
						<span className="h-px w-7 bg-corporate-400/60" />
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
									animate={{ opacity: 0.07 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.6 }}
									className="pointer-events-none absolute select-none font-display font-black leading-none tracking-tightest text-ink"
									style={{ fontSize: "clamp(11rem, 28vw, 24rem)" }}>
									{String(active + 1).padStart(2, "0")}
								</motion.span>
							</AnimatePresence>

							{/* stone shadow */}
							<div className="pointer-events-none absolute bottom-3 h-16 w-[68%] rounded-[50%] bg-ink/25 blur-2xl" />

							{/* arch-framed image. The lower clamp bounds only ever bind below
							    lg (at >= 1024px, 44vw >= 450px and the lg: pair restores the
							    original clamps verbatim). 280px was wider than a 320px phone's
							    content box (100vw - 48px of gutter), and the 293px floor left
							    no room for the caption on a short viewport. */}
							<div className="relative h-[clamp(220px,52vh,440px)] w-[clamp(240px,44vw,760px)] lg:h-[clamp(293px,52vh,440px)] lg:w-[clamp(280px,44vw,760px)]">
								<AnimatePresence>
									<motion.div
										key={active}
										initial={{ opacity: 0, scale: 1.06, y: 16 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.98, y: -12 }}
										transition={{ duration: 0.8, ease: EASE }}
										className="absolute inset-0 overflow-hidden bg-canvas-silver shadow-[0_50px_120px_-40px_rgba(11,27,58,0.45)] ring-1 ring-ink/10"
										style={{ borderRadius: "46% 46% 18px 18px" }}>
										{/* The artwork is ~1.9:1 but the arch is portrait, so a cover
										    fit cropped most of every screenshot away. The image is now
										    contained (nothing cut) and the arch is filled by a blurred,
										    lightened copy of that same image, so the letterbox reads as
										    the picture's own colours rather than a dead panel.

										    `sizes` deliberately carries no `vw` token: next/image only
										    prunes the generated srcset when the string contains one,
										    and that pruning would drop the 384w candidate the browser
										    picks at >= lg (where `sizes` resolves to 336px either way). */}
										<Image
											src={cur.image}
											alt=""
											aria-hidden
											fill
											sizes="(min-width: 1024px) 336px, 360px"
											className="scale-110 object-cover blur-2xl saturate-125"
										/>
										<div className="absolute inset-0 bg-white/45" />
										<Image
											src={cur.image}
											alt=""
											fill
											sizes="(min-width: 1024px) 336px, 360px"
											priority={active === 0}
											className="object-contain"
										/>
										{/* overlay  brand tint, top sheen and a grounding scrim that
										    carries the caption card sitting over the lower edge */}
										<div className="pointer-events-none absolute inset-0 bg-corporate-500/10 mix-blend-multiply" />
										<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
										<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
										<div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/25" />
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
									className="rounded-3xl border border-steel-200 bg-white/80 p-6 text-center shadow-soft backdrop-blur-md lg:p-7">
									<div className="flex items-center justify-center gap-2.5 text-corporate-600">
										<span className="flex size-8 items-center justify-center rounded-lg bg-corporate-50 ring-1 ring-corporate-100">
											<Icon
												name={icon}
												className="size-4"
											/>
										</span>
										<span className="text-[11px] font-semibold uppercase tracking-[0.22em] tabular-nums">
											{count}
										</span>
									</div>
									<p className="mt-3 text-pretty text-[15px] leading-relaxed text-steel-600 lg:text-base">
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

				{/* Arched thumbnail rail. An industry ships 5-8 solutions, so the row is
				    600-730px of `shrink-0` thumbnails — it cannot fit a phone and was
				    simply being clipped by the pin's overflow, stranding the outer
				    thumbnails off-screen. Below lg it becomes a swipe strip; `pb-6`
				    keeps the arch `translateY` (up to +22px) inside the padding box so
				    `overflow-y: hidden` has nothing to clip. Every property is restored
				    at lg:, where the row fits and `overflow: visible` is back. */}
				<div
					ref={railRef}
					className="absolute inset-x-0 bottom-5 z-30 flex items-end justify-start gap-2.5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:bottom-7 lg:justify-center lg:gap-3.5 lg:overflow-visible lg:pb-0">
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
										"h-16 w-24 scale-105 shadow-soft ring-2 ring-corporate-500 lg:h-[74px] lg:w-28"
									:	"h-12 w-20 opacity-60 grayscale ring-steel-300 hover:opacity-100 hover:grayscale-0 lg:h-14 lg:w-24",
								)}>
								<Image
									src={it.image}
									alt=""
									fill
									sizes="112px"
									className="object-cover"
								/>
								{!on && <span className="absolute inset-0 bg-canvas/35" />}
							</button>
						);
					})}
				</div>

				{/* scroll hint */}
				<motion.div
					style={{ opacity: hintOpacity }}
					className="pointer-events-none absolute inset-x-0 bottom-[calc(2.5rem+90px)] z-20 hidden justify-center lg:flex">
					<span className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-steel-400">
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
			{/* aspect-[1000/560] restates the viewBox ratio the SVG already resolves its
			    auto height from — inert everywhere, but it stops Safari collapsing an
			    auto-height SVG to zero inside a stretch-aligned flex line. */}
			<svg
				viewBox="0 0 1000 560"
				className="aspect-[1000/560] w-[min(88vw,760px)] overflow-visible"
				aria-hidden>
				<defs>
					<path
						id={ARCH_ID}
						d="M40 560 L40 300 Q40 40 500 40 Q960 40 960 300 L960 560"
						fill="none"
					/>
				</defs>
				<text
					className="fill-ink font-display"
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
				"pointer-events-auto flex size-14 items-center justify-center rounded-full border border-steel-200 bg-white/80 text-ink shadow-soft backdrop-blur transition-all duration-300",
				disabled ?
					"cursor-not-allowed opacity-30"
				:	"hover:scale-105 hover:border-corporate-300 hover:bg-white hover:text-corporate-600",
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
			<div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_8%,#FFFFFF_0%,#F7F8FA_45%,#EDF0F4_100%)]" />
			<div className="absolute inset-0 bg-blueprint [background-size:46px_46px] opacity-60" />

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
						stopColor="#A7C9ED"
					/>
					<stop
						offset="0.5"
						stopColor="#1B6EC2"
					/>
					<stop
						offset="1"
						stopColor="#0F4C81"
					/>
				</linearGradient>
				<motion.path
					d="M517,1080c246-232.9,804.3-242.7,752-429.1-27.9-99.7-412.5-154.2-649-29.3-228.9,120.8-467.4,88.3-462,49.5,15.1-108.4,394,337.4,527,133.9C924.6,438.3,14,694.9,250,0"
					fill="none"
					stroke="url(#sol-path-grad)"
					strokeWidth="1"
					vectorEffect="non-scaling-stroke"
					style={{ pathLength: pathDraw, opacity: 0.35 }}
				/>
			</svg>

			<motion.div
				style={{ y: glowY, x: glowX }}
				className="absolute left-1/2 top-1/2 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-400/20 blur-[150px]"
			/>
			<div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(203,213,225,0.55)_100%)]" />
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
		<section className="relative overflow-hidden bg-canvas py-20 text-ink lg:py-28">
			<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:46px_46px] opacity-60" />
			<div className="pointer-events-none absolute left-1/2 top-0 size-[560px] -translate-x-1/2 rounded-full bg-corporate-400/15 blur-3xl" />
			<div className="container-x relative">
				<div className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-corporate-600">
						<span className="h-px w-7 bg-corporate-400/60" /> How we help
					</span>
					<h2 className="mt-4 font-display text-3xl font-bold tracking-tightest sm:text-4xl">
						{title}
					</h2>
				</div>
				<div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((it, i) => (
						<article
							key={i}
							className="group overflow-hidden rounded-3xl border border-steel-200 bg-white shadow-soft">
							{/* Contained, so the whole screenshot is visible; the blurred copy
							    behind it fills the frame in the image's own colours. */}
							<div className="relative aspect-[16/10] w-full overflow-hidden bg-canvas-silver">
								<Image
									src={it.image}
									alt=""
									aria-hidden
									fill
									sizes="(min-width:1024px) 33vw, 100vw"
									className="scale-110 object-cover blur-2xl saturate-125"
								/>
								<div className="absolute inset-0 bg-white/45" />
								<Image
									src={it.image}
									alt=""
									fill
									sizes="(min-width:1024px) 33vw, 100vw"
									className="object-contain transition duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
								<span className="absolute left-4 top-4 flex size-9 items-center justify-center rounded-lg bg-white/90 text-corporate-600 ring-1 ring-steel-200">
									<Icon
										name={icon}
										className="size-4"
									/>
								</span>
								<span className="absolute bottom-2 left-4 font-display text-4xl font-black tracking-tightest text-white">
									{String(i + 1).padStart(2, "0")}
								</span>
							</div>
							<div className="p-6">
								<h3 className="font-display text-lg font-semibold leading-snug text-ink">
									{it.label}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-steel-600">
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
