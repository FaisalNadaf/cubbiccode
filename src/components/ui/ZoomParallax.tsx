/** @format */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
	motion,
	useScroll,
	useSpring,
	useTransform,
	useMotionValueEvent,
	type MotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ZoomImage = {
	src: string;
	alt: string;
	name?: string;
	href?: string;
};

/** Scatter layout for the 7 zoom tiles (vw/vh, relative to the viewport centre). */
const LAYOUT: { w: string; h: string; top?: string; left?: string }[] = [
	{ w: "25vw", h: "25vh" }, // centre  zooms to fill, hands off to the carousel
	{ w: "35vw", h: "30vh", top: "-30vh", left: "5vw" },
	{ w: "20vw", h: "45vh", top: "-10vh", left: "-25vw" },
	{ w: "25vw", h: "25vh", left: "27.5vw" },
	{ w: "20vw", h: "25vh", top: "27.5vh", left: "5vw" },
	{ w: "30vw", h: "25vh", top: "27.5vh", left: "-22.5vw" },
	{ w: "15vw", h: "15vh", top: "22.5vh", left: "25vw" },
];

/** Cross-fade keyframes for carousel slide `i`, clean first/last endpoints. */
function opacityStops(i: number, total: number) {
	const seg = 1 / total;
	const c = (i + 0.5) * seg;
	const fade = seg * 0.34;
	let input = [c - 2 * fade, c - fade, c + fade, c + 2 * fade];
	let output = [0, 1, 1, 0];
	if (i === 0) {
		input = [-1, 0, c + fade, c + 2 * fade];
		output = [1, 1, 1, 0];
	}
	if (i === total - 1) {
		input = [c - 2 * fade, c - fade, 1, 2];
		output = [0, 1, 1, 1];
	}
	return { input, output, seg, c };
}

/**
 * Two-phase scroll experience:
 *  1. ZOOM PARALLAX  scattered tiles scale up until the centre tile fills the
 *     screen.
 *  2. CAROUSEL  at the hand-off the scatter fades to a full-screen carousel of
 *     the same images that continues on scroll: each slide Ken-Burns-zooms and
 *     cross-fades, with centre prev/next buttons, a place name + counter, and an
 *     optional "Visit website" button. Spring-smoothed throughout.
 */
