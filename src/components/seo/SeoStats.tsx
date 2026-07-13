/** @format */

"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CountStat } from "@/components/ui/Stat";
import { Icon } from "@/components/ui/Icon";
import { Sparkline } from "@/components/charts/Sparkline";
import { CHART } from "@/components/charts/theme";
import { SeoBackground } from "./SeoBackground";
import { SEO_STATS, SEO_CAPABILITIES } from "@/lib/seoClients";

export function SeoStats() {
	return (
		<section className="relative overflow-hidden bg-ink text-white">
			<SeoBackground dense={false} />

			<div className="container-x relative py-20 lg:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<Reveal>
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-300">
							<span className="h-px w-8 bg-corporate-300/60" />
							Proof in the numbers
						</span>
					</Reveal>
					<Reveal delay={0.1}>
						<h2 className="mt-4 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-white sm:text-4xl">
							Local rankings, engineered at scale
						</h2>
					</Reveal>
				</div>

				<RevealGroup
					stagger={0.1}
					className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
					{SEO_STATS.map((s) => (
						<RevealItem
							key={s.label}
							className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07] lg:p-6">
							<span
								aria-hidden
								className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-corporate-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
							/>
							<span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-corporate-200">
								<Icon
									name={s.icon}
									className="size-[18px]"
									strokeWidth={1.75}
								/>
							</span>
							<CountStat
								value={s.value}
								prefix={s.prefix}
								suffix={s.suffix}
								decimals={s.decimals ?? 0}
								className="mt-4 block bg-gradient-to-br from-white via-corporate-100 to-corporate-300 bg-clip-text font-display text-3xl font-bold tracking-tightest tabular-nums text-transparent sm:text-5xl"
							/>
							<p className="mt-2 text-sm leading-relaxed text-steel-300">
								{s.label}
							</p>
							<div className="mt-4">
								<Sparkline
									data={s.spark}
									color={CHART.blue.onDark}
									height={34}
								/>
							</div>
						</RevealItem>
					))}
				</RevealGroup>

				<RevealGroup
					stagger={0.12}
					delay={0.15}
					className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
					{SEO_CAPABILITIES.map((c) => (
						<RevealItem
							key={c.title}
							className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:border-corporate-400/40 hover:bg-white/[0.06]">
							<span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-corporate-500 to-corporate-700 text-white shadow-glow">
								<Icon
									name={c.icon}
									className="size-5"
									strokeWidth={1.75}
								/>
							</span>
							<div>
								<h3 className="font-display text-base font-bold tracking-tight text-white">
									{c.title}
								</h3>
								<p className="mt-1 text-[13px] leading-relaxed text-steel-400">
									{c.desc}
								</p>
							</div>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
