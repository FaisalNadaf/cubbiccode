/** @format */

"use client";

import { useEffect, useRef, type ElementType, type Ref } from "react";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

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

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		gsap.registerPlugin(ScrollTrigger);
		const split = new SplitType(el, { types: "lines,words" });
		gsap.set(el.querySelectorAll(".line"), {
			overflow: "hidden",
			display: "block",
		});

		const tween = gsap.from(el.querySelectorAll(".word"), {
			yPercent: 115,
			opacity: 0,
			duration: 0.95,
			ease: "power4.out",
			stagger,
			delay: play === "mount" ? delay : 0,
			scrollTrigger:
				play === "scroll" ?
					{ trigger: el, start: "top 88%", once: true }
				:	undefined,
		});

		return () => {
			tween.scrollTrigger?.kill();
			tween.kill();
			split.revert();
		};
	}, [play, delay, stagger]);

	return (
		<Tag
			ref={ref as Ref<never>}
			className={cn(className)}>
			{children}
		</Tag>
	);
}
