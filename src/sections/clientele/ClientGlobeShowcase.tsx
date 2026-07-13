/** @format */

"use client";

/**
 * CLIENT GLOBE SHOWCASE (light theme)
 * ────────────────────────────────────────────────────────────────────────────
 * On load: a big cobe globe fades/zooms in and rotates, with client logos
 * pinned to its surface (they hide around the back like real pins). On scroll
 * the globe spins; near the end the pinned logos stream off the globe and,
 * right below, the full MagicBento grid (every logo) assembles into place
 * reading as "the logos leave the globe and form the grid". Row 5 of the grid
 * is a band of big, full-colour highlight logos.
 *
 * Mobile / reduced-motion → the MagicBento grid only (no heavy 3D).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	type MotionValue,
} from "framer-motion";
import { GlobeWeather } from "@/components/ui/cobe-globe-weather";
import MagicBento from "@/components/customComponent/MagicBento";
import { featuredClients } from "@/content/clients";

export type Logo = { src: string; alt: string };

const FLYER = 64; // px  a pinned logo chip
const GLOBE_SPEED = 0.0045; // globe auto-spin per frame  shared with the pinned logos
const AUTO_DIR = -1; // sign of the pins' auto-spin  flip to +1 if they rotate against the globe

/** Scroll length of the pinned globe scene. 100vh of it is the pin itself. */
const SCENE_VH = 250;

/**
 * Choreography, as fractions of the globe scene's scroll progress. Every value
 * below is read through `useTransform`, so the whole sequence is *scrubbed*:
 * scrolling back up runs it in reverse for free, with no state to unwind.
 *
 *   0 ─────────── .40 ──── .58 ─ .62 ──── .66 ─── .92 ─── 1
 *   spin          logos leave │   globe fades      │
 *                             grid slides up ──────────────►
 */
const LOGOS_EXIT: [number, number] = [0.4, 0.66];
const GLOBE_OUT: [number, number] = [0.62, 0.92];
const GRID_IN: [number, number] = [0.58, 1];

/** Fixed set of logos pinned to the globe  the featured brands from clients.ts. */
const FEATURED_LOGOS: Logo[] = featuredClients.map((c) => ({
	src: c.logo,
	alt: c.name,
}));

/* ── math ─────────────────────────────────────────────────────────────── */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smoothstep = (e0: number, e1: number, x: number) => {
	const t = clamp((x - e0) / (e1 - e0), 0, 1);
	return t * t * (3 - 2 * t);
};

/** Even scatter of unit vectors on a sphere (Fibonacci). */
function fibonacciSphere(n: number): [number, number, number][] {
	const pts: [number, number, number][] = [];
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let i = 0; i < n; i++) {
		const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
		const r = Math.sqrt(Math.max(0, 1 - y * y));
		const theta = golden * i;
		pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
	}
	return pts;
}

/* ── public component ─────────────────────────────────────────────────── */

export function ClientGlobeShowcase({ logos }: { logos: Logo[] }) {
	const reduce = useReducedMotion();
	const [enhanced, setEnhanced] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const update = () => setEnhanced(mq.matches && !reduce);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, [reduce]);

	// One progress value drives both layers, so the globe's exit and the grid's
	// entrance are two views of the same number and can never drift apart.
	//
	// It is owned here but *written* by GlobeScene, not by a `useScroll` at this
	// level: `enhanced` is false on the first render, so a scroll target declared
	// here would resolve against a ref that is still null. Framer reads
	// `target.current` once, in an effect, and never re-reads it — the progress
	// would then sit at 0 forever, even after GlobeScene mounted.
	const progress = useMotionValue(0);

	return enhanced ?
			<>
				<GlobeScene progress={progress} />
				<GridSection
					logos={logos}
					progress={progress}
				/>
			</>
		:	<GridSection logos={logos} />;
}

/* ── heading ──────────────────────────────────────────────────────────── */

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<div className="mx-auto max-w-2xl text-center">
			{/* The two rules are decoration. At tracking-kicker (0.22em) this label is
			    already ~290px of type; with the rules and their gaps it needs ~370px,
			    more than the 272px a 320px phone has inside container-x. They were
			    being squeezed to stubs while the label broke to two lines, so drop
			    them below sm, where the label fits on its own. */}
			<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-600">
				<span className="hidden h-px w-8 bg-corporate-500/50 sm:block" />
				Trusted by industry leaders
				<span className="hidden h-px w-8 bg-corporate-500/50 sm:block" />
			</span>
			<h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-[2.9rem]">
				{title}
			</h2>
			{subtitle && (
				<p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-steel-600">
					{subtitle}
				</p>
			)}
		</div>
	);
}

/* ── the full interactive grid (every logo) ───────────────────────────── */

