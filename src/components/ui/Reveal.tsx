/** @format */

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
	up: { y: 28 },
	down: { y: -28 },
	left: { x: 28 },
	right: { x: -28 },
	none: {},
};

const BELOW_LG = "(max-width: 1023.98px)";

// Derived from framer's own prop so the (template-literal-typed) `margin` stays
// in step with whatever version is installed.
type Viewport = NonNullable<React.ComponentProps<typeof motion.div>["viewport"]>;

/**
 * An `amount` threshold can strand content at opacity 0 forever on a phone.
 * IntersectionObserver reports (visible area / ELEMENT area), so an element
 * taller than `viewport height / amount` can never reach the threshold — and the
 * three-column grid that is 400px tall on desktop is a 3000px single column on a
 * 667px-tall iPhone. At amount 0.25 that grid tops out at a ratio of ~0.22 and
 * the reveal simply never fires: the whole section stays blank.
 *
 * Below lg we therefore trigger on any intersection (threshold 0, which cannot
 * get stuck) and pull the trigger line up with a bottom root-margin so the
 * reveal still starts once the element is properly on screen. At >= lg the
 * caller's `amount` is passed through verbatim, so desktop timing is untouched.
 */
function useRevealViewport(once: boolean, amount: number): Viewport {
	const [belowLg, setBelowLg] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia(BELOW_LG);
		const sync = () => setBelowLg(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	return belowLg ?
			{ once, amount: "some", margin: "0px 0px -15% 0px" }
		:	{ once, amount };
}

export function Reveal({
	children,
	className,
	direction = "up",
	delay = 0,
	duration = 0.7,
	once = true,
	amount = 0.3,
	as = "div",
}: {
	children: React.ReactNode;
	className?: string;
	direction?: Direction;
	delay?: number;
	duration?: number;
	once?: boolean;
	amount?: number;
	as?: "div" | "section" | "li" | "span" | "article" | "p";
}) {
	const reduce = useReducedMotion();
	const MotionTag = motion[as] as typeof motion.div;
	const viewport = useRevealViewport(once, amount);

	const variants: Variants =
		reduce ?
			{ hidden: { opacity: 0 }, show: { opacity: 1 } }
		:	{
				hidden: { opacity: 0, ...offset[direction] },
				show: {
					opacity: 1,
					x: 0,
					y: 0,
					transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] },
				},
			};

	return (
		<MotionTag
			className={cn(className)}
			variants={variants}
			initial="hidden"
			whileInView="show"
			viewport={viewport}>
			{children}
		</MotionTag>
	);
}

/** Stagger container  children should be <RevealItem> */
export function RevealGroup({
	children,
	className,
	stagger = 0.09,
	delay = 0,
	once = true,
	amount = 0.25,
}: {
	children: React.ReactNode;
	className?: string;
	stagger?: number;
	delay?: number;
	once?: boolean;
	amount?: number;
}) {
	const viewport = useRevealViewport(once, amount);

	return (
		<motion.div
			className={cn(className)}
			initial="hidden"
			whileInView="show"
			viewport={viewport}
			variants={{
				hidden: {},
				show: {
					transition: { staggerChildren: stagger, delayChildren: delay },
				},
			}}>
			{children}
		</motion.div>
	);
}

export function RevealItem({
	children,
	className,
	direction = "up",
	as = "div",
}: {
	children: React.ReactNode;
	className?: string;
	direction?: Direction;
	as?: "div" | "li" | "span" | "article" | "p";
}) {
	const reduce = useReducedMotion();
	const MotionTag = motion[as] as typeof motion.div;
	const variants: Variants =
		reduce ?
			{ hidden: { opacity: 0 }, show: { opacity: 1 } }
		:	{
				hidden: { opacity: 0, ...offset[direction] },
				show: {
					opacity: 1,
					x: 0,
					y: 0,
					transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] },
				},
			};
	return (
		<MotionTag
			className={cn(className)}
			variants={variants}>
			{children}
		</MotionTag>
	);
}
