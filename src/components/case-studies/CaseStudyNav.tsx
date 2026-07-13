/** @format */

"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { caseStudies } from "@/content/portfolio";
import { CATEGORY_TOKENS, entryId } from "@/lib/caseStudyMetrics";
import { cn } from "@/lib/utils";

/**
 * Sticky "contents / command" bar for the case-studies ledger. A live-in-
 * production label plus six scroll-spy anchor chips that jump to each entry and
 * highlight the one currently in view (IntersectionObserver). Sits just below
 * the fixed Navbar (top-[66px], z-30 < the nav's z-[70]).
 */
export function CaseStudyNav() {
	const [active, setActive] = useState(0);

	useEffect(() => {
		const els = caseStudies
			.map((_, i) => document.getElementById(entryId(i)))
			.filter((el): el is HTMLElement => el !== null);
		if (els.length === 0) return;

		const io = new IntersectionObserver(
			(entries) => {
				const vis = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (vis) {
					const idx = els.indexOf(vis.target as HTMLElement);
					if (idx !== -1) setActive(idx);
				}
			},
			{ rootMargin: "-140px 0px -55% 0px", threshold: [0.1, 0.4] },
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, []);

	return (
		<Reveal
			direction="none"
			className="sticky top-[66px] z-30 border-y border-steel-200 bg-canvas/85 backdrop-blur supports-[backdrop-filter]:bg-canvas/70">
			<div className="container-x flex h-14 items-center justify-between gap-4">
				<div className="flex shrink-0 items-center gap-2.5">
					<span className="size-2 animate-pulse rounded-full bg-corporate-500" />
					<span className="text-[11px] font-semibold uppercase tracking-kicker text-steel-500">
						<span className="hidden sm:inline">06 platforms · </span>live in
						production
					</span>
				</div>
				{/* `[scrollbar-width:none]` only silences Firefox. globals.css paints a
				    10px `::-webkit-scrollbar` on *every* scroll container, so on
				    WebKit/Blink this strip loses 10px of its 56px bar to a track it
				    never needs — hidden below lg, where the chips are the only thing
				    that actually overflows. `overscroll-x-contain` stops a swipe past
				    the last chip from triggering the browser's back gesture. */}
				<nav className="-mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 [scrollbar-width:none] max-lg:overscroll-x-contain max-lg:[&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
					{caseStudies.map((c, i) => (
						<a
							key={c.slug}
							href={`#${entryId(i)}`}
							className={cn(
								// `.tap-target` grows the hit area to 44px on coarse pointers via
								// an ::after pseudo — no layout change, so the chip is identical
								// under a mouse.
								"tap-target snap-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors",
								active === i ?
									"bg-ink text-white"
								:	"border border-steel-200 text-steel-500 hover:border-corporate-300 hover:text-ink",
							)}>
							{String(i + 1).padStart(2, "0")} {CATEGORY_TOKENS[i]}
						</a>
					))}
				</nav>
			</div>
		</Reveal>
	);
}
