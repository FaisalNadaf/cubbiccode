/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { CountStat } from "@/components/ui/Stat";
import { awards, heroStats, type Award } from "@/content/site";

/**
 * WHY CUBICCODE  one continuous page-scroll stack: awards, then the stats.
 *
 * A full-bleed stage driven by the *page* scroll (ScrollStack with
 * useWindowScroll). Each award card is a 60/40 split  a fully-visible proof
 * photo / certificate (60%) beside its copy (40%)  pinning/stacking on the one
 * before it. Once the awards finish, a final stats card continues the very same
 * stack in the very same spot, its four headline numbers rising in one-by-one.
 *
 * Page-scroll (not a nested scroll box) is deliberate: a fixed-height internal
 * scroller would trap the wheel. Inner stat motion respects reduced-motion.
 */

const CARD_SIZE = "w-[86vw] max-w-[1200px] h-[70vh] min-h-[520px]";

/* A 60/40 award card  full-visible proof image (60%), copy (40%). */
function AwardCard({ a, priority }: { a: Award; priority?: boolean }) {
	return (
		<ScrollStackItem
			itemClassName={`${CARD_SIZE} border border-steel-200 bg-white`}>
			<div className="flex h-full flex-col md:flex-row">
				{/* Proof photo / certificate  60%, shown whole (contain) over an
				    ambient blurred fill of itself so the panel never looks empty. */}
				<div className="relative h-[44%] w-full shrink-0 overflow-hidden bg-steel-100 md:h-full md:w-3/5">
					<Image
						src={a.moment}
						alt=""
						aria-hidden
						fill
						sizes="(min-width: 768px) 55vw, 86vw"
						className="scale-125 object-cover blur-2xl"
					/>
					<div className="absolute inset-0 bg-white/60" />
					<Image
						src={a.moment}
						alt=""
						fill
						sizes="(min-width: 768px) 55vw, 86vw"
						className="object-contain p-4 md:p-8"
						priority={priority}
					/>
				</div>

				{/* Copy  40% */}
				<div className="flex flex-1 flex-col justify-center gap-4 p-7 sm:p-9 md:p-10 lg:p-12">
					<div className="flex items-center gap-4">
						<span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-corporate-50 ring-1 ring-corporate-100">
							<Image
								src={a.image}
								alt=""
								width={44}
								height={44}
								className="size-10 object-contain"
							/>
						</span>
						<span className="text-[11px] font-semibold uppercase leading-snug tracking-kicker text-corporate-600">
							{a.org}
						</span>
					</div>
					<h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tight text-ink lg:text-[1.75rem]">
						{a.title}
					</h3>
					<p className="text-[15px] leading-relaxed text-steel-600">{a.desc}</p>
				</div>
			</div>
		</ScrollStackItem>
	);
}

/* The final card in the stack  stat blocks rising in one-by-one. */
function StatsCard() {
	const reduce = useReducedMotion();

	const item: Variants =
		reduce ?
			{ hidden: { opacity: 0 }, show: { opacity: 1 } }
		:	{
				hidden: { opacity: 0, y: 90 },
				show: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
				},
			};

	return (
		<ScrollStackItem
			itemClassName={`${CARD_SIZE} bg-gradient-to-br from-ink via-corporate-900 to-corporate-800 text-white`}>
			<div className="flex h-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
				<div className="text-center">
					<span className="text-xs font-semibold uppercase tracking-kicker text-corporate-200">
						By the numbers
					</span>
					<h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Proof, not promises
					</h3>
				</div>

				<motion.div
					className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-2 gap-5 md:grid-cols-4"
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.35 }}
					variants={{
						hidden: {},
						show: { transition: { staggerChildren: 0.18 } },
					}}>
					{heroStats.map((s) => (
						<motion.div
							key={s.label}
							variants={item}
							className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-8 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.1]">
							{/* top accent */}
							<span className="absolute inset-x-0 top-0 mx-auto block h-px w-2/3 bg-gradient-to-r from-transparent via-corporate-300/60 to-transparent" />
							<div className="font-display text-[2.6rem] font-bold leading-none tracking-tight text-white sm:text-5xl">
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
					))}
				</motion.div>
			</div>
		</ScrollStackItem>
	);
}

export function WhyCollage() {
	return (
		<div className="relative w-full overflow-x-clip bg-canvas-soft">
			{/* One continuous stack: award cards, then the stats card */}
			<ScrollStack
				useWindowScroll
				itemDistance={120}
				itemScale={0.02}
				itemStackDistance={26}
				baseScale={0.92}
				stackPosition="15%"
				scaleEndPosition="8%">
				{awards.map((a, i) => (
					<AwardCard
						key={a.title}
						a={a}
						priority={i === 0}
					/>
				))}
				<StatsCard />
			</ScrollStack>
		</div>
	);
}
