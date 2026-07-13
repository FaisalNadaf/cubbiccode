/** @format */

"use client";

import { useRef, type ElementType, type Ref } from "react";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect, prefersReducedMotion } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Line-clipped word reveal for headings  the signature "premium" text entrance.
 * Falls back to plain text under reduced-motion / no-JS.
 */
export function SplitReveal({
	children,
	className,
	as = "h2",
	play = "scroll",
	delay = 0,
	stagger = 0.055,
}: {
	children: string;
	className?: string;
	as?: Tag;
	play?: "scroll" | "mount";
	delay?: number;
	stagger?: number;
}) {
	const ref = useRef<HTMLElement>(null);
	const Tag = as as ElementType;

	// Only scroll-triggered headings get the CSS pre-hide. A `play="mount"`
	// heading is the hero <h1> — the LCP candidate — so it must paint from the
	// server HTML rather than wait for hydration. Its one-frame settle is hidden
	// behind the first-load preloader / the route-change curtain anyway.
	const preHide = play === "scroll";

	// Layout effect, not effect: GSAP must stamp the `from` state before the
	// browser paints, or the heading paints solid and snaps to hidden a frame
	// later. Paired with the `html[data-anim] [data-split-reveal]{opacity:0}`
	// rule in globals.css, which covers the pre-hydration paint.
	useIsomorphicLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		// No-motion users keep the server-rendered text. globals.css never hides
		// it for them (the `data-anim` gate is absent), so there is nothing to do.
		if (prefersReducedMotion()) return;

		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const split = new SplitType(el, { types: "lines,words" });

			gsap.set(el.querySelectorAll(".line"), {
				overflow: "hidden",
				display: "block",
			});

			// Hand control of opacity from the CSS gate to GSAP, and disarm the
			// stylesheet failsafe now that the tween owns this element.
			el.setAttribute("data-split-ready", "");
			gsap.set(el, { opacity: 1 });

			gsap.from(el.querySelectorAll(".word"), {
				yPercent: 115,
				opacity: 0,
				duration: 0.95,
				ease: "power4.out",
				stagger,
				delay: play === "mount" ? delay : 0,
				force3D: true,
				scrollTrigger:
					play === "scroll" ?
						{ trigger: el, start: "top 88%", once: true }
					:	undefined,
				onComplete: () => {
					// Drop the compositor layers GSAP promoted for the tween.
					gsap.set(el.querySelectorAll(".word"), { clearProps: "willChange,transform" });
				},
			});

			return () => split.revert();
		}, ref);

		return () => {
			ctx.revert();
			el.removeAttribute("data-split-ready");
		};
	}, [play, delay, stagger]);

	return (
		<Tag
			ref={ref as Ref<never>}
			{...(preHide ? { "data-split-reveal": "" } : {})}
			className={cn(className)}>
			{children}
		</Tag>
	);
}
