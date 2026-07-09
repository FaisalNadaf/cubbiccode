/** @format */

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";

export function CaseStudies() {
	return (
		<section className="section relative overflow-hidden bg-ink text-white">
			<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:40px_40px] opacity-[0.1]" />
			<div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
			<div className="container-x relative">
				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
					<SectionHeading
						light
						kicker="Web app & ERP case studies"
						title="Real platforms, running real businesses at scale"
						intro="Our web applications don't just look good  they manage crores in assets, thousands of users and millions in transactions, every month."
					/>
					<Link
						href="/case-studies"
						className="group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-200 hover:text-white">
						All case studies
						<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</div>

				<RevealGroup className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{caseStudies.map((c) => (
						<RevealItem key={c.slug}>
							<GlowCard className="h-full rounded-3xl">
								<article className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-corporate-400/40 hover:bg-white/[0.06]">
									<span className="text-[11px] font-semibold uppercase tracking-kicker text-corporate-300">
										{c.category}
									</span>
									<h3 className="mt-3 text-xl font-semibold text-white">
										{c.name}
									</h3>
									<p className="mt-2 text-[13.5px] leading-relaxed text-steel-300">
										{c.tagline}
									</p>
									<ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
										{c.stats.slice(0, 3).map((s) => (
											<li
												key={s.label}
												className="flex items-center gap-2.5 text-[13px] text-steel-300">
												<Icon
													name={s.icon}
													className="size-4 shrink-0 text-corporate-300"
													strokeWidth={1.75}
												/>
												{s.value && (
													<span className="font-semibold text-white">
														{s.value}
													</span>
												)}
												<span>{s.label}</span>
											</li>
										))}
									</ul>
								</article>
							</GlowCard>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
