/** @format */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SEO_PROCESS } from "@/lib/seoClients";

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const card = {
	hidden: { opacity: 0, y: 26 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, delay: i * 0.09, ease: EASE },
	}),
};

export function SeoProcess() {
	const reduce = useReducedMotion();

	return (
		<section
			id="process"
			className="relative overflow-hidden bg-canvas">
			<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
			<div className="container-x relative py-20 lg:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<span className="kicker justify-center">Explain our SEO process</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h2 className="mt-4 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
							From keyword to ranking, in six moves
						</h2>
					</Reveal>
					<Reveal delay={0.18}>
						<p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-steel-600">
							A repeatable pipeline that compounds classic SEO, Google Business
							signals and answer-engine optimisation into durable local
							visibility.
						</p>
					</Reveal>
				</div>

				<div className="relative mt-16">
					{/* horizontal spine (xl row layout only) */}
					<div className="pointer-events-none absolute inset-x-0 top-[34px] hidden xl:block">
						<div className="relative mx-[8.33%] h-px bg-gradient-to-r from-corporate-200 via-corporate-400 to-corporate-200">
							<motion.span
								className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-corporate-500 shadow-glow"
								animate={reduce ? undefined : { left: ["0%", "100%"] }}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
						{SEO_PROCESS.map((step, i) => (
							<motion.div
								key={step.n}
								custom={i}
								variants={card}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.4 }}
								className="group relative flex flex-col rounded-3xl border border-steel-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-corporate-200 hover:shadow-lift">
								{/* number badge — sits on the spine at xl */}
								<div className="flex items-center justify-between">
									<span className="grid size-[34px] place-items-center rounded-full bg-gradient-to-br from-ink to-corporate-700 text-sm font-bold text-white shadow-soft ring-4 ring-canvas">
										{step.n}
									</span>
									<span className="grid size-10 place-items-center rounded-xl border border-steel-200 bg-canvas-soft text-corporate-600 transition-colors duration-300 group-hover:border-corporate-300 group-hover:bg-corporate-50">
										<Icon
											name={step.icon}
											className="size-[18px]"
											strokeWidth={1.75}
										/>
									</span>
								</div>

								<h3 className="mt-4 font-display text-base font-bold leading-snug tracking-tight text-ink">
									{step.title}
								</h3>

								<ul className="mt-3 space-y-1.5">
									{step.points.map((p) => (
										<li
											key={p}
											className="flex items-start gap-2 text-[13px] leading-snug text-steel-600">
											<span className="mt-1.5 size-1 shrink-0 rounded-full bg-corporate-400" />
											{p}
										</li>
									))}
								</ul>

								{/* base accent that grows on hover */}
								<span className="mt-4 block h-px w-8 bg-corporate-500 transition-[width] duration-300 group-hover:w-full" />
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
