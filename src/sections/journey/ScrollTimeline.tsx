/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
	motion,
	useScroll,
	useTransform,
	useMotionValueEvent,
	useReducedMotion,
} from "framer-motion";
import { Play } from "lucide-react";
import type { Milestone } from "@/content/company";
import { cn } from "@/lib/utils";

const FALLBACK = "/images/Moments/1759160316850.jpg";

/** How far the snake bulges left/right of centre (px). Kept under the 150px
 *  clear channel the cards leave down the middle (`lg:pr/pl-[150px]` below). */
const AMP = 128;

/**
 * Builds an S-curve that threads through every node (centre-x, y), bulging to
 * alternating sides between them — a smooth "snake" like the Positron timeline,
 * but drawn through the *measured* card centres so it stays glued to them no
 * matter how tall the cards grow.
 *
 * Each node gets ONE vertical tangent handle, shared by the two segments that
 * meet there, so the curve leaves and enters the node at the same angle — no
 * kink where cards of different height meet. That shared handle is what makes
 * the whole run C1-continuous, i.e. genuinely smooth rather than a chain of
 * separate bumps.
 */
function buildSnake(cx: number, ys: number[], amp: number) {
	const n = ys.length;
	if (n === 0) return "";
	if (n === 1) return `M ${cx} ${ys[0]}`;

	const seg = (i: number) => ys[i + 1] - ys[i];
	const handle = ys.map((_, i) => {
		if (i === 0) return seg(0) * 0.5;
		if (i === n - 1) return seg(n - 2) * 0.5;
		// half of the *shorter* neighbour keeps the handle inside both segments
		return Math.min(seg(i - 1), seg(i)) * 0.5;
	});

	let d = `M ${cx} ${ys[0]}`;
	for (let i = 1; i < n; i++) {
		const bx = cx + (i % 2 === 1 ? amp : -amp); // bulge side alternates each segment
		d += ` C ${bx} ${ys[i - 1] + handle[i - 1]}, ${bx} ${ys[i] - handle[i]}, ${cx} ${ys[i]}`;
	}
	return d;
}

/**
 * SCROLL TIMELINE — a scroll-drawn "snake" of the company journey.
 *
 * A corporate-blue S-curve runs down the centre and *fills in* as you scroll
 * (SVG `pathLength`, exactly the reference technique); each milestone's node
 * lights the instant the fill reaches it. Image cards alternate left / right off
 * the curve. Because the snake is drawn through the cards' *measured* centres,
 * it never drifts as content reflows. On narrow screens the curve gives way to a
 * clean straight rail down the left with the cards stacked beside it, and under
 * `prefers-reduced-motion` everything renders finished — snake full, nodes lit.
 */
