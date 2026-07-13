/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCarousel } from "./CarouselContext";
import { UI_SPRING } from "./motion";
import type { CarouselTheme } from "./theme";

/**
 * CarouselIndicators  the row of large circular thumbnails. The active one
 * scales up, shows full-colour and carries a shared ring that springs between
 * positions; inactive ones are dimmed/desaturated behind a thin border.
 * Falls back to numbers when no `thumbnails` are supplied.
 */
export function CarouselIndicators({
	className,
	thumbnails,
	theme = "dark",
}: {
	className?: string;
	thumbnails?: { src: string }[];
	theme?: CarouselTheme;
}) {
	const { count, index, goTo } = useCarousel();
	const reduce = useReducedMotion();
	const light = theme === "light";

	return (
		<div
			role="group"
			aria-label="Slide navigation"
			className={cn(
				"flex flex-wrap items-center justify-center gap-3 sm:gap-4",
				className,
			)}>
			{Array.from({ length: count }).map((_, i) => {
				const active = i === index;
				const thumb = thumbnails?.[i];
				return (
					<motion.button
						key={i}
						type="button"
						onClick={() => goTo(i)}
						aria-label={`Go to slide ${i + 1}`}
						aria-current={active ? "true" : undefined}
						animate={reduce ? undefined : { scale: active ? 1.15 : 1 }}
						whileHover={{ scale: active ? 1.2 : 1.1 }}
						whileTap={{ scale: 0.92 }}
						transition={UI_SPRING}
						className={cn(
							"group/dot relative flex size-14 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:size-16 lg:size-20",
							light ?
								"focus-visible:ring-ink/40"
							:	"focus-visible:ring-white/70",
						)}>
						{/* Image / number, clipped to the circle */}
						<span
							className={cn(
								"absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border text-[13px] font-semibold tabular-nums transition-colors duration-300",
								active ?
									light ? "border-ink bg-ink text-white"
									:	"border-white bg-white text-ink"
								: light ?
									"border-steel-300 text-steel-500 group-hover/dot:border-ink/60 group-hover/dot:text-ink"
								:	"border-white/30 text-white/60 group-hover/dot:border-white/70 group-hover/dot:text-white",
							)}>
							{thumb ?
								<>
									<Image
										src={thumb.src}
										alt=""
										fill
										sizes="96px"
										className={cn(
											"object-cover transition-all duration-300",
											active ?
												"opacity-100 grayscale-0"
											:	"opacity-60 grayscale group-hover/dot:opacity-90 group-hover/dot:grayscale-0",
										)}
									/>
									{!active && (
										<span
											aria-hidden
											className={cn(
												"pointer-events-none absolute inset-0",
												light ? "bg-white/30" : "bg-ink/30",
											)}
										/>
									)}
								</>
							:	<span className="relative z-10">{i + 1}</span>}
						</span>

						{/* Shared active ring (sits outside the clip) */}
						{active && !reduce && (
							<motion.span
								layoutId="carousel-active-ring"
								aria-hidden
								className={cn(
									"pointer-events-none absolute -inset-1 rounded-full ring-2",
									light ? "ring-ink/60" : "ring-white/70",
								)}
								transition={UI_SPRING}
							/>
						)}
					</motion.button>
				);
			})}
		</div>
	);
}
