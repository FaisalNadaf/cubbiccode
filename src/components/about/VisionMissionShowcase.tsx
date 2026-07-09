/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { Compass, Target } from "lucide-react";
import { aboutCopy } from "@/content/company";

/* ── Brand palette (Cubiccode) ───────────────────────────── */
const INK = "#0B1B3A";
const INK_DEEP = "#081427";
const INK_MID = "#13284f";
const ACCENT = "#1B6EC2"; // corporate blue
const ACCENT_LIGHT = "#6FA6DF"; // corporate-300

// Vision = bright, forward-looking corporate blue; Mission = deep navy anchor.
// The strong two-tone contrast makes the interlocking diagonal clearly legible.
const VISION_GRADIENT = `linear-gradient(125deg, ${ACCENT} 0%, #0B3A63 100%)`;
const MISSION_GRADIENT = `linear-gradient(135deg, ${INK} 0%, ${INK_MID} 100%)`;

const VISION_BG = "/images/about/parallax-2.jpg";
const MISSION_BG = "/images/Moments/devfest2022_2.jpg";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (y: number, duration: number): Variants => ({
	hidden: { opacity: 0, y },
	visible: { opacity: 1, y: 0, transition: { duration, ease: SMOOTH_EASE } },
});

/**
 * Vision + Mission shown as two interlocking diagonal panels.
 * Vision slides down from the top, Mission rises from the bottom.
 */
export function VisionMissionShowcase() {
	return (
		<section className="relative isolate overflow-hidden bg-ink py-16 text-white lg:py-24">
			{/* ambient glows + blueprint */}
			<div
				aria-hidden
				className="pointer-events-none absolute -left-32 top-24 -z-10 size-[26rem] rounded-full blur-[160px]"
				style={{ background: `${ACCENT}26` }}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-32 bottom-24 -z-10 size-[24rem] rounded-full blur-[140px]"
				style={{ background: `${INK_MID}66` }}
			/>
			<div className="pointer-events-none absolute inset-0 -z-10 bg-blueprint [background-size:44px_44px] opacity-[0.08]" />

			<div className="container-x relative">
				{/* Heading */}
				<motion.div
					className="mb-10 max-w-2xl"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					variants={{
						hidden: {},
						visible: { transition: { staggerChildren: 0.12 } },
					}}>
					<motion.span
						className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-300"
						variants={fadeUp(16, 0.6)}>
						<span className="h-px w-8 bg-corporate-300/60" />
						Vision &amp; mission
					</motion.span>
					<motion.h2
						className="mt-6 text-pretty text-3xl font-semibold leading-[1.1] tracking-tightest sm:text-4xl lg:text-[2.9rem]"
						variants={fadeUp(28, 0.8)}>
						<span className="text-white">Where we&apos;re going, </span>
						<span
							className="bg-clip-text text-transparent"
							style={{
								backgroundImage: `linear-gradient(90deg, ${ACCENT} 0%, ${ACCENT_LIGHT} 100%)`,
							}}>
							and why.
						</span>
					</motion.h2>
					<motion.p
						className="mt-5 text-lg leading-relaxed text-steel-300"
						variants={fadeUp(20, 0.7)}>
						The horizon we&apos;re building toward and the promise we keep on
						the way there.
					</motion.p>
				</motion.div>

				{/* Mobile: stacked cards */}
				<div className="flex flex-col gap-5 lg:hidden">
					<MobilePanel variant="vision" />
					<MobilePanel variant="mission" />
				</div>

				{/* Desktop: interlocking diagonal panels */}
				<DiagonalPanels />
			</div>
		</section>
	);
}

function MobilePanel({ variant }: { variant: "vision" | "mission" }) {
	const isVision = variant === "vision";
	const Icon = isVision ? Compass : Target;
	const bg = isVision ? VISION_BG : MISSION_BG;
	const gradient = isVision ? VISION_GRADIENT : MISSION_GRADIENT;
	const label = isVision ? "Vision" : "Mission";
	const title = isVision ? "Where we're headed" : "What we deliver";
	const body = isVision ? aboutCopy.vision : aboutCopy.mission;
	const imageOpacity = isVision ? "opacity-25" : "opacity-30";
	const mixBlend = isVision ? "mix-blend-overlay" : "mix-blend-luminosity";

	return (
		<motion.article
			initial={{ y: 40, opacity: 0 }}
			whileInView={{ y: 0, opacity: 1 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.8, ease: SMOOTH_EASE }}
			className="relative overflow-hidden rounded-3xl p-7 text-white shadow-lift"
			style={{ background: gradient }}>
			<Image
				aria-hidden
				src={bg}
				alt=""
				fill
				sizes="100vw"
				className={`pointer-events-none object-cover ${imageOpacity} ${mixBlend}`}
				style={{ filter: "saturate(0.6) contrast(1.1)" }}
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background: `linear-gradient(135deg, ${INK}b3 0%, ${INK_DEEP}70 100%)`,
				}}
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
				style={{ background: `${ACCENT}33` }}
			/>

			<div className="relative">
				<span
					className="inline-flex size-12 items-center justify-center rounded-xl ring-1 ring-white/20"
					style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}
					aria-hidden>
					<Icon
						className="size-7"
						strokeWidth={1.5}
					/>
				</span>
				<h3
					className="mt-5 font-display text-5xl font-black uppercase leading-[0.95] tracking-tightest text-white"
					style={{ textShadow: "0 2px 18px rgba(5,16,31,0.6)" }}>
					{label}
				</h3>
				<p className="mt-3 text-xl font-semibold leading-snug text-white">
					{title}
				</p>
				<p className="mt-2 text-[15px] leading-relaxed text-white/85">
					{body}
				</p>
			</div>
		</motion.article>
	);
}

