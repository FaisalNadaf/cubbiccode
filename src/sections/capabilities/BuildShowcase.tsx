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

	// A card is a white titlebar over a screenshot body, so it wants the taller
	// 600x440 box rather than the imagery's own ~1.88:1 — the body crops to fill and
	// the bar sits on solid white above it. CardSwap bottom-anchors a stack of
	// `height + (n - 1) * verticalDistance` and scales it by fit = min(1, host/600),
	// so the wrapper reserves exactly that — derived from the real deck length,
	// since decks run 5-8 cards.
	const CARD_W = 600;
	const CARD_H = 440;
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
							className="cursor-pointer border border-steel-200 bg-white shadow-2xl ring-1 ring-black/5 transition-shadow hover:shadow-[0_28px_70px_-20px_rgba(11,27,58,0.45)]">
							<div className="flex h-full w-full flex-col">
								{/* titlebar  icon + label on solid white, above the shot rather
								    than floating over it. Padding tightens below sm, where CardSwap
								    fits the box down to ~276px wide and the desktop padding would
								    eat the bar; sm: restores the desktop values and >= 1024px is
								    inside that range. */}
								<div className="flex shrink-0 items-center gap-2 border-b border-steel-200 bg-white px-3 py-2 sm:gap-2.5 sm:px-5 sm:py-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 sm:size-7">
										<Icon
											name={it.icon}
											className="size-3.5 sm:size-4"
										/>
									</span>
									<span className="truncate text-xs font-semibold text-ink sm:text-sm">
										{it.title}
									</span>
									<span className="ml-auto font-display text-[10px] font-bold text-steel-300 sm:text-xs">
										{String(i + 1).padStart(2, "0")}
									</span>
								</div>

								{/* body  the project screenshot fills whatever the bar leaves */}
								<div className="relative flex-1">
									<Image
										src={it.image}
										alt={it.title}
										fill
										sizes="(max-width: 639.98px) 448px, 600px"
										className="object-cover"
									/>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
								</div>
							</div>
						</Card>
					))}
				</CardSwap>
			</div>
		</div>
	);
}