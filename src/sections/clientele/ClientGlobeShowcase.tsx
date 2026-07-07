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

	return enhanced ?
			<>
				<GlobeScene logos={logos} />
				<GridSection
					logos={logos}
					assemble
				/>
			</>
		:	<GridSection logos={logos} />;
}

/* ── heading ──────────────────────────────────────────────────────────── */

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<div className="mx-auto max-w-2xl text-center">
			<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-600">
				<span className="h-px w-8 bg-corporate-500/50" />
				Trusted by industry leaders
				<span className="h-px w-8 bg-corporate-500/50" />
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
	assemble = false,
}: {
	logos: Logo[];
	assemble?: boolean;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "start center"],
	});

	// The grid "grows into place" as it scrolls up from the globe (scrubbed).
	const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
	const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
	const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

	return (
		<section
			ref={ref}
			className="relative overflow-hidden bg-gradient-to-b from-canvas to-white py-16 lg:py-24">
			<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
			<div className="container-x relative">
				<Heading
					title="Every brand we've worked with"
					subtitle="500+ businesses across India and beyond."
				/>
				<motion.div
					style={assemble ? { scale, opacity, y } : undefined}
					initial={assemble ? undefined : { opacity: 0, y: 24 }}
					whileInView={assemble ? undefined : { opacity: 1, y: 0 }}
					viewport={assemble ? undefined : { once: true, margin: "-80px" }}
					transition={
						assemble ? undefined : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
					}
					className="mx-auto mt-14 max-w-6xl [transform-origin:top_center]">
					<MagicBento images={logos} />
				</motion.div>
			</div>
		</section>
	);
}

/* ── desktop: pinned rotating globe with pinned logos ─────────────────── */

function GlobeScene({ logos }: { logos: Logo[] }) {
	void logos; // grid uses the full list; the globe pins the fixed featured set
	const wrapRef = useRef<HTMLDivElement>(null);
	const globeRef = useRef<HTMLDivElement>(null);
	const dimsRef = useRef({ r: 260, vh: 800 });

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

	const { scrollYProgress } = useScroll({
		target: wrapRef,
		offset: ["start start", "end end"],
	});

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

	// Stay visible right through the pin  the sticky globe then scrolls up
	// into the grid (no faded-out empty div = no blank screen on the way out).
	const globeOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.85]);
	const globeScale = useTransform(scrollYProgress, [0, 0.92], [1, 1.14]);
	const glowOpacity = useTransform(
		scrollYProgress,
		[0, 0.85, 0.97],
		[0.8, 0.5, 0],
	);
	const headingOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
	const headingY = useTransform(scrollYProgress, [0, 0.4], [0, -28]);
	const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

	return (
		<section
			ref={wrapRef}
			className="relative bg-gradient-to-b from-white via-white to-canvas"
			style={{ height: "150vh" }}>
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
							progress={scrollYProgress}
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
		const exit = smoothstep(0.66, 0.97, p);
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
