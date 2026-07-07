/** @format */

"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./CarouselContext";
import { UI_SPRING } from "./motion";
import type { CarouselTheme } from "./theme";

/**
 * CarouselArrow  circular, thin-bordered nav button sitting outside the card.
 * Hover: gentle scale + brighter border + a soft glow + the arrow nudges.
 * Press: soft spring-back. Never disabled  the carousel loops infinitely.
 */
export function CarouselArrow({
	dir,
	theme = "dark",
	className,
}: {
	dir: "prev" | "next";
	theme?: CarouselTheme;
	className?: string;
}) {
	const { next, prev } = useCarousel();
	const isNext = dir === "next";
	const Icon = isNext ? ArrowRight : ArrowLeft;
	const light = theme === "light";

	return (
		<motion.button
			type="button"
			onClick={isNext ? next : prev}
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.92 }}
			transition={UI_SPRING}
			aria-label={isNext ? "Next slide" : "Previous slide"}
			className={cn(
				"group/arrow relative flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:size-14",
				light ?
					"border-steel-300 text-ink/70 hover:border-ink hover:text-ink focus-visible:ring-ink/40"
				:	"border-white/25 text-white/80 hover:border-white/80 hover:text-white focus-visible:ring-white/70",
				className,
			)}>
			{/* Hover glow */}
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover/arrow:opacity-100",
					light ?
						"shadow-[0_0_0_1px_rgba(11,27,58,0.15),0_10px_30px_-8px_rgba(11,27,58,0.35)]"
					:	"shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_10px_34px_-6px_rgba(255,255,255,0.4)]",
				)}
			/>
			<Icon
				className={cn(
					"size-5 transition-transform duration-300",
					isNext ?
						"group-hover/arrow:translate-x-0.5"
					:	"group-hover/arrow:-translate-x-0.5",
				)}
			/>
		</motion.button>
	);
}