function GridSection({
	logos,
	progress,
}: {
	logos: Logo[];
	progress?: MotionValue<number>;
}) {
	const assemble = Boolean(progress);

	// The reveal-on-view below is a framer transform, so the global
	// `prefers-reduced-motion` block in globals.css cannot reach it. Zeroing the
	// duration (rather than dropping `initial`/`whileInView`) keeps the tile
	// visible either way — a guard that removed them would strand the sheet at
	// the `opacity: 0` framer had already written inline. `assemble` is never
	// true here: the globe only mounts when reduced motion is *off*.
	const reduce = useReducedMotion();

	// Stable hook order: without a globe above us there is nothing to slide over,
	// so we park on a constant 0 and fall back to a plain reveal-on-view.
	const idle = useMotionValue(0);
	const p = progress ?? idle;

	// The sheet starts one full viewport below its resting place and rides up to
	// meet it. Its resting place is one viewport *above* where it would normally
	// sit (see `-mt-[100vh]`), which is exactly the globe's pinned screen — so at
	// progress 1 the grid has covered the globe completely.
	const y = useTransform(p, GRID_IN, ["100vh", "0vh"]);
	// Corners round off while airborne and square up as it docks.
	const radius = useTransform(p, GRID_IN, [40, 0]);
	const lift = useTransform(p, GRID_IN, [0.22, 0]);
	const shadow = useTransform(
		lift,
		(a) => `0 -30px 60px -20px rgba(11,27,58,${a})`,
	);

	return (
		<motion.section
			style={assemble ? { y, borderTopLeftRadius: radius, borderTopRightRadius: radius, boxShadow: shadow } : undefined}
			className={
				"relative overflow-hidden bg-gradient-to-b from-canvas to-white py-16 lg:py-24" +
				// Overlap the globe's last viewport and paint above it. Margin moves
				// only the layout box; the `y` transform above does the animating, so
				// the page's total height is unaffected by the slide.
				(assemble ? " z-10 -mt-[100vh] will-change-transform" : "")
			}>
			<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
			<div className="container-x relative">
				<Heading
					title="Every brand we've worked with"
					subtitle="500+ businesses across India and beyond."
				/>
				<motion.div
					initial={assemble ? undefined : { opacity: 0, y: 24 }}
					whileInView={assemble ? undefined : { opacity: 1, y: 0 }}
					viewport={assemble ? undefined : { once: true, margin: "-80px" }}
					transition={
						assemble ? undefined : (
							{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }
						)
					}
					className="mx-auto mt-14 max-w-6xl">
					<MagicBento images={logos} />
				</motion.div>
			</div>
		</motion.section>
	);
}

/* ── desktop: pinned rotating globe with pinned logos ─────────────────── */

