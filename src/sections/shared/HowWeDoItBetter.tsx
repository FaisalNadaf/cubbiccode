/** @format */

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/content/site";

/**
 * "How we do it better"  the shared dark band used by both /capabilities/[slug]
 * and /industries/[slug]. Each point of the pitch becomes its own numbered card,
 * so the copy is scanned rather than read as a wall of prose.
 *
 * Blocks are authored balanced in length (see the `solution` / `better` fields
 * in content) so every card in the row fills to the same height.
 */

// Blocks are authored in threes, but stay resilient if that ever changes  a
// lone card stranded in a 3-col grid reads as a mistake.
const BLOCK_GRID: Record<number, string> = {
	1: "mx-auto max-w-3xl",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function HowWeDoItBetter({
	blocks,
	cta,
	kicker = "The Cubiccode difference",
}: {
	blocks: string[];
	cta: string;
	kicker?: string;
}) {
	return (
		<section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
			<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.14]" />
			<div className="pointer-events-none absolute -left-24 top-1/3 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
			<div className="pointer-events-none absolute -right-32 bottom-0 size-[380px] rounded-full bg-corporate-500/10 blur-3xl" />

			<div className="container-x relative">
				<div className="max-w-4xl">
					<span className="kicker !text-corporate-300">{kicker}</span>
					{/* `text-white` is required: the base layer paints every h1h5
					    `text-ink`, and an element selector beats the section's
					    inherited colour. */}
					<h2 className="mt-6 text-balance font-display text-4xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-5xl lg:text-7xl xl:text-[5rem]">
						How we do it{" "}
						<span className="bg-gradient-to-r from-corporate-300 to-corporate-500 bg-clip-text text-transparent">
							better
						</span>
					</h2>
				</div>

				<RevealGroup
					className={`mt-14 grid gap-5 ${BLOCK_GRID[blocks.length] ?? "sm:grid-cols-2 lg:grid-cols-3"}`}>
					{blocks.map((text, i) => (
						<RevealItem
							key={text}
							className="h-full">
							<article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/40 hover:bg-white/[0.07]">
								<div className="flex items-center gap-3">
									<span className="font-display text-2xl font-bold tabular-nums text-corporate-300">
										{String(i + 1).padStart(2, "0")}
									</span>
									<span className="h-px flex-1 bg-white/10 transition-colors duration-300 group-hover:bg-corporate-400/40" />
								</div>
								<p className="mt-5 text-pretty text-[15px] leading-relaxed text-white/80 lg:text-base">
									{text}
								</p>
							</article>
						</RevealItem>
					))}
				</RevealGroup>

				<div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						{cta}
					</Button>
					<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
						<Sparkles className="size-3.5 text-corporate-300" />
						{site.certification}
					</span>
				</div>
			</div>
		</section>
	);
}
