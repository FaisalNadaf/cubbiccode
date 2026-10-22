/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
	motion,
	useScroll,
	useSpring,
	useTransform,
	useMotionValueEvent,
	type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ZoomImage = {
	src: string;
	alt: string;
	name?: string;
	href?: string;
};

/**
 * Every shot in /images/portfolio is a landscape website capture, ~1.88:1.
 * Tiles therefore take a width and inherit this ratio, never an explicit height.
 * Sizing them `vw × vh` made a tile's shape a function of the *viewport's*
 * shape, so on a tall window they turned portrait and `object-cover` sliced each
 * screenshot down to an unreadable vertical strip.
 */
const SHOT_RATIO = "15 / 8"; // 1.875

/**
 * Scatter layout for the 7 zoom tiles, offset from the viewport centre.
 *
 * Each width is `min(<vw>, <vh>)`. The `vw` term sizes the tile on ordinary
 * screens; the `vh` term caps how tall it may get, because a width-driven tile
 * with a fixed ratio grows in *viewport heights* as the window widens — on a
 * 21:9 monitor the uncapped tiles collided with each other. The vh cap is the
 * tile's target height × 1.875, so it bounds the height directly.
 *
 * Only the centre tile carries an explicit `h`: it is deliberately
 * viewport-shaped (25vw × 25vh) so that at its 4× scale it lands exactly
 * full-screen and hands off to the carousel.
 */
const LAYOUT: { w: string; h?: string; top?: string; left?: string }[] = [
	{ w: "25vw", h: "25vh" }, // centre  zooms to fill, hands off to the carousel
	{ w: "min(30vw, 48.75vh)", top: "-31vh", left: "7vw" }, // ≤ 26vh tall
	{ w: "min(23vw, 39.4vh)", top: "-4vh", left: "-31vw" }, // ≤ 21vh
	{ w: "min(25vw, 41.25vh)", top: "1vh", left: "31vw" }, // ≤ 22vh
	{ w: "min(22vw, 37.5vh)", top: "29vh", left: "8vw" }, // ≤ 20vh
	{ w: "min(27vw, 45vh)", top: "28vh", left: "-25vw" }, // ≤ 24vh
	{ w: "min(15vw, 26.25vh)", top: "26vh", left: "31vw" }, // ≤ 14vh
];

/**
 * How many slides either side of the active one stay mounted.
 *
 * This is the whole reason the carousel scales. Every slide is two full-viewport
 * images — a sharp `object-contain` shot and a blurred backdrop — each of which
 * the compositor promotes to its own layer and keeps a decoded bitmap for. Mount
 * all of them and the cost is linear in the number of projects: at 27 slides it
 * measured 64 images, 90 promoted layers and ~114MB of decoded bitmaps, and the
 * GPU simply ran out of budget. It then evicted and re-rastered tiles on every
 * frame — which is what the flicker was — and dragged frames out to ~90ms, which
 * is what made the page feel dead. Adding projects made it strictly worse, so
 * this would have broken again on the next launch.
 *
 * A cross-fade only ever needs the slide you are on and the one you are heading
 * for: `opacityStops` leaves a slide fully transparent beyond ±0.68 of a
 * segment. One neighbour is therefore enough to be *correct*; the second is
 * lead time, so the next shot is decoded before it has to be shown and no slide
 * ever fades up from blank.
 */
const WINDOW = 2;

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
export function 	ZoomParallax({
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
			{/* `h-screen-dvh` (not `h-screen`): on mobile Safari `100vh` is the *large*
			    viewport, so the pane hangs behind the address bar and the carousel's
			    bottom controls sit off-screen. `100dvh` === `100vh` on desktop. */}
			<div className="sticky top-0 h-screen-dvh w-full overflow-clip bg-ink">
				{/* ── Base layer: full-screen carousel (hidden until the hand-off) ── */}
				<motion.div
					style={{ opacity: carouselOpacity }}
					className="absolute inset-0">
					{images.map((img, i) =>
						Math.abs(i - active) <= WINDOW ?
							<CarouselSlide
								key={i}
								img={img}
								i={i}
								total={N}
								cp={cp}
							/>
						:	null,
					)}
				</motion.div>

				{/* ── Zoom scatter layer (fades out at the hand-off) ──
				    Dropped from the tree once the carousel is properly under way. The
				    seven tiles are full-size images on their own promoted layers, and
				    they were being carried — decoded, composited, transformed — through
				    the entire carousel, long after `zoomOpacity` had taken them to 0.
				    The gate is `active`, not opacity: it only unmounts from the second
				    slide on, so scrubbing back to the hand-off finds the tiles already
				    there, and they are still invisible for the whole of slide 1 anyway. */}
				{active < 1 ?
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
									// Height only for the viewport-shaped centre tile; the rest
									// take the screenshots' own landscape ratio, so `object-cover`
									// has essentially nothing left to crop.
									...(LAYOUT[i].h ?
										{ height: LAYOUT[i].h }
									:	{ aspectRatio: SHOT_RATIO }),
									top: LAYOUT[i].top,
									left: LAYOUT[i].left,
								}}>
								<Image
									src={img.src}
									alt={img.alt}
									fill
									sizes="60vw"
									priority={i === 0}
									// Top-aligned: whatever little a tile does trim should come
									// off the footer, never the site's header and hero.
									className="object-cover object-top"
								/>
							</div>
						</motion.div>
					))}
				</motion.div>
				:	null}

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
					{/* `truncate` clips to the line box, so the line box has to be tall
					    enough for the serif's ascenders and descenders (g, y, B) — the
					    text-* default `leading-none` sliced them off. */}
					<span className="absolute left-6 top-14 max-w-[70vw] truncate px-1 py-2 font-serif text-3xl !leading-[1.3] text-white sm:left-10 sm:top-[4.5rem] sm:text-4xl lg:left-14 lg:text-5xl">
						{current?.name}
					</span>

					{/* Visit website  bottom centre */}
					{/* Below 768 the centred button and the bottom-right counter + arrows
					    are wide enough to collide, so the button rides above them. It is
					    back on the shared bottom line from `md:` up — desktop is untouched. */}
					{current?.href ?
						<a
							href={current.href}
							target="_blank"
							rel="noopener noreferrer"
							className="pointer-events-auto group absolute bottom-[calc(7.5rem_+_env(safe-area-inset-bottom))] left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lift transition-transform hover:-translate-y-0.5 max-md:bottom-[calc(11.5rem_+_env(safe-area-inset-bottom))]">
							Visit website
							<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</a>
					:	null}

					{/* Project switcher  small circular thumbnails. Scroll drives `active`
					    and click calls `jumpTo`, so the two stay in sync both ways. */}
					<ProjectDots
						images={images}
						active={active}
						onSelect={jumpTo}
					/>
					</motion.div>
			</div>
		</div>
	);
}

