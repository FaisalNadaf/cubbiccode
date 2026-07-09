/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, Sparkles, MapPin, TrendingUp, Star, Globe } from "lucide-react";

/**
 * Shared animated backdrop for the SEO page's dark bands — a slow-panning
 * blueprint grid, drifting gradient blobs, a deterministic particle field and a
 * few floating SEO glyphs. All positions are computed from the index (golden-
 * ratio spacing) so server and client render identically — no Math.random, no
 * hydration mismatch. Purely decorative; hidden from assistive tech.
 */

const GOLD = 0.618033988749895;

const PARTICLES = Array.from({ length: 28 }, (_, i) => {
	const a = (i * GOLD) % 1;
	const b = (i * 0.754877666) % 1;
	return {
		left: 3 + a * 94,
		top: 5 + b * 90,
		size: 2 + ((i * 3) % 5),
		delay: (i % 9) * 0.5,
		duration: 6 + (i % 6),
		drift: i % 2 ? 14 : -14,
	};
});

const GLYPHS = [
	{ Icon: Search, left: 8, top: 24, size: 26, dur: 9 },
	{ Icon: Sparkles, left: 86, top: 18, size: 22, dur: 11 },
	{ Icon: MapPin, left: 78, top: 68, size: 24, dur: 10 },
	{ Icon: TrendingUp, left: 14, top: 72, size: 24, dur: 12 },
	{ Icon: Star, left: 50, top: 12, size: 18, dur: 8 },
	{ Icon: Globe, left: 40, top: 82, size: 20, dur: 13 },
];

export function SeoBackground({ dense = true }: { dense?: boolean }) {
	const reduce = useReducedMotion();

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden">
			{/* panning blueprint grid */}
			<motion.div
				className="absolute inset-[-40%] bg-blueprint [background-size:46px_46px] opacity-[0.14]"
				animate={reduce ? undefined : { backgroundPosition: ["0px 0px", "46px 46px"] }}
				transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
			/>

			{/* drifting gradient blobs */}
			<motion.div
				className="absolute -left-24 top-[-10%] size-[520px] rounded-full bg-corporate-600/30 blur-3xl"
				animate={
					reduce ? undefined : (
						{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.35, 0.6, 0.35] }
					)
				}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute -right-20 bottom-[-15%] size-[480px] rounded-full bg-corporate-400/20 blur-3xl"
				animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -30, 0], opacity: [0.25, 0.5, 0.25] }}
				transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute left-1/2 top-1/3 size-[360px] -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl"
				animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.15, 0.3, 0.15] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
			/>

			{/* particle field */}
			{dense &&
				PARTICLES.map((p, i) => (
					<motion.span
						key={i}
						className="absolute rounded-full bg-corporate-200"
						style={{
							left: `${p.left}%`,
							top: `${p.top}%`,
							width: p.size,
							height: p.size,
						}}
						animate={
							reduce ? { opacity: 0.4 } : (
								{ y: [0, p.drift, 0], opacity: [0.15, 0.7, 0.15] }
							)
						}
						transition={{
							duration: p.duration,
							delay: p.delay,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				))}

			{/* floating SEO glyphs */}
			{dense &&
				GLYPHS.map(({ Icon, left, top, size, dur }, i) => (
					<motion.span
						key={`g-${i}`}
						className="absolute text-corporate-300/25"
						style={{ left: `${left}%`, top: `${top}%` }}
						animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 8, 0] }}
						transition={{
							duration: dur,
							delay: i * 0.6,
							repeat: Infinity,
							ease: "easeInOut",
						}}>
						<Icon
							style={{ width: size, height: size }}
							strokeWidth={1.5}
						/>
					</motion.span>
				))}

			{/* top glow + vignette */}
			<div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-corporate-500/15 to-transparent" />
			<div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(8,20,39,0.55)_100%)]" />
		</div>
	);
}