export function ZoomParallax({
	images,
	caption,
}: {
	images: ZoomImage[];
	caption?: string;
}) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const N = images.length;
	// Fraction of scroll where the zoom completes and the carousel takes over.
	const Z = 1.6 / (N + 1.6);

	const [active, setActive] = useState(0);
	const [inCarousel, setInCarousel] = useState(false);

	const { scrollYProgress } = useScroll({
		target: wrapRef,
		offset: ["start start", "end end"],
	});
	const progress = useSpring(scrollYProgress, {
		stiffness: 90,
		damping: 30,
		restDelta: 0.0005,
	});

	useMotionValueEvent(progress, "change", (v) => {
		if (v < Z) {
			setInCarousel(false);
			setActive(0);
			return;
		}
		setInCarousel(true);
		const cpv = (v - Z) / (1 - Z);
		setActive(Math.max(0, Math.min(N - 1, Math.round(cpv * N - 0.5))));
	});

	// Zoom-phase scales  reach their max exactly at the hand-off point Z.
	const s4 = useTransform(progress, [0, Z], [1, 4]);
	const s5 = useTransform(progress, [0, Z], [1, 5]);
	const s6 = useTransform(progress, [0, Z], [1, 6]);
	const s8 = useTransform(progress, [0, Z], [1, 8]);
	const s9 = useTransform(progress, [0, Z], [1, 9]);
	const scales = [s4, s5, s6, s5, s6, s8, s9];

	const zoomOpacity = useTransform(progress, [Z - 0.04, Z + 0.01], [1, 0]);
	const carouselOpacity = useTransform(progress, [Z - 0.03, Z + 0.02], [0, 1]);
	const uiOpacity = useTransform(progress, [Z - 0.02, Z + 0.03], [0, 1]);

	// Carousel progress (0..1 across the images).
	const cp = useTransform(progress, [Z, 1], [0, 1]);

	const tiles = Array.from({ length: LAYOUT.length }, (_, i) => images[i % N]);

	const jumpTo = (i: number) => {
		const el = wrapRef.current;
		if (!el) return;
		const clamped = Math.max(0, Math.min(N - 1, i));
		const top = el.getBoundingClientRect().top + window.scrollY;
		const travel = el.offsetHeight - window.innerHeight;
		const target = Z + ((clamped + 0.5) / N) * (1 - Z);
		window.scrollTo({ top: top + target * travel, behavior: "smooth" });
	};

	const current = images[active];

	return (
		<div
			ref={wrapRef}
			className="relative"
			style={{ height: `${N * 100 + 160}vh` }}>
			<div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
				{/* ── Base layer: full-screen carousel (hidden until the hand-off) ── */}
				<motion.div
					style={{ opacity: carouselOpacity }}
					className="absolute inset-0">
					{images.map((img, i) => (
						<CarouselSlide
							key={i}
							img={img}
							i={i}
							total={N}
							cp={cp}
						/>
					))}
				</motion.div>

				{/* ── Zoom scatter layer (fades out at the hand-off) ── */}
				<motion.div
					style={{ opacity: zoomOpacity }}
					className="pointer-events-none absolute inset-0 z-10">
					{tiles.map((img, i) => (
						<motion.div
							key={i}
							style={{ scale: scales[i] }}
							className="absolute top-0 flex h-full w-full items-center justify-center [will-change:transform]">
							<div
								className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
								style={{
									width: LAYOUT[i].w,
									height: LAYOUT[i].h,
									top: LAYOUT[i].top,
									left: LAYOUT[i].left,
								}}>
								<Image
									src={img.src}
									alt={img.alt}
									fill
									sizes="60vw"
									priority={i === 0}
									className="object-cover"
								/>
							</div>
						</motion.div>
					))}
				</motion.div>

				{/* Legibility wash */}
				<div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />

				{/* Caption */}
				{caption ?
					<span className="pointer-events-none absolute inset-x-0 top-8 z-30 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
						{caption}
					</span>
				:	null}

				{/* ── Carousel controls (fade in after the hand-off) ── */}
				<motion.div
					style={{ opacity: uiOpacity }}
					className={cn(
						"absolute inset-0 z-30",
						inCarousel ? "" : "pointer-events-none",
					)}>
					{/* Name  top left */}
					<span className="absolute left-6 top-16 max-w-[70vw] truncate font-serif text-3xl text-white sm:left-10 sm:top-20 sm:text-4xl lg:left-14 lg:text-5xl">
						{current?.name}
					</span>

					{/* Visit website  bottom centre */}
					{current?.href ?
						<a
							href={current.href}
							target="_blank"
							rel="noopener noreferrer"
							className="pointer-events-auto group absolute bottom-9 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lift transition-transform hover:-translate-y-0.5">
							Visit website
							<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</a>
					:	null}

					{/* Counter + prev/next  bottom right */}
					<div className="absolute bottom-9 right-6 flex items-center gap-5 sm:right-10 lg:right-14">
						<span className="font-display text-xl tabular-nums text-white/80 sm:text-2xl">
							{String(active + 1).padStart(2, "0")}
							<span className="text-white/40">
								{" "}
								/ {String(N).padStart(2, "0")}
							</span>
						</span>
						<div className="pointer-events-auto flex items-center gap-3">
							<button
								type="button"
								onClick={() => jumpTo(active - 1)}
								disabled={active === 0}
								aria-label="Previous"
								className="flex size-14 items-center justify-center rounded-full bg-ink/60 text-white ring-1 ring-white/25 backdrop-blur transition-all hover:bg-white hover:text-ink disabled:opacity-30 disabled:hover:bg-ink/60 disabled:hover:text-white">
								<ArrowLeft className="size-5" />
							</button>
							<button
								type="button"
								onClick={() => jumpTo(active + 1)}
								disabled={active === N - 1}
								aria-label="Next"
								className="flex size-14 items-center justify-center rounded-full bg-ink/60 text-white ring-1 ring-white/25 backdrop-blur transition-all hover:bg-white hover:text-ink disabled:opacity-30 disabled:hover:bg-ink/60 disabled:hover:text-white">
								<ArrowRight className="size-5" />
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

function CarouselSlide({
	img,
	i,
	total,
	cp,
}: {
	img: ZoomImage;
	i: number;
	total: number;
	cp: MotionValue<number>;
}) {
	const { input, output, seg, c } = opacityStops(i, total);
	const opacity = useTransform(cp, input, output);
	// Blurred backdrop zooms (Ken-Burns); the sharp shot stays ≤ 1 so it's never cropped.
	const bgScale = useTransform(cp, [c - seg, c, c + seg], [1.14, 1, 1.05]);
	const shotScale = useTransform(cp, [c - seg, c, c + seg], [0.94, 1, 0.97]);

	return (
		<motion.div
			style={{ opacity }}
			className="pointer-events-none absolute inset-0 [will-change:opacity]">
			{/* Blurred cover fill  keeps the frame immersive behind the full shot */}
			<motion.div
				style={{ scale: bgScale }}
				className="absolute inset-0 [will-change:transform]">
				<Image
					src={img.src}
					alt=""
					aria-hidden
					fill
					sizes="100vw"
					className="scale-110 object-cover blur-2xl"
				/>
				<div className="absolute inset-0 bg-ink/60" />
			</motion.div>

			{/* The full website screenshot  always shown in its entirety, never cropped */}
			<motion.div
				style={{ scale: shotScale }}
				className="absolute inset-0 flex items-center justify-center p-4 [will-change:transform] sm:p-8 lg:p-12">
				<div className="relative h-full w-full">
					<Image
						src={img.src}
						alt={img.alt}
						fill
						sizes="100vw"
						className="object-contain"
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}
