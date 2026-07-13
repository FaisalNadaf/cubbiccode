/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CountStat } from "@/components/ui/Stat";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ScrollTimeline } from "@/sections/journey/ScrollTimeline";
import { journey } from "@/content/company";
import { heroStats } from "@/content/site";

export const metadata = {
	title: "Our Journey From a Belagavi Studio to 500+ Clients | Cubiccode",
	description:
		"Milestone by milestone, 2016 to today how Cubiccode grew from a small Belagavi studio into an ISO 9001:2015 certified company trusted by 500+ businesses across India.",
};

export default function JourneyPage() {
	return (
		<>
			<PageHero
				kicker="Our journey"
				title="From humble beginnings to 700+ projects nationwide."
				subtitle="Nearly a decade of disciplined delivery, told milestone by milestone from our first 100 students and 250+ companies to national awards, the TEDx stage and the platforms now running real businesses at scale."
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: "/about" },
					{ label: "Our Journey" },
				]}
			/>

			{/* Timeline  cinematic scroll-driven slideshow */}
			<ScrollTimeline items={journey} />

			{/* Closing stat band */}
			<section className="relative overflow-hidden bg-ink py-20 text-white md:py-28 lg:py-24">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
					<div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
				</div>
				<div className="container-x relative">
					<Reveal>
						<p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
							Where the journey stands today
						</p>
					</Reveal>
					<RevealGroup
						stagger={0.1}
						className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
						{heroStats.map((s) => (
							<RevealItem
								key={s.label}
								className="text-center">
								<CountStat
									value={s.value}
									prefix={s.prefix}
									suffix={s.suffix}
									className="font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl lg:text-6xl"
								/>
								<p className="mx-auto mt-3 max-w-[180px] text-sm leading-relaxed text-steel-300">
									{s.label}
								</p>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>
		</>
	);
}
