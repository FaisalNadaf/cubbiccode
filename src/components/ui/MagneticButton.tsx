"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Wraps any element and gives it a subtle magnetic pull toward the cursor.
 */
export function Magnetic({
	children,
	className,
	strength = 0.35,
}: {
	children: React.ReactNode;
	className?: string;
	strength?: number;
}) {
	// Measured once per hover instead of once per pointer frame. A
	// getBoundingClientRect() in onMouseMove forces a synchronous layout flush,
	// and Button defaults to magnetic, so that was every button on the page.
	const rectRef = useRef<DOMRect | null>(null);
	const [hovering, setHovering] = useState(false);

	const reduce = usePrefersReducedMotion();

	// A magnet needs a cursor to be pulled toward. On touch there isn't one:
	// tapping fires a *synthetic* mouseenter/mousemove at the contact point, so
	// the button lurches under the finger, and no mouseleave follows until the
	// user taps something else — the offset just stays. Starts false on the
	// server and on the first client render (same as usePrefersReducedMotion),
	// so the fine-pointer tree hydrates unchanged.
	const [coarse, setCoarse] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(pointer: coarse)");
		const sync = () => setCoarse(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
	const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

	function onEnter(e: React.MouseEvent<HTMLDivElement>) {
		rectRef.current = e.currentTarget.getBoundingClientRect();
		setHovering(true);
	}

	function onMove(e: React.MouseEvent<HTMLDivElement>) {
		const rect = rectRef.current;
		if (!rect) return;
		x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
		y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
	}

	function onLeave() {
		setHovering(false);
		x.set(0);
		y.set(0);
	}

	// Reduced motion or touch: no pull, no springs, no pointer handlers, no layer.
	if (reduce || coarse) {
		return <span className={cn("inline-block", className)}>{children}</span>;
	}

	return (
		<motion.div
			onMouseEnter={onEnter}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			style={{ x: sx, y: sy }}
			className={cn(
				"inline-block",
				// Promote to its own layer only while it can actually move. A
				// permanent will-change kept a standing compositor layer for every
				// button on the site.
				hovering && "[will-change:transform]",
				className,
			)}>
			{children}
		</motion.div>
	);
}