export function ScrollTimeline({ items }: { items: Milestone[] }) {
	const reduce = useReducedMotion();
	const trackRef = useRef<HTMLDivElement>(null);
	const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Geometry of the node column, measured from the laid-out cards.
	const [geo, setGeo] = useState<{ w: number; h: number; ys: number[] }>({
		w: 0,
		h: 0,
		ys: [],
	});
	const [lit, setLit] = useState(0); // how many nodes the fill has passed

	const { scrollYProgress } = useScroll({
		target: trackRef,
		offset: ["start center", "end center"],
	});
	const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
	const railScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

	// Measure each card's vertical centre (and the column box) so the snake can be
	// drawn through them. Re-runs on any reflow — resize, breakpoint flip, fonts.
	useEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const measure = () => {
			const top = el.getBoundingClientRect().top;
			const ys = rowRefs.current.map((r) =>
				r ? r.getBoundingClientRect().top - top + r.offsetHeight / 2 : 0,
			);
			const h = el.offsetHeight;
			setGeo({ w: el.offsetWidth, h, ys });
			setLit(ys.filter((y) => h > 0 && y / h <= scrollYProgress.get()).length);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, [items.length, scrollYProgress]);

	// Light nodes as the fill head (pinned to the reading line) passes each centre.
	useMotionValueEvent(scrollYProgress, "change", (v) => {
		if (!geo.h) return;
		setLit(geo.ys.filter((y) => y / geo.h <= v + 0.001).length);
	});

	const litCount = reduce ? items.length : lit;
	const cx = geo.w / 2;
	const snake = buildSnake(cx, geo.ys, AMP);
	const drawSnake = geo.w > 0 && geo.ys.length === items.length;

	return (
		<section className="relative overflow-hidden bg-canvas py-20 md:py-24 lg:py-28">
			{/* faint blueprint texture, fading in and out at the edges */}
			<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:46px_46px] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)]" />
			<div className="pointer-events-none absolute left-1/2 top-24 size-[560px] -translate-x-1/2 rounded-full bg-corporate-500/[0.06] blur-3xl" />

			<div className="container-x relative">
				{/* header */}
				{/* <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-24">
					<p className="text-sm font-semibold uppercase tracking-kicker text-corporate-600">
						2016 — Today
					</p>
					<h2 className="mt-4 font-display text-3xl font-bold tracking-tightest text-ink sm:text-4xl lg:text-[2.75rem]">
						Milestones that shaped Cubiccode
					</h2>
					<p className="mt-4 leading-relaxed text-steel-600">
						Scroll through the moments — the awards, the launches and the
						people — that took us from a single Belagavi room to teams across
						Karnataka.
					</p>
				</div> */}

				{/* timeline */}
				<div
					ref={trackRef}
					className="relative mx-auto max-w-6xl">
					{/* DESKTOP: the scroll-drawn snake, threaded through card centres */}
					{drawSnake && (
						<svg
							aria-hidden
							width={geo.w}
							height={geo.h}
							viewBox={`0 0 ${geo.w} ${geo.h}`}
							fill="none"
							className="pointer-events-none absolute left-0 top-0 z-0 hidden lg:block">
							<defs>
								<linearGradient
									id="ct-snake"
									x1="0"
									y1="0"
									x2="0"
									y2="1">
									<stop
										offset="0"
										stopColor="#3F86D0"
									/>
									<stop
										offset="1"
										stopColor="#155BA3"
									/>
								</linearGradient>
							</defs>
							{/* unfilled track */}
							<path
								d={snake}
								stroke="#E1E7EF"
								strokeWidth="9"
								strokeLinecap="round"
							/>
							{/* fill that draws in on scroll */}
							<motion.path
								d={snake}
								stroke="url(#ct-snake)"
								strokeWidth="9"
								strokeLinecap="round"
								initial={{ pathLength: reduce ? 1 : 0 }}
								style={{ pathLength: reduce ? 1 : pathLength }}
							/>
						</svg>
					)}

					{/* MOBILE: straight rail down the left, faded at both ends */}
					<div className="absolute inset-y-0 left-[27px] z-0 w-0.5 lg:hidden [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_4%,#000_96%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_4%,#000_96%,transparent)]">
						<div className="absolute inset-0 bg-steel-200" />
						<motion.div
							style={{ scaleY: reduce ? 1 : railScaleY }}
							className="absolute inset-0 origin-top bg-gradient-to-b from-corporate-400 to-corporate-600 [will-change:transform]"
						/>
					</div>

					{/* rows */}
					<div className="relative z-10">
						{items.map((m, i) => {
							const isLeft = i % 2 === 0;
							const side = isLeft ? -1 : 1;
							return (
								<div
									key={m.year}
									ref={(el) => {
										rowRefs.current[i] = el;
									}}
									className="relative py-7 lg:py-10">
									{/* connector — a line linking the dot to its card. Emerges from
									    under the bead and runs to the card's inner edge. */}
									<span
										className={cn(
											"pointer-events-none absolute top-1/2 z-0 h-[3px] -translate-y-1/2 rounded-full transition-colors duration-500",
											"left-[27px] w-9", // mobile: rail → card
											isLeft ?
												"lg:left-auto lg:right-1/2 lg:w-[150px]"
											:	"lg:left-1/2 lg:w-[150px]",
											i < litCount ? "bg-corporate-400" : "bg-steel-200",
										)}
									/>

									{/* node — a bead the snake threads through */}
									<span className="absolute left-[27px] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-1/2">
										<span className="grid size-7 place-items-center rounded-full bg-white shadow-sm ring-1 ring-steel-200">
											<span
												className={cn(
													"rounded-full transition-all duration-500",
													i < litCount ?
														"size-4 bg-corporate-500 shadow-[0_0_10px_2px_rgba(27,110,194,0.55)]"
													:	"size-3 bg-steel-300",
												)}
											/>
										</span>
									</span>

									{/* card */}
									<div className="pl-16 pr-6 lg:grid lg:grid-cols-2 lg:px-0">
										<div
											className={cn(
												"lg:flex",
												isLeft ?
													"lg:col-start-1 lg:justify-end lg:pr-[150px]"
												:	"lg:col-start-2 lg:justify-start lg:pl-[150px]",
											)}>
											<motion.article
												initial={
													reduce ? false : (
														{ opacity: 0, x: side * 60, y: 20 }
													)
												}
												whileInView={{ opacity: 1, x: 0, y: 0 }}
												viewport={{ once: true, amount: 0.3 }}
												transition={{
													duration: 0.7,
													ease: [0.22, 1, 0.36, 1],
												}}
												whileHover={reduce ? undefined : { y: -6 }}
												className="group relative w-full lg:max-w-[380px]">
												{/* content body — the image reserves room on the outer side. Left
												    and right padding are set per-side so a `lg:` shorthand can't
												    collapse the space the floating image needs. */}
												<div
													className={cn(
														"relative rounded-3xl border border-steel-200 bg-white shadow-card transition-shadow duration-300 group-hover:shadow-lift",
														"py-6 lg:py-7",
														isLeft ?
															"pl-6 pr-[104px] lg:pl-[80px] lg:pr-7"
														:	"pl-6 pr-[104px] lg:pl-7 lg:pr-[80px]",
													)}>
													<p className="font-display text-sm font-bold tracking-wide text-corporate-600">
														{m.year}
													</p>
													<h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-ink lg:text-xl">
														{m.title}
													</h3>
													<p className="mt-2.5 text-sm leading-relaxed text-steel-600">
														{m.text}
													</p>
												</div>

												{/* small image, floating over the outer edge */}
												<CardMedia
													m={m}
													isLeft={isLeft}
													reduce={reduce}
												/>
											</motion.article>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ── Card media: photo, whole document, or click-to-play footage ─────────── */

function CardMedia({
	m,
	isLeft,
	reduce,
}: {
	m: Milestone;
	isLeft: boolean;
	reduce: boolean | null;
}) {
	const [playing, setPlaying] = useState(false);
	const src = m.image ?? FALLBACK;

	return (
		<div
			className={cn(
				"absolute top-1/2 z-10 aspect-square w-32 -translate-y-1/2 overflow-hidden rounded-2xl bg-steel-100 shadow-lift ring-1 ring-black/5 lg:w-40",
				"right-0 translate-x-[28%] lg:translate-x-[60%]", // mobile modest, desktop 60% outside
				isLeft && "lg:left-0 lg:right-auto lg:-translate-x-[60%]", // desktop-left: float left
			)}>
			<Image
				src={src}
				alt={m.title}
				fill
				sizes="(min-width: 1024px) 160px, 128px"
				className={cn(
					"object-cover",
					!reduce &&
						"transition-transform duration-700 ease-out group-hover:scale-105",
				)}
			/>

			{/* footage: the still is the poster, the embed loads only on click */}
			{m.youtubeId && !playing && (
				<button
					type="button"
					onClick={() => setPlaying(true)}
					aria-label={`Play video: ${m.title}`}
					className="absolute inset-0 grid place-items-center bg-ink/10 transition-colors hover:bg-ink/20">
					<span className="grid size-9 place-items-center rounded-full bg-white/90 text-corporate-600 shadow-lg ring-1 ring-black/5">
						<Play className="ml-0.5 size-4 fill-current" />
					</span>
				</button>
			)}
			{m.youtubeId && playing && (
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
					title={m.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
					className="absolute inset-0 size-full border-0"
				/>
			)}
		</div>
	);
}
