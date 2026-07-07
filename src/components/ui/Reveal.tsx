/** @format */

"use client";

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
	as?: "div" | "section" | "li" | "span" | "article";
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
					transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] },
				},
			};

	return (
		<MotionTag
			className={cn(className)}
			variants={variants}
			initial="hidden"
			whileInView="show"
			viewport={{ once, amount }}>
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
	return (
		<motion.div
			className={cn(className)}
			initial="hidden"
			whileInView="show"
			viewport={{ once, amount }}
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
	as?: "div" | "li" | "span" | "article";
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
