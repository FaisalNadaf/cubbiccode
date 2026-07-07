/** @format */

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Cinematic page header banner  a full-bleed background image with layered
 * ink overlays, breadcrumb, kicker, headline, subtitle and CTAs.
 *
 * This is the single source of truth for every interior page header, so they
 * all share the exact look of the About page hero. Pass an `image` to set the
 * background; it falls back to the About parallax shot.
 */
export function PageHero({
	kicker,
	title,
	subtitle,
	breadcrumb,
	children,
	image = "/images/about/parallax-1.jpg",
	imageAlt = "Cubiccode",
	align = "left",
	className,
}: {
	kicker?: string;
	title: string;
	subtitle?: string;
	breadcrumb?: { label: string; href?: string }[];
	children?: React.ReactNode;
	image?: string;
	imageAlt?: string;
	align?: "left" | "center";
	className?: string;
}) {
	const centered = align === "center";

	return (
		<section
			className={cn(
				"relative flex h-[50vh] min-h-[440px] w-screen items-end overflow-hidden",
				className,
			)}>
			{/* Background image + cinematic overlays */}
			<div className="absolute inset-0">
				<Image
					src={image}
					alt={imageAlt}
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-ink/45" />
				<div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
				<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
				<div className="absolute inset-0 bg-blueprint [background-size:44px_44px] opacity-[0.12]" />
				<div className="pointer-events-none absolute -left-24 -top-16 size-[440px] rounded-full bg-corporate-600/25 blur-3xl" />
			</div>

			{/* Content */}
			<div className="container-x relative z-10 w-full pb-10 pt-24 sm:pt-28 lg:pb-14">
				<div className={cn("max-w-4xl", centered && "mx-auto text-center")}>
					{kicker && (
						<Reveal>
							<span
								className={cn(
									"inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-300",
									centered && "justify-center",
								)}>
								<span className="h-px w-8 bg-corporate-300/60" />
								{kicker}
							</span>
						</Reveal>
					)}

					<SplitReveal
						as="h1"
						play="mount"
						delay={0.1}
						className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tightest text-white sm:text-4xl lg:text-5xl">
						{title}
					</SplitReveal>

					{subtitle && (
						<Reveal delay={0.2}>
							<p
								className={cn(
									"mt-4 max-w-xl text-pretty leading-relaxed text-steel-200",
									centered && "mx-auto",
								)}>
								{subtitle}
							</p>
						</Reveal>
					)}

					{children && (
						<Reveal delay={0.3}>
							<div className={cn("mt-7", centered && "flex justify-center")}>
								{children}
							</div>
						</Reveal>
					)}
				</div>
			</div>
		</section>
	);
}
