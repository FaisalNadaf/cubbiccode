/** @format */

"use client";

import React, { useCallback, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

export interface ScrollStackItemProps {
	itemClassName?: string;
	children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
	children,
	itemClassName = "",
}) => (
	// No `transform-style: preserve-3d` / `perspective`. `overflow: hidden` forces
	// a flat rendering context anyway, so a 3D context only ever created
	// z-fighting between the stacked cards.
	<div
		className={`scroll-stack-card relative mx-auto my-8 box-border origin-top overflow-hidden rounded-[40px] ${itemClassName}`.trim()}>
		{children}

		{/* Depth scrim. Buried cards fade instead of blurring: `opacity` on a flat
		    overlay is a compositor-only property, so it costs nothing per frame,
		    whereas `filter: blur()` re-rasterises the whole card every time its
		    scale changes. Last child + `absolute` ⇒ paints above the content.

		    Top-weighted, because the only part of a buried card you ever see is the
		    sliver peeking above the card covering it. An even tint there just dims
		    whatever imagery happens to sit at the card's top edge; washing it out to
		    the card's own background instead makes every peek a clean, uniform edge,
		    so the run reads as a stack of cards rather than a stack of pictures. */}
		<div
			aria-hidden
			className="scroll-stack-shade pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
			style={{
				backgroundImage:
					"linear-gradient(to bottom, rgba(255,255,255,0.95) 0, rgba(255,255,255,0.95) 28px, rgba(255,255,255,0.5) 90px, rgba(11,27,58,0.10) 240px, rgba(11,27,58,0.12) 100%)",
			}}
		/>
	</div>
);

interface ScrollStackProps {
	className?: string;
	children: ReactNode;
	/** Flow gap between cards. Also sets how much scroll each card gets. */
	itemDistance?: number;
	/** Scale removed per card of stack depth. */
	itemScale?: number;
	/** Vertical peek of each buried card above the one covering it. */
	itemStackDistance?: number;
	/** Where a card pins, as a % of viewport height. */
	stackPosition?: string;
	/** Smallest a card may shrink to, however deep it is buried. */
	baseScale?: number;
	rotationAmount?: number;
	/** Scrim opacity gained per card of depth, saturating at 1. `0` disables it. */
	dimAmount?: number;
	useWindowScroll?: boolean;
	onStackComplete?: () => void;
	/**
	 * Space below the deck, before whatever the page renders next.
	 *
	 * Any CSS length. This is not decorative padding: the last card's pin releases
	 * half a viewport before the end spacer, and a pinned card out-ranks the
	 * following section on z-index, so if the runway is shorter than the card's
	 * remaining on-screen extent the deck paints over that section. A caller with
	 * tall cards or a deep stack must size this to them — see RecognitionStack.
	 */
	endSpace?: string;
}

/** Frames to keep looking for the app-wide Lenis before giving up. */
const LENIS_LOOKUP_FRAMES = 60;

type CardState = {
	y: number;
	scale: number;
	rotation: number;
	dim: number;
};