function ProjectDots({
	images,
	active,
	onSelect,
}: {
	images: ZoomImage[];
	active: number;
	onSelect: (i: number) => void;
}) {
	const trackRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
	const [dragging, setDragging] = useState(false);

	// Keep the active circle centred in the strip. Scrolls the strip itself —
	// scrollIntoView would also scroll the page and fight the scrub.
	useEffect(() => {
		const track = trackRef.current;
		const el = itemRefs.current[active];
		if (!track || !el || drag.current.down) return;
		track.scrollTo({
			left: el.offsetLeft - track.clientWidth / 2 + el.offsetWidth / 2,
			behavior: "smooth",
		});
	}, [active]);

	// Mouse drag-to-scroll. Touch already pans natively (`touch-action: pan-x`).
	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.pointerType !== "mouse" || e.button !== 0) return;
		const track = trackRef.current;
		if (!track) return;
		drag.current = { down: true, moved: false, x: e.clientX, left: track.scrollLeft };
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const d = drag.current;
		const track = trackRef.current;
		if (!d.down || !track) return;
		const dx = e.clientX - d.x;
		if (!d.moved && Math.abs(dx) > 5) {
			d.moved = true;
			setDragging(true);
			track.setPointerCapture(e.pointerId);
		}
		if (d.moved) track.scrollLeft = d.left - dx;
	};
	const endDrag = () => {
		if (!drag.current.down) return;
		drag.current.down = false;
		setDragging(false);
		// `moved` stays set until the click that follows the release has been
		// swallowed, then resets.
		setTimeout(() => {
			drag.current.moved = false;
		}, 0);
	};

	return (
		<div className="pointer-events-auto absolute bottom-0 left-1/2 w-[min(97vw,1120px)] -translate-x-1/2 rounded-t-[2.5rem] border border-b-0 border-white/20 bg-ink/60 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
			<div
				ref={trackRef}
				data-lenis-prevent
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onClickCapture={(e) => {
					if (drag.current.moved) {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
				className={cn(
					"flex select-none items-center gap-3 overflow-x-auto px-[max(1rem,calc(50%_-_1.5rem))] py-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]",
					dragging ? "cursor-grabbing" : "cursor-grab",
				)}>
				{images.map((img, i) => {
					const on = i === active;
					return (
						<button
							key={i}
							ref={(el) => {
								itemRefs.current[i] = el;
							}}
							type="button"
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => onSelect(i)}
							aria-label={`Show ${img.name ?? `project ${i + 1}`}`}
							aria-current={on}
							className={cn(
								"shrink-0 rounded-full p-[2.5px] transition-all duration-300",
								on ?
									"scale-110 bg-gradient-to-tr from-corporate-400 via-fuchsia-400 to-amber-300 shadow-[0_0_16px_rgba(232,121,249,0.55)]"
								:	"bg-white/25 opacity-75 hover:scale-105 hover:opacity-100",
							)}>
							<span className="relative block size-11 overflow-hidden rounded-full bg-ink sm:size-12">
								<Image
									src={img.src}
									alt=""
									fill
									sizes="48px"
									draggable={false}
									className="object-cover object-top"
								/>
							</span>
						</button>
					);
				})}
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
			{/* Blurred cover fill  keeps the frame immersive behind the full shot.
			    `sizes` is deliberately tiny: this layer is under a 40px blur, a 1.1
			    upscale and a 60% ink wash, so a ~300px source is indistinguishable
			    from a 2560px one — and asking for the full-width candidate meant
			    fetching and decoding a second copy of every screenshot at full size,
			    purely to throw the detail away. */}
			<motion.div
				style={{ scale: bgScale }}
				className="absolute inset-0 [will-change:transform]">
				<Image
					src={img.src}
					alt=""
					aria-hidden
					fill
					sizes="20vw"
					className="scale-110 object-cover blur-2xl"
				/>
				<div className="absolute inset-0 bg-ink/60" />
			</motion.div>

			{/* The full website screenshot  always shown in its entirety, never cropped */}
			<motion.div
				style={{ scale: shotScale }}
				className="absolute inset-0 flex items-center justify-center px-2 pb-[13rem] pt-[4.5rem] [will-change:transform] sm:px-4 sm:pt-[5.25rem] md:pb-[9rem] lg:px-[2vw]">
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
