/** @format */

"use client";

import {
	motion,
	useMotionValue,
	useMotionTemplate,
	useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

/**
 * A light-theme adaptation of BorderGlow. Instead of a dark self-contained card,
 * this leaves the card surface untouched and lays a corporate-blue glow over its
 * border: a gradient border fades in on hover, a bright highlight traces the
 * cursor around the edge, and a soft halo blooms outside the card.
 *
 * Usage  pass the visible card as the child and give GlowCard the matching
 * `rounded-*` (and usually `h-full`) so the ring aligns to the card's corners:
 *
 *   <GlowCard className="h-full rounded-2xl">
 *     <div className="rounded-2xl border bg-white p-5 …">…</div>
 *   </GlowCard>
 *
 * For cards that transform in 3D (e.g. TiltCard) the ring must live INSIDE the
 * transformed element  drop <GlowBorder /> in there instead.
 */

// Gradient-border trick: reveal the background only inside the 1px padding ring.
const RING = {
	padding: "1px",
	borderRadius: "inherit",
	WebkitMask:
		"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
	WebkitMaskComposite: "xor",
	mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
	maskComposite: "exclude",
} as unknown as CSSProperties;

const BORDER_GRADIENT = "linear-gradient(120deg, #6FA6DF, #1B6EC2, #3F86D0)";

export function GlowCard({
	children,
	className,
	haloClassName,
}: {
	children: ReactNode;
	className?: string;
	haloClassName?: string;
}) {
	const reduce = useReducedMotion();
	const mx = useMotionValue(-240);
	const my = useMotionValue(-240);
	const hotspot = useMotionTemplate`radial-gradient(180px circle at ${mx}px ${my}px, rgba(198,222,252,0.95), rgba(27,110,194,0.25) 45%, transparent 72%)`;

	const onMove =
		reduce ? undefined : (
			(e: React.PointerEvent<HTMLDivElement>) => {
				// Touch pointers only ever fire pointermove mid-scroll, and there is
				// no cursor for the hotspot to follow anyway — reading the rect on
				// every one of those frames forces a synchronous layout during the
				// gesture. Mouse and pen are untouched, so desktop is unchanged.
				if (e.pointerType === "touch") return;
				const r = e.currentTarget.getBoundingClientRect();
				mx.set(e.clientX - r.left);
				my.set(e.clientY - r.top);
			}
		);

	return (
		<div className="group/glow relative isolate h-full">
			{/* soft outer halo */}
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute -inset-1.5 -z-10 rounded-[inherit] bg-corporate-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover/glow:opacity-100",
					haloClassName,
				)}
			/>
			<div
				onPointerMove={onMove}
				className={cn("relative", className)}>
				{children}
				{/* base gradient border */}
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-70"
					style={{ ...RING, background: BORDER_GRADIENT }}
				/>
				{/* cursor-tracked highlight on the border */}
				{!reduce && (
					<motion.span
						aria-hidden
						className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
						style={{ ...RING, background: hotspot } as unknown as CSSProperties}
					/>
				)}
			</div>
		</div>
	);
}

/**
 * Just the hover gradient-border ring  a drop-in for any `group relative
 * rounded-*` card, including 3D-transformed ones. Render it as a child so it
 * inherits the card's radius and transforms with it.
 */
export function GlowBorder({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-80",
				className,
			)}
			style={{ ...RING, background: BORDER_GRADIENT }}
		/>
	);
}
