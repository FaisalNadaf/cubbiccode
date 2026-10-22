"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Subtle dual-ring custom cursor. Desktop pointer devices only. */
export function Cursor() {
	const [enabled, setEnabled] = useState(false);
	const [active, setActive] = useState(false);

	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
	const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

	useEffect(() => {
		const fine =
			window.matchMedia("(pointer: fine)").matches &&
			!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!fine) return;
		setEnabled(true);

		const move = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		const over = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			setActive(!!target.closest("a,button,[data-cursor],input,textarea"));
		};
		// Neither handler calls preventDefault; passive lets the browser skip the
		// "will it block scrolling?" wait on every event.
		window.addEventListener("mousemove", move, { passive: true });
		window.addEventListener("mouseover", over, { passive: true });
		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseover", over);
		};
	}, [x, y]);

	if (!enabled) return null;

	// Position is driven by `x`/`y` (compositor transforms) instead of `left`/
	// `top`, which invalidated layout on every pointer frame — and again on each
	// spring frame while the ring settled behind the cursor.
	//
	// Centering is done with negative margins rather than a -50% translate, so
	// framer-motion's composed transform stays purely translate and nothing
	// fights it. Size still animates on hover: that fires twice per hover, not
	// 60x/second, and keeps the ring's 1px border visually exact (a scale()
	// would thicken it).
	return (
		<>
			<motion.div
				aria-hidden
				style={{ x, y }}
				className="pointer-events-none fixed left-0 top-0 z-[90] hidden rounded-full bg-corporate-600 will-change-transform lg:block"
				animate={{
					width: active ? 10 : 8,
					height: active ? 10 : 8,
					marginLeft: active ? -5 : -4,
					marginTop: active ? -5 : -4,
				}}
			/>
			<motion.div
				aria-hidden
				style={{ x: ringX, y: ringY }}
				className="pointer-events-none fixed left-0 top-0 z-[90] hidden rounded-full border border-ink/40 will-change-transform lg:block"
				animate={{
					width: active ? 64 : 42,
					height: active ? 64 : 42,
					marginLeft: active ? -32 : -21,
					marginTop: active ? -32 : -21,
					borderColor: active ? "rgba(27,110,194,0.6)" : "rgba(11,27,58,0.35)",
					backgroundColor: active ? "rgba(27,110,194,0.06)" : "rgba(27,110,194,0)",
				}}
				transition={{ type: "spring", stiffness: 220, damping: 22 }}
			/>
		</>
	);
}
