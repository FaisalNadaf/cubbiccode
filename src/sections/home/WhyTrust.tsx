/** @format */

"use client";

import { useRef } from "react";
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	useMotionTemplate,
	useReducedMotion,
	type MotionValue,
} from "framer-motion";
import { Users, Gauge, LifeBuoy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountStat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

/* Each ownership pillar now rides on its own floating image tile. */
const ownership = [
	{
		icon: Users,
		title: "A cross-functional team",
		text: "Designers, full-stack developers and a dedicated project manager on every single engagement.",
		image: "/images/downloads/A cross-functional team.webp",
	},
	{
		icon: Gauge,
		title: "Your scorecard is ours",
		text: "We treat your launch date, your traffic and your conversions as our own KPIs  not yours alone.",
		image: "/images/downloads/Your scorecard is ours.webp",
	},
	{
		icon: LifeBuoy,
		title: "We don't vanish at launch",
		text: "Ongoing support and AMC mean we're with you long after the site goes live.",
		image: "/images/downloads/we dont vansih on launch.webp",
	},
];

/* ─────────────────────────── floating image card ─────────────────────────── */

function FloatingCard({
	item,
	x,
	y,
	depth,
	position,
	delay,
	reduce,
}: {
	item: (typeof ownership)[number];
	x: MotionValue<number>;
	y: MotionValue<number>;
	depth: number;
	position: string;
	delay: number;
	reduce: boolean;
}) {
	return (
		<motion.div
			// Outer layer = pointer-driven depth parallax (+ real z translate).
			style={
				reduce ? undefined : { x, y, z: depth, transformStyle: "preserve-3d" }
			}
			className={`absolute ${position}`}>
			<motion.div
				// Inner layer = one-shot entrance so it never fights the parallax.
				initial={reduce ? false : { opacity: 0, scale: 0.9, y: 26 }}
				whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
				viewport={{ once: true, amount: 0.35 }}
				transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
				className="group relative h-full w-full overflow-hidden rounded-[1.6rem] border border-white/70 bg-white p-1.5 shadow-lift ring-1 ring-ink/5">
				<div className="relative h-full w-full overflow-hidden rounded-[1.25rem]">
					<img
						src={item.image}
						alt={item.title}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
					/>
					{/* legibility scrim  stronger so titles stay crisp on any image */}
					<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />

					{/* content  title always, text reveals on hover */}
					<div className="absolute inset-x-5 bottom-5 text-white">
						<span className="mb-2.5 block h-[3px] w-9 rounded-full bg-corporate-400 shadow-[0_0_12px_rgba(63,134,208,0.7)]" />
						<p className="font-display text-lg font-bold leading-snug tracking-tight text-white sm:text-xl [text-shadow:0_2px_20px_rgba(8,20,39,0.98),0_1px_2px_rgba(8,20,39,0.9)]">
							{item.title}
						</p>
						<p className="mt-2 max-h-0 overflow-hidden text-[13.5px] font-medium leading-snug text-white/90 opacity-0 transition-all duration-500 ease-out [text-shadow:0_1px_10px_rgba(8,20,39,0.9)] group-hover:max-h-28 group-hover:opacity-100">
							{item.text}
						</p>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}

/* ─────────────────────────────── section ─────────────────────────────── */

export function WhyTrust() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const reduce = useReducedMotion() ?? false;

	// Pointer tracking (0..1), spring-smoothed for buttery motion.
	const px = useMotionValue(0.5);
	const py = useMotionValue(0.5);
	const spx = useSpring(px, { stiffness: 110, damping: 22, mass: 0.45 });
	const spy = useSpring(py, { stiffness: 110, damping: 22, mass: 0.45 });

	// Whole cluster tilts in 3D toward the cursor.
	const tiltY = useTransform(spx, [0, 1], [9, -9]);
	const tiltX = useTransform(spy, [0, 1], [-9, 9]);

	// Per-card parallax  bigger travel = closer to the viewer.
	const backX = useTransform(spx, [0, 1], [14, -14]);
	const backY = useTransform(spy, [0, 1], [10, -10]);
	const midX = useTransform(spx, [0, 1], [20, -20]);
	const midY = useTransform(spy, [0, 1], [14, -14]);
	const frontX = useTransform(spx, [0, 1], [30, -30]);
	const frontY = useTransform(spy, [0, 1], [22, -22]);

	// Left column drifts gently the opposite way for depth.
	const leftX = useTransform(spx, [0, 1], [8, -8]);

	// Soft spotlight that follows the cursor across the section.
	const spotX = useTransform(spx, (v) => `${(v * 100).toFixed(1)}%`);
	const spotY = useTransform(spy, (v) => `${(v * 100).toFixed(1)}%`);
	const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX} ${spotY}, rgba(27,110,194,0.12), transparent 60%)`;

	const handleMove =
		reduce ? undefined : (
			(e: React.MouseEvent<HTMLElement>) => {
				const r = sectionRef.current?.getBoundingClientRect();
				if (!r) return;
				px.set((e.clientX - r.left) / r.width);
				py.set((e.clientY - r.top) / r.height);
			}
		);
	const handleLeave =
		reduce ? undefined : (
			() => {
				px.set(0.5);
				py.set(0.5);
			}
		);

	return (
		<section
			ref={sectionRef}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			aria-label="Why clients trust Cubiccode"
			className="relative overflow-hidden bg-canvas py-20 md:py-28 lg:py-32">
			{/* ── Ambient background ─────────────────────────────────────────── */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden>
				<div className="absolute inset-0 bg-blueprint [background-size:38px_38px] opacity-[0.04]" />
				<div className="absolute -right-40 -top-20 size-[560px] rounded-full bg-corporate-100/50 blur-3xl" />
				<div className="absolute -left-40 bottom-0 size-[440px] rounded-full bg-steel-100 blur-3xl" />
			</div>
			{!reduce && (
				<motion.div
					style={{ background: spotlight }}
					className="pointer-events-none absolute inset-0 z-[1]"
					aria-hidden
				/>
			)}

			<div className="container-x relative z-10 grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
				{/* ── LEFT  copy + CTA + proof ──────────────────────────────── */}
				<motion.div style={reduce ? undefined : { x: leftX }}>
					<Reveal>
						<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-kicker text-corporate-600">
							<span className="h-px w-8 bg-corporate-400/70" />
							The reason for our success
						</span>
					</Reveal>

					<Reveal delay={0.08}>
						<h2 className="mt-5 max-w-2xl text-balance font-display font-semibold leading-[1.12] tracking-tight text-ink text-[2rem] sm:text-[2.4rem] lg:text-[2.85rem]">
							A web partner that takes{" "}
							<span className="relative whitespace-nowrap text-corporate-600">
								ownership
								<span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-corporate-500 via-corporate-400 to-transparent" />
							</span>{" "}
							of your outcome  not just your project.
						</h2>
					</Reveal>

					<Reveal delay={0.16}>
						<p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-steel-500 sm:text-base lg:text-[17px]">
							Most agencies hand you a website and disappear. We don&apos;t work
							that way  every Cubiccode engagement is run by a team that treats
							your launch date, your traffic and your conversions as their own
							scorecard.
						</p>
					</Reveal>

					<Reveal delay={0.24}>
						<div className="mt-9 flex flex-wrap gap-3">
							<Button
								href="/about"
								variant="outline"
								arrow>
								Why Cubiccode
							</Button>
						</div>
					</Reveal>

					<Reveal delay={0.32}>
						<div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
							<div className="flex items-center gap-5 sm:gap-7">
								<div>
									<div className="font-display text-2xl font-bold leading-none text-ink sm:text-[27px]">
										<CountStat
											value={700}
											suffix="+"
										/>
									</div>
									<div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-steel-500">
										Projects
									</div>
								</div>
								<span className="h-8 w-px bg-steel-200" />
								<div>
									<div className="font-display text-2xl font-bold leading-none text-ink sm:text-[27px]">
										<CountStat
											value={500}
											suffix="+"
										/>
									</div>
									<div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-steel-500">
										Clients
									</div>
								</div>
								<span className="h-8 w-px bg-steel-200" />
								<div>
									<div className="font-display text-2xl font-bold leading-none text-ink sm:text-[27px]">
										<CountStat
											value={1}
											suffix="M+"
										/>
									</div>
									<div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-steel-500">
										Daily visitors
									</div>
								</div>
							</div>
						</div>
					</Reveal>
				</motion.div>

				{/* ── RIGHT  floating image collage ─────────────────────────── */}
				<div className="relative [perspective:1500px]">
					<motion.div
						style={
							reduce ? undefined : (
								{
									rotateX: tiltX,
									rotateY: tiltY,
									transformStyle: "preserve-3d",
								}
							)
						}
						className="relative mx-auto h-[480px] w-full max-w-[600px] sm:h-[600px] lg:h-[640px]">
						{/* decorative floating shapes */}
						<motion.span
							aria-hidden
							animate={reduce ? undefined : { y: [0, -12, 0] }}
							transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
							className="absolute -left-5 top-8 size-16 rounded-3xl bg-corporate-200/50 blur-[1px]"
						/>
						<motion.span
							aria-hidden
							animate={reduce ? undefined : { y: [0, 10, 0] }}
							transition={{
								duration: 6,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 0.8,
							}}
							className="absolute -right-6 top-2 size-12 rounded-full bg-corporate-400/40"
						/>

						{/* floating proof chip */}
						<motion.div
							animate={reduce ? undefined : { y: [0, -9, 0] }}
							transition={{
								duration: 4.6,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							style={reduce ? undefined : { z: 90 }}
							className="absolute -right-5 -bottom-5 z-40 inline-flex items-center gap-3 rounded-2xl border border-steel-200 bg-white/95 px-4 py-3 shadow-lift backdrop-blur-md">
							<span className="flex size-9 items-center justify-center rounded-xl bg-corporate-600 text-white">
								<Users className="size-[18px]" />
							</span>
							<div className="leading-tight">
								<div className="font-display text-sm font-bold text-ink">
									500+ clients
								</div>
								<div className="text-[11px] text-steel-500">
									stayed &amp; referred us
								</div>
							</div>
						</motion.div>

						{/* the three image tiles */}
						<FloatingCard
							item={ownership[1]}
							x={frontX}
							y={frontY}
							depth={70}
							delay={0.05}
							reduce={reduce}
							position="right-0 top-[7%] z-30 h-[56%] w-[50%]"
						/>
						<FloatingCard
							item={ownership[0]}
							x={midX}
							y={midY}
							depth={40}
							delay={0.15}
							reduce={reduce}
							position="left-0 top-0 z-20 h-[48%] w-[53%]"
						/>
						<FloatingCard
							item={ownership[2]}
							x={backX}
							y={backY}
							depth={10}
							delay={0.25}
							reduce={reduce}
							position="bottom-0 left-[12%] z-10 h-[48%] w-[56%]"
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
