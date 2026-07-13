/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The four surfaces a ranking is verified on, as an inline animated icon pill.
 *
 * Rendered *inside* a sentence, so it sits on the text baseline (`align-middle`)
 * and must not blow up the line height.
 *
 * These are the real brand marks from /public/brand  full colour, gradients and
 * all. `unoptimized` is required: next.config.mjs does not set
 * `dangerouslyAllowSVG`, so the image optimizer refuses SVG. With `unoptimized`
 * the file is served verbatim, which is what we want for vector logos anyway.
 */
const PLATFORMS = [
	{ name: "Google Search", src: "/brand/google.svg" },
	{ name: "ChatGPT", src: "/brand/chatgpt.svg" },
	{ name: "Google Maps", src: "/brand/maps.svg" },
	{ name: "Gemini", src: "/brand/gemini-logo.svg" },
];

export function PlatformIcons() {
	const reduce = useReducedMotion();

	return (
		<span className="mx-1 inline-flex select-none items-center gap-1.5 rounded-full border border-steel-200 bg-white px-2 py-1 align-middle shadow-soft">
			{/* The sentence around this reads "…then hit Search on <icons> to see…",
			    so the icons have to name themselves for anyone not looking at them. */}
			<span className="sr-only">Google, ChatGPT, Google Maps or Gemini</span>

			{PLATFORMS.map(({ name, src }, i) => (
				<motion.span
					key={name}
					title={name}
					aria-hidden
					className="grid size-7 place-items-center rounded-lg bg-white ring-1 ring-steel-200"
					initial={{ opacity: 0, scale: 0.5 }}
					// One `animate` carries both the entrance and the idle float: a
					// separate `whileInView` would be overridden by `animate` and the
					// icons would never fade in.
					animate={{
						opacity: 1,
						scale: 1,
						y: reduce ? 0 : [0, -2.5, 0],
					}}
					whileHover={reduce ? undefined : { scale: 1.18, y: -4 }}
					transition={{
						opacity: { duration: 0.4, delay: i * 0.08 },
						scale: { type: "spring", stiffness: 420, damping: 18 },
						y: {
							duration: 2.4,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.18,
						},
					}}>
					<Image
						src={src}
						alt=""
						width={18}
						height={18}
						unoptimized
						className="size-[18px] object-contain"
					/>
				</motion.span>
			))}
		</span>
	);
}
