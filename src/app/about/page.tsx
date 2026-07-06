/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

/** @format */

import Image from "next/image";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { VisionMissionShowcase } from "@/components/about/VisionMissionShowcase";
import { aboutCopy, founders } from "@/content/company";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata = {
	title: "About Us — Transforming Businesses Since 2016 | Cubiccode",
	description:
		"Cubiccode Digital Media LLP is a full-stack ITES company born in Belagavi, now serving 500+ clients nationwide from offices in Belagavi and Bengaluru.",
};

// One photo per story chapter (public/images/Moments).
const storyImages = [
	{
		src: "/images/Moments/2016.jpeg",
		alt: "The first Cubiccode studio in Belagavi, 2016",
		tag: "2016",
	},
	{
		src: "/images/Moments/devfest2022_2.jpg",
		alt: "The growing Cubiccode team at DevFest, Belagavi",
		tag: "The team",
	},
	{
		src: "/images/Moments/DSC_5539.JPG",
		alt: "Cubiccode on stage at the DevFest Belagavi 2025 inauguration",
		tag: "Today",
	},
];

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
					<Button href={site.proposalCta} external variant="accent" arrow>
						Get a Proposal
					</Button>
					<Button href="/journey" variant="outline">
						Our journey
					</Button>
				</div>
			</PageHero>

			{/* ───────────────────────── The Story ───────────────────────── */}
			<section className="section relative overflow-hidden bg-canvas-soft">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_25%,#000,transparent)] opacity-40" />

				<div className="container-x relative">
					{/* Heading */}
					<div className="max-w-2xl">
						<span className="kicker">The story</span>
						<SplitReveal
							as="h2"
							className="mt-5 text-pretty text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl lg:text-[2.6rem]">
							{aboutCopy.storyHeading}
						</SplitReveal>

						<Reveal delay={0.1}>
							<div className="mt-7 flex items-center gap-4">
								<div className="flex -space-x-2">
									{founders.map((f) => (
										<span
											key={f.initials}
											className="flex size-10 items-center justify-center rounded-full border-2 border-canvas-soft bg-ink text-xs font-semibold text-white">
											{f.initials}
										</span>
									))}
								</div>
								<div>
									<p className="text-sm font-semibold text-ink">
										Sarvesh Kakkeri &amp; Shivani Jadhav
									</p>
									<p className="text-[13px] text-steel-600">
										Co-Founders, {site.name}
									</p>
								</div>
							</div>
						</Reveal>
					</div>

					{/* Alternating story chapters — content ⇄ image */}
					<div className="mt-14 space-y-8 lg:mt-16 lg:space-y-0">
						{aboutCopy.story.map((p, i) => {
							const imageLeft = i % 2 === 1;
							const img = storyImages[i];
							return (
								<div
									key={i}
									className="grid items-center gap-6 lg:grid-cols-5 lg:gap-10">
									{/* Content */}
									<Reveal
										direction={imageLeft ? "left" : "right"}
										className={cn(
											"lg:col-span-3",
											imageLeft ? "lg:order-2" : "lg:order-1",
										)}>
										<div className="relative overflow-hidden rounded-3xl border border-steel-200 bg-white p-8 shadow-soft lg:p-10">
											<div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-corporate-50 blur-2xl" />
											<span className="relative font-display text-5xl font-bold tracking-tightest text-steel-200">
												0{i + 1}
											</span>
											<p
												className={cn(
													"relative mt-4 text-pretty leading-relaxed",
													i === 0
														? "text-lg text-steel-700"
														: "text-steel-600",
												)}>
												{p}
											</p>
										</div>
									</Reveal>

									{/* Image */}
									<Reveal
										direction={imageLeft ? "right" : "left"}
										delay={0.1}
										className={cn(
											"lg:col-span-2",
											imageLeft ? "lg:order-1" : "lg:order-2",
										)}>
										<div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-steel-200 shadow-lift">
											<Image
												src={img.src}
												alt={img.alt}
												fill
												sizes="(min-width: 1024px) 40vw, 100vw"
												className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
											<span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
												{img.tag}
											</span>
										</div>
									</Reveal>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ───────────────────────── Vision & Mission ───────────────────────── */}
			<VisionMissionShowcase />
		</>
	);
}