type Metrics = {
	/** Layout offset of each card's top, in scroller coordinates. */
	tops: number[];
	/** Layout offset of the trailing spacer. */
	endTop: number;
	viewport: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Linear progress of `value` across `[start, end]`, clamped. */
const progress = (value: number, start: number, end: number) =>
	end <= start ? (value >= end ? 1 : 0) : clamp01((value - start) / (end - start));

/** Smoothstep. Zero first-derivative at both ends, so cards ease in and settle. */
const ease = (t: number) => t * t * (3 - 2 * t);

const ScrollStack: React.FC<ScrollStackProps> = ({
	children,
	className = "",
	itemDistance = 160,
	itemScale = 0.03,
	itemStackDistance = 18,
	stackPosition = "7%",
	baseScale = 0.85,
	rotationAmount = 0,
	dimAmount = 0.7,
	useWindowScroll = false,
	onStackComplete,
	endSpace = "40vh",
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const endRef = useRef<HTMLDivElement>(null);

	const cardsRef = useRef<HTMLElement[]>([]);
	const shadesRef = useRef<(HTMLElement | null)[]>([]);
	const metricsRef = useRef<Metrics | null>(null);
	const lastStateRef = useRef<CardState[]>([]);
	const stackCompletedRef = useRef(false);

	/** A Lenis we own (inner-scroller mode only). */
	const ownLenisRef = useRef<Lenis | null>(null);
	/** The app-wide Lenis we piggyback on. Never destroyed by us. */
	const sharedLenisRef = useRef<Lenis | null>(null);
	const ownRafRef = useRef<number | null>(null);
	const nativeListeningRef = useRef(false);

	const parsePercentage = useCallback(
		(value: string | number, containerHeight: number) => {
			if (typeof value === "string" && value.includes("%")) {
				return (parseFloat(value) / 100) * containerHeight;
			}
			return parseFloat(value as string);
		},
		[],
	);

	const readScrollTop = useCallback(() => {
		if (useWindowScroll) return window.scrollY;
		return scrollerRef.current?.scrollTop ?? 0;
	}, [useWindowScroll]);

	/**
	 * Layout offset of `element`, ignoring the CSS transforms we apply to cards.
	 * `getBoundingClientRect` would fold each card's own translateY back into the
	 * next frame's input and the deck would walk off-screen.
	 */
	const offsetOf = useCallback(
		(element: HTMLElement) => {
			if (!useWindowScroll) return element.offsetTop;
			let top = 0;
			let node: HTMLElement | null = element;
			while (node) {
				top += node.offsetTop;
				node = node.offsetParent as HTMLElement | null;
			}
			return top;
		},
		[useWindowScroll],
	);

	/**
	 * Read every layout value the scroll loop needs, once, up front.
	 *
	 * Cheap rather than critical: because `transform` never invalidates layout
	 * geometry, reading `offsetTop` between transform writes does not actually
	 * force a reflow. Hoisting the reads out of the loop still spares us an
	 * `offsetParent` walk per card plus a `querySelector` per frame, and keeps
	 * the scroll path a pure function of `scrollTop`.
	 */
	const measure = useCallback(() => {
		const cards = cardsRef.current;
		if (!cards.length) return;

		metricsRef.current = {
			tops: cards.map(offsetOf),
			endTop: endRef.current ? offsetOf(endRef.current) : 0,
			viewport:
				useWindowScroll ?
					window.innerHeight
				:	(scrollerRef.current?.clientHeight ?? 0),
		};
	}, [offsetOf, useWindowScroll]);

	const applyTransforms = useCallback(
		(scrollTop: number) => {
			const metrics = metricsRef.current;
			const cards = cardsRef.current;
			const n = cards.length;
			if (!metrics || !n) return;

			const { tops, endTop, viewport } = metrics;
			const stackPx = parsePercentage(stackPosition, viewport);
			const pinEnd = endTop - viewport / 2;

			// ── Pass 1: pure arithmetic, zero DOM access ──────────────────────────
			//
			// `pinStart[i]` is the scroll position at which card i comes to rest.
			const pinStart: number[] = new Array(n);
			for (let i = 0; i < n; i++) {
				pinStart[i] = tops[i] - stackPx - itemStackDistance * i;
			}

			// `cover[i]` — how far card i+1 has travelled across card i, from the
			// moment its top edge clears the bottom of the viewport (so the shrink is
			// only ever driven by a card you can actually see) until it lands on its
			// own pin. The last card is covered by nothing.
			const cover: number[] = new Array(n).fill(0);
			for (let i = 0; i < n - 1; i++) {
				const start = Math.max(pinStart[i], tops[i + 1] - viewport);
				cover[i] = ease(progress(scrollTop, start, pinStart[i + 1]));
			}

			// `depth[i]` — cards stacked on top of card i, as a continuous quantity.
			// Suffix sum of `cover`, so a card sits at scale 1 for as long as it is
			// the top card and only recedes as the next one slides over it.
			const depth: number[] = new Array(n);
			depth[n - 1] = 0;
			for (let i = n - 2; i >= 0; i--) depth[i] = depth[i + 1] + cover[i];

			// ── Pass 2: writes only ───────────────────────────────────────────────
			for (let i = 0; i < n; i++) {
				const card = cards[i];
				if (!card) continue;

				// Sub-pixel translation is deliberate. A pinned card's on-screen
				// position is `layoutTop - scrollTop + y`, and Lenis scrolls to
				// fractional offsets — so rounding `y` to whole pixels leaks
				// `frac(scrollTop)` straight into the card and it wobbles within 1px of
				// the page it is meant to be frozen against.
				const y =
					scrollTop < pinStart[i] ?
						0
					:	Math.max(0, Math.min(scrollTop, pinEnd) - pinStart[i]);

				const scale = Math.max(baseScale, 1 - depth[i] * itemScale);
				const rotation = rotationAmount ? depth[i] * rotationAmount : 0;
				const dim = dimAmount ? clamp01(depth[i] * dimAmount) : 0;

				// Skipping a write means keeping the *written* value in the cache, not
				// the computed one — otherwise changes smaller than the threshold are
				// swallowed one frame at a time and the card silently drifts.
				let previous = lastStateRef.current[i];
				if (!previous) {
					previous = { y: NaN, scale: NaN, rotation: NaN, dim: NaN };
					lastStateRef.current[i] = previous;
				}

				const moved =
					!(Math.abs(previous.y - y) <= 0.01) ||
					!(Math.abs(previous.scale - scale) <= 0.0005) ||
					!(Math.abs(previous.rotation - rotation) <= 0.01);

				if (moved) {
					const rotate = rotation ? ` rotate(${rotation.toFixed(3)}deg)` : "";
					card.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(4)})${rotate}`;
					previous.y = y;
					previous.scale = scale;
					previous.rotation = rotation;
				}

				if (dimAmount && !(Math.abs(previous.dim - dim) <= 0.002)) {
					const shade = shadesRef.current[i];
					if (shade) shade.style.opacity = dim.toFixed(3);
					previous.dim = dim;
				}
			}

			const lastPinned =
				scrollTop >= pinStart[n - 1] && scrollTop <= pinEnd;
			if (lastPinned !== stackCompletedRef.current) {
				stackCompletedRef.current = lastPinned;
				if (lastPinned) onStackComplete?.();
			}
		},
		[
			baseScale,
			dimAmount,
			itemScale,
			itemStackDistance,
			onStackComplete,
			parsePercentage,
			rotationAmount,
			stackPosition,
		],
	);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const cards = Array.from(
			root.querySelectorAll<HTMLElement>(".scroll-stack-card"),
		);
		if (!cards.length) return;

		cardsRef.current = cards;
		shadesRef.current = cards.map((card) =>
			card.querySelector<HTMLElement>(".scroll-stack-shade"),
		);
		lastStateRef.current = [];

		// Reduced motion: no pinning, no scaling, no shade — just a plain stack of
		// cards in normal flow. The deck is decoration, not content.
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) {
			cards.forEach((card, i) => {
				if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
			});
			return;
		}

		cards.forEach((card, i) => {
			if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
			card.style.transformOrigin = "top center";
			card.style.willChange = "transform";
			// Stable paint order — later cards always stack over earlier ones.
			card.style.zIndex = String(i + 1);
		});
		shadesRef.current.forEach((shade) => {
			if (shade) shade.style.willChange = "opacity";
		});

		let disposed = false;

		const update = () => applyTransforms(readScrollTop());

		const remeasure = () => {
			measure();
			update();
		};

		// Mobile address bars collapse as you scroll and fire `resize` every time.
		// `measure()` would then re-read `window.innerHeight` — a value the cards
		// never see, because their heights are authored in `vh`, which on iOS is
		// pinned to the *large* viewport — so `pinEnd` and the cover windows would
		// shift mid-scroll and the whole deck snaps. Only a width change can
		// actually move a card's layout offset, so on touch we re-measure on width
		// (i.e. rotation) alone. Fine pointers keep re-measuring on every resize.
		const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
		let lastWidth = window.innerWidth;
		const onResize = () => {
			const width = window.innerWidth;
			const widthChanged = width !== lastWidth;
			lastWidth = width;
			if (coarsePointer && !widthChanged) return;
			remeasure();
		};

		// Native `scroll` fires after the browser has already committed the frame,
		// so it is only a fallback (reduced-motion Lenis, or before Lenis exists).
		let rafPending: number | null = null;
		const onNativeScroll = () => {
			if (rafPending !== null) return;
			rafPending = requestAnimationFrame(() => {
				rafPending = null;
				update();
			});
		};

		const listenNative = () => {
			if (nativeListeningRef.current) return;
			window.addEventListener("scroll", onNativeScroll, { passive: true });
			nativeListeningRef.current = true;
		};
		const unlistenNative = () => {
			if (!nativeListeningRef.current) return;
			window.removeEventListener("scroll", onNativeScroll);
			nativeListeningRef.current = false;
		};

		if (useWindowScroll) {
			// The app runs one window-level Lenis (providers/SmoothScroll). Attach to
			// it and write transforms *synchronously* from its scroll event: Lenis
			// emits immediately after it repositions the page, inside the same frame,
			// so the card's compensating translate lands before paint. Deferring to a
			// rAF instead leaves every pinned card one frame behind the scroll it is
			// cancelling out — a per-frame shudder that reads as flicker.
			//
			// SmoothScroll assigns `window.lenis` from a *parent* effect, and React
			// flushes child effects first, so it is reliably absent on our first pass.
			// Listen natively meanwhile and upgrade the moment it appears.
			measure();
			update();
			listenNative();

			let framesLeft = LENIS_LOOKUP_FRAMES;
			let lookupRaf: number | null = null;

			const acquire = () => {
				if (disposed) return;
				const shared = (window as unknown as { lenis?: Lenis }).lenis;
				if (shared) {
					shared.on("scroll", update);
					sharedLenisRef.current = shared;
					unlistenNative();
					return;
				}
				// No global instance at all (reduced motion upstream) — stay native.
				if (framesLeft-- > 0) lookupRaf = requestAnimationFrame(acquire);
			};
			acquire();

			window.addEventListener("resize", onResize);

			// Text reflow and late-loading fonts move the cards' layout offsets.
			// Transforms never change the inner's height, so this cannot self-trigger.
			// This one is never gated: a real layout change must always re-measure.
			const observer = new ResizeObserver(remeasure);
			const inner = root.querySelector(".scroll-stack-inner");
			if (inner) observer.observe(inner);

			return () => {
				disposed = true;
				if (lookupRaf !== null) cancelAnimationFrame(lookupRaf);
				if (rafPending !== null) cancelAnimationFrame(rafPending);
				window.removeEventListener("resize", onResize);
				observer.disconnect();
				unlistenNative();
				// Only detach from the shared Lenis. It outlives this component.
				sharedLenisRef.current?.off("scroll", update);
				sharedLenisRef.current = null;
				cardsRef.current = [];
				shadesRef.current = [];
				lastStateRef.current = [];
				metricsRef.current = null;
				stackCompletedRef.current = false;
			};
		}

		// ── Inner-scroller mode: we own the Lenis ───────────────────────────────
		const scroller = scrollerRef.current;
		if (!scroller) return;

		const lenis = new Lenis({
			wrapper: scroller,
			content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			touchMultiplier: 2,
			gestureOrientation: "vertical",
			lerp: 0.1,
			syncTouch: true,
		});
		lenis.on("scroll", update);
		ownLenisRef.current = lenis;

		const raf = (time: number) => {
			lenis.raf(time);
			ownRafRef.current = requestAnimationFrame(raf);
		};
		ownRafRef.current = requestAnimationFrame(raf);

		measure();
		update();

		window.addEventListener("resize", onResize);
		const observer = new ResizeObserver(remeasure);
		const inner = scroller.querySelector(".scroll-stack-inner");
		if (inner) observer.observe(inner);

		return () => {
			disposed = true;
			if (ownRafRef.current) cancelAnimationFrame(ownRafRef.current);
			if (rafPending !== null) cancelAnimationFrame(rafPending);
			window.removeEventListener("resize", onResize);
			observer.disconnect();
			unlistenNative();
			ownLenisRef.current?.destroy();
			ownLenisRef.current = null;
			cardsRef.current = [];
			shadesRef.current = [];
			lastStateRef.current = [];
			metricsRef.current = null;
			stackCompletedRef.current = false;
		};
	}, [
		applyTransforms,
		itemDistance,
		measure,
		readScrollTop,
		useWindowScroll,
	]);

	// In window-scroll mode the page itself is the scroller. Making this an
	// `overflow-y-auto` box too would trap the wheel inside it.
	if (useWindowScroll) {
		return (
			<div
				ref={rootRef}
				className={`relative w-full ${className}`.trim()}>
				<div
					className="scroll-stack-inner px-4 pt-[14vh] sm:px-8 lg:px-10 xl:px-12"
					style={{ paddingBottom: endSpace }}>
					{children}
					{/* Spacer so the last pin can release cleanly */}
					<div
						ref={endRef}
						className="scroll-stack-end h-px w-full"
					/>
				</div>
			</div>
		);
	}

	// One element is both the query root and the scroller, so `offsetTop` (which
	// is measured against the nearest positioned ancestor) and `scrollTop` share
	// a coordinate space.
	return (
		<div
			ref={(node) => {
				rootRef.current = node;
				scrollerRef.current = node;
			}}
			className={`relative h-full w-full overflow-y-auto overflow-x-visible ${className}`.trim()}
			style={{
				overscrollBehavior: "contain",
				WebkitOverflowScrolling: "touch",
			}}>
			<div
				className="scroll-stack-inner px-4 pt-[14vh] sm:px-8 lg:px-10 xl:px-12"
				style={{ paddingBottom: endSpace }}>
				{children}
				{/* Spacer so the last pin can release cleanly */}
				<div
					ref={endRef}
					className="scroll-stack-end h-px w-full"
				/>
			</div>
		</div>
	);
};

export default ScrollStack;
