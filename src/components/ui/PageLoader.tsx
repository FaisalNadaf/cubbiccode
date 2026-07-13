/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { BrandCube, cubeLandAt } from "./BrandCube";

/**
 * PageLoader — the branded splash shown on every client-side route change.
 *
 * Scope, and why it is narrow:
 *  • Fires ONLY on a client-side route change — to a subpage or back to "/".
 *    The first *hard load* of any URL belongs to <Preloader/>, which plays once
 *    per session; firing here as well would stack two overlays on one paint.
 *    That is what `previousPath === null` guards below.
 *  • A single instance lives in the root layout (which, unlike app/template.tsx,
 *    survives navigation), so there is exactly one loader in the tree at a time.
 *
 * Why it opens on the *click* rather than on `usePathname()` changing:
 * `usePathname` only updates once the new route has committed, so by the time we
 * heard about it the incoming page had already painted and the overlay would
 * fade in on top of it — a visible flash of the new content, precisely the
 * flicker this is meant to hide. Opening on the click means the fade-in plays
 * over the *outgoing* page and the swap happens underneath a fully opaque
 * screen. Back/forward navigations never fire a click, so `usePathname` is still
 * the fallback trigger for those.
 *
 * Layering: z-150 sits above the navbar (z-70) but below <Preloader/> (z-200).
 * app/template.tsx's opacity cross-fade still runs underneath, hidden by this
 * overlay, which is what keeps the incoming page from flashing.
 *
 * Cost: `opacity` and `transform` only, so every frame is composited on the GPU;
 * `fixed inset-0` keeps it out of the layout, so it cannot shift the page.
 */

/**
 * Assembly speed for the cube. The preloader plays it at 1× (≈1.29s to close),
 * which is longer than this loader is even on screen — so it is run fast enough
 * to land, pulse and settle inside TOTAL_MS.
 */
const CUBE_SPEED = 1.9;
/** Cube closed, pulse finished — the earliest the loader can leave cleanly. */
const CUBE_SETTLED_MS = (cubeLandAt(CUBE_SPEED) + 0.5 / CUBE_SPEED) * 1000; // ≈ 943

/**
 * On-screen life of the loader, from click to fully revealed page.
 *
 * Held above CUBE_SETTLED_MS + FADE_OUT so the cube always completes: at the old
 * 1000ms the exit began at 640ms and cut the assembly off mid-flight, which read
 * as a stutter rather than an animation. If the cube's timing changes, this
 * floor moves with it.
 */
const FADE_IN_S = 0.16;
const FADE_OUT_S = 0.36;
const TOTAL_MS = Math.max(1000, Math.ceil(CUBE_SETTLED_MS + FADE_OUT_S * 1000)); // ≈ 1303

/**
 * When to *begin* the exit, so the fade-out lands on TOTAL_MS. Measured from the
 * click, not from the route commit — if a route takes longer than this to
 * arrive, the loader simply stays up until it does, which is the whole point of
 * having one.
 */
const HOLD_MS = TOTAL_MS - FADE_OUT_S * 1000;

/** If a click never results in a navigation, never strand the overlay. */
const FAILSAFE_MS = 6000;

export function PageLoader() {
	const pathname = usePathname();
	const reduce = usePrefersReducedMotion();

	const [visible, setVisible] = useState(false);

	/** When the current loader opened. `null` when no navigation is in flight. */
	const openedAt = useRef<number | null>(null);
	/** `null` until the first effect runs — that is what marks a hard load. */
	const previousPath = useRef<string | null>(null);
	const failsafe = useRef<number | undefined>(undefined);

	const close = useCallback(() => {
		openedAt.current = null;
		window.clearTimeout(failsafe.current);
		setVisible(false);
	}, []);

	const open = useCallback(() => {
		openedAt.current = performance.now();
		window.clearTimeout(failsafe.current);
		failsafe.current = window.setTimeout(close, FAILSAFE_MS);
		setVisible(true);
	}, [close]);

	// ── Trigger: a click on an internal link that will really navigate ────────
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			// Anything the browser will not treat as a plain same-tab navigation.
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const anchor = (event.target as Element | null)?.closest?.("a");
			if (!anchor || !anchor.getAttribute("href")) return;
			if (anchor.target && anchor.target !== "_self") return;
			if (anchor.hasAttribute("download")) return;

			const url = new URL(anchor.href, window.location.href);
			if (url.origin !== window.location.origin) return;
			// A hash or query-only change re-renders nothing; there is nothing to
			// cover, and `usePathname` would never fire to close us again.
			if (url.pathname === window.location.pathname) return;

			open();
		};

		// Capture phase: we must run before any handler that calls
		// stopPropagation() on its way to the router.
		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [open]);

	// ── Close: once the new route has committed ───────────────────────────────
	useEffect(() => {
		const previous = previousPath.current;
		previousPath.current = pathname;

		if (previous === null) return; // hard load — <Preloader/> owns first paint
		if (previous === pathname) return;

		// Back/forward buttons fire no click, so this is where they open.
		if (openedAt.current === null) open();

		const elapsed = performance.now() - (openedAt.current ?? performance.now());
		const timer = window.setTimeout(close, Math.max(0, HOLD_MS - elapsed));
		return () => window.clearTimeout(timer);
	}, [pathname, open, close]);

	useEffect(() => () => window.clearTimeout(failsafe.current), []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key="cc-page-loader"
					role="status"
					aria-live="polite"
					className="fixed inset-0 z-[150] flex items-center justify-center bg-canvas"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					// The exit's duration is what HOLD_MS is calibrated against; the
					// two must stay in step or the reveal drifts off TOTAL_MS.
					exit={{
						opacity: 0,
						transition: {
							duration: reduce ? 0.12 : FADE_OUT_S,
							ease: "easeInOut",
						},
					}}
					transition={{ duration: reduce ? 0.12 : FADE_IN_S, ease: "easeOut" }}>
					<span className="sr-only">Loading page</span>

					{/* Brand wash — the same radial tint and blueprint rule the light
					    chrome uses elsewhere, so the loader reads as part of the site. */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-radial-fade"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.06] [background-size:44px_44px]"
					/>

					<div className="relative flex items-center justify-center">
						{/* Soft corporate glow. Scaling a radial gradient is a
						    compositor-only transform — no per-frame blur filter. */}
						{!reduce && (
							<motion.span
								aria-hidden
								className="pointer-events-none absolute size-[15rem] rounded-full will-change-transform sm:size-[19rem]"
								style={{
									background:
										"radial-gradient(closest-side, rgba(27,110,194,0.16), rgba(27,110,194,0) 70%)",
								}}
								animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
								transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
							/>
						)}

						{/* The same cube <Preloader/> assembles, run fast enough to finish
						    inside TOTAL_MS — a cube caught mid-flight by the fade-out reads
						    as a stutter, not an animation. No idle float for the same
						    reason: the loader is gone before a bob would complete.
						    The stroke is inked down because this backdrop is white, where
						    the preloader's pale-blue outline just fuzzes the silhouette. */}
						<BrandCube
							className="h-36 w-36 sm:h-40 sm:w-40"
							speed={CUBE_SPEED}
							float={false}
							stroke="#0F4C81"
							strokeOpacity={0.35}
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
