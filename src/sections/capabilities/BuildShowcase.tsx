/** @format */

"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import CardSwap, { Card } from "@/components/CardSwap";

export type BuildItem = {
	title: string;
	detail: string;
	image: string;
	icon: string;
};

export function BuildShowcase({
	buildHeading,
	items,
}: {
	buildHeading: string;
	items: BuildItem[];
}) {
	const [active, setActive] = useState(0);
	const current = items[active] ?? items[0];
	const reduce = usePrefersReducedMotion();

	// The deck imagery is ~1.88:1 (1200x637 and friends), so the card is sized to
	// that ratio: a contained image then fills it edge-to-edge with nothing cropped
	// and no letterbox bars. CardSwap bottom-anchors a stack of
	// `height + (n - 1) * verticalDistance` and scales it by fit = min(1, host/600),
	// so the wrapper reserves exactly that — derived from the real deck length,
	// since decks run 5-8 cards.
	const CARD_W = 600;
	const CARD_H = 320;
	const STEP = 60;
	const deckH = CARD_H + Math.max(0, items.length - 1) * STEP;

	return (
		<div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
			{/* Left  heading + live panel reflecting the front card */}
			<div>
				<SectionHeading
					className="mb-10"
					kicker={buildHeading}
					title="Everything you need, engineered end-to-end."
					intro="A complete, accountable scope no hand-offs, no gaps. Here's exactly what this engagement delivers."
				/>

				{/* progress track */}
				<div className="mt-10 flex items-center gap-2">
					{items.map((_, i) => (
						<span
							key={i}
							className={cn(
								"h-1.5 rounded-full transition-all duration-500",
								i === active ? "w-9 bg-corporate-600" : "w-2.5 bg-steel-200",
							)}
						/>
					))}
				</div>

				{/* live card detail */}
				<div className="mt-6 min-h-[188px]">
					<AnimatePresence mode="wait">
						<motion.div
							key={active}
							initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
							animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
							exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
							transition={{
								duration: reduce ? 0.15 : 0.35,
								ease: [0.21, 0.47, 0.32, 0.98],
							}}>
							<div className="flex items-center gap-4">
								<div>
									<span className="text-xs font-semibold uppercase tracking-wider text-corporate-600">
										{String(active + 1).padStart(2, "0")}/
										{String(items.length).padStart(2, "0")}
									</span>
									<h3 className="text-2xl font-semibold leading-tight text-ink">
										{current.title}
									</h3>
								</div>
							</div>
							{current.detail && (
								<p className="mt-4 max-w-md text-[15px] leading-relaxed text-steel-600">
									{current.detail}
								</p>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Right  animated CardSwap showcase (real project imagery) */}
			{/* Below ~648px the host (container-x, so 100vw - 3rem) is narrower than the
			    600px card, and CardSwap fits the stack to host/600 — so the reserve has
			    to track that rather than sit at a flat height that would leave dead space
			    on a phone and let the fanned cards climb over the copy from ~560px up.
			    CardSwap *rounds* fit to 2% steps, so the drawn stack can run up to
			    1% (~7px) over the raw ratio; the 10px absorbs that. At >= lg the min()
			    resolves to deckH either way, so desktop is untouched. */}
			<div
				className="relative w-full"
				style={{
					height: `min(${deckH}px, calc((100vw - 3rem) * ${(
						deckH / CARD_W
					).toFixed(4)} + 10px))`,
				}}>
				<CardSwap
					width={CARD_W}
					height={CARD_H}
					cardDistance={46}
					verticalDistance={STEP}
					delay={3000}
					skewAmount={5}
					pauseOnHover
					onActiveChange={setActive}>
					{items.map((it, i) => (
						<Card
							key={it.title}
							className="group/card relative cursor-pointer border border-steel-200 bg-ink-900 shadow-2xl ring-1 ring-black/5 transition-shadow hover:shadow-[0_28px_70px_-20px_rgba(11,27,58,0.45)]">
							{/* Card is 600x320 (1.875) to match the ~1.88:1 deck imagery, so the
							    contained image fills it edge-to-edge with nothing cropped. The
							    blurred self-backdrop only shows for odd-ratio sources, letterboxing
							    them into their own colours instead of dead grey. */}
							<Image
								src={it.image}
								alt=""
								aria-hidden
								fill
								sizes="(max-width: 1023.98px) 96px, 600px"
								className="scale-110 object-cover blur-2xl saturate-125"
							/>
							<Image
								src={it.image}
								alt={it.title}
								fill
								sizes="(max-width: 639.98px) 448px, 600px"
								className="object-contain"
							/>

							{/* Scrims: top carries the titlebar, bottom grounds the card. The middle
							    stays clear so the screenshot itself is never washed out.

							    Sized in PERCENT, not px. CardSwap fits the card in JS, so below lg
							    the box really is smaller (~276x147 on a 320px phone) — a fixed
							    h-20 + h-16 would be 144px of scrim on a 147px card, i.e. an almost
							    solid black tile. 25% / 20% are exactly the old 80px / 64px on the
							    320px-tall card the deck draws at >= lg, so desktop is unchanged. */}
							<div className="pointer-events-none absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-ink-900/85 via-ink-900/40 to-transparent" />
							<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-ink-900/60 to-transparent" />
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-corporate-900/40 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />

							{/* titlebar  floats over the image instead of cropping it. Tightened
							    below sm, where the fitted card is short enough that the desktop
							    padding would eat a third of it; sm: restores the desktop values and
							    >= 1024px is inside that range. */}
							<div className="absolute inset-x-0 top-0 flex items-center gap-2 px-3 py-2 sm:gap-2.5 sm:px-5 sm:py-3.5">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md sm:size-7">
									<Icon
										name={it.icon}
										className="size-3.5 sm:size-4"
									/>
								</span>
								<span className="truncate text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(8,20,39,0.6)] sm:text-sm">
									{it.title}
								</span>
								<span className="ml-auto font-display text-[10px] font-bold text-white/60 sm:text-xs">
									{String(i + 1).padStart(2, "0")}
								</span>
							</div>
						</Card>
					))}
				</CardSwap>
			</div>
		</div>
	);
}
