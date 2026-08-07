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
import { BrandCube } from "./BrandCube";

/**
 * Preloader  branded first-load splash for Cubiccode.
 *
 * Sequence: the brand cube draws + assembles face-by-face, the three-line
 * white wordmark lockup (CUBICCODE / DIGITAL MEDIA LLP / ISO 9001 : 2015
 * CERTIFIED) rises in line by line, and a hairline progress bar tracks the
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
 *  • Scroll is locked (html/body overflow + capture-phase wheel/touch block,
 *    which also neutralises Lenis smooth scroll) only while visible.
 *  • prefers-reduced-motion: content appears instantly, exit is a fade.
 */

const SEEN_KEY = "cc-preloader-seen";
const MIN_VISIBLE_MS = 3400;
const MAX_VISIBLE_MS = 5000;

// Matches the route-transition curtain in app/template.tsx.
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const RISE_EASE = [0.22, 1, 0.36, 1] as const;

const LETTERS = [..."CUBICCODE"];

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

	// Scroll lock while the overlay is up.
	//
	// `overflow: hidden` alone can't hold the page still: the smooth-scroll layer
	// (Lenis) listens for wheel/touch on `window` and scrolls the page
	// *programmatically*, which ignores overflow entirely. Reaching for the
	// `window.lenis` global to stop it is unreliable (it may be absent or the
	// wrong shape when we read it). So we swallow the gestures at the source: a
	// capture-phase listener on `window` runs *before* Lenis's bubble-phase
	// handler, so preventDefault() blocks native scroll and stopPropagation()
	// keeps Lenis  and any other scroller  from ever seeing the event.
	// overflow:hidden stays as a secondary guard for keyboard / scrollbar scroll.
	//
	// That guard goes on `body` ONLY, never on `<html>`. An overflow on the root
	// element is applied to the viewport as-is; an overflow on `body` is applied
	// to the viewport *instead* while the root is `visible`, and body's own used
	// value stays `visible`. Both lock the scroll — but locking the root also
	// makes body a scroll container, which re-homes every `position: sticky`
	// element on the page onto it and silently stops it pinning (see the awards
	// deck in components/ScrollStack). Nothing unpins it again if a stray lock is
	// ever left behind, so the cheap version is simply never to set it.
	useEffect(() => {
		if (gone) return;
		const body = document.body;
		const prevBodyOverflow = body.style.overflow;
		body.style.overflow = "hidden";

		const block = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		};
		const opts = { capture: true, passive: false } as const;
		window.addEventListener("wheel", block, opts);
		window.addEventListener("touchmove", block, opts);

		return () => {
			window.removeEventListener("wheel", block, opts);
			window.removeEventListener("touchmove", block, opts);
			body.style.overflow = prevBodyOverflow;
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
							{/* Cube  shared with the route-change loader. */}
							<div className="relative">
								{/* The short+coarse override is a landscape phone: at md the
								    lockup stands ~308px tall in a ~375px viewport and runs
								    into the bottom rail. Gated on pointer:coarse, so a fine
								    pointer can never match it. */}
								<BrandCube className="h-32 w-32 md:h-36 md:w-36 [@media(max-height:500px)_and_(pointer:coarse)]:!h-20 [@media(max-height:500px)_and_(pointer:coarse)]:!w-20" />
							</div>

							{/* Wordmark lockup  each line rises behind its own overflow mask,
							    the whole stack lit by a single glint sweep. */}
							<div
								aria-hidden
								className="relative mt-7 px-2 text-center text-white md:mt-8">
								{/* CUBICCODE  per-letter stagger. */}
								<div className="flex justify-center overflow-hidden pb-[0.12em] font-display text-[2.15rem] font-extrabold leading-none tracking-[0.005em] md:text-6xl">
									{LETTERS.map((ch, i) => (
										<span
											key={i}
											className="inline-flex overflow-hidden">
											<motion.span
												className="inline-block"
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

								{/* DIGITAL MEDIA LLP  tracked out to sit flush under the wordmark. */}
								<div className="mt-2 overflow-hidden pb-[0.14em] md:mt-3">
									<motion.div
										className="pl-[0.2em] font-display text-base font-bold leading-none tracking-[0.2em] md:text-2xl"
										initial={{ y: "115%" }}
										animate={{ y: 0 }}
										transition={tr({
											duration: 0.6,
											ease: RISE_EASE,
											delay: 1.32,
										})}>
										DIGITAL MEDIA LLP
									</motion.div>
								</div>

								{/* ISO line. */}
								<motion.div
									className="mt-2.5 pl-[0.08em] text-[10px] font-semibold leading-none tracking-[0.08em] md:mt-3 md:text-sm"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={tr({
										duration: 0.55,
										ease: "easeOut",
										delay: 1.62,
									})}>
									ISO 9001 : 2015 CERTIFIED
								</motion.div>

								{!reduce && (
									<motion.div
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
											delay: 2,
										}}
									/>
								)}
							</div>
						</motion.div>

						{/* Bottom rail  ISO note, live percentage, hairline progress. */}
						{/* layout.tsx ships viewport-fit=cover, so the insets are real on a
						    notched iPhone: without this the progress bar sits under the home
						    indicator and, in landscape, "Loading" sits under the notch. Every
						    env() here resolves to 0px on desktop. */}
						<motion.div
							aria-hidden
							className="absolute inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={tr({ duration: 0.6, ease: "easeOut", delay: 1.5 })}
							exit={{ opacity: 0, transition: { duration: 0.2 } }}>
							<div className="flex items-end justify-between px-6 pb-5 md:px-8">
								<span className="text-[10px] font-medium uppercase tracking-[0.18em] text-steel-500">
									Loading
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
