/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { contentContainer, contentItem, reducedContentItem } from "./motion";
import type { CarouselTheme } from "./theme";
import type { ShowcaseSlide } from "@/content/showcase";

/**
 * CarouselCard  the content card. Children animate in with a stagger every
 * time the slide mounts (eyebrow → title → copy → CTA → image). A faint
 * two-digit index watermark nods to the reference sketch. Dark or light themed.
 */
export function CarouselCard({
	slide,
	index,
	theme = "dark",
}: {
	slide: ShowcaseSlide;
	index: number;
	theme?: CarouselTheme;
}) {
	const reduce = useReducedMotion();
	const item = reduce ? reducedContentItem : contentItem;
	const light = theme === "light";

	return (
		<article
			className={cn(
				"relative flex h-full w-full select-none overflow-hidden rounded-[1.75rem] border",
				light ?
					"border-steel-200 bg-white shadow-card"
				:	"border-white/12 bg-gradient-to-br from-white/[0.07] to-white/[0.015] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.95)] backdrop-blur-sm",
			)}>
			{/* Index watermark */}
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute -bottom-10 right-2 select-none font-display text-[10rem] font-bold leading-none sm:text-[13rem] lg:text-[16rem]",
					light ? "text-ink/[0.04]" : "text-white/[0.04]",
				)}>
				{String(index + 1).padStart(2, "0")}
			</span>

			<motion.div
				variants={contentContainer}
				initial="hidden"
				animate="show"
				className="relative z-10 flex h-full w-full flex-col justify-center gap-5 p-5 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-14">
				{/* Text column */}
				<div className="flex flex-1 flex-col items-start gap-4">
					<motion.span
						variants={item}
						className={cn(
							"inline-flex items-center rounded-full border px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.22em]",
							light ?
								"border-steel-300 text-steel-600"
							:	"border-white/20 text-white/70",
						)}>
						{slide.eyebrow}
					</motion.span>

					<motion.h3
						variants={item}
						className={cn(
							"font-display text-2xl font-bold leading-[1.1] sm:text-3xl lg:text-[2.6rem]",
							light ? "text-ink" : "text-white",
						)}>
						{slide.title}
					</motion.h3>

					<motion.p
						variants={item}
						className={cn(
							"max-w-md text-sm leading-relaxed sm:text-[15px]",
							light ? "text-steel-600" : "text-white/60",
						)}>
						{slide.description}
					</motion.p>

					<motion.a
						variants={item}
						href={slide.cta.href}
						target="_blank"
						rel="noopener noreferrer"
						draggable={false}
						onClick={(e) => e.stopPropagation()}
						className={cn(
							"group/cta mt-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-transform duration-300 hover:scale-[1.03] active:scale-95",
							light ? "bg-ink text-white" : "bg-white text-ink",
						)}>
						{slide.cta.label}
						<ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
					</motion.a>
				</div>

				{/* Image column  large, fills the card height on desktop */}
				<motion.div
					variants={item}
					className={cn(
						"relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border lg:aspect-auto lg:h-full lg:w-[58%]",
						light ? "border-steel-200" : "border-white/10",
					)}>
					<Image
						src={slide.image}
						alt={slide.title}
						fill
						draggable={false}
						sizes="(max-width: 1024px) 90vw, 58vw"
						className="object-cover object-top"
					/>
					<div
						aria-hidden
						className={cn(
							"absolute inset-0 bg-gradient-to-t via-transparent to-transparent",
							light ? "from-black/15" : "from-black/45",
						)}
					/>
				</motion.div>
			</motion.div>
		</article>
	);
}
