/** @format */

"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import CardSwap, { Card } from "@/components/CardSwap";

export type BuildItem = {
	title: string;
	detail: string;
	image: string;
	icon: string;
};

export function BuildShowcase({
	buildHeading,
	items,
}: {
	buildHeading: string;
	items: BuildItem[];
}) {
	const [active, setActive] = useState(0);
	const current = items[active] ?? items[0];

	return (
		<div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
			{/* Left  heading + live panel reflecting the front card */}
			<div>
				<SectionHeading
					className="mb-10"
					kicker={buildHeading}
					title="Everything you need, engineered end-to-end."
					intro="A complete, accountable scope  no hand-offs, no gaps. Here's exactly what this engagement delivers."
				/>

				{/* progress track */}
				<div className="mt-10 flex items-center gap-2">
					{items.map((_, i) => (
						<span
							key={i}
							className={cn(
								"h-1.5 rounded-full transition-all duration-500",
								i === active ? "w-9 bg-corporate-600" : "w-2.5 bg-steel-200",
							)}
						/>
					))}
				</div>

				{/* live card detail */}
				<div className="mt-6 min-h-[188px]">
					<AnimatePresence mode="wait">
						<motion.div
							key={active}
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -14 }}
							transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}>
							<div className="flex items-center gap-4">
								<div>
									<span className="text-xs font-semibold uppercase tracking-wider text-corporate-600">
										{String(active + 1).padStart(2, "0")}/
										{String(items.length).padStart(2, "0")}
									</span>
									<h3 className="text-2xl font-semibold leading-tight text-ink">
										{current.title}
									</h3>
								</div>
							</div>
							{current.detail && (
								<p className="mt-4 max-w-md text-[15px] leading-relaxed text-steel-600">
									{current.detail}
								</p>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			{/* Right  animated CardSwap showcase (real project imagery) */}
			<div className="relative h-[640px] w-full sm:h-[760px] lg:h-[860px]">
				<CardSwap
					width={600}
					height={440}
					cardDistance={46}
					verticalDistance={60}
					delay={3000}
					skewAmount={5}
					pauseOnHover
					onActiveChange={setActive}>
					{items.map((it, i) => (
						<Card
							key={it.title}
							className="cursor-pointer border border-steel-200 bg-white shadow-2xl ring-1 ring-black/5 transition-shadow hover:shadow-[0_28px_70px_-20px_rgba(11,27,58,0.45)]">
							<div className="flex h-full w-full flex-col">
								{/* titlebar  icon + label, like the reference */}
								<div className="flex items-center gap-2.5 border-b border-steel-200 bg-white px-5 py-3">
									<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
										<Icon
											name={it.icon}
											className="size-4"
										/>
									</span>
									<span className="truncate text-sm font-semibold text-ink">
										{it.title}
									</span>
									<span className="ml-auto font-display text-xs font-bold text-steel-300">
										{String(i + 1).padStart(2, "0")}
									</span>
								</div>
								{/* body  real project screenshot fills the card */}
								<div className="relative flex-1">
									<Image
										src={it.image}
										alt={it.title}
										fill
										sizes="600px"
										className="object-cover"
									/>
									<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
								</div>
							</div>
						</Card>
					))}
				</CardSwap>
			</div>
		</div>
	);
}
