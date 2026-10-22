/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { awards } from "@/content/site";

/**
 * WHY CUBICCODE  awards & recognition.
 *
 * Four recognition cards — 2x2 on phones, a single row from `lg`. Each is a
 * circular award badge that overlaps the top edge of a white content card
 * carrying the awarding body, the award title and a short line. That last line
 * is dropped below `sm`, where a half-width column would stretch it over a
 * dozen wrapped lines. Cards reveal with a staggered rise on scroll;
 * reduced-motion users get a plain fade.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export function WhyCollage() {
	const reduce = useReducedMotion();

	const container: Variants = {
		hidden: {},
		show: { transition: { staggerChildren: 0.12 } },
	};
	const card: Variants =
		reduce ?
			{ hidden: { opacity: 0 }, show: { opacity: 1 } }
		:	{
				hidden: { opacity: 0, y: 40 },
				show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
			};

	return (
		<section className="relative w-full overflow-hidden bg-canvas-soft py-16 sm:py-24 lg:py-32">
			{/* Brand texture + ambient glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.4] [background-size:34px_34px]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-8 size-[40rem] -translate-x-1/2 rounded-full bg-corporate-500/[0.06] blur-3xl"
			/>

			<div className="container-x relative">
				{/* Section header */}
				<div className="mx-auto max-w-7xl text-center">
					<span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-kicker text-corporate-600">
						<span className="h-px w-8 bg-corporate-300" />
						Awards &amp; Recognition
						<span className="h-px w-8 bg-corporate-300" />
					</span>
					<h2 className="mt-5 text-balance font-display text-3xl font-bold text-ink sm:text-4xl lg:text-[2.2rem]">
						We build websites &amp; web apps that don&apos;t just look good,
						they drive traffic and sales.
					</h2>
			
				</div>

				{/* Award cards  four in a row */}
				<motion.div
					variants={container}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.2 }}
					className="mt-16 grid grid-cols-2 gap-x-3 gap-y-12 sm:mt-24 sm:gap-x-6 sm:gap-y-20 lg:grid-cols-4">
					{awards.map((a) => (
						<motion.article
							key={a.title}
							variants={card}
							className="group relative flex flex-col rounded-2xl border border-steel-200 bg-white px-3 pb-5 pt-11 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-corporate-200 hover:shadow-card sm:rounded-3xl sm:px-6 sm:pb-8 sm:pt-20">
							{/* Award badge  overlaps the card's top edge */}
							<span className="absolute left-1/2 top-0 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-steel-200 bg-white shadow-lift ring-2 ring-canvas-soft transition-transform duration-300 group-hover:scale-105 sm:size-28 sm:ring-4">
								<Image
									src={a.image}
									alt=""
									width={72}
									height={72}
									className="size-[42px] object-contain sm:size-[68px]"
								/>
							</span>

							<span className="text-[10px] font-semibold uppercase leading-snug tracking-kicker text-corporate-600 sm:text-[11px]">
								{a.org}
							</span>
							<h3 className="mt-2 font-display text-sm font-bold leading-[1.2] tracking-tight text-ink sm:mt-3 sm:text-lg">
								{a.title}
							</h3>
							<p className="mt-3 hidden text-[13.5px] leading-relaxed text-steel-600 sm:block">
								{a.desc}
							</p>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	);
}
