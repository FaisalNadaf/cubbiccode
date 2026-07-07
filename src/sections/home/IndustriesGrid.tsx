/** @format */

import Image from "next/image";
import Link from "next/link";
import { industries, type Industry } from "@/content/industries";
import { industryImage } from "@/content/serviceImages";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * INDUSTRIES  industrial blueprint mosaic (light theme).
 *
 * Manually composed (NOT a single auto-grid): Row 1 = wide heading block + one
 * large industry card; Row 2 = four cards; Row 3 = four cards. Rows are aligned
 * (no horizontal stagger) so the straight outer edges line up. Nine industries
 * fill 1 + 4 + 4 exactly.
 *
 * Geometry: one global `--slant` length drives every clip so all tiles share the
 * SAME edge angle. Interior cards are full parallelograms (both edges slanted);
 * the heading block and the leftmost card in a row are flush-left (vertical left
 * edge), and the rightmost card in a row is flush-right (vertical right edge), so
 * the whole mosaic has clean vertical outer edges. Neighbours in a row are
 * separated by a clean diagonal gap (slant-parallel) via a positive margin.
 *
 * Cards are full-bleed: a background image under a legibility scrim, the title
 * pinned to the bottom and the sub-title revealed on hover. Thin steel borders,
 * sharp corners, corporate-blue hover accents.
 *
 * Below `lg` the manual rows collapse to a clean 2-col (tablet) / 1-col (mobile)
 * grid; the parallelogram geometry is preserved at every breakpoint.
 */

// One global slant  a FIXED length, so every tile shares one edge angle.
const SLANT_VARS = "[--slant:0.9rem] sm:[--slant:1.4rem] lg:[--slant:2.5rem]";

// Full parallelogram (both side edges slanted)  interior industry cards.
const CARD_CLIP =
	"polygon(var(--slant) 0%, 100% 0%, calc(100% - var(--slant)) 100%, 0% 100%)";
// Flush-left block (vertical left edge, slanted right)  heading panel.
const HEAD_CLIP =
	"polygon(0% 0%, 100% 0%, calc(100% - var(--slant)) 100%, 0% 100%)";

// Vertical LEFT edge, slanted right  leftmost card in a row (flush outer left).
const CARD_CLIP_LEFT_STRAIGHT = HEAD_CLIP;
// Slanted left edge, vertical RIGHT edge  rightmost card in a row (flush outer right).
const CARD_CLIP_RIGHT_STRAIGHT =
	"polygon(var(--slant) 0%, 100% 0%, 100% 100%, 0% 100%)";

// Space row neighbours apart with a clean ~16px diagonal gap (parallel to the
// slant). The clip insets each tile by `--slant`, so the visible gap between two
// tiles is `margin + slant`; set margin = 16px − slant to land a ~16px gap.
const ROW_GAP_X = "[&>*+*]:ml-[calc(16px_-_var(--slant))]";

// Very subtle engineering grid  dark hairlines on the light canvas.
const GRID = {
	backgroundImage:
		"linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
	backgroundSize: "40px 40px",
} as const;

