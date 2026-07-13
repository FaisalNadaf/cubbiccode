/** @format */

"use client";

import { useEffect, useState } from "react";
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useCarousel } from "./CarouselContext";
import {
	slideVariants,
	reducedSlideVariants,
	touchSlideVariants,
	reducedTouchSlideVariants,
	swipePower,
	SWIPE_CONFIDENCE,
} from "./motion";

/**
 * Matches `(pointer: coarse)`. Starts false so the server render and the fine-
 * pointer (desktop) path are identical to the pre-existing behaviour.
 */
function useCoarsePointer() {
	const [coarse, setCoarse] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(pointer: coarse)");
		const sync = () => setCoarse(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);
	return coarse;
}

/**
 * CarouselViewport  renders exactly one slide (the wrapped `index`) inside an
 * AnimatePresence so the outgoing/incoming slides cross-animate. The slide is
 * drag-enabled: a small drag rubber-bands back to centre, a fast/long flick
 * paginates. `render` receives the current index so the parent owns the content.
 */
export function CarouselViewport({
	render,
	className,
}: {
	render: (index: number) => React.ReactNode;
	className?: string;
}) {
	const { page, index, direction, next, prev, setDragging } = useCarousel();
	const reduce = useReducedMotion();
	const coarse = useCoarsePointer();
	const variants =
		coarse ?
			reduce ? reducedTouchSlideVariants
			:	touchSlideVariants
		: reduce ? reducedSlideVariants
		: slideVariants;

	const handleDragEnd = (_e: unknown, info: PanInfo) => {
		setDragging(false);
		const power = swipePower(info.offset.x, info.velocity.x);
		if (power < -SWIPE_CONFIDENCE) next();
		else if (power > SWIPE_CONFIDENCE) prev();
		// Otherwise the constrained drag snaps back to centre on its own.
	};

	return (
		<div className={cn("relative h-full w-full overflow-hidden", className)}>
			<AnimatePresence
				initial={false}
				custom={direction}>
				<motion.div
					key={page}
					custom={direction}
					variants={variants}
					initial="enter"
					animate="center"
					exit="exit"
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.6}
					onDragStart={() => setDragging(true)}
					onDragEnd={handleDragEnd}
					className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing">
					{render(index)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
