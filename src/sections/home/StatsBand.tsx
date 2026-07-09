/** @format */

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Rocket, Users, ClipboardCheck, Globe } from "lucide-react";
import { CountStat } from "@/components/ui/Stat";
import { heroStats } from "@/content/site";

/**
 * STATS BAND  "By the numbers" proof strip.
 *
 * A dark, brand-navy band that breaks up the surrounding light sections. Four
 * glass stat cards, each with an icon chip and a count-up number that animates
 * when it scrolls into view. Reveals stagger in; reduced-motion users get a
 * plain fade and the numbers still count (CountStat owns its own trigger).
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// Icons aligned to the heroStats order.
const ICONS = [Rocket, Users, ClipboardCheck, Globe] as const;

export function StatsBand() {
	const reduce = useReducedMotion();

	const container: Variants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.14 } },
	};
	const item: Variants =
		reduce ?
			{ hidden: { opacity: 0 }, show: { opacity: 1 } }
		:	{
				hidden: { opacity: 0, y: 48 },
				show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
			};

	return (
		<section className="relative w-full overflow-hidden bg-gradient-to-br from-ink via-corporate-900 to-corporate-800 py-24 text-white lg:py-32">
			{/* Texture + ambient glows */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.15] [background-size:40px_40px]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -left-32 top-0 size-[36rem] rounded-full bg-corporate-500/20 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 bottom-0 size-[30rem] rounded-full bg-corporate-400/10 blur-3xl"
			/>

			<div className="container-x relative">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center">
					<span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-kicker text-corporate-200">
						<span className="h-px w-8 bg-corporate-300/60" />
						By the numbers
						<span className="h-px w-8 bg-corporate-300/60" />
					</span>
					<h2 className="mt-5 font-display text-3xl font-bold tracking-tightest text-white sm:text-4xl lg:text-[2.9rem]">
						Proof, not promises
					</h2>
				</div>

				{/* Stat cards */}
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.3 }}
					className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{heroStats.map((s, i) => {
						const Icon = ICONS[i] ?? Rocket;
						return (
							<motion.div
								key={s.label}
								variants={item}
								className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-7 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-corporate-300/40 hover:bg-white/[0.09]">
								{/* Top accent */}
								<span className="absolute inset-x-0 top-0 mx-auto block h-px w-2/3 bg-gradient-to-r from-transparent via-corporate-300/70 to-transparent" />
								{/* Corner glow on hover */}
								<span
									aria-hidden
									className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-corporate-400/25 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
								/>

								{/* Icon chip */}
								<span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-corporate-500/15 text-corporate-200 ring-1 ring-corporate-400/25 transition-colors duration-300 group-hover:bg-corporate-500/25 group-hover:text-white">
									<Icon className="size-5" />
								</span>

								<div className="mt-5 font-display text-[2.6rem] font-bold leading-none tracking-tight text-white sm:text-5xl">
									<CountStat
										value={s.value}
										prefix={s.prefix}
										suffix={s.suffix}
									/>
								</div>
								<div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-corporate-100/80">
									{s.label}
								</div>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