function DiagonalPanels() {
	return (
		<div
			className="relative hidden h-[32rem] w-full lg:block xl:h-[34rem]"
			style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.45))" }}>
			{/* ── Mission (back layer, slides up from bottom) ─────────── */}
			<motion.article
				initial={{ y: 120, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 1.2, ease: SMOOTH_EASE, delay: 0.15 }}
				className="absolute inset-0 overflow-hidden"
				style={{
					background: MISSION_GRADIENT,
					clipPath: "polygon(62% 0, 100% 0, 100% 100%, 42% 100%)",
					borderRadius: "0 28px 28px 0",
				}}>
				<Image
					aria-hidden
					src={MISSION_BG}
					alt=""
					fill
					sizes="(min-width: 1024px) 60vw, 100vw"
					className="pointer-events-none object-cover opacity-30 mix-blend-luminosity"
					style={{ filter: "saturate(0.5) contrast(1.05)" }}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background: `linear-gradient(135deg, ${INK}cc 0%, ${INK_DEEP}b3 100%)`,
					}}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-40"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
						backgroundSize: "36px 36px",
						maskImage:
							"radial-gradient(ellipse at bottom right, black 30%, transparent 80%)",
						WebkitMaskImage:
							"radial-gradient(ellipse at bottom right, black 30%, transparent 80%)",
					}}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full blur-3xl"
					style={{ background: `${ACCENT}33` }}
				/>

				{/* Target icon  top-right */}
				<motion.span
					initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
					whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.9, ease: SMOOTH_EASE, delay: 0.7 }}
					className="absolute right-10 top-10 text-corporate-400 lg:right-14 lg:top-14"
					aria-hidden>
					<Target
						className="size-12 lg:size-16"
						strokeWidth={1.5}
					/>
				</motion.span>

				{/* Content */}
				<motion.div
					initial={{ y: 30, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1, ease: SMOOTH_EASE, delay: 0.55 }}
					className="absolute bottom-12 right-10 max-w-sm text-end text-white lg:bottom-16 lg:right-14">
					<h3
						className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-white lg:text-7xl"
						style={{ textShadow: "0 2px 22px rgba(5,16,31,0.65)" }}>
						Mission
					</h3>
					<p className="mt-4 text-xl font-semibold leading-snug text-corporate-100 lg:text-2xl">
						What we deliver
					</p>
					<p className="mt-4 text-base leading-relaxed text-white/85 lg:text-lg">
						{aboutCopy.mission}
					</p>
				</motion.div>
			</motion.article>

			{/* ── Vision (front layer, slides down from top) ─────────── */}
			<motion.article
				initial={{ y: -120, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 1.2, ease: SMOOTH_EASE }}
				className="absolute inset-0 overflow-hidden text-white"
				style={{
					background: VISION_GRADIENT,
					clipPath: "polygon(0 0, 58% 0, 38% 100%, 0 100%)",
					borderRadius: "28px 0 0 28px",
				}}>
				<Image
					aria-hidden
					src={VISION_BG}
					alt=""
					fill
					sizes="(min-width: 1024px) 55vw, 100vw"
					className="pointer-events-none object-cover opacity-25 mix-blend-overlay"
					style={{ filter: "saturate(0.6) contrast(1.15)" }}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background: `radial-gradient(135% 135% at 0% 0%, ${INK_DEEP}e6 0%, transparent 58%)`,
					}}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-40"
					style={{
						backgroundImage:
							"linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
						backgroundSize: "36px 36px",
						maskImage:
							"radial-gradient(ellipse at top left, black 30%, transparent 80%)",
						WebkitMaskImage:
							"radial-gradient(ellipse at top left, black 30%, transparent 80%)",
					}}
				/>
				<span
					aria-hidden
					className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full blur-3xl"
					style={{ background: `${ACCENT}40` }}
				/>

				{/* Content */}
				<motion.div
					initial={{ y: -30, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1, ease: SMOOTH_EASE, delay: 0.4 }}
					className="absolute left-10 top-12 max-w-sm lg:left-14 lg:top-16">
					<h3
						className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tightest text-white lg:text-7xl"
						style={{ textShadow: "0 2px 22px rgba(5,16,31,0.65)" }}>
						Vision
					</h3>
					<p className="mt-4 text-xl font-semibold leading-snug text-white lg:text-2xl">
						Where we&apos;re headed
					</p>
					<p className="mt-4 text-base leading-relaxed text-white/90 lg:text-lg">
						{aboutCopy.vision}
					</p>
				</motion.div>

				{/* Compass icon  bottom-left */}
				<motion.span
					initial={{ scale: 0.5, opacity: 0, rotate: 20 }}
					whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.9, ease: SMOOTH_EASE, delay: 0.6 }}
					className="absolute bottom-10 left-10 text-white/85 lg:bottom-14 lg:left-14"
					aria-hidden>
					<Compass
						className="size-12 lg:size-16"
						strokeWidth={1.5}
					/>
				</motion.span>
			</motion.article>
		</div>
	);
}
