/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, ChevronDown } from "lucide-react";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SeoBackground } from "./SeoBackground";
import { TOTAL_CLIENTS, INDUSTRIES, CITIES } from "@/lib/seoClients";
import { routes } from "@/lib/routes";

const TRUST = [
	`${TOTAL_CLIENTS}+ businesses ranked`,
	`${INDUSTRIES.length} industries`,
	`${CITIES.length} cities`,
	"AI-answer optimized",
];

export function SeoHero() {
	const reduce = useReducedMotion();

	return (
		<section className="relative flex min-h-[92dvh] w-full items-center overflow-hidden bg-ink text-white lg:min-h-[92vh]">
			<SeoBackground />

			<div className="container-x relative z-10 w-full py-32 pt-40 text-center sm:pt-44">
				<div className="mx-auto max-w-4xl">
					<Reveal>
						<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-kicker text-corporate-200 backdrop-blur">
							<motion.span
								animate={reduce ? undefined : { rotate: [0, 15, -10, 0] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
								<Sparkles className="size-3.5" />
							</motion.span>
							AI Search · Local SEO · Answer Engines
						</span>
					</Reveal>

					<SplitReveal
						as="h1"
						play="mount"
						delay={0.15}
						className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.04] tracking-tightest text-white sm:text-6xl lg:text-7xl">
						AI Search & SEO Performance
					</SplitReveal>

					<Reveal delay={0.3}>
						<p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-steel-300">
							We optimize businesses for Google Search, AI-powered search
							engines, Local SEO, and Answer Engines to help them dominate
							location-based search results.
						</p>
					</Reveal>

					<Reveal delay={0.42}>
						<div className="mt-9 flex flex-wrap items-center justify-center gap-4">
							<Magnetic strength={0.28}>
								<a
									href={routes.contact}
									className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-corporate-600 px-8 text-base font-semibold text-white shadow-glow transition-transform duration-300 hover:-translate-y-0.5">
									<span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
										<span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
									</span>
									Get a free SEO audit
									<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</a>
							</Magnetic>
							<Magnetic strength={0.2}>
								<a
									href="#clients"
									className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 text-base font-medium text-white backdrop-blur transition-colors duration-300 hover:border-white/45 hover:bg-white/[0.09]">
									Explore ranked clients
								</a>
							</Magnetic>
						</div>
					</Reveal>

					<Reveal delay={0.55}>
						<ul className="mx-auto mt-11 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-steel-400">
							{TRUST.map((t, i) => (
								<li
									key={t}
									className="inline-flex items-center gap-3">
									{i > 0 && (
										<span className="hidden size-1 rounded-full bg-corporate-400/60 sm:inline-block" />
									)}
									<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-steel-300 backdrop-blur">
										<span className="size-1.5 rounded-full bg-corporate-400" />
										{t}
									</span>
								</li>
							))}
						</ul>
					</Reveal>
				</div>
			</div>

			{/* scroll cue */}
			<motion.a
				href="#process"
				aria-label="Scroll to our process"
				className="tap-target-h absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-1.5 text-[11px] font-medium uppercase tracking-kicker text-steel-400"
				animate={reduce ? undefined : { y: [0, 7, 0] }}
				transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
				Scroll
				<ChevronDown className="size-4" />
			</motion.a>
		</section>
	);
}
