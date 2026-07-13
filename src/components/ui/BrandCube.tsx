/** @format */

"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * BrandCube — the Cubiccode cube that draws, flies together and clicks shut.
 *
 * Shared by <Preloader/> (first load, navy) and <PageLoader/> (route change,
 * light), so the two loading screens are the same object by construction rather
 * than by two copies of the geometry that quietly drift apart. It is also why
 * the gradient IDs are namespaced per instance with useId(): a hard-coded id
 * would collide the moment both loaders were ever in the DOM together, and one
 * cube would silently paint with the other's gradients.
 *
 * Geometry lifted from public/brand/Cube.svg. The source file is a 4.1MB
 * image-trace (1378 <path> elements on a 14400×10800 canvas), which is unusable
 * in a loading screen and impossible to animate per-piece. Its three quad faces
 * were extracted and normalised into this 120×120 viewBox, so the closed cube is
 * a pixel-faithful rebuild of the artwork in three paths. The gaps between the
 * quads are the source art's own gutters — they read as the cube's edges.
 *
 * Colour is the one deliberate departure: Cube.svg is drawn in flat navy for a
 * white background (#000671 / #041b87 / #06228e) and would sink into a navy
 * backdrop, so the faces are re-lit in the corporate palette, darkest to
 * lightest in the same order as the original.
 */

// Assembly timing (seconds) at `speed = 1`. The last face lands at BASE_LAND_AT,
// which is when the cube pulses.
const FIRST_DELAY = 0.12;
const STAGGER = 0.16;
const FLY_DURATION = 0.85;
const BASE_LAND_AT = FIRST_DELAY + STAGGER * 2 + FLY_DURATION; // ≈ 1.29

/** When the cube finishes assembling at a given speed. Callers time copy off this. */
export const cubeLandAt = (speed = 1) => BASE_LAND_AT / speed;

// Overshoot on the final approach, so each face "clicks" into place.
const SNAP_EASE = [0.34, 1.56, 0.64, 1] as const;

/**
 * Padding (viewBox units) around the 120×120 art, so nothing the animation does
 * gets clipped. The binding constraint is the land-pulse: scale 1.07 about the
 * centre takes the art's 60-unit half-extent to 64.2, i.e. 4.2 past the edge.
 * The fly-in's overshoot all travels *inward* (each face overshoots past its
 * home position, back toward the centre it came from), so it needs no room.
 * 16 leaves comfortable margin over the 4.2 that's actually required.
 */
const BLEED = 16;

/**
 * ex/ey are each face's exploded start offset, aimed along its own outward
 * normal from the cube's centre (60,60), so the pieces scatter apart and then
 * fly home to close the form. Units are viewBox units.
 */
const FACES = [
	{
		id: "left", // largest, most-shadowed face — lands first, at the back
		d: "M13.91 24 L80.18 0 L79.64 74.86 L4.5 89.59 Z",
		grad: "left",
		ex: -40,
		ey: -33,
		rot: -18,
		from: 0.6,
	},
	{
		id: "right",
		d: "M86.32 5.45 L112.64 45.14 L115.5 106.64 L85.36 75.27 Z",
		grad: "right",
		ex: 50,
		ey: -2,
		rot: 22,
		from: 0.62,
	},
	{
		id: "bottom", // lit face — lands last, closing the cube
		d: "M8.59 95.45 L80.18 80.18 L109.09 112.64 L45.41 120 Z",
		grad: "bottom",
		ex: 1,
		ey: 48,
		rot: 14,
		from: 0.65,
	},
];

export function BrandCube({
	className,
	/** Multiplier on the assembly. >1 is faster — the route loader is only up for ~1s. */
	speed = 1,
	/** Idle bob once assembled. Off for short-lived loaders that exit before it reads. */
	float = true,
	/** Face outline. The navy default is tuned for a dark backdrop; pass a darker
	 *  ink on light ones, where a pale stroke just fuzzes the silhouette. */
	stroke = "#A7C9ED",
	strokeOpacity = 0.85,
}: {
	className?: string;
	speed?: number;
	float?: boolean;
	stroke?: string;
	strokeOpacity?: number;
}) {
	const reduce = useReducedMotion();

	// useId() yields ":r0:" — legal in an XML id, but a colon terminates the
	// reference inside url(#…) in some engines. Strip them.
	const uid = useId().replace(/:/g, "");
	const g = (name: string) => `cc-cube-${name}-${uid}`;

	const landAt = cubeLandAt(speed);
	const snap = { duration: 0 };

	const cube = (
		// The art fills 0..120 exactly — flush against every edge — so a bare
		// "0 0 120 120" box clips it: half the 1.4pt stroke is shaved off top and
		// bottom at rest, and the land-pulse (scale 1.07 → ±64.2 about the centre)
		// slices the corners off. BLEED pads the box past the widest the cube ever
		// gets, so the whole animation stays inside it.
		//
		// Consequence for callers: the cube now paints at 120/(120+2·BLEED) ≈ 79%
		// of the element's height, so sizing classes are ~27% larger than the cube
		// you want on screen.
		<svg
			viewBox={`${-BLEED} ${-BLEED} ${120 + BLEED * 2} ${120 + BLEED * 2}`}
			className={cn("relative h-24 w-24", className)}
			aria-hidden>
			<defs>
				{/* Lit face — the source art's brightest quad. */}
				<linearGradient
					id={g("bottom")}
					x1="0"
					y1="0"
					x2="0.4"
					y2="1">
					<stop
						offset="0%"
						stopColor="#6FA6DF"
					/>
					<stop
						offset="100%"
						stopColor="#3F86D0"
					/>
				</linearGradient>
				{/* Mid face. */}
				<linearGradient
					id={g("right")}
					x1="0"
					y1="0"
					x2="0.6"
					y2="1">
					<stop
						offset="0%"
						stopColor="#1B6EC2"
					/>
					<stop
						offset="100%"
						stopColor="#155BA3"
					/>
				</linearGradient>
				{/* Shadowed face — the source art's darkest quad. */}
				<linearGradient
					id={g("left")}
					x1="1"
					y1="0"
					x2="0"
					y2="1">
					<stop
						offset="0%"
						stopColor="#0F4C81"
					/>
					<stop
						offset="100%"
						stopColor="#0B3A63"
					/>
				</linearGradient>
			</defs>

			{/* The whole cube pulses once, on the beat the last face lands. */}
			<motion.g
				style={{ transformOrigin: "60px 60px" }}
				animate={reduce ? undefined : { scale: [1, 1.07, 1] }}
				transition={
					reduce ? undefined : (
						{ duration: 0.5 / speed, ease: "easeOut", delay: landAt }
					)
				}>
				{FACES.map((f, i) => {
					const at = (FIRST_DELAY + i * STAGGER) / speed;
					const fly = FLY_DURATION / speed;
					return (
						<motion.path
							key={f.id}
							d={f.d}
							fill={`url(#${g(f.grad)})`}
							stroke={stroke}
							strokeWidth="1.4"
							strokeLinejoin="round"
							strokeOpacity={strokeOpacity}
							// fill-box so each face spins and scales about its own centre
							// while it flies, not the cube's.
							style={{
								transformBox: "fill-box",
								transformOrigin: "center",
							}}
							initial={{
								pathLength: 0,
								fillOpacity: 0,
								opacity: 0,
								x: f.ex,
								y: f.ey,
								rotate: f.rot,
								scale: f.from,
							}}
							animate={{
								pathLength: 1,
								fillOpacity: 1,
								opacity: 1,
								x: 0,
								y: 0,
								rotate: 0,
								scale: 1,
							}}
							transition={
								reduce ? snap : (
									{
										opacity: {
											duration: 0.26 / speed,
											ease: "easeOut",
											delay: at,
										},
										// Outline draws itself in flight...
										pathLength: {
											duration: 0.62 / speed,
											ease: "easeInOut",
											delay: at,
										},
										x: { duration: fly, ease: SNAP_EASE, delay: at },
										y: { duration: fly, ease: SNAP_EASE, delay: at },
										rotate: { duration: fly, ease: SNAP_EASE, delay: at },
										scale: { duration: fly, ease: SNAP_EASE, delay: at },
										// ...and the face floods with colour as it seats.
										fillOpacity: {
											duration: 0.55 / speed,
											ease: "easeOut",
											delay: at + 0.42 / speed,
										},
									}
								)
							}
						/>
					);
				})}
			</motion.g>
		</svg>
	);

	if (!float || reduce) return cube;

	return (
		<motion.div
			animate={{ y: [0, -6, 0] }}
			transition={{
				duration: 3.6,
				ease: "easeInOut",
				repeat: Infinity,
				delay: landAt + 0.4,
			}}>
			{cube}
		</motion.div>
	);
}
