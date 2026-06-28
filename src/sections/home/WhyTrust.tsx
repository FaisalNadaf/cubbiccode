/** @format */

"use client";

import { useEffect, useRef } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
	useMotionTemplate,
	useReducedMotion,
} from "framer-motion";
import { Users, Gauge, LifeBuoy, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { site } from "@/content/site";

const ownership = [
	{
		icon: Users,
		title: "A cross-functional team",
		text: "Designers, full-stack developers and a dedicated project manager on every single engagement.",
	},
	{
		icon: Gauge,
		title: "Your scorecard is our scorecard",
		text: "We treat your launch date, your traffic and your conversions as our own KPIs — not yours alone.",
	},
	{
		icon: LifeBuoy,
		title: "We don't disappear at launch",
		text: "Ongoing support and AMC mean we're with you long after the site goes live.",
	},
];

/* ─────────────────────── ownership card (right column) ─────────────────────── */

function OwnershipCard({
	item,
	index,
}: {
	item: (typeof ownership)[number];
	index: number;
}) {
	const Icon = item.icon;
	return (
		<Reveal
			direction="left"
			delay={0.12 + index * 0.1}>
			<TiltCard
				max={6}
				className="group overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-md transition-colors duration-300 hover:border-corporate-300/40 hover:bg-white/[0.1]">
				{/* growing accent bar */}
				<span className="pointer-events-none absolute left-0 top-6 h-8 w-[3px] origin-top scale-y-0 rounded-full bg-corporate-400 transition-transform duration-500 ease-out group-hover:scale-y-100" />
				{/* corner glow on hover */}
				<span className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-corporate-500/0 blur-2xl transition-colors duration-500 group-hover:bg-corporate-500/30" />

				<div className="relative flex items-start gap-4">
					<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-corporate-200 transition-all duration-300 group-hover:scale-105 group-hover:border-transparent group-hover:bg-corporate-600 group-hover:text-white">
						<Icon className="size-[22px]" />
					</span>
					<div>
						<p className="flex items-center gap-1.5 font-display text-[17px] font-semibold text-white">
							{item.title}
							<ArrowRight className="size-4 -translate-x-1 text-corporate-200 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
						</p>
						<p className="mt-1.5 text-pretty text-[14.5px] leading-relaxed text-steel-300">
							{item.text}
						</p>
					</div>
				</div>
			</TiltCard>
		</Reveal>
	);
}

/* ─────────────────────────────── section ─────────────────────────────── */

export function WhyTrust() {
	const trackRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const reduce = useReducedMotion() ?? false;

	// Scroll → expand the card from an inset rounded panel to fullscreen.
	// Animated via clip-path (paint-only) so it stays smooth (no layout thrash).
	const { scrollYProgress } = useScroll({
		target: trackRef,
		offset: ["start start", "end start"],
	});
	const clipY = useTransform(scrollYProgress, [0, 0.45], [6, 0]);
	const clipX = useTransform(scrollYProgress, [0, 0.45], [4, 0]);
	const clipR = useTransform(scrollYProgress, [0, 0.45], [44, 0]);
	const clipPath = useMotionTemplate`inset(${clipY}vh ${clipX}vw round ${clipR}px)`;

	// Pointer tracking → cursor spotlight + parallax.
	const px = useMotionValue(0.5);
	const py = useMotionValue(0.5);
	const spx = useSpring(px, { stiffness: 120, damping: 24, mass: 0.4 });
	const spy = useSpring(py, { stiffness: 120, damping: 24, mass: 0.4 });

	const spotX = useTransform(spx, (v) => `${(v * 100).toFixed(2)}%`);
	const spotY = useTransform(spy, (v) => `${(v * 100).toFixed(2)}%`);
	const spotlight = useMotionTemplate`radial-gradient(640px circle at ${spotX} ${spotY}, rgba(27,110,194,0.22), transparent 62%)`;

	const leftX = useTransform(spx, [0, 1], [10, -10]);
	const rightX = useTransform(spx, [0, 1], [-10, 10]);
	const videoX = useTransform(spx, [0, 1], [-22, 22]);
	const videoY = useTransform(spy, [0, 1], [-16, 16]);

	// Reduced motion: pause the background video; pointer handlers stay detached.
	useEffect(() => {
		if (reduce) videoRef.current?.pause();
	}, [reduce]);

	const handleMove =
		reduce ? undefined : (
			(e: React.MouseEvent<HTMLElement>) => {
				const r = stageRef.current?.getBoundingClientRect();
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
			ref={trackRef}
			aria-label="Why clients trust Cubiccode"
			className={`relative bg-canvas ${reduce ? "" : "h-[185vh]"}`}>
			{/* Sticky stage — pins while the card grows to fullscreen. */}
			<div
				ref={stageRef}
				onMouseMove={handleMove}
				onMouseLeave={handleLeave}
				className={`flex items-center overflow-hidden ${
					reduce ? "relative min-h-screen" : "sticky top-0 h-screen"
				}`}>
				{/* ── Expanding card ───────────────────────────────────────────── */}
				<motion.div
					style={reduce ? undefined : { clipPath }}
					className="absolute inset-0 isolate overflow-hidden bg-ink text-white">
					{/* Background video (full bleed) */}
					<div
						className="absolute inset-0 z-0"
						aria-hidden="true">
						<motion.div
							style={reduce ? undefined : { x: videoX, y: videoY }}
							className="absolute -inset-[7%]">
							<motion.video
								ref={videoRef}
								initial={reduce ? false : { scale: 1.05 }}
								animate={reduce ? undefined : { scale: [1.05, 1.13, 1.05] }}
								transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
								className="h-full w-full object-cover"
								autoPlay
								muted
								loop
								playsInline
								preload="metadata"
								poster="/images/no.png">
								<source
									src="/videos/demo.mp4"
									type="video/mp4"
								/>
							</motion.video>
						</motion.div>
					</div>

					{/* Legibility + mood scrims */}
					<div
						className="pointer-events-none absolute inset-0 z-[1]"
						aria-hidden="true">
						<div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/35" />
						<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/55" />
						<div className="absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.1]" />
						<div className="absolute inset-0 [background:radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(8,20,39,0.7))]" />
					</div>

					{/* Cursor spotlight (mouse interaction) */}
					{!reduce && (
						<motion.div
							style={{ background: spotlight }}
							className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen"
							aria-hidden="true"
						/>
					)}

					{/* film grain */}
					<div
						className="noise pointer-events-none absolute inset-0 z-[2]"
						aria-hidden="true"
					/>

					{/* ── Content ─────────────────────────────────────────────── */}
					<div className="absolute inset-0 z-10 flex items-center">
						<div className="container-x grid w-full items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
							{/* LEFT — copy + CTA */}
							<motion.div style={reduce ? undefined : { x: leftX }}>
								<Reveal>
									<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-kicker text-corporate-200">
										<span className="h-px w-8 bg-corporate-300/60" />
										The reason for our success
									</span>
								</Reveal>

								<Reveal delay={0.08}>
									<h2 className="mt-5 max-w-2xl text-balance font-display font-semibold leading-[1.14] tracking-tight text-white [text-shadow:0_2px_24px_rgba(8,20,39,0.45)] text-[1.9rem] sm:text-[2.3rem] lg:text-[2.6rem] xl:text-[2.95rem]">
										A web partner that takes ownership of your outcome — not
										just your project.
									</h2>
								</Reveal>

								<Reveal delay={0.16}>
									<p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-steel-200 sm:text-base lg:text-[17px]">
										Most agencies hand you a website and disappear. We don&apos;t
										work that way — every Cubiccode engagement is run by a team
										that treats your launch date, your traffic and your
										conversions as their own scorecard.
									</p>
								</Reveal>

								<Reveal delay={0.24}>
									<div className="mt-9 flex flex-wrap gap-3">
										<Button
											href={site.proposalCta}
											external
											variant="white"
											arrow>
											Get a Proposal
										</Button>
										<Button
											href="/about"
											variant="outline"
											arrow
											className="border-white/30 bg-white/5 text-white hover:border-white/60 hover:bg-white/10">
											Why Cubiccode
										</Button>
									</div>
								</Reveal>

								<Reveal delay={0.32}>
									<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-steel-300">
										<span className="inline-flex items-center gap-2">
											<ShieldCheck className="size-4 text-corporate-300" />
											{site.certification}
										</span>
										<span className="hidden h-3 w-px bg-white/20 sm:inline-block" />
										<span>700+ projects delivered · 500+ clients</span>
									</div>
								</Reveal>
							</motion.div>

							{/* RIGHT — ownership map */}
							<motion.div
								style={reduce ? undefined : { x: rightX }}
								className="relative">
								{/* floating proof chip — pinned to the TOP now */}
								<div className="mb-6 flex justify-end">
									<motion.div
										animate={reduce ? undefined : { y: [0, -9, 0] }}
										transition={{
											duration: 4.6,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-lift backdrop-blur-md">
										<span className="flex size-9 items-center justify-center rounded-xl bg-corporate-600 text-white">
											<Users className="size-[18px]" />
										</span>
										<div className="leading-tight">
											<div className="font-display text-sm font-bold text-white">
												500+ clients
											</div>
											<div className="text-[11px] text-steel-300">
												stayed &amp; referred us
											</div>
										</div>
									</motion.div>
								</div>

								<Reveal direction="up">
									<p className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-kicker text-corporate-200">
										<span className="h-px w-8 bg-corporate-300/60" />
										How we take ownership
									</p>
								</Reveal>

								<div className="space-y-4 [perspective:1200px]">
									{ownership.map((item, i) => (
										<OwnershipCard
											key={item.title}
											item={item}
											index={i}
										/>
									))}
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