export function IndustriesGrid() {
	return (
		<section className="relative w-full overflow-hidden bg-canvas text-ink lg:h-screen lg:w-screen pt-10 ">
			{/* Subtle blueprint grid */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0 opacity-70"
				style={GRID}
			/>
			{/* Very subtle top tint */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/3 bg-gradient-to-b from-corporate-500/[0.05] to-transparent"
			/>

			<div
				className={`relative z-10 flex h-full w-full flex-col px-4 py-5 sm:px-6 lg:px-10 lg:py-8 ${SLANT_VARS}`}>
				{/* ── Desktop: manual aligned rows ───────────────────────────── */}
				<RevealGroup
					stagger={0.05}
					className="hidden h-full flex-1 flex-col gap-[14px] lg:flex">
					{/* Row 1  heading + one large card */}
					<div className={`flex flex-1 lg:min-h-0 ${ROW_GAP_X}`}>
						<RevealItem className="h-full w-[67%] min-w-0">
							<HeadingPanel />
						</RevealItem>
						<RevealItem className="h-full flex-1 min-w-0">
							{/* Block 1  rightmost: straight right edge */}
							<IndustryCard
								ind={industries[0]}
								priority
								clip={CARD_CLIP_RIGHT_STRAIGHT}
							/>
						</RevealItem>
					</div>

					{/* Row 2  four cards (block 2 leftmost-straight, block 5 rightmost-straight) */}
					<div className={`flex flex-1 lg:min-h-0 ${ROW_GAP_X}`}>
						{industries.slice(1, 5).map((ind, i) => (
							<RevealItem
								key={ind.slug}
								className="h-full flex-1 min-w-0">
								<IndustryCard
									ind={ind}
									clip={
										i === 0 ? CARD_CLIP_LEFT_STRAIGHT
										: i === 3 ?
											CARD_CLIP_RIGHT_STRAIGHT
										:	CARD_CLIP
									}
								/>
							</RevealItem>
						))}
					</div>

					{/* Row 3  four cards (block 6 leftmost-straight, block 9 rightmost-straight) */}
					<div className={`flex flex-1 lg:min-h-0 ${ROW_GAP_X}`}>
						{industries.slice(5, 9).map((ind, i) => (
							<RevealItem
								key={ind.slug}
								className="h-full flex-1 min-w-0">
								<IndustryCard
									ind={ind}
									clip={
										i === 0 ? CARD_CLIP_LEFT_STRAIGHT
										: i === 3 ?
											CARD_CLIP_RIGHT_STRAIGHT
										:	CARD_CLIP
									}
								/>
							</RevealItem>
						))}
					</div>
				</RevealGroup>

				{/* ── Tablet / mobile: 2-col / 1-col ─────────────────────────── */}
				<RevealGroup
					stagger={0.05}
					className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 lg:hidden">
					<RevealItem className="sm:col-span-2">
						<HeadingPanel />
					</RevealItem>
					{industries.map((ind) => (
						<RevealItem key={ind.slug}>
							<IndustryCard ind={ind} />
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}

/* ── Heading block ───────────────────────────────────────────────────────── */

function HeadingPanel() {
	return (
		<div className="group relative h-full min-h-[150px] w-full transition-transform duration-300 ease-out hover:-translate-y-1 lg:min-h-0">
			{/* Thin border */}
			<div
				className="absolute inset-0 bg-steel-300"
				style={{ clipPath: HEAD_CLIP }}
			/>
			{/* Fill */}
			<div
				className="absolute inset-[1.5px] overflow-hidden bg-white"
				style={{ clipPath: HEAD_CLIP }}>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 opacity-60"
					style={GRID}
				/>
				<div className="relative flex h-full flex-col justify-center gap-4 px-6 py-7 pr-[calc(var(--slant)_+_1.5rem)] sm:px-8 lg:px-12 lg:pr-[calc(var(--slant)_+_2.5rem)]">
					<span className="w-fit border border-corporate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-corporate-600">
						Industries we serve
					</span>
					<h2 className="font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
						Built for your industry
					</h2>
					<p className="max-w-2xl text-xl leading-relaxed text-steel-600">
						We understand your industry&apos;s needs and speak your
						industry&apos;s language domain-specific platforms, not generic
						templates retrofitted to your sector.
					</p>
				</div>
			</div>
		</div>
	);
}

/* ── Industry card (split: image + content) ──────────────────────────────── */

function IndustryCard({
	ind,
	priority = false,
	clip = CARD_CLIP,
}: {
	ind: Industry;
	priority?: boolean;
	clip?: string;
}) {
	return (
		<Link
			href={`/industries/${ind.slug}`}
			className="group relative block h-full min-h-[132px] w-full transition-transform duration-300 ease-out hover:z-20 hover:-translate-y-1 focus-visible:z-20 focus-visible:outline-none lg:min-h-0">
			{/* Thin border  accents on hover */}
			<div
				className="absolute inset-0 bg-steel-300 transition-colors duration-300 group-hover:bg-corporate-400 group-focus-visible:bg-corporate-400"
				style={{ clipPath: clip }}
			/>

			{/* Full-bleed image background */}
			<div
				className="absolute inset-[1.5px] overflow-hidden bg-steel-900"
				style={{ clipPath: clip }}>
				<Image
					src={industryImage(ind.slug)}
					alt={ind.title}
					fill
					priority={priority}
					sizes="(max-width: 1024px) 100vw, 25vw"
					className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>

				{/* Base legibility scrim */}
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"
				/>
				{/* Extra dim on hover so the sub-title stays readable */}
				<div
					aria-hidden
					className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/35"
				/>

				{/* Title (always) + sub-title (revealed on hover at lg) */}
				<div className="absolute inset-0 flex flex-col justify-end gap-1.5 p-3 pr-[calc(var(--slant)_+_0.5rem)] lg:p-4 lg:pr-[calc(var(--slant)_+_0.75rem)]">
					<h3 className="line-clamp-2 font-display text-[12px] font-bold uppercase leading-tight tracking-wide text-white lg:text-[13.5px]">
						{ind.title}
					</h3>
					<p className="line-clamp-3 max-h-24 overflow-hidden text-[10.5px] leading-snug text-white/85 transition-all duration-300 lg:max-h-0 lg:text-white/0 lg:group-hover:max-h-24 lg:group-hover:text-white/85">
						{ind.short}
					</p>
				</div>
			</div>
		</Link>
	);
}
