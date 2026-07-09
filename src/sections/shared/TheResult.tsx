/** @format */

import { Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * "The result"  the outcomes a client walks away with, one card per outcome.
 * Reads as a checklist of promises rather than a single centred paragraph.
 */

const OUTCOME_GRID: Record<number, string> = {
	1: "mx-auto max-w-xl",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function TheResult({ outcomes }: { outcomes: string[] }) {
	return (
		<section className="section relative overflow-hidden bg-canvas-soft">
			<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] opacity-50" />

			<div className="container-x relative">
				<Reveal className="mx-auto max-w-3xl text-center">
					<span className="kicker justify-center">The result</span>
					<h2 className="mt-6 text-balance font-display text-3xl font-bold leading-[1.05] tracking-tightest text-ink sm:text-4xl lg:text-5xl">
						What you actually walk away with.
					</h2>
				</Reveal>

				<RevealGroup
					stagger={0.08}
					className={`mt-14 grid gap-5 ${OUTCOME_GRID[outcomes.length] ?? "sm:grid-cols-2 lg:grid-cols-3"}`}>
					{outcomes.map((outcome) => (
						<RevealItem
							key={outcome}
							className="h-full">
							<article className="group flex h-full flex-col gap-5 rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift">
								<span
									aria-hidden
									className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 transition-colors duration-300 group-hover:bg-corporate-500 group-hover:text-white group-hover:ring-corporate-500">
									<Check
										className="size-5"
										strokeWidth={2.5}
									/>
								</span>
								<p className="text-pretty text-[17px] font-semibold leading-snug text-ink">
									{outcome}
								</p>
							</article>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
