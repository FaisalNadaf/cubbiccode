/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

/** @format */

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { VisionMissionShowcase } from "@/components/about/VisionMissionShowcase";
import ScrollReveal from "@/components/ScrollReveal";
import { aboutCopy, founders } from "@/content/company";
import { site } from "@/content/site";

export const metadata = {
	title: "About Us  Transforming Businesses Since 2016 | Cubiccode",
	description:
		"Cubiccode Digital Media LLP is a full-stack ITES company born in Belagavi, now serving 500+ clients nationwide from offices in Belagavi and Bengaluru.",
};

// Single hero photo for the "Who we are" band (public/images/Moments).
const storyImage = {
	src: "/images/Moments/2016.jpeg",
	alt: "Cubiccode's first office in Belagavi, 2016",
	tag: "Where it began · 2016",
};

export default function AboutPage() {
	return (
		<>
			{/* ───────────────────────── Hero (header banner) ───────────────────────── */}
			<PageHero
				kicker={aboutCopy.eyebrow}
				title={aboutCopy.headline}
				subtitle={aboutCopy.intro}
				image="/images/about/parallax-1.jpg"
				imageAlt="The Cubiccode team building websites and web apps"
				breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						Get a Proposal
					</Button>
					<Button
						href="/journey"
						variant="outline">
						Our journey
					</Button>
				</div>
			</PageHero>

			{/* ────────────── Who we are (sticky image · scroll-revealed story) ────────────── */}
			<section className="section relative bg-canvas-soft">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_25%,#000,transparent)] opacity-40" />

				<div className="container-x relative">
					<div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
						{/* Image  left, stays still (sticky) while the story scrolls past */}
						<div>
							<div className="lg:sticky lg:top-24">
								<Reveal direction="up">
									<div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-steel-200 shadow-lift">
										<Image
											src={storyImage.src}
											alt={storyImage.alt}
											fill
											sizes="(min-width: 1024px) 46vw, 100vw"
											className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent" />
										<span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-semibold text-ink backdrop-blur">
											{storyImage.tag}
										</span>
								
									</div>
								</Reveal>
							</div>
						</div>

						{/* Content  right, reveals word-by-word on scroll */}
						<div className="lg:py-6">
							<span className="kicker">Who we are</span>

							<ScrollReveal
								baseOpacity={0.1}
								enableBlur
								blurStrength={7}
								baseRotation={2}
								containerClassName="!mt-6 !mb-0"
								textClassName="!text-[clamp(1.35rem,2.8vw,2.1rem)] !leading-[1.4] font-display tracking-tight text-ink">
								{aboutCopy.storyStatement}
							</ScrollReveal>

							<Reveal delay={0.1}>
								<p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-steel-600 sm:text-lg">
									{aboutCopy.storySupport}
								</p>
							</Reveal>

							<Reveal delay={0.15}>
								<div className="mt-9 flex flex-wrap gap-3">
									{[
										`Est. ${site.founded} · Belagavi`,
										"500+ clients",
										"700+ projects",
										site.certification,
									].map((chip) => (
										<span
											key={chip}
											className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-4 py-2 text-[13px] font-semibold text-steel-700 shadow-soft">
											<span className="size-1.5 rounded-full bg-corporate-500" />
											{chip}
										</span>
									))}
								</div>
							</Reveal>
						</div>
					</div>
				</div>
			</section>

			{/* ───────────────────────── Vision & Mission ───────────────────────── */}
			<VisionMissionShowcase />
		</>
	);
}
