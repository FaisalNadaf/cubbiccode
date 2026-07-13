/** @format */

"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures an element's width (ResizeObserver) and reports when it first scrolls
 * into view (IntersectionObserver) — the two signals every chart needs to draw
 * crisp, correctly-sized, animate-on-reveal SVG. Before the first measurement
 * `width` is 0, so charts render a skeleton (no SSR/client text mismatch).
 */
export function useChartSize<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);
	const [width, setWidth] = useState(0);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const measure = () => {
			const w = el.getBoundingClientRect().width;
			if (w) setWidth(Math.round(w));
		};
		// Seed immediately so we don't wait a frame on mount.
		measure();

		let ro: ResizeObserver | undefined;
		if (typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver((entries) => {
				const w = entries[0]?.contentRect.width ?? 0;
				if (w) setWidth(Math.round(w));
			});
			ro.observe(el);
		} else {
			// iOS Safari below 13.4 ships no ResizeObserver. Without a fallback the
			// width would never update and the chart would sit on its skeleton for
			// the life of the page (including after a rotation).
			window.addEventListener("resize", measure);
			window.addEventListener("orientationchange", measure);
		}

		let io: IntersectionObserver | undefined;
		if (typeof IntersectionObserver !== "undefined") {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting) {
						setInView(true);
						observer.disconnect();
					}
				},
				{ rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
			);
			observer.observe(el);
			io = observer;
		} else {
			// No IntersectionObserver means `inView` would never flip, which leaves
			// the draw-in clip rect at width 0 — i.e. a blank chart, not an
			// un-animated one. Reveal it immediately instead.
			setInView(true);
		}

		return () => {
			ro?.disconnect();
			io?.disconnect();
			window.removeEventListener("resize", measure);
			window.removeEventListener("orientationchange", measure);
		};
	}, []);

	return { ref, width, inView };
}
