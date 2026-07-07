/** @format */

"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export function CTASection({
	title = "Let's transform your business for a change that matters.",
	subtitle = "Have a project in mind? Tell us what you're building  we'll come back with a clear plan, timeline and proposal. Typically within a day.",
}: {
	title?: string;
	subtitle?: string;
}) {
	return (
		<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
			{/* Background video, heavily darkened so the white headline stays legible.
          Swap the footage at public/videos/demo.mp4. */}
			<div className="pointer-events-none absolute inset-0">
				<video
					className="absolute inset-0 h-full w-full object-cover opacity-40"
					autoPlay
					muted
					loop
					playsInline
					preload="none"
					poster="/images/no.png"
					aria-hidden="true">
					<source
						src="/videos/demo.mp4"
						type="video/mp4"
					/>
				</video>
				<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/75" />
				<div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.16]" />
				<motion.div
					animate={{ x: [0, 60, 0], opacity: [0.25, 0.5, 0.25] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -left-20 top-0 h-full w-1/2 bg-gradient-to-r from-corporate-600/30 to-transparent blur-3xl"
				/>
				<motion.div
					animate={{ x: [0, -50, 0], opacity: [0.2, 0.45, 0.2] }}
					transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
					className="absolute right-0 top-10 size-[520px] rounded-full bg-corporate-500/20 blur-3xl"
				/>
			</div>

			<div className="container-x relative text-center">
				<Reveal>
					<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-corporate-200 backdrop-blur">
						<Sparkles className="size-3.5" /> Power your website. Impact the
						world.
					</span>
				</Reveal>

				<SplitReveal
					as="h2"
					className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl">
					{title}
				</SplitReveal>

				<Reveal delay={0.15}>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-steel-300">
						{subtitle}
					</p>
				</Reveal>

				<Reveal delay={0.25}>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Button
							href={site.proposalCta}
							external
							variant="accent"
							size="lg"
							arrow>
							Get a Proposal
						</Button>
						<Button
							href={`tel:${site.primaryPhoneRaw}`}
							variant="white"
							size="lg">
							<Phone className="size-4" /> Call Us
						</Button>
						<a
							href={site.whatsapp}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-sm font-medium text-steel-300 transition-colors hover:text-white">
							<MessageCircle className="size-4 text-corporate-300" /> Or chat on
							WhatsApp
						</a>
					</div>
				</Reveal>

				<Reveal delay={0.35}>
					<div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-sm text-steel-400">
						<span>{site.certification}</span>
						<span className="hidden text-white/20 sm:inline">·</span>
						<span>500+ clients served</span>
						<span className="hidden text-white/20 sm:inline">·</span>
						<span>Belagavi &amp; Bengaluru</span>
						<span className="hidden text-white/20 sm:inline">·</span>
						<a
							href={`mailto:${site.email}`}
							className="hover:text-white">
							{site.email}
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
