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
	/** Where a card pins, as a px length or a % of viewport height. */
	stackPosition?: string;
	/** Smallest a card may shrink to, however deep it is buried. */
	baseScale?: number;
	rotationAmount?: number;
	/** Scrim opacity gained per card of depth, saturating at 1. `0` disables it. */
	dimAmount?: number;
	useWindowScroll?: boolean;
	onStackComplete?: () => void;
	/**
	 * How long the finished deck holds before it is released back into the flow.
	 *
	 * Any CSS length. The cards are pinned with `position: sticky`, so they are
	 * held by the *bottom edge of their container*, not by a scroll threshold —
	 * this is the height of the spacer that sits between the last card and that
	 * edge, and therefore how much further you scroll with the completed deck on
	 * screen before it starts to leave.
	 *
	 * Because the browser owns the release, a card can never outrun its own
	 * container and paint over whatever the page renders next — that is a
	 * guarantee of the mechanism, not something the caller has to size for.
	 */
	endSpace?: string;
}

/** Frames to keep looking for the app-wide Lenis before giving up. */
const LENIS_LOOKUP_FRAMES = 60;

type CardState = {
	scale: number;
	rotation: number;
	dim: number;
};

type Metrics = {
	/** Layout offset of each card's top, in scroller coordinates. */
	tops: number[];
	/** Each card's sticky inset — where it comes to rest, from the viewport top. */
	pins: number[];
	/** Scroll offset at which the container's bottom edge releases the deck. */
	releaseAt: number;
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
	endSpace = "50vh",
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	const endRef = useRef<HTMLDivElement>(null);

	const cardsRef = useRef<HTMLElement[]>([]);
	const shadesRef = useRef<(HTMLElement | null)[]>([]);
	const pinsRef = useRef<number[]>([]);
	/** Bottom margin dealt to the last card — part of the box sticky clamps. */
	const lastMarginRef = useRef(0);
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
	 * `getBoundingClientRect` would fold each card's own sticky shift and scale
	 * back into the next frame's input and the deck would walk off-screen.
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
	 * Pin every card, in CSS, with `position: sticky`.
	 *
	 * This used to be a per-frame job: each card was translated down by exactly
	 * the distance the page had scrolled past it, so it appeared to freeze. That
	 * only ever looks frozen if the translate lands in the *same frame* as the
	 * scroll it cancels — true on desktop, where Lenis repositions the page and
	 * emits `scroll` synchronously, and false on every touch device, where Lenis
	 * runs with `syncTouch` off and the page is scrolled natively on the
	 * compositor thread. There the transform is always at least a frame late, so
	 * every pinned card jitters by the frame's scroll delta — tens of pixels at
	 * flick speed. That is the mobile flicker.
	 *
	 * A sticky card rests at `stackPosition + itemStackDistance × i` from the top
	 * of the scrollport, which is precisely where the old arithmetic parked it —
	 * same geometry, except the browser holds it, on the compositor, in lockstep
	 * with native scrolling. Only the shrink and the dim are left to JS, and a
	 * frame of latency there is invisible: they are slow, continuous, and no
	 * longer carry any positional component.
	 */
	const applyPins = useCallback(
		(viewport: number) => {
			const cards = cardsRef.current;
			const n = cards.length;
			if (!n) return;

			const stackPx = parsePercentage(stackPosition, viewport);
			const pins: number[] = new Array(n);

			for (let i = 0; i < n; i++) {
				const card = cards[i];
				const pin = stackPx + itemStackDistance * i;
				pins[i] = pin;

				card.style.position = "sticky";
				// Safari shipped this behind a prefix for years and still rejects the
				// unprefixed keyword on old builds — the assignment above is simply
				// dropped, leaving the property empty rather than throwing.
				if (!card.style.position) card.style.position = "-webkit-sticky";
				card.style.top = `${pin}px`;

				// The bottom margin still carries the flow gap, but it is dealt the
				// mirror of the card's own pin, and that is load-bearing.
				//
				// A sticky box is held by two different edges measured off two
				// different boxes — verified in Chromium, WebKit and Gecko, which all
				// agree: the inset above is applied to the *border* box (a top margin
				// does not move the pin, so `my-8` is left alone), but the clamp to the
				// bottom of the containing block is applied to the *margin* box. Under
				// a uniform bottom margin the front card — the one that pins lowest —
				// would therefore reach that clamp first and slide up out of the deck
				// while the cards buried behind it stayed put, unstacking the run from
				// the front just as it left. Mirroring the pin ends every card's margin
				// box the same distance below its own rest position, so the container
				// catches the whole deck on one frame and it exits as the single object
				// it reads as.
				card.style.marginBottom = `${itemDistance + itemStackDistance * (n - 1 - i)}px`;
			}

			pinsRef.current = pins;
			lastMarginRef.current = itemDistance;
		},
		[itemDistance, itemStackDistance, parsePercentage, stackPosition],
	);

	/**
	 * Read every layout value the scroll loop needs, once, up front.
	 *
	 * Must run *after* `applyPins`, which writes the margins these offsets are
	 * measured from. `viewport` is passed in rather than sampled here — see the
	 * mobile URL-bar note on `layout()`.
	 */
	const measure = useCallback(
		(viewport: number) => {
			const cards = cardsRef.current;
			const n = cards.length;
			if (!n) return;

			const pins = pinsRef.current;
			const end = endRef.current;
			// Bottom of the container's *content* box — the edge sticky measures
			// against, which is the bottom margin edge of its last in-flow child.
			const contentBottom = end ? offsetOf(end) + end.offsetHeight : 0;

			// Sticky clamps the *margin* box, so the last card is caught once the
			// content bottom rises to `pin + height + marginBottom` from the top of
			// the scrollport — the same edge, and therefore the same frame, as every
			// card behind it (see the mirrored margins in `applyPins`).
			const lastBox = cards[n - 1].offsetHeight + lastMarginRef.current;

			metricsRef.current = {
				tops: cards.map(offsetOf),
				pins,
				releaseAt: contentBottom - (pins[n - 1] ?? 0) - lastBox,
				viewport,
			};
		},
		[offsetOf],
	);

	const applyTransforms = useCallback(
		(scrollTop: number) => {
			const metrics = metricsRef.current;
			const cards = cardsRef.current;
			const n = cards.length;
			if (!metrics || !n) return;

			const { tops, pins, releaseAt, viewport } = metrics;

			// ── Pass 1: pure arithmetic, zero DOM access ──────────────────────────
			//
			// `pinStart[i]` is the scroll position at which card i comes to rest.
			// CSS does the resting now; this is only the number the shrink and dim
			// curves are keyed off.
			const pinStart: number[] = new Array(n);
			for (let i = 0; i < n; i++) {
				pinStart[i] = tops[i] - pins[i];
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

				const scale = Math.max(baseScale, 1 - depth[i] * itemScale);
				const rotation = rotationAmount ? depth[i] * rotationAmount : 0;
				const dim = dimAmount ? clamp01(depth[i] * dimAmount) : 0;

				// Skipping a write means keeping the *written* value in the cache, not
				// the computed one — otherwise changes smaller than the threshold are
				// swallowed one frame at a time and the card silently drifts.
				let previous = lastStateRef.current[i];
				if (!previous) {
					previous = { scale: NaN, rotation: NaN, dim: NaN };
					lastStateRef.current[i] = previous;
				}

				const moved =
					!(Math.abs(previous.scale - scale) <= 0.0005) ||
					!(Math.abs(previous.rotation - rotation) <= 0.01);

				if (moved) {
					const rotate = rotation ? ` rotate(${rotation.toFixed(3)}deg)` : "";
					card.style.transform = `scale(${scale.toFixed(4)})${rotate}`;
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
				scrollTop >= pinStart[n - 1] && scrollTop <= releaseAt;
			if (lastPinned !== stackCompletedRef.current) {
				stackCompletedRef.current = lastPinned;
				if (lastPinned) onStackComplete?.();
			}
		},
		[baseScale, dimAmount, itemScale, onStackComplete, rotationAmount],
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
		// cards in normal flow. The deck is decoration, not content, so the trailing
		// spacer that holds the finished deck on screen is dead weight here too.
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) {
			cards.forEach((card, i) => {
				if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
			});
			if (endRef.current) endRef.current.style.height = "0px";
			return;
		}

		cards.forEach((card, i) => {
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

		/** Cached viewport height. See `layout()`. */
		let viewport = 0;

		/**
		 * Re-pin and re-measure.
		 *
		 * `refreshViewport` is the whole point of the split. Mobile address bars
		 * collapse as you scroll and change `innerHeight` by ~10%, but every height
		 * in this deck is authored in `svh`, which does *not* move with the bar. So
		 * re-sampling the live viewport in response to anything other than a genuine
		 * layout change shifts the cover windows and the release point under a deck
		 * whose geometry never moved, and the whole stack snaps mid-scroll.
		 *
		 * Order matters: `applyPins` writes the margins `measure` reads offsets from.
		 */
		const layout = (refreshViewport: boolean) => {
			if (refreshViewport || !viewport) {
				viewport =
					useWindowScroll ?
						window.innerHeight
					:	(scrollerRef.current?.clientHeight ?? 0);
			}
			applyPins(viewport);
			measure(viewport);
			update();
		};

		// Only a width change can actually move a card's layout offset on touch, so
		// there we re-measure on width (i.e. rotation) alone. Fine pointers have no
		// collapsing chrome, so every resize is real.
		const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
		let lastWidth = window.innerWidth;
		const onResize = () => {
			const width = window.innerWidth;
			const widthChanged = width !== lastWidth;
			lastWidth = width;
			if (coarsePointer && !widthChanged) return;
			layout(true);
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
			// it so the shrink and the dim advance on the same tick Lenis repositions
			// the page, rather than a frame behind it. The card's *position* no longer
			// depends on this — sticky owns that — so a missing Lenis is now only a
			// smoothness question, not a correctness one.
			//
			// SmoothScroll assigns `window.lenis` from a *parent* effect, and React
			// flushes child effects first, so it is reliably absent on our first pass.
			// Listen natively meanwhile and upgrade the moment it appears.
			layout(true);
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
			// Transforms never change the inner's height, so this cannot self-trigger;
			// neither can `applyPins`, which rewrites the same margins it wrote last
			// pass. This one is never gated — a real layout change must always
			// re-measure — but it deliberately does not re-sample the viewport.
			const observer = new ResizeObserver(() => layout(false));
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
				pinsRef.current = [];
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

		layout(true);

		window.addEventListener("resize", onResize);
		const observer = new ResizeObserver(() => layout(false));
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
			pinsRef.current = [];
			lastStateRef.current = [];
			metricsRef.current = null;
			stackCompletedRef.current = false;
		};
	}, [
		applyPins,
		applyTransforms,
		itemDistance,
		measure,
		readScrollTop,
		useWindowScroll,
	]);

	// In window-scroll mode the page itself is the scroller. Making this an
	// `overflow-y-auto` box too would trap the wheel inside it.
	//
	// NOTE: nothing between here and the scrollport may set `overflow`,
	// `transform`, `filter` or `contain` — any of those re-homes a sticky
	// descendant onto that ancestor and the deck stops pinning. app/template.tsx
	// crossfades routes with opacity alone for exactly this reason.
	if (useWindowScroll) {
		return (
			<div
				ref={rootRef}
				className={`relative w-full ${className}`.trim()}>
				<div className="scroll-stack-inner px-4 pb-24 pt-[14vh] sm:px-8 sm:pb-32 lg:px-10 xl:px-12">
					{children}
					{/* The deck's runway, and an in-flow one: it is the last child, so it
					    is what pushes the container's content box — and therefore the
					    edge every sticky card is clamped to — below the last card. Padding
					    on the container could not do this; padding sits outside the
					    content box, where sticky cannot see it. */}
					<div
						ref={endRef}
						className="scroll-stack-end w-full"
						style={{ height: endSpace }}
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
			<div className="scroll-stack-inner px-4 pb-24 pt-[14vh] sm:px-8 sm:pb-32 lg:px-10 xl:px-12">
				{children}
				{/* See the note on the window-scroll branch's spacer. */}
				<div
					ref={endRef}
					className="scroll-stack-end w-full"
					style={{ height: endSpace }}
				/>
			</div>
		</div>
	);
};

export default ScrollStack;
