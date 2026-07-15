/** @format */

import type { Outcome } from "@/content/capabilities";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * "What You Get" — the payoff band on /capabilities/[slug].
 *
 * Sits directly under the dark HowWeDoItBetter band, so it stays light: two dark
 * sections back to back flatten the page's rhythm. Depth comes from the cards
 * lifting off a soft canvas instead.
 *
 * Deliberately distinct from the page's other two card grids — "What you'll
 * build" leads with a big numeral, "How we do it better" with a rule — so the
 * reader can tell at a glance which section they're in. These lead with an icon.
 */

// A lone card stranded on its own row reads as a mistake, so the column count
// is chosen to divide the outcomes evenly rather than always maxing out at 4.
const GRID: Record<number, string> = {
	1: "mx-auto max-w-md",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function OutcomeShowcase({
	lead,
	outcomes,
	cta,
}: {
	lead: string;
	outcomes: Outcome[];
	/** Optional centred call-to-action below the grid (e.g. SEO → results page). */
	cta?: { href: string; label: string };
}) {
	return (
		<section className="section relative overflow-hidden bg-canvas-soft">
			{/* -webkit-mask-image carries the same value: WebKit before 15.4 honours only
			    the prefixed form, and without it the grid paints full-bleed and unfaded. */}
			<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [-webkit-mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)] [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)] opacity-50" />
			<div className="pointer-events-none absolute left-1/2 top-0 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-100/40 blur-3xl" />

			<div className="container-x relative">
				<SectionHeading
					align="center"
					kicker="What you get"
					title="The outcome you're actually buying."
					intro={lead}
				/>

				<RevealGroup
					className={`mt-14 grid grid-cols-1 gap-5 ${GRID[outcomes.length] ?? GRID[4]}`}>
					{outcomes.map((o, i) => (
						<RevealItem
							key={o.title}
							className="h-full">
							<article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-corporate-200 hover:shadow-lift">
								{/* accent rail — draws in from the left on hover */}
								<span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-corporate-600 to-corporate-300 transition-transform duration-500 ease-out group-hover:scale-x-100" />
								{/* corner bloom, so the lift reads as light rather than just shadow */}
								<span className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-corporate-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />

								<span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-inset ring-corporate-100 transition-colors duration-300 group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
									<Icon
										name={o.icon}
										className="size-5"
									/>
								</span>

								<h3 className="relative mt-6 text-lg font-semibold leading-snug text-ink">
									{o.title}
								</h3>
								<p className="relative mt-3 text-[15px] leading-relaxed text-steel-600">
									{o.text}
								</p>

								{/* pinned to the bottom so the rules line up across uneven cards */}
								<div className="relative mt-auto flex items-center gap-3 pt-7">
									<span className="h-px flex-1 bg-steel-200 transition-colors duration-300 group-hover:bg-corporate-200" />
									<span className="font-display text-xs font-bold tabular-nums tracking-widest text-steel-300 transition-colors duration-300 group-hover:text-corporate-500">
										{String(i + 1).padStart(2, "0")}
									</span>
								</div>
							</article>
						</RevealItem>
					))}
				</RevealGroup>

				{cta && (
					<div className="mt-12 flex justify-center">
						<Button
							href={cta.href}
							variant="accent"
							size="lg"
							arrow>
							{cta.label}
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
