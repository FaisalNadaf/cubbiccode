/** @format */

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { founderMessage } from "@/content/company";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const line: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Panel container that slides in from an offset, then staggers its lines. */
function panelVariants(x: number, y: number): Variants {
	return {
		hidden: { opacity: 0, x, y },
		show: {
			opacity: 1,
			x: 0,
			y: 0,
			transition: {
				duration: 0.9,
				ease: EASE,
				when: "beforeChildren",
				delayChildren: 0.2,
				staggerChildren: 0.1,
			},
		},
	};
}

const viewport = { once: true, margin: "-100px" } as const;

/** Split a paragraph into a bold opening sentence + the supporting remainder. */
function split(p: string): [string, string] {
	const i = p.indexOf(". ");
	return i === -1 ? [p, ""] : [p.slice(0, i + 1), p.slice(i + 2)];
}

/**
 * Founder message laid out as three interlocking angled panels. The side panels
 * (navy / light-blue) have an outer-top corner clipped so their bottoms flare
 * outward, while the white focal middle panel narrows toward the bottom and
 * overlaps its neighbours. Panels slide in from opposite edges. Below lg the
 * clip-paths drop and panels stack as clean cards. Honours reduced motion.
 *
 * The interlock is gated at `lg`, not `md`: three columns plus the 64px corner
 * cuts and the panels' 48–80px inner padding need ~1024px to survive. At 768px
 * each column is ~240px wide, of which the padding alone claims 128px.
 */
export function FoundingPanels() {
	const reduce = useReducedMotion();
	const [p2, p3, p4] = founderMessage.paragraphs.slice(1);
	const [lead1, body1] = split(p2);
	const [lead2, body2] = split(p3);
	const [lead3, body3] = split(p4);

	const from = (x: number, y: number) =>
		reduce ? panelVariants(0, 0) : panelVariants(x, y);

	return (
		<section className="relative overflow-hidden bg-canvas-soft">
			{/* Ambient glows */}
			<div
				aria-hidden
				className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-corporate-500/10 blur-[140px]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-ink/10 blur-[140px]"
			/>

			<div className="relative w-full px-4 sm:px-6 lg:px-0">
				<div className="grid items-stretch gap-0 lg:grid-cols-[1fr_1fr_1fr] lg:gap-0">
					{/* ── Panel 1  approach (navy, top-right corner clipped) ── */}
					<motion.article
						variants={from(-180, 0)}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
						className="relative flex flex-col justify-center overflow-hidden rounded-sm bg-ink px-8 py-10 text-white shadow-xl shadow-ink/20 lg:pb-14 lg:pl-12 lg:pr-20 lg:pt-16 lg:[clip-path:polygon(0_0,calc(100%_-_64px)_0,100%_100%,0_100%)]">
						<span
							aria-hidden
							className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-corporate-500/20 blur-2xl"
						/>
						<motion.span
							variants={line}
							className="kicker text-corporate-300">
							Our approach
						</motion.span>
						<motion.p
							variants={line}
							className="mt-5 text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl">
							{lead1}
						</motion.p>
						{body1 && (
							<motion.p
								variants={line}
								className="mt-4 text-[15px] leading-relaxed text-steel-300 md:text-base">
								{body1}
							</motion.p>
						)}
					</motion.article>

					{/* ── Panel 2  promise (white focal, narrows at bottom) ──
              The corporate outline is painted with stacked drop-shadows so it
              follows the clipped edges  a real border gets cut by clip-path. */}
					<motion.article
						variants={from(0, -160)}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
						className="relative z-10 flex flex-col justify-center overflow-hidden rounded-sm border-2 border-corporate-400/40 bg-white px-8 py-10 [filter:drop-shadow(0_18px_40px_rgba(11,27,58,0.22))] lg:-mx-[38px] lg:border-0 lg:px-16 lg:pb-16 lg:pt-14 lg:[clip-path:polygon(0_0,100%_0,calc(100%_-_64px)_100%,64px_100%)] lg:[filter:drop-shadow(3px_0_0_rgba(27,110,194,0.5))_drop-shadow(-3px_0_0_rgba(27,110,194,0.5))_drop-shadow(0_3px_0_rgba(27,110,194,0.5))_drop-shadow(0_-3px_0_rgba(27,110,194,0.5))_drop-shadow(0_18px_28px_rgba(11,27,58,0.24))_drop-shadow(0_44px_66px_rgba(11,27,58,0.34))]">
						<motion.span
							variants={line}
							className="kicker justify-center text-corporate-600">
							Our promise
						</motion.span>
						<motion.p
							variants={line}
							className="mt-5 text-balance text-center text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
							{lead2}
						</motion.p>
						{body2 && (
							<motion.p
								variants={line}
								className="mt-6 text-center text-base leading-relaxed text-steel-600 md:text-lg">
								{body2}
							</motion.p>
						)}
					</motion.article>

					{/* ── Panel 3  purpose (light blue, top-left corner clipped) ── */}
					<motion.article
						variants={from(180, 0)}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
						className="relative flex flex-col justify-center overflow-hidden rounded-sm border border-corporate-200 bg-corporate-50 px-8 py-10 shadow-xl shadow-corporate-500/10 lg:pb-14 lg:pl-20 lg:pr-12 lg:pt-16 lg:[clip-path:polygon(64px_0,100%_0,100%_100%,0_100%)]">
						<span
							aria-hidden
							className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-corporate-500/15 blur-2xl"
						/>
						<motion.span
							variants={line}
							className="kicker text-corporate-600">
							Our purpose
						</motion.span>
						<motion.p
							variants={line}
							className="mt-5 text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl">
							{lead3}
						</motion.p>
						{body3 && (
							<motion.p
								variants={line}
								className="mt-4 text-[15px] leading-relaxed text-steel-600 md:text-base">
								{body3}
							</motion.p>
						)}
					</motion.article>
				</div>
			</div>
		</section>
	);
}
