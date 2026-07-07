/** @format */

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { cn } from "@/lib/utils";

/**
 * FLOATING-IMAGES SHOWCASE  the signature scroll moment.
 *
 * A cluster of real project shots floats up into place on the LEFT, each:
 *   • revealing once (fade + lift + de-rotate + settle from scale 0.92)  ← FloatCard
 *   • drifting at its own speed as you scroll (depth)                     ← <Parallax>
 *   • breathing with a continuous idle float                             ← inner loop
 * The editorial copy on the RIGHT mask/stagger-reveals as the images settle.
 *
 * Layout: desktop = absolute collage (varied sizes / offsets / z-depth);
 * mobile = a clean 2-col grid (no clipping). All motion is GPU transforms only
 * and is fully disabled under prefers-reduced-motion.
 *
 * ── SWAP THE IMAGES ─────────────────────────────────────────────────────────
 * Edit the `shots` array below  point `src` at any file in /public/images and
 * update `alt`. Tune position/size/depth with `pos` (lg-only classes), `speed`
 * (parallax px), `rotate`, and the idle `dur`/`delay`/`amp`.
 */

type Shot = {
	src: string;
	alt: string;
	/** lg-only absolute position + width */
	pos: string;
	/** mobile grid span */
	span?: string;
	z: string;
	/** parallax drift in px (bigger = closer / faster) */
	speed: number;
	/** resting rotation in deg */
	rotate: number;
	/** idle-float duration / delay / amplitude */
	dur: number;
	delay: number;
	amp: number;
};

const shots: Shot[] = [
	{
		src: "/images/portfolio/prions-biotech.jpg",
		alt: "Prions Biotech  website built by Cubiccode",
		pos: "lg:left-[1%] lg:top-[3%] lg:w-[52%]",
		span: "col-span-2",
		z: "z-20",
		speed: 56,
		rotate: -4,
		dur: 6,
		delay: 0,
		amp: 10,
	},
	{
		src: "/images/portfolio/laxis-analytics.jpg",
		alt: "Laxis Analytics  website built by Cubiccode",
		pos: "lg:left-[50%] lg:top-[0%] lg:w-[46%]",
		z: "z-30",
		speed: 26,
		rotate: 5,
		dur: 7,
		delay: 0.6,
		amp: 7,
	},
	{
		src: "/images/portfolio/woodpecker-exotic.jpg",
		alt: "Woodpecker Exotica  website built by Cubiccode",
		pos: "lg:left-[9%] lg:top-[39%] lg:w-[50%]",
		z: "z-40",
		speed: 88,
		rotate: 3,
		dur: 5.4,
		delay: 0.3,
		amp: 12,
	},
	{
		src: "/images/portfolio/city-index.jpg",
		alt: "CityIndex  investment web app built by Cubiccode",
		pos: "lg:left-[56%] lg:top-[41%] lg:w-[42%]",
		z: "z-20",
		speed: 36,
		rotate: -6,
		dur: 6.6,
		delay: 0.9,
		amp: 8,
	},
	{
		src: "/images/portfolio/harsha-rakesh.jpg",
		alt: "Harsha & Rakesh Salon  e-commerce store built by Cubiccode",
		pos: "lg:left-[20%] lg:top-[71%] lg:w-[46%]",
		z: "z-30",
		speed: 64,
		rotate: 4,
		dur: 5.8,
		delay: 0.45,
		amp: 9,
	},
];

function FloatCard({ shot }: { shot: Shot }) {
	const reduce = useReducedMotion();

	const card = (
		<figure className="group relative overflow-hidden rounded-2xl border border-steel-200 bg-white shadow-card transition-shadow duration-500 hover:shadow-lift">
			{/* browser chrome strip */}
			<div className="flex items-center gap-1.5 border-b border-steel-100 bg-steel-50 px-3 py-2">
				<span className="size-2 rounded-full bg-steel-300" />
				<span className="size-2 rounded-full bg-steel-300" />
				<span className="size-2 rounded-full bg-steel-300" />
			</div>
			<div className="relative aspect-[16/10] w-full">
				<Image
					src={shot.src}
					alt={shot.alt}
					fill
					sizes="(max-width: 1024px) 45vw, 28vw"
					className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
				/>
			</div>
		</figure>
	);

	// Reduced motion: static, no parallax / reveal / idle float.
	if (reduce) {
		return (
			<div className={cn("relative lg:absolute", shot.pos, shot.span, shot.z)}>
				{card}
			</div>
		);
	}

	return (
		<Parallax
			speed={shot.speed}
			className={cn("relative lg:absolute", shot.pos, shot.span, shot.z)}>
			{/* settle-in reveal (once) */}
			<motion.div
				initial={{ opacity: 0, y: 60, rotate: shot.rotate * 2.4, scale: 0.92 }}
				whileInView={{ opacity: 1, y: 0, rotate: shot.rotate, scale: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{
					duration: 1,
					delay: shot.delay * 0.5,
					ease: [0.22, 1, 0.36, 1],
				}}
				className="[will-change:transform]">
				{/* continuous idle float */}
				<motion.div
					animate={{ y: [0, -shot.amp, 0] }}
					transition={{
						duration: shot.dur,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="[will-change:transform]">
					{card}
				</motion.div>
			</motion.div>
		</Parallax>
	);
}

export function FloatingShowcase() {
	return (
		<section className="section relative overflow-hidden bg-canvas-soft">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-radial-fade opacity-70" />
				<div className="absolute -right-32 top-1/3 size-[460px] rounded-full bg-corporate-50 blur-3xl" />
			</div>

			<div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
				{/* LEFT  floating image cluster (collage on lg, grid on mobile) */}
				<div
					className={cn(
						"order-2 lg:order-1",
						"grid grid-cols-2 gap-4 sm:gap-5",
						"lg:block lg:h-[600px]",
					)}>
					{shots.map((shot) => (
						<FloatCard
							key={shot.src}
							shot={shot}
						/>
					))}
				</div>

				{/* RIGHT  editorial copy */}
				<div className="order-1 lg:order-2">
					<SectionHeading
						kicker="Selected Work"
						title="Crafted interfaces, engineered to perform."
					/>

					<Reveal delay={0.12}>
						<p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-steel-600 sm:text-lg">
							Every screen we ship is designed for clarity and built for speed
							pixel-tuned in the browser, then measured against real traffic and
							conversions. This is a glimpse of the websites, stores and
							platforms we&apos;ve launched for brands across India.
						</p>
					</Reveal>

					<div className="mt-8 grid max-w-md grid-cols-2 gap-x-8 gap-y-6">
						{[
							{ k: "700+", v: "Projects delivered" },
							{ k: "500+", v: "Clients served" },
							{ k: "42+", v: "Live websites in our portfolio" },
							{ k: "9 yrs", v: "Building for the web" },
						].map((s, i) => (
							<Reveal
								key={s.v}
								direction="up"
								delay={0.15 + i * 0.08}>
								<div>
									<div className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
										{s.k}
									</div>
									<div className="mt-1 text-[13px] leading-tight text-steel-500">
										{s.v}
									</div>
								</div>
							</Reveal>
						))}
					</div>

					<Reveal delay={0.35}>
						<div className="mt-10 flex flex-wrap gap-3">
							<Button
								href="/portfolio"
								arrow>
								Explore Our Work
							</Button>
							<Button
								href="/case-studies"
								variant="outline"
								arrow>
								View Case Studies
							</Button>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
