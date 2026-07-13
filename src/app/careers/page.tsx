/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Image from "next/image";
import {
	AtSign,
	GraduationCap,
	Rocket,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CountStat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { site, heroStats } from "@/content/site";

export const metadata = {
	title: "Join the Cubiccode Team Careers",
	description:
		"Build things that matter, with people who give a damn. A lean, award-winning studio with 700+ projects and 500+ clients, looking for people who take ownership, learn fast and want their work to reach the world.",
};

/* ── Application mailto: HR primary, biz in CC, position in the subject ── */
const APPLY_MAILTO =
	`mailto:${site.hrEmail}` +
	`?cc=${site.email}` +
	`&subject=${encodeURIComponent("Application  [position you're applying for]")}` +
	`&body=${encodeURIComponent(
		"Hi Cubiccode team,\n\nI'd like to apply for the role of [position].\n\nWhy you should hire me:\n\nThe work I'm proudest of:\n\nMy CV is attached.\n",
	)}`;

/** Each claim is backed by a real photograph of that claim happening. */
const WORK_HERE = [
	{
		icon: ShieldCheck,
		title: "Ownership, not hand-holding",
		text: "You'll be trusted with responsibility early. We hire people we can rely on, then get out of their way.",
		image: "/images/Moments/DSC_5557.JPG",
	},
	{
		icon: Sparkles,
		title: "AI-first, always learning",
		text: "We build with modern tools React, Laravel, Cloud, and AI workflows. You'll work the way the industry is heading, not the way it's leaving behind.",
		image: "/images/Moments/_MG_9991.JPG",
	},
	{
		icon: Rocket,
		title: "Real impact, real clients",
		text: "From local first-movers to brands like Tata Sky and Reliance, your work ships and gets used. No busywork, no shelfware.",
		image: "/images/about/parallax-2.jpg",
	},
	{
		icon: GraduationCap,
		title: "Grow with us",
		text: "We train 1,000+ students a year; we invest just as hard in our own team. Mentorship, new skills, and a clear path forward.",
		image: "/images/Moments/DSC_7895.JPG",
	},
	{
		icon: Users,
		title: "Lean teams, big voice",
		text: "Small teams mean your ideas are heard and your work is visible. No bureaucracy to disappear into.",
		image: "/images/Moments/20250914_112031.jpg",
	},
];

const APPLY_STEPS = [
	{
		title: "Send your CV",
		body: (
			<>
				Email it to{" "}
				<strong className="font-semibold text-ink">{site.hrEmail}</strong>, with{" "}
				<strong className="font-semibold text-ink">{site.email}</strong> in CC.
			</>
		),
	},
	{
		title: "Name the position",
		body: (
			<>
				Mention the{" "}
				<strong className="font-semibold text-ink">position</strong> you&apos;re
				applying for in the subject line.
			</>
		),
	},
	{
		title: "Make your case",
		body: (
			<>
				Tell us{" "}
				<strong className="font-semibold text-ink">
					why we should hire you
				</strong>{" "}
				 what you&apos;d bring, and the work you&apos;re proudest of.
			</>
		),
	},
];

export default function CareersPage() {
	return (
		<>
			<PageHero
				kicker="Join Cubiccode Team"
				title="Build things that matter, with people who give a damn."
				subtitle="We're a lean, award-winning studio that's shipped 700+ projects for 500+ clients, and we're always looking for people who take ownership, learn fast, and want their work to actually reach the world."
				image="/images/Moments/devfest2022_2.jpg"
				imageAlt="The Cubiccode team at a community developer event"
				breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href={APPLY_MAILTO}
						arrow>
						Apply now
					</Button>
					<Button
						href={site.socials.glassdoor}
						external
						variant="outline">
						Read Glassdoor reviews
					</Button>
				</div>
			</PageHero>

			{/* ============ BY THE NUMBERS ============ */}
			<section className="relative overflow-hidden bg-canvas-soft py-16 lg:py-20">
				<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:38px_38px] opacity-[0.05]" />
				<div className="pointer-events-none absolute -right-40 -top-20 size-[520px] rounded-full bg-corporate-100/50 blur-3xl" />

				<div className="container-x relative">
					<Reveal>
						<span className="kicker">By the numbers</span>
					</Reveal>

					<RevealGroup
						stagger={0.08}
						className="mt-10 flex flex-wrap items-end justify-center gap-x-12 gap-y-10 lg:justify-between">
						{heroStats.map((s, i) => (
							<RevealItem
								key={s.label}
								className="flex items-end gap-12">
								<div>
									<CountStat
										value={s.value}
										prefix={s.prefix}
										suffix={s.suffix}
										className="block font-display text-[clamp(2.75rem,6vw,4.5rem)] font-black leading-none tracking-tightest tabular-nums text-ink"
									/>
									<span
										aria-hidden
										className="mt-4 block h-1 w-16 rounded-full bg-corporate-500"
									/>
									<span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
										{s.label}
									</span>
								</div>
								{i < heroStats.length - 1 && (
									<span
										aria-hidden
										className="hidden h-16 w-px bg-steel-200 lg:block"
									/>
								)}
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>

			

			{/* ============ WHAT IT'S LIKE TO WORK HERE ============ */}
			<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
				<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.14]" />
				<div className="pointer-events-none absolute -left-24 top-1/4 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
				<div className="pointer-events-none absolute -right-32 bottom-0 size-[380px] rounded-full bg-corporate-500/10 blur-3xl" />

				<div className="container-x relative">
					<div className="max-w-3xl">
						<Reveal>
							<span className="kicker !text-corporate-300">Life here</span>
						</Reveal>
						{/* `text-white` is required: the base layer paints every h1h5
						    `text-ink`, and an element selector beats the section's
						    inherited colour. */}
						<SplitReveal
							as="h2"
							className="mt-6 text-balance font-display text-3xl font-bold leading-[1.06] tracking-tightest text-white sm:text-4xl lg:text-5xl">
							What it’s like to work here.
						</SplitReveal>
					</div>

					{/* Bento: three cards, then two wider ones  five items never
					    strand a lonely card at the end of a three-column row. */}
					<RevealGroup
						stagger={0.08}
						className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
						{WORK_HERE.map((v, i) => (
							<RevealItem
								key={v.title}
								className={`h-full ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
								{/* Photo on top in its own frame, copy below on a solid card:
								    the image is never cropped by the text or dimmed by a scrim.
								    Narrow cards get a taller 4:3 crop, the two wide ones 16:9,
								    so every image in a row lands at the same height. */}
								<article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/40 hover:bg-white/[0.07]">
									<div
										className={`relative w-full overflow-hidden ${
											i < 3 ? "aspect-[4/3]" : "aspect-[16/9]"
										}`}>
										<Image
											src={v.image}
											alt=""
											fill
											sizes="(min-width: 1024px) 40vw, 100vw"
											className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 motion-reduce:transform-none"
										/>
										{/* Just enough gradient at the foot of the photo to seat
										    it against the card; the subject stays untouched. */}
										<div
											aria-hidden
											className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
										/>
									</div>

									<div className="relative flex flex-1 flex-col p-7">
										{/* The chip straddles the seam between photo and copy. */}
										<span
											aria-hidden
											className="absolute -top-6 left-7 inline-flex size-12 items-center justify-center rounded-2xl bg-ink/80 text-corporate-300 ring-1 ring-white/15 backdrop-blur transition-colors duration-300 group-hover:bg-corporate-500 group-hover:text-white">
											<v.icon
												className="size-5"
												strokeWidth={1.75}
											/>
										</span>
										<h3 className="mt-6 font-display text-lg font-bold tracking-tight text-white">
											{v.title}
										</h3>
										<p className="mt-2 text-pretty text-[15px] leading-relaxed text-white/85">
											{v.text}
										</p>
									</div>
								</article>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>

	
			{/* ============ HOW TO APPLY ============ */}
			<section className="section relative overflow-hidden bg-canvas-soft">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] opacity-60" />

				<div className="container-x relative">
					<Reveal className="mx-auto max-w-2xl text-center">
						<span className="kicker justify-center">How to apply</span>
						<h2 className="mt-6 text-balance font-display text-3xl font-bold leading-[1.06] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
							Three steps. No portals, no black holes.
						</h2>
					</Reveal>

					<RevealGroup
						stagger={0.12}
						className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-3">
						{APPLY_STEPS.map((step, i) => (
							<RevealItem
								key={step.title}
								className="h-full">
								<div className="flex h-full flex-col items-center text-center">
									<span
										aria-hidden
										className="font-display font-black leading-[0.8] tracking-tightest tabular-nums text-corporate-600/15"
										style={{ fontSize: "clamp(3.5rem,7vw,5.5rem)" }}>
										{String(i + 1).padStart(2, "0")}
									</span>
									<span
										aria-hidden
										className="mt-4 h-1 w-16 rounded-full bg-corporate-500"
									/>
									<h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
										{step.title}
									</h3>
									<p className="mt-3 max-w-xs text-pretty leading-relaxed text-steel-600">
										{step.body}
									</p>
								</div>
							</RevealItem>
						))}
					</RevealGroup>

					<Reveal
						delay={0.15}
						className="mx-auto mt-16 max-w-3xl">
						<div className="relative overflow-hidden rounded-4xl border border-steel-200 bg-white p-6 text-center shadow-card sm:p-10">
							<span
								aria-hidden
								className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-corporate-500/[0.07] blur-3xl"
							/>
							<div className="relative">
								<span
									aria-hidden
									className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
									<AtSign className="size-5" />
								</span>
								<p className="mt-6 text-pretty text-lg leading-relaxed text-steel-600">
									Ready when you are. Every application is read by a person, and
									we come back to you either way.
								</p>
								<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
									<Button
										href={APPLY_MAILTO}
										size="lg"
										arrow
										className="max-lg:break-all max-lg:px-6">
										Email {site.hrEmail}
									</Button>
									<Button
										href={site.socials.glassdoor}
										external
										variant="outline"
										size="lg"
										className="max-lg:px-6">
										Read Glassdoor reviews
									</Button>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</section>
		</>
	);
}
