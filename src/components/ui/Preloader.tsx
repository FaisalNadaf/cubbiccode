/** @format */

"use client";

import { useEffect, useState } from "react";
import {
	AnimatePresence,
	animate,
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from "framer-motion";

/**
 * Preloader  branded first-load splash for Cubiccode.
 *
 * Sequence: the brand cube draws + assembles face-by-face, the wordmark
 * rises in with a letter stagger, and a hairline progress bar tracks the
 * real page load (window `load`), showing no less than MIN_VISIBLE_MS and
 * no more than MAX_VISIBLE_MS. The exit is a two-layer curtain lift that
 * reuses the route-transition easing from app/template.tsx so the motion
 * language stays consistent.
 *
 * Robustness:
 *  • Server-rendered, so the overlay covers the very first paint.
 *  • Plays once per browser session  a pre-paint <head> script in
 *    app/layout.tsx sets html[data-preloader-seen] from sessionStorage and
 *    globals.css hides the overlay before hydration (no flash on repeats).
 *  • <noscript> hides it for no-JS users/crawlers, and a pure-CSS failsafe
 *    in globals.css hides it after 9s even if hydration never runs.
 *  • Scroll is locked (html overflow + Lenis stop) only while visible.
 *  • prefers-reduced-motion: content appears instantly, exit is a fade.
 */

const SEEN_KEY = "cc-preloader-seen";
const MIN_VISIBLE_MS = 3400;
const MAX_VISIBLE_MS = 5000;

// Matches the route-transition curtain in app/template.tsx.
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const RISE_EASE = [0.22, 1, 0.36, 1] as const;

const LETTERS = ["C", "u", "b", "i", "c", "c", "o", "d", "e"];
const ACCENT_FROM = 5; // "code" tail rendered in corporate blue

// Isometric cube faces (120×120 viewBox), each with its assembly offset
// faces fly in from outside toward the closed cube.
const FACES = [
	{
		d: "M60 22 L92 40 L60 58 L28 40 Z",
		fill: "url(#cc-face-top)",
		dx: 0,
		dy: -16,
	},
	{
		d: "M92 40 L92 76 L60 94 L60 58 Z",
		fill: "url(#cc-face-right)",
		dx: 16,
		dy: 10,
	},
	{
		d: "M28 40 L60 58 L60 94 L28 76 Z",
		fill: "url(#cc-face-left)",
		dx: -16,
		dy: 10,
	},
];

type LenisWindow = { lenis?: { stop: () => void; start: () => void } };

export function Preloader() {
	const reduce = useReducedMotion();
	const progress = useMotionValue(0);
	const [leaving, setLeaving] = useState(false);
	const [gone, setGone] = useState(false);

	const barScaleX = useTransform(progress, (v) => v / 100);
	const pct = useTransform(progress, (v) => Math.round(v));

	// Load tracking → progress ramp → exit.
	useEffect(() => {
		try {
			if (sessionStorage.getItem(SEEN_KEY) === "1") {
				setGone(true);
				return;
			}
		} catch {
			/* storage unavailable  still play the loader */
		}

		let cancelled = false;
		let finished = false;
		const startedAt = performance.now();

		// Crawl toward 90% while assets stream in; the final 10% is reserved
		// for the actual load event so the bar never "lies" at 100%.
		const crawl = animate(progress, 90, {
			duration: 3.4,
			ease: [0.3, 0.65, 0.25, 1],
		});

		const finish = () => {
			if (cancelled || finished) return;
			finished = true;
			animate(progress, 100, { duration: 0.4, ease: "easeOut" }).then(() => {
				if (!cancelled) setLeaving(true);
			});
		};

		// Exit once the page has actually loaded  never before MIN, never after MAX.
		let minTimer: number | undefined;
		const onReady = () => {
			const elapsed = performance.now() - startedAt;
			minTimer = window.setTimeout(
				finish,
				Math.max(0, MIN_VISIBLE_MS - elapsed),
			);
		};
		if (document.readyState === "complete") onReady();
		else window.addEventListener("load", onReady, { once: true });
		const maxTimer = window.setTimeout(finish, MAX_VISIBLE_MS);

		return () => {
			cancelled = true;
			crawl.stop();
			window.removeEventListener("load", onReady);
			window.clearTimeout(minTimer);
			window.clearTimeout(maxTimer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Scroll lock while the overlay is up (native + Lenis).
	useEffect(() => {
		if (gone) return;
		const html = document.documentElement;
		const prevOverflow = html.style.overflow;
		html.style.overflow = "hidden";
		const lenis = (
			window as unknown as { lenis?: { stop?: () => void; start?: () => void } }
		).lenis;
		lenis?.stop?.();
		return () => {
			html.style.overflow = prevOverflow;
			lenis?.start?.();
		};
	}, [gone]);

	if (gone) return null;

	const snap = { duration: 0 };
	const tr = (t: object) => (reduce ? snap : t);

	return (
		<AnimatePresence
			onExitComplete={() => {
				try {
					sessionStorage.setItem(SEEN_KEY, "1");
				} catch {
					/* ignore */
				}
				setGone(true);
			}}>
			{!leaving && (
				<div
					key="cc-preloader"
					data-preloader
					role="status"
					aria-live="polite"
					className="fixed inset-0 z-[200] overflow-hidden">
					<span className="sr-only">Cubiccode is loading</span>

					{/* Accent under-curtain  revealed for a beat as the navy panel lifts. */}
					<motion.div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-b from-corporate-700 via-corporate-500 to-corporate-400"
						exit={
							reduce ?
								{ opacity: 0, transition: { duration: 0.25 } }
							:	{
									y: "-100%",
									transition: {
										duration: 0.7,
										ease: CURTAIN_EASE,
										delay: 0.34,
									},
								}
						}
					/>

					{/* Main navy panel. */}
					<motion.div
						className="absolute inset-0 flex items-center justify-center bg-ink"
						exit={
							reduce ?
								{ opacity: 0, transition: { duration: 0.25 } }
							:	{
									y: "-100%",
									transition: {
										duration: 0.7,
										ease: CURTAIN_EASE,
										delay: 0.22,
									},
								}
						}>
						{/* Blueprint grid, masked toward the center for focus. */}
						<motion.div
							aria-hidden
							className="absolute inset-0 bg-blueprint [background-size:44px_44px]"
							style={{
								maskImage:
									"radial-gradient(70% 60% at 50% 45%, #000, transparent 78%)",
								WebkitMaskImage:
									"radial-gradient(70% 60% at 50% 45%, #000, transparent 78%)",
							}}
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.14 }}
							transition={tr({ duration: 1.1, ease: "easeOut", delay: 0.2 })}
						/>
						{/* Edge vignette. */}
						<div
							aria-hidden
							className="absolute inset-0 [background:radial-gradient(120%_90%_at_50%_42%,transparent_0%,rgba(5,11,23,0.55)_100%)]"
						/>

						{/* Center lockup  fades out first during the exit. */}
						<motion.div
							className="relative flex flex-col items-center px-6"
							exit={{
								opacity: 0,
								y: reduce ? 0 : -24,
								scale: reduce ? 1 : 0.98,
								transition: { duration: 0.26, ease: "easeIn" },
							}}>
							{/* Cube + glow. */}
							<div className="relative">
								<motion.div
									aria-hidden
									className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
									style={{
										background:
											"radial-gradient(closest-side, rgba(63,134,208,0.4), rgba(63,134,208,0) 72%)",
									}}
									initial={{ opacity: 0, scale: 0.7 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={tr({
										duration: 0.9,
										ease: "easeOut",
										delay: 0.55,
									})}>
									{!reduce && (
										<motion.div
											className="absolute inset-0 rounded-full"
											style={{
												background:
													"radial-gradient(closest-side, rgba(111,166,223,0.35), rgba(111,166,223,0) 65%)",
											}}
											animate={{ scale: [1, 1.14, 1], opacity: [0.7, 1, 0.7] }}
											transition={{
												duration: 3,
												ease: "easeInOut",
												repeat: Infinity,
												delay: 1.4,
											}}
										/>
									)}
								</motion.div>

								<motion.div
									animate={reduce ? undefined : { y: [0, -6, 0] }}
									transition={
										reduce ? undefined : (
											{
												duration: 3.6,
												ease: "easeInOut",
												repeat: Infinity,
												delay: 1.7,
											}
										)
									}>
									<svg
										viewBox="0 0 120 120"
										className="relative h-24 w-24 md:h-28 md:w-28"
										aria-hidden>
										<defs>
											<linearGradient
												id="cc-face-top"
												x1="0"
												y1="0"
												x2="1"
												y2="1">
												<stop
													offset="0%"
													stopColor="#6FA6DF"
												/>
												<stop
													offset="100%"
													stopColor="#1B6EC2"
												/>
											</linearGradient>
											<linearGradient
												id="cc-face-right"
												x1="0"
												y1="0"
												x2="0"
												y2="1">
												<stop
													offset="0%"
													stopColor="#1B6EC2"
												/>
												<stop
													offset="100%"
													stopColor="#0F4C81"
												/>
											</linearGradient>
											<linearGradient
												id="cc-face-left"
												x1="1"
												y1="0"
												x2="0"
												y2="1">
												<stop
													offset="0%"
													stopColor="#0B3A63"
												/>
												<stop
													offset="100%"
													stopColor="#071D33"
												/>
											</linearGradient>
										</defs>
										{FACES.map((f, i) => (
											<motion.path
												key={f.d}
												d={f.d}
												fill={f.fill}
												stroke="#A7C9ED"
												strokeWidth="1.4"
												strokeLinejoin="round"
												strokeOpacity="0.85"
												initial={{
													pathLength: 0,
													fillOpacity: 0,
													opacity: 0,
													x: f.dx,
													y: f.dy,
												}}
												animate={{
													pathLength: 1,
													fillOpacity: 1,
													opacity: 1,
													x: 0,
													y: 0,
												}}
												transition={
													reduce ? snap : (
														{
															opacity: {
																duration: 0.22,
																ease: "easeOut",
																delay: 0.1 + i * 0.14,
															},
															pathLength: {
																duration: 0.6,
																ease: "easeInOut",
																delay: 0.1 + i * 0.14,
															},
															x: {
																duration: 0.6,
																ease: RISE_EASE,
																delay: 0.1 + i * 0.14,
															},
															y: {
																duration: 0.6,
																ease: RISE_EASE,
																delay: 0.1 + i * 0.14,
															},
															fillOpacity: {
																duration: 0.5,
																ease: "easeOut",
																delay: 0.5 + i * 0.14,
															},
														}
													)
												}
											/>
										))}
									</svg>
								</motion.div>
							</div>

							{/* Wordmark  per-letter rise behind an overflow mask + glint sweep. */}
							<div className="relative mt-7 overflow-hidden px-2 pb-1 md:mt-8">
								<div
									aria-hidden
									className="flex font-display text-4xl font-bold tracking-tightest md:text-5xl">
									{LETTERS.map((ch, i) => (
										<span
											key={i}
											className="inline-flex overflow-hidden">
											<motion.span
												className={
													i >= ACCENT_FROM ?
														"inline-block text-corporate-400"
													:	"inline-block text-white"
												}
												initial={{ y: "112%" }}
												animate={{ y: 0 }}
												transition={tr({
													duration: 0.55,
													ease: RISE_EASE,
													delay: 0.95 + i * 0.04,
												})}>
												{ch}
											</motion.span>
										</span>
									))}
								</div>
								{!reduce && (
									<motion.div
										aria-hidden
										className="pointer-events-none absolute inset-0"
										style={{
											background:
												"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
											backgroundSize: "220% 100%",
											mixBlendMode: "screen",
										}}
										initial={{ backgroundPosition: "180% 0" }}
										animate={{ backgroundPosition: "-80% 0" }}
										transition={{
											duration: 1.1,
											ease: "easeInOut",
											delay: 1.9,
										}}
									/>
								)}
							</div>

							{/* Kicker. */}
							<motion.div
								aria-hidden
								className="mt-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-kicker text-steel-400 md:text-xs"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={tr({
									duration: 0.55,
									ease: "easeOut",
									delay: 1.45,
								})}>
								<span className="h-px w-8 bg-gradient-to-r from-transparent to-corporate-400/70" />
								Digital Media LLP
								<span className="h-px w-8 bg-gradient-to-l from-transparent to-corporate-400/70" />
							</motion.div>
						</motion.div>

						{/* Bottom rail  ISO note, live percentage, hairline progress. */}
						<motion.div
							aria-hidden
							className="absolute inset-x-0 bottom-0"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={tr({ duration: 0.6, ease: "easeOut", delay: 1.5 })}
							exit={{ opacity: 0, transition: { duration: 0.2 } }}>
							<div className="flex items-end justify-between px-6 pb-5 md:px-8">
								<span className="text-[10px] font-medium uppercase tracking-[0.18em] text-steel-500">
									ISO 9001 : 2015 Certified
								</span>
								<span className="text-xs tabular-nums text-steel-400">
									<motion.span>{pct}</motion.span>%
								</span>
							</div>
							<div className="h-[2px] w-full bg-white/[0.06]">
								<motion.div
									className="h-full origin-left bg-gradient-to-r from-corporate-600 via-corporate-400 to-corporate-200"
									style={{ scaleX: barScaleX }}
								/>
							</div>
						</motion.div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
