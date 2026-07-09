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

		const ro = new ResizeObserver((entries) => {
			const w = entries[0]?.contentRect.width ?? 0;
			if (w) setWidth(Math.round(w));
		});
		ro.observe(el);
		// Seed immediately so we don't wait a frame on mount.
		const rect = el.getBoundingClientRect();
		if (rect.width) setWidth(Math.round(rect.width));

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setInView(true);
					io.disconnect();
				}
			},
			{ rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
		);
		io.observe(el);

		return () => {
			ro.disconnect();
			io.disconnect();
		};
	}, []);

	return { ref, width, inView };
}
