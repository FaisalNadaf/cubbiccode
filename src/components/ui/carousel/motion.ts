/** @format */

/**
 * CarouselMotion — shared springs, easings and variants for the carousel.
 *
 * Everything animates with `transform`/`opacity`/`filter` only (GPU-friendly).
 * Slides use a physical spring; opacity + blur ride a premium ease so they
 * resolve a touch ahead of the positional spring, which reads as "natural".
 */

import type { Transition, Variants } from "framer-motion";

// Apple / Stripe / Linear-style ease.
export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

// Positional spring used for slide x/scale.
export const SLIDE_SPRING: Transition = {
	type: "spring",
	stiffness: 120,
	damping: 20,
	mass: 0.9,
};

// Snappier spring for hover/press/indicator micro-interactions.
export const UI_SPRING: Transition = {
	type: "spring",
	stiffness: 360,
	damping: 24,
};

// Tween for opacity/blur — slightly faster than the spring.
export const FADE_TWEEN: Transition = {
	duration: 0.5,
	ease: PREMIUM_EASE,
};

const slideTransition: Transition = {
	x: SLIDE_SPRING,
	scale: SLIDE_SPRING,
	opacity: FADE_TWEEN,
	filter: FADE_TWEEN,
};

/**
 * Slide enter/exit, driven by direction (1 = forward, -1 = back).
 * Incoming starts offset + scaled down + blurred, glides to rest;
 * outgoing scales down, fades, blurs and drifts the opposite way.
 */
export const slideVariants: Variants = {
	enter: (dir: number) => ({
		x: dir >= 0 ? "55%" : "-55%",
		scale: 0.95,
		opacity: 0,
		filter: "blur(10px)",
	}),
	center: {
		x: "0%",
		scale: 1,
		opacity: 1,
		filter: "blur(0px)",
		transition: slideTransition,
	},
	exit: (dir: number) => ({
		x: dir >= 0 ? "-45%" : "45%",
		scale: 0.95,
		opacity: 0,
		filter: "blur(10px)",
		transition: slideTransition,
	}),
};

// Reduced motion: cross-fade only, no movement/blur.
export const reducedSlideVariants: Variants = {
	enter: { opacity: 0 },
	center: { opacity: 1, transition: { duration: 0.2 } },
	exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Staggered content inside a slide (heading → description → button → image).
export const contentContainer: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const contentItem: Variants = {
	hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
	show: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.6, ease: PREMIUM_EASE },
	},
};

export const reducedContentItem: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 0.2 } },
};

// Drag → navigation: weight the swipe by distance × velocity.
export const SWIPE_CONFIDENCE = 8000;
export const swipePower = (offset: number, velocity: number) =>
	Math.abs(offset) * velocity;
