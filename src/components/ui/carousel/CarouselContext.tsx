/** @format */

"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { wrap, useReducedMotion } from "framer-motion";

/**
 * CarouselContext  single source of truth for the carousel.
 *
 * Paging uses an unbounded `page` counter; the visible `index` is `page` wrapped
 * into [0, count). This gives a seamless infinite loop (10 → 1, 1 → 10) with no
 * reset jump, and a `direction` (-1 | 0 | 1) for the enter/exit animations.
 *
 * Autoplay is paused while any of {hovering, focus-within, dragging, tab-hidden}
 * is true. Each is an idempotent boolean, so there are no unbalanced
 * pause/resume bugs, and the timer restarts cleanly on every page change.
 */

type CarouselContextValue = {
	count: number;
	index: number;
	page: number;
	direction: number;
	next: () => void;
	prev: () => void;
	goTo: (target: number) => void;
	isAutoPlaying: boolean;
	setHovered: (v: boolean) => void;
	setFocused: (v: boolean) => void;
	setDragging: (v: boolean) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
	const ctx = useContext(CarouselContext);
	if (!ctx)
		throw new Error("useCarousel must be used within <CarouselProvider>");
	return ctx;
}

export function CarouselProvider({
	count,
	autoPlay = true,
	interval = 5000,
	children,
}: {
	count: number;
	autoPlay?: boolean;
	interval?: number;
	children: React.ReactNode;
}) {
	const reduce = useReducedMotion();
	const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
	const index = wrap(0, count, page);

	const paginate = useCallback((dir: number) => {
		setPage(([p]) => [p + dir, dir]);
	}, []);
	const next = useCallback(() => paginate(1), [paginate]);
	const prev = useCallback(() => paginate(-1), [paginate]);

	const goTo = useCallback(
		(target: number) => {
			setPage(([p]) => {
				const current = wrap(0, count, p);
				let delta = target - current;
				// Travel the short way around the loop.
				if (delta > count / 2) delta -= count;
				if (delta < -count / 2) delta += count;
				if (delta === 0) return [p, 0];
				return [p + delta, Math.sign(delta)];
			});
		},
		[count],
	);

	// ── Autoplay pause signals (all idempotent) ──────────────────────────
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const onVis = () => setHidden(document.hidden);
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);

	const enabled = autoPlay && !reduce && count > 1;
	const isAutoPlaying = enabled && !hovered && !focused && !dragging && !hidden;

	useEffect(() => {
		if (!isAutoPlaying) return;
		// Depends on `page` so each advance restarts the countdown cleanly.
		const id = window.setTimeout(next, interval);
		return () => window.clearTimeout(id);
	}, [isAutoPlaying, interval, next, page]);

	const value = useMemo<CarouselContextValue>(
		() => ({
			count,
			index,
			page,
			direction,
			next,
			prev,
			goTo,
			isAutoPlaying,
			setHovered,
			setFocused,
			setDragging,
		}),
		[count, index, page, direction, next, prev, goTo, isAutoPlaying],
	);

	return (
		<CarouselContext.Provider value={value}>
			{children}
		</CarouselContext.Provider>
	);
}
