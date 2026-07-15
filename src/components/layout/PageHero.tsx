/** @format */

import Image from "next/image";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Cinematic page header banner  a full-bleed background image with layered
 * ink overlays, breadcrumb, kicker, headline, subtitle and CTAs.
 *
 * This is the single source of truth for every interior page header, so they
 * all share the exact look of the About page hero.
 *
 * `image` is required and has no default: no two pages on the site repeat a
 * header photograph, and /public/images/Headerimages holds exactly as many
 * shots as there are pages. A default would therefore have to be some other
 * page's photo, and a new page that forgot to pass one would silently wear it.
 * Requiring the prop makes that a compile error instead.
 */
export function PageHero({
	kicker,
	title,
	subtitle,
	children,
	image,
	/**
	 * The banner sits behind four ink overlays with the headline and subtitle
	 * already in the DOM, so it is decorative by default and is skipped by
	 * assistive tech. Pass a description only when the photo itself is content.
	 */
	imageAlt = "",
	align = "left",
	className,
}: {
	kicker?: string;
	title: string;
	subtitle?: string;
	/**
	 * Accepted by ~15 pages but deliberately not rendered — the cinematic hero
	 * has no breadcrumb row in the current design. Kept in the type so callers
	 * keep type-checking; rendering it would change the desktop layout.
	 */
	breadcrumb?: { label: string; href?: string }[];
	children?: React.ReactNode;
	image: string;
	imageAlt?: string;
	align?: "left" | "center";
	className?: string;
}) {	
	const centered = align === "center";

	return (
		<section
			className={cn(
				// `w-full`, not `w-screen`: 100vw includes the scrollbar gutter, so
				// the section overhung the content box and only the global
				// body{overflow-x:hidden} was hiding the resulting shift.
				//
				// A locked `h-[50vh]` plus `items-end` + `overflow-hidden` clipped the
				// kicker and the top of the wrapped headline off a phone: the stack is
				// ~500px tall at 320-390px, the box was 440px. Below lg the height is
				// the content's, floored at the same 440px banner minimum; `lg:h-[50vh]`
				// restores the exact desktop box (height 50vh, min-height 440px). As a
				// bonus, no `vh` unit is left in play below lg, so the iOS URL-bar
				// viewport jump can't resize the banner either.
				"relative flex h-auto min-h-[440px] w-full items-end overflow-hidden lg:h-[50vh]",
				className,
			)}>
			{/* Background image + cinematic overlays.
			    The ink base is on the wrapper, not just under the photo: from `lg` the
			    photo only covers the right column, so the left half is this colour and
			    nothing else. */}
			<div className="absolute inset-0 bg-ink">
				{/* Full-bleed below `lg` — at phone widths a half-width photo is a
				    sliver, and the headline already sits on top of it. From `lg` it
				    takes the right column and dissolves leftward.

				    The fade is a mask, not a gradient painted over the top: the pixels
				    themselves go transparent, so the photo melts into the ink base at
				    any viewport width. A dark gradient overlay instead would only ever
				    approximate the base colour and would leave a visible seam wherever
				    the two disagreed. `-webkit-mask-image` is still required for Safari. */}
				<div
					className={cn(
						"absolute inset-y-0 left-0 right-0 lg:left-1/2",
						"lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.45)_28%,#000_62%)]",
						"lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.45)_28%,#000_62%)]",
					)}>
					<Image
						src={image}
						alt={imageAlt}
						fill
						priority
						// Half the viewport from `lg`, so the browser stops fetching a
						// 2x-wider file than it can paint.
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="object-cover object-center"
					/>
				</div>

				{/* Legibility stack. Below `lg` these do the work of separating the
				    headline from the photo; from `lg` the left column is already empty
				    ink, so they only feather the seam and settle the photo's contrast. */}
				<div className="absolute inset-0 bg-ink/45 lg:bg-ink/25" />
				<div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20 lg:via-ink/70 lg:to-transparent" />
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