function GlobeScene({ progress }: { progress: MotionValue<number> }) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const globeRef = useRef<HTMLDivElement>(null);
	const dimsRef = useRef({ r: 260, vh: 800 });

	// This component only ever mounts once `enhanced` is true, so by the time
	// framer resolves the target the section is really in the DOM.
	const { scrollYProgress } = useScroll({
		target: wrapRef,
		offset: ["start start", "end end"],
	});

	// Republish onto the value GridSection reads. `change` does not fire for the
	// value framer computes on mount, so seed it too — otherwise a reload halfway
	// down the page would leave the grid parked off-screen until you scrolled.
	useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v));
	useEffect(() => {
		progress.set(scrollYProgress.get());
	}, [progress, scrollYProgress]);

	// Fixed pinned logos (featured brands), not a random sample.
	const spinLogos = FEATURED_LOGOS;
	const spheres = useMemo(
		() => fibonacciSphere(spinLogos.length),
		[spinLogos.length],
	);

	// Continuous rotation that matches the globe's auto-spin, so pinned logos
	// keep revolving with the globe even when the page isn't being scrolled.
	const autoRot = useMotionValue(0);
	useEffect(() => {
		let raf = 0;
		const loop = () => {
			// advance once per frame by the same amount cobe adds to its phi
			autoRot.set(autoRot.get() + GLOBE_SPEED);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [autoRot]);

	const markers = useMemo(
		() =>
			spheres.map((v, i) => ({
				id: `g${i}`,
				location: [
					(Math.asin(clamp(v[1], -1, 1)) * 180) / Math.PI,
					(Math.atan2(v[2], v[0]) * 180) / Math.PI,
				] as [number, number],
				emoji: "",
			})),
		[spheres],
	);

	// Pin radius = the globe's on-screen radius, so logos ride its surface.
	useEffect(() => {
		const measure = () => {
			const el = globeRef.current;
			if (!el) return;
			dimsRef.current.r = (el.getBoundingClientRect().width / 2) * 0.92;
			dimsRef.current.vh = window.innerHeight;
		};
		measure();
		const ro = new ResizeObserver(measure);
		if (globeRef.current) ro.observe(globeRef.current);
		window.addEventListener("resize", measure);
		return () => {
			ro.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);

	// Once the logos have flown off, the globe has nothing left to say: it recedes
	// and fades out entirely while the grid slides up over it. Holding it at 0.85
	// opacity was what left it sitting there after the animation had finished.
	const globeOpacity = useTransform(progress, GLOBE_OUT, [1, 0]);
	const globeScale = useTransform(progress, [0, ...GLOBE_OUT], [1, 1.08, 0.9]);
	const glowOpacity = useTransform(progress, [0, ...GLOBE_OUT], [0.8, 0.5, 0]);

	return (
		<section
			ref={wrapRef}
			className="relative z-0 bg-gradient-to-b from-white via-white to-canvas"
			style={{ height: `${SCENE_VH}vh` }}>
			<div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />

				{/* soft glow behind the globe */}
				<motion.div
					style={{ opacity: glowOpacity }}
					className="pointer-events-none absolute left-1/2 top-1/2 size-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(27,110,194,0.16)_0%,rgba(111,166,223,0.09)_42%,transparent_70%)] blur-2xl"
				/>

				{/* BIG cobe globe (decorative; pointer-events off so scroll passes through) */}
				<motion.div
					style={{ opacity: globeOpacity, scale: globeScale }}
					className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
					<div
						ref={globeRef}
						className="w-[min(92vw,620px)]">
						<GlobeWeather
							markers={markers}
							speed={GLOBE_SPEED}
							baseColor={[0.85, 0.89, 0.96]}
							markerColor={[0.106, 0.435, 0.761]}
							glowColor={[0.92, 0.95, 1]}
							className="w-full"
						/>
					</div>
				</motion.div>

				{/* logos pinned to the globe surface */}
				<div className="absolute inset-0 z-20">
					{spinLogos.map((logo, i) => (
						<PinnedLogo
							key={logo.src + i}
							i={i}
							logo={logo}
							progress={progress}
							autoRot={autoRot}
							spheres={spheres}
							dimsRef={dimsRef}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

/* ── one logo pinned to the globe (then streams off toward the grid) ───── */

function PinnedLogo({
	i,
	logo,
	progress,
	autoRot,
	spheres,
	dimsRef,
}: {
	i: number;
	logo: Logo;
	progress: MotionValue<number>;
	autoRot: MotionValue<number>;
	spheres: [number, number, number][];
	dimsRef: React.MutableRefObject<{ r: number; vh: number }>;
}) {
	const state = useTransform([progress, autoRot], ([p, a]: number[]) => {
		const v = spheres[i] ?? [0, 0, 0];

		// scroll adds spin; `a` is the globe's continuous auto-rotation
		const spin = p * Math.PI * 2 * 1.5 + AUTO_DIR * a;
		const cS = Math.cos(spin);
		const sS = Math.sin(spin);
		const X = v[0] * cS + v[2] * sS;
		const Z = -v[0] * sS + v[2] * cS;
		const Y = v[1];

		// globe tilt for depth
		const tilt = -0.3;
		const cT = Math.cos(tilt);
		const sT = Math.sin(tilt);
		const Y2 = Y * cT - Z * sT;
		const Z2 = Y * sT + Z * cT;

		const { r, vh } = dimsRef.current;
		const persp = 1 / (1 - Z2 * 0.14);
		let x = X * r * persp;
		let y = Y2 * r * persp;

		// near the end, stream off the globe and downward toward the grid
		const exit = smoothstep(LOGOS_EXIT[0], LOGOS_EXIT[1], p);
		x *= 1 + exit * 0.6;
		y = y * (1 + exit * 0.3) + exit * vh * 0.55;

		const front = (Z2 + 1) / 2; // 0 back … 1 front
		const scale = (0.82 + front * 0.5) * (1 + exit * 0.2);
		let op = smoothstep(-0.28, 0.16, Z2); // softer back-hide → more visible
		op *= 1 - exit;

		return { x, y, scale, op };
	});

	const x = useTransform(state, (s) => s.x);
	const y = useTransform(state, (s) => s.y);
	const scale = useTransform(state, (s) => s.scale);
	const opacity = useTransform(state, (s) => s.op);

	return (
		<motion.div
			style={{
				x,
				y,
				scale,
				opacity,
				width: FLYER,
				height: FLYER,
				marginLeft: -FLYER / 2,
				marginTop: -FLYER / 2,
			}}
			className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-[0_10px_26px_-10px_rgba(15,23,42,0.45)] [will-change:transform,opacity]">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={logo.src}
				alt=""
				loading="lazy"
				className="max-h-[64%] max-w-[78%] object-contain"
			/>
		</motion.div>
	);
}
