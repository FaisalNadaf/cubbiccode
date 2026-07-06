/** @format */

"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ─────────────────────────────── types ─────────────────────────────── */

// Mirrors the variants exposed by our custom Button (src/components/ui/Button.tsx).
type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "white";

interface StatProps {
	value: string;
	label: string;
	icon: React.ReactNode;
}

interface ActionProps {
	text: string;
	/** Use for click handlers (renders a <button>). */
	onClick?: () => void;
	/** Use for navigation (renders a <Link>). Takes precedence over onClick. */
	href?: string;
	external?: boolean;
	variant?: ButtonVariant;
	className?: string;
}

interface HeroSectionProps {
	title: React.ReactNode;
	subtitle: string;
	actions: ActionProps[];
	stats: StatProps[];
	/** Exactly three image URLs — one per collage tile. */
	images: string[];
	className?: string;
}

/* ───────────────────────── animation variants ──────────────────────── */

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.14, delayChildren: 0.05 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 22 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const imageVariants: Variants = {
	hidden: { opacity: 0, scale: 0.85 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

/* ─────────────────────────────── section ───────────────────────────── */

export function HeroSection({
	title,
	subtitle,
	actions,
	stats,
	images,
	className,
}: HeroSectionProps) {
	const reduce = useReducedMotion() ?? false;

	// A tiny helper so every floating shape shares one loop with its own phase.
	const float = (delay: number) =>
		reduce
			? undefined
			: {
					animate: { y: [0, -8, 0] },
					transition: {
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut" as const,
						delay,
					},
			  };

	return (
		<section
			className={cn(
				"relative w-full overflow-hidden bg-canvas py-16 sm:py-24",
				className
			)}>
			<div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
				{/* ── Left column: copy ─────────────────────────────────────── */}
				<motion.div
					className="flex flex-col items-center text-center lg:items-start lg:text-left"
					variants={containerVariants}
					initial={reduce ? false : "hidden"}
					whileInView="visible"
					viewport={{ once: true, amount: 0.35 }}>
					<motion.h1
						variants={itemVariants}
						className="max-w-xl text-balance font-display text-[2.1rem] font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
						{title}
					</motion.h1>

					<motion.p
						variants={itemVariants}
						className="mt-6 max-w-md text-pretty text-[17px] leading-relaxed text-steel-500">
						{subtitle}
					</motion.p>

					<motion.div
						variants={itemVariants}
						className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
						{actions.map((action, i) => (
							<Button
								key={i}
								href={action.href}
								external={action.external}
								onClick={action.onClick}
								variant={action.variant}
								size="lg"
								arrow={action.variant === "accent" || action.variant === "primary"}
								className={action.className}>
								{action.text}
							</Button>
						))}
					</motion.div>

					<motion.div
						variants={itemVariants}
						className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-6 lg:justify-start">
						{stats.map((stat, i) => (
							<div key={i} className="flex items-center gap-3">
								<span className="flex size-11 items-center justify-center rounded-full border border-steel-200 bg-steel-100 text-corporate-600">
									{stat.icon}
								</span>
								<div className="text-left">
									<p className="font-display text-xl font-bold leading-none text-ink">
										{stat.value}
									</p>
									{stat.label ? (
										<p className="mt-1 text-sm text-steel-500">{stat.label}</p>
									) : null}
								</div>
							</div>
						))}
					</motion.div>
				</motion.div>

				{/* ── Right column: image collage ───────────────────────────── */}
				<motion.div
					className="relative h-[420px] w-full sm:h-[500px]"
					variants={containerVariants}
					initial={reduce ? false : "hidden"}
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}>
					{/* Decorative floating shapes (on-brand tints) */}
					<motion.div
						{...float(0)}
						className="absolute -top-4 left-1/4 size-16 rounded-full bg-corporate-200/50"
					/>
					<motion.div
						{...float(0.6)}
						className="absolute bottom-0 right-1/4 size-12 rounded-2xl bg-steel-200/70"
					/>
					<motion.div
						{...float(1.1)}
						className="absolute bottom-1/4 left-2 size-6 rounded-full bg-corporate-400/40"
					/>

					{/* Collage tiles */}
					<motion.div
						variants={imageVariants}
						style={{ transformOrigin: "bottom center" }}
						className="absolute left-1/2 top-0 size-48 -translate-x-1/2 rounded-3xl bg-steel-100 p-2 shadow-card sm:size-64">
						<img
							src={images[0]}
							alt=""
							className="size-full rounded-2xl object-cover"
						/>
					</motion.div>
					<motion.div
						variants={imageVariants}
						style={{ transformOrigin: "left center" }}
						className="absolute right-0 top-1/3 size-40 rounded-3xl bg-steel-100 p-2 shadow-card sm:size-56">
						<img
							src={images[1]}
							alt=""
							className="size-full rounded-2xl object-cover"
						/>
					</motion.div>
					<motion.div
						variants={imageVariants}
						style={{ transformOrigin: "top right" }}
						className="absolute bottom-0 left-0 size-32 rounded-3xl bg-steel-100 p-2 shadow-card sm:size-48">
						<img
							src={images[2]}
							alt=""
							className="size-full rounded-2xl object-cover"
						/>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

export default HeroSection;
