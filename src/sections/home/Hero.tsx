/** @format */

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
	motion,
	useScroll,
	useTransform,
	useReducedMotion,
} from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { HeroTechIcons } from "./HeroTechIcons";
import { WhyCollage } from "./WhyCollage";
import { hero, site } from "@/content/site";
import { featuredClients } from "@/content/clients";
import ColorBends from "@/components/ColorBends";


export function Hero() {
	const ref = useRef<HTMLElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const reduce = useReducedMotion();

	// Pause the background video under prefers-reduced-motion.
	useEffect(() => {
		if (reduce) videoRef.current?.pause();
	}, [reduce]);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	// Foreground lifts + fades as the landing scrolls away → depth.
	const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
	const contentFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
	const indicatorFade = useTransform(scrollYProgress, [0, 0.14], [1, 0]);

	return (
		<>
			{/* ══ SCREEN 1  full-screen centered landing on brand blue ══════════ */}
			<section
				ref={ref}
				className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-corporate-800 to-corporate-600 text-white">
				{/* ── Background video (full-bleed) ───────────────────────────────── */}
				<div
					className="absolute inset-0 z-0 overflow-hidden"
					aria-hidden="true">
					<video
						ref={videoRef}
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
					</video>
					{/* uniform darkening so the white copy stays legible over any frame */}
					<div className="absolute inset-0 bg-ink/40" />
				</div>

				{/* ── Light system  soft glow (grid + bottom melt removed) ────────── */}
				<div
					className="pointer-events-none absolute inset-0 z-[2]"
					aria-hidden="true">
					{/* Dark legibility scrim behind the headline so the white text always
              reads over the animated colour bands. */}
					<div className="absolute inset-0 [background:radial-gradient(80%_55%_at_50%_42%,rgba(8,20,39,0.6),transparent_80%)]" />
				</div>

				{/* ── Floating technology badges (xl+, decorative) ─────────────────── */}
				<motion.div
					className="pointer-events-none absolute inset-0 z-[3]"
					style={reduce ? undefined : { y: contentY, opacity: contentFade }}
					aria-hidden="true">
					<HeroTechIcons />
				</motion.div>

				{/* ── Centered content ────────────────────────────────────────────── */}
				<motion.div
					style={reduce ? undefined : { y: contentY, opacity: contentFade }}
					className="container-x relative z-10 flex flex-col items-center text-center">
					<Reveal direction="up">
						<span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 shadow-soft backdrop-blur">
							<ShieldCheck className="size-3.5 text-corporate-200" />
							{hero.eyebrow}
						</span>
					</Reveal>

					<h1 className="mx-auto mt-7 max-w-5xl font-display text-[2.2rem] font-bold leading-[1.06] tracking-tightest text-white [text-shadow:0_2px_24px_rgba(8,20,39,0.45)] sm:text-[3rem] lg:text-[3.9rem]">
						<SplitReveal
							as="span"
							play="mount"
							className="block">
							We build websites &amp; web apps that don&apos;t just look good
						</SplitReveal>
						<SplitReveal
							as="span"
							play="mount"
							delay={0.18}
							className="block text-corporate-100">
							they drive traffic and sales.
						</SplitReveal>
					</h1>

					<Reveal delay={0.45}>
						<div className="mt-10">
							<Button
								href={site.proposalCta}
								
								variant="white"
								size="lg"
								arrow>
								{hero.primaryCta}
							</Button>
						</div>
					</Reveal>
				</motion.div>

				{/* ── Scroll indicator ────────────────────────────────────────────── */}
				<motion.div
					style={reduce ? undefined : { opacity: indicatorFade }}
					className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
					aria-hidden="true">
					<span className="text-[10px] font-semibold uppercase tracking-kicker text-white/65 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
						Scroll
					</span>
					<span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-white/35 p-1.5">
						<motion.span
							animate={
								reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }
							}
							transition={{
								duration: 1.6,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="size-1.5 rounded-full bg-corporate-200"
						/>
					</span>
				</motion.div>
			</section>

			{/* ══ SCREEN 2  awards & recognition row ══════════════════════════════ */}
			<section className="relative bg-canvas">
				{/* WhyCollage owns its own layout + spacing */}
				<WhyCollage />
			</section>
		</>
	);
}
