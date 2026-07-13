/** @format */

"use client";

/**
 * CardSwap  animated swapping card stack (adapted from React Bits).
 * https://reactbits.dev  •  Dependency: gsap
 *
 * Base <Card> chrome is intentionally neutral so callers own the look
 * (border / background) via className. Only the structural + 3D transform
 * classes are baked in.
 */

import React, {
	Children,
	cloneElement,
	forwardRef,
	isValidElement,
	ReactElement,
	ReactNode,
	RefObject,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import gsap from "gsap";

// Runs before paint on the client so the fitted geometry lands in the same frame
// as hydration; falls back to useEffect on the server, where useLayoutEffect warns.
const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

// GSAP animates via rAF/transforms, so a CSS `prefers-reduced-motion` block
// cannot reach it — it has to opt out in JS.
const prefersReducedMotion = () =>
	typeof window !== "undefined" &&
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface CardSwapProps {
	width?: number | string;
	height?: number | string;
	cardDistance?: number;
	verticalDistance?: number;
	delay?: number;
	pauseOnHover?: boolean;
	onCardClick?: (idx: number) => void;
	/** Fires with the original index of the card entering the front slot. */
	onActiveChange?: (index: number) => void;
	skewAmount?: number;
	easing?: "linear" | "elastic";
	children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ customClass, ...rest }, ref) => (
		<div
			ref={ref}
			{...rest}
			className={`absolute top-1/2 left-1/2 overflow-hidden rounded-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
		/>
	),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
	x: number;
	y: number;
	z: number;
	zIndex: number;
}

const makeSlot = (
	i: number,
	distX: number,
	distY: number,
	total: number,
): Slot => ({
	x: i * distX,
	y: -i * distY,
	// Shallow z-recede so back cards don't foreshorten into each other  keeps
	// every card's titlebar readable even with a tall stack.
	z: -i * distX * 0.9,
	zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
	gsap.set(el, {
		x: slot.x,
		y: slot.y,
		z: slot.z,
		xPercent: -50,
		yPercent: -50,
		skewY: skew,
		transformOrigin: "center center",
		zIndex: slot.zIndex,
		force3D: true,
	});

const CardSwap: React.FC<CardSwapProps> = ({
	width = 500,
	height = 400,
	cardDistance = 60,
	verticalDistance = 70,
	delay = 5000,
	pauseOnHover = false,
	onCardClick,
	onActiveChange,
	skewAmount = 6,
	easing = "elastic",
	children,
}) => {
	// Keep the latest callback in a ref so the animation effect never goes stale
	// and doesn't need to re-run when the parent re-renders.
	const onActiveRef = useRef(onActiveChange);
	onActiveRef.current = onActiveChange;
	const config =
		easing === "elastic" ?
			{
				ease: "elastic.out(0.6,0.9)",
				durDrop: 2,
				durMove: 2,
				durReturn: 2,
				promoteOverlap: 0.9,
				returnDelay: 0.05,
			}
		:	{
				ease: "power1.inOut",
				durDrop: 0.8,
				durMove: 0.8,
				durReturn: 0.8,
				promoteOverlap: 0.45,
				returnDelay: 0.2,
			};

	const childArr = useMemo(
		() => Children.toArray(children) as ReactElement<CardProps>[],
		[children],
	);
	const refs = useMemo<CardRef[]>(
		() => childArr.map(() => React.createRef<HTMLDivElement>()),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[childArr.length],
	);

	const order = useRef<number[]>(
		Array.from({ length: childArr.length }, (_, i) => i),
	);

	const tlRef = useRef<gsap.core.Timeline | null>(null);
	const intervalRef = useRef<number>(0);
	const container = useRef<HTMLDivElement>(null);
	const moveToFrontRef = useRef<((idx: number) => void) | null>(null);

	/**
	 * Below lg the caller's 600px card is wider than the column it sits in. The
	 * previous fix CSS-scaled the whole stack (to 0.72, then 0.58), which rendered
	 * the card's 14px titlebar at ~8px  unreadable. Instead we shrink the card
	 * *box* and the fan offsets with it, so the type still renders at full size.
	 *
	 * `fit` is hard-gated on `(min-width: 1024px)`: at desktop widths it is pinned
	 * to 1 and every value derived from it collapses back to the raw prop, so the
	 * >= 1024 render is untouched. It also *starts* at 1, so SSR and the first
	 * client render emit the desktop geometry and hydration always matches.
	 */
	const [fit, setFit] = useState(1);

	useIsomorphicLayoutEffect(() => {
		const host = container.current?.parentElement;
		if (!host || typeof width !== "number") return;

		const desktop = window.matchMedia("(min-width: 1024px)");
		const measure = () => {
			if (desktop.matches) {
				setFit(1);
				return;
			}
			const avail = host.clientWidth;
			if (!avail) return;
			// Quantised to 2% steps so a drag-resize can't restart the GSAP timeline
			// on every pixel of travel.
			const raw = Math.min(1, avail / width);
			setFit(Math.max(0.4, Math.round(raw * 50) / 50));
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(host);
		desktop.addEventListener("change", measure);
		return () => {
			ro.disconnect();
			desktop.removeEventListener("change", measure);
		};
	}, [width]);

	const fitted = fit < 1;
	const boxW =
		typeof width === "number" && fitted ? Math.round(width * fit) : width;
	const boxH =
		typeof height === "number" && fitted ? Math.round(height * fit) : height;
	const distX =
		fitted ? Math.max(10, Math.round(cardDistance * fit)) : cardDistance;
	const distY =
		fitted ? Math.max(10, Math.round(verticalDistance * fit)) : verticalDistance;
	const dropY = fitted ? Math.max(220, Math.round(500 * fit)) : 500;

	useEffect(() => {
		// GSAP drives rAF/transforms, so the global `prefers-reduced-motion` block
		// in globals.css cannot touch it  it has to opt out by hand.
		const reduce = prefersReducedMotion();

		const total = refs.length;
		// Seed from the CURRENT order, not from the original index. This effect
		// re-runs whenever the fit changes (any resize below lg), and by then the
		// deck is usually mid-rotation — placing card i into slot i would put a card
		// in front that isn't the one we announce as active on the next line, so the
		// copy panel would describe a screenshot that isn't the one on top.
		order.current.forEach((idx, pos) =>
			placeNow(
				refs[idx].current!,
				makeSlot(pos, distX, distY, total),
				skewAmount,
			),
		);
		onActiveRef.current?.(order.current[0]);

		const swap = () => {
			if (order.current.length < 2) return;

			const [front, ...rest] = order.current;
			// Commit the rotation now, not in a trailing tl.call(). The timeline runs
			// 2.2s + (n - 2) * 0.15s, which is 3.1s for an 8-card deck — longer than
			// the 3s auto-advance — so a deferred commit landed *after* the next swap
			// had already read `order`. That swap then dropped the same card twice and
			// re-announced the same active index, stalling the copy panel a card behind
			// the deck. moveToFront() below already commits synchronously; match it.
			order.current = [...rest, front];

			const elFront = refs[front].current!;
			// Every card of a still-running swap is re-targeted below, so killing it
			// strands nothing — it just stops two timelines fighting over the same
			// element on decks long enough to overlap the interval.
			tlRef.current?.kill();
			const tl = gsap.timeline();
			tlRef.current = tl;

			tl.to(elFront, {
				y: `+=${dropY}`,
				duration: config.durDrop,
				ease: config.ease,
			});

			tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
			// The second card is the one sliding into the front slot  surface it.
			const upcoming = rest[0];
			tl.call(() => onActiveRef.current?.(upcoming), undefined, "promote");
			rest.forEach((idx, i) => {
				const el = refs[idx].current!;
				const slot = makeSlot(i, distX, distY, refs.length);
				tl.set(el, { zIndex: slot.zIndex }, "promote");
				tl.to(
					el,
					{
						x: slot.x,
						y: slot.y,
						z: slot.z,
						duration: config.durMove,
						ease: config.ease,
					},
					`promote+=${i * 0.15}`,
				);
			});

			const backSlot = makeSlot(refs.length - 1, distX, distY, refs.length);
			tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
			tl.call(
				() => {
					gsap.set(elFront, { zIndex: backSlot.zIndex });
				},
				undefined,
				"return",
			);
			tl.to(
				elFront,
				{
					x: backSlot.x,
					y: backSlot.y,
					z: backSlot.z,
					duration: config.durReturn,
					ease: config.ease,
				},
				"return",
			);
		};

		let paused = false;

		// Bring an arbitrary card to the front (used on click). Re-slots every card
		// to its new position and restarts the auto-advance timer.
		const moveToFront = (originalIdx: number) => {
			const cur = order.current;
			const k = cur.indexOf(originalIdx);
			if (k <= 0) return; // not found, or already at the front

			const newOrder = [cur[k], ...cur.slice(0, k), ...cur.slice(k + 1)];
			order.current = newOrder;

			tlRef.current?.kill();
			const tl = gsap.timeline();
			tlRef.current = tl;
			newOrder.forEach((idx, pos) => {
				const slot = makeSlot(pos, distX, distY, newOrder.length);
				const el = refs[idx].current!;
				tl.set(el, { zIndex: slot.zIndex }, 0);
				tl.to(
					el,
					{
						x: slot.x,
						y: slot.y,
						z: slot.z,
						duration: reduce ? 0 : config.durMove,
						ease: config.ease,
					},
					0,
				);
			});

			onActiveRef.current?.(originalIdx);
			clearInterval(intervalRef.current);
			if (!paused && !reduce)
				intervalRef.current = window.setInterval(swap, delay);
		};
		moveToFrontRef.current = moveToFront;

		// Under reduced motion the deck is laid out statically  no opening swap,
		// no auto-advance. Tapping a card still re-slots it, just instantly.
		if (!reduce) {
			swap();
			intervalRef.current = window.setInterval(swap, delay);
		}

		// Touch browsers (notably iOS Safari) synthesise mouseenter on tap, which
		// would pause the deck with no matching mouseleave to ever resume it. Bind
		// the pause listeners only where a real hover exists.
		const canHover = window.matchMedia("(hover: hover)").matches;

		if (pauseOnHover && canHover && !reduce) {
			const node = container.current!;
			const pause = () => {
				paused = true;
				tlRef.current?.pause();
				clearInterval(intervalRef.current);
			};
			const resume = () => {
				paused = false;
				tlRef.current?.play();
				clearInterval(intervalRef.current);
				intervalRef.current = window.setInterval(swap, delay);
			};
			node.addEventListener("mouseenter", pause);
			node.addEventListener("mouseleave", resume);
			return () => {
				node.removeEventListener("mouseenter", pause);
				node.removeEventListener("mouseleave", resume);
				clearInterval(intervalRef.current);
				tlRef.current?.kill();
			};
		}
		return () => {
			clearInterval(intervalRef.current);
			tlRef.current?.kill();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [distX, distY, dropY, delay, pauseOnHover, skewAmount, easing]);

	const rendered = childArr.map((child, i) =>
		isValidElement<CardProps>(child) ?
			cloneElement(child, {
				key: i,
				ref: refs[i],
				style: { width: boxW, height: boxH, ...(child.props.style ?? {}) },
				onClick: (e: React.MouseEvent<HTMLDivElement>) => {
					child.props.onClick?.(e);
					moveToFrontRef.current?.(i);
					onCardClick?.(i);
				},
			} as CardProps & React.RefAttributes<HTMLDivElement>)
		:	child,
	);

	// The `max-lg:` rules can only ever match below 1024px, and the base
	// (>= 1024) transform is left exactly as it was. The old below-lg CSS scale
	// is gone: the box is fitted in JS above, so the stack no longer needs
	// shrinking and its type stays at full size.
	return (
		<div
			ref={container}
			className="absolute bottom-0 right-0 origin-bottom-right -translate-x-[3%] -translate-y-[2%] transform overflow-visible [perspective:1400px] max-lg:translate-x-0 max-lg:translate-y-0"
			style={{ width: boxW, height: boxH }}>
			{rendered}
		</div>
	);
};

export default CardSwap;
