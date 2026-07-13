/** @format */

"use client";

import { useId } from "react";
import { LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ShowcaseSlide } from "@/content/showcase";
import type { CarouselTheme } from "./theme";
import { CarouselProvider, useCarousel } from "./CarouselContext";
import { CarouselViewport } from "./CarouselSlide";
import { CarouselArrow } from "./CarouselControls";
import { CarouselIndicators } from "./CarouselIndicators";
import { CarouselCard } from "./CarouselCard";

/**
 * Carousel  premium, custom-built, infinitely looping slider.
 *
 * Layout (matches the reference): thumbnail indicators on top, then a large
 * centred card flanked by circular prev/next arrows that sit outside the card.
 *
 * Behaviour: spring slide transitions, drag/swipe with velocity-based paging,
 * 3.5s autoplay that pauses on hover / focus / drag / hidden tab, full keyboard
 * support (← → Home End) and a polite live region for screen readers.
 *
 * `theme` switches the whole surface between dark (default) and light.
 * `fill` makes the carousel stretch to its parent's height (the card area
 * flex-grows) instead of using a fixed height  use inside an h-screen flex
 * column. The parent must give it a height (e.g. flex-1 min-h-0).
 */
export function Carousel({
	slides,
	autoPlay = true,
	interval = 3500,
	theme = "dark",
	fill = false,
	className,
}: {
	slides: ShowcaseSlide[];
	autoPlay?: boolean;
	interval?: number;
	theme?: CarouselTheme;
	fill?: boolean;
	className?: string;
}) {
	if (!slides.length) return null;
	return (
		<CarouselProvider
			count={slides.length}
			autoPlay={autoPlay}
			interval={interval}>
			<CarouselInner
				slides={slides}
				theme={theme}
				fill={fill}
				className={className}
			/>
		</CarouselProvider>
	);
}

function CarouselInner({
	slides,
	theme = "dark",
	fill = false,
	className,
}: {
	slides: ShowcaseSlide[];
	theme?: CarouselTheme;
	fill?: boolean;
	className?: string;
}) {
	const { index, count, next, prev, goTo, setHovered, setFocused } =
		useCarousel();
	// Scope shared layout animations (active-ring) to this instance so multiple
	// carousels on one page don't cross-animate.
	const uid = useId();

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				prev();
				break;
			case "ArrowRight":
				e.preventDefault();
				next();
				break;
			case "Home":
				e.preventDefault();
				goTo(0);
				break;
			case "End":
				e.preventDefault();
				goTo(count - 1);
				break;
		}
	};

	return (
		<LayoutGroup id={uid}>
			<div
				role="region"
				aria-roledescription="carousel"
				aria-label="Featured work showcase"
				className={cn(
					"relative w-full",
					fill && "flex h-full flex-col",
					className,
				)}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				onFocus={() => setFocused(true)}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget as Node | null))
						setFocused(false);
				}}
				onKeyDown={onKeyDown}>
				{/* Top: thumbnail indicators */}
				<CarouselIndicators
					className={
						fill ? "mb-5 shrink-0 sm:mb-7 lg:mb-8" : "mb-8 sm:mb-10 lg:mb-12"
					}
					theme={theme}
					thumbnails={slides.map((s) => ({ src: s.image }))}
				/>

				{/* Middle: arrows flanking the card */}
				<div
					className={cn(
						"flex items-center gap-2.5 sm:gap-5 lg:gap-8",
						fill && "min-h-0 flex-1 items-stretch",
					)}>
					<CarouselArrow
						dir="prev"
						theme={theme}
						className={cn("hidden sm:flex", fill && "self-center")}
					/>

					<div
						className={cn(
							"relative flex-1",
							fill ? "h-full min-h-0" : "h-[540px] sm:h-[420px] lg:h-[440px]",
						)}>
						<CarouselViewport
							render={(i) => (
								<CarouselCard
									slide={slides[i]}
									index={i}
									theme={theme}
								/>
							)}
						/>
					</div>

					<CarouselArrow
						dir="next"
						theme={theme}
						className={cn("hidden sm:flex", fill && "self-center")}
					/>
				</div>

				{/* Below sm the flanking pair (2 × 44px + gaps) eats ~40% of a 320-375px
				    row and squeezes the card to ~200px, so there the arrows drop to
				    their own centred row under the card and it takes the full width.
				    From sm up they are `display:flex` in the row above exactly as
				    before and this row is `display:none`, so ≥1024px cannot move. */}
				<div className="mt-5 flex shrink-0 items-center justify-center gap-5 sm:hidden">
					<CarouselArrow
						dir="prev"
						theme={theme}
					/>
					<CarouselArrow
						dir="next"
						theme={theme}
					/>
				</div>

				{/* Screen-reader announcement */}
				<p
					aria-live="polite"
					aria-atomic="true"
					className="sr-only">
					{`Slide ${index + 1} of ${count}: ${slides[index]?.title ?? ""}`}
				</p>
			</div>
		</LayoutGroup>
	);
}
