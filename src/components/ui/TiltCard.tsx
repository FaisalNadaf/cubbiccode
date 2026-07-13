/** @format */

"use client";

import { useEffect, useRef, useState } from "react";
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	useMotionTemplate,
	useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A floating card that tilts in 3D toward the pointer, with a soft glare that
 * tracks the cursor.
 *
 * Tilt is enabled only AFTER mount (and never under prefers-reduced-motion), so
 * the server render and the first client render are structurally identical  no
 * hydration mismatch, and reduced-motion users get a perfectly still card. The
 * root always carries `group relative`, so caller-supplied group-hover /
 * absolutely-positioned children (e.g. a corner glow) work in every mode.
 *
 * Pass the card surface styling (bg / border / rounding / padding) via
 * `className`; include `rounded-*` + `overflow-hidden` so the inherited-radius
 * glare clips correctly.
 */
export function TiltCard({
	children,
	className,
	max = 8,
}: {
	children: React.ReactNode;
	className?: string;
	max?: number;
}) {
	const reduce = useReducedMotion();
	const [active, setActive] = useState(false);
	const rectRef = useRef<DOMRect | null>(null);

	const px = useMotionValue(0.5);
	const py = useMotionValue(0.5);
	const spx = useSpring(px, { stiffness: 260, damping: 22 });
	const spy = useSpring(py, { stiffness: 260, damping: 22 });

	const rotateY = useTransform(spx, [0, 1], [-max, max]);
	const rotateX = useTransform(spy, [0, 1], [max, -max]);
	const glareX = useTransform(spx, [0, 1], ["0%", "100%"]);
	const glareY = useTransform(spy, [0, 1], ["0%", "100%"]);
	const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45), transparent 55%)`;

	// Defer tilt to after mount, and disable it under reduced motion, so SSR and
	// the first client paint match exactly.
	//
	// Also off when the primary pointer is coarse. There is no cursor to tilt
	// toward on a touchscreen, and the synthesised mouse events a tap fires would
	// rotate the card and then leave it rotated (no reliable mouseleave). Reading
	// matchMedia inside the effect keeps SSR and the first client render
	// identical; a mouse/trackpad machine reports `pointer: fine`, so the desktop
	// branch is unchanged.
	useEffect(() => {
		const coarse =
			typeof window !== "undefined" &&
			window.matchMedia("(pointer: coarse)").matches;
		setActive(!reduce && !coarse);
	}, [reduce]);

	return (
		<motion.div
			onMouseEnter={
				active ?
					(e) => {
						rectRef.current = e.currentTarget.getBoundingClientRect();
					}
				:	undefined
			}
			onMouseMove={
				active ?
					(e) => {
						const r =
							rectRef.current ?? e.currentTarget.getBoundingClientRect();
						px.set((e.clientX - r.left) / r.width);
						py.set((e.clientY - r.top) / r.height);
					}
				:	undefined
			}
			onMouseLeave={
				active ?
					() => {
						px.set(0.5);
						py.set(0.5);
					}
				:	undefined
			}
			style={
				active ? { rotateX, rotateY, transformPerspective: 1000 } : undefined
			}
			className={cn(
				"group relative",
				active && "will-change-transform",
				className,
			)}>
			{children}
			{/* cursor-tracking glare  only mounted once tilt is active */}
			{active && (
				<motion.span
					aria-hidden
					className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60"
					style={{ background: glare }}
				/>
			)}
		</motion.div>
	);
}
