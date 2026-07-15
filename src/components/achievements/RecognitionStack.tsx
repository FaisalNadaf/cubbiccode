/** @format */

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { Icon } from "@/components/ui/Icon";
import { recognitions, type Recognition } from "@/content/company";
import { usePrefersReducedMotion } from "@/lib/motion";

const TOTAL = String(recognitions.length).padStart(2, "0");

/**
 * Deck geometry: how far the top card pins from the viewport top, and how far
 * each card behind it peeks out.
 *
 * Every pixel spent here is taken off the card, because the card is sized to the
 * space the deck leaves (see CARD_HEIGHT). With nine awards the desktop numbers
 * reserve 104 + 16x8 = 232px, which is affordable on a 900px monitor and ruinous
 * on a 640px phone: the card collapses to ~368px, the figure to a ~147px strip,
 * and the citation is left ~220px to fit content that needs ~275px, so its tail
 * is clipped for exactly as long as you are reading it. Below lg the pin only has
 * to clear the same 67px header and the peeks only have to read as a deck, so
 * both shrink and the card gets ~92px back.
 */
// `cap` is the card's maximum height at this breakpoint (see cardHeight).
// Below lg the figure flexes to fill whatever the content leaves (see the card
// markup), so the cap no longer fights a white gap — it just keeps the card, and
// thus that flexed image, a sensible height on a tall phone instead of letting
// it grow to fill the whole viewport. Small phones stay viewport-limited below
// the cap, so their citations are never clipped either way.
const DECK_DESKTOP = { pin: 104, peek: 16, cap: "42rem" };
const DECK_MOBILE = { pin: 76, peek: 8, cap: "36rem" };

/**
 * SSR and the first client paint assume desktop, so the >= 1024px render is
 * byte-identical and never flashes. ScrollStack lists these props in its layout
 * effect's deps, so it re-measures the deck when they flip on a phone.
 */
function useDeck() {
	const [mobile, setMobile] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 1023.98px)");
		const sync = () => setMobile(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);
	return mobile ? DECK_MOBILE : DECK_DESKTOP;
}

/**
 * One percent of the viewport height the deck may actually use.
 *
 * `vh` is the wrong unit here. On mobile Safari and Chrome `100vh` measures the
 * viewport with the URL bar *hidden*, but ScrollStack derives every pin from
 * `window.innerHeight` — the *visible* viewport, URL bar and all. Size a pinned
 * card in `vh` and it stands taller than the space the deck reserved for it, so
 * its bottom (the index row, the tail of the citation) is cropped for exactly as
 * long as you are reading it.
 *
 * `svh` is the small viewport — browser chrome fully expanded — which is the
 * floor of `innerHeight`, so a card measured in it always fits, and unlike `dvh`
 * it does not resize mid-scroll as the URL bar collapses (that would relayout
 * the deck under ScrollStack's cached metrics). On any pointer device with no
 * collapsing chrome `svh === vh`, so desktop is unchanged either way; the `vh`
 * line stays as the fallback for engines that predate the unit.
 */
const DECK_VH_CLASS = "recognition-deck";
const DECK_VH_CSS = `.${DECK_VH_CLASS}{--deck-vh:1vh}@supports (height:1svh){.${DECK_VH_CLASS}{--deck-vh:1svh}}`;
/** `100vh`-equivalent, in the unit above. */
const VH100 = "calc(var(--deck-vh, 1vh) * 100)";
/** `50vh`-equivalent, in the unit above. */
const VH50 = "calc(var(--deck-vh, 1vh) * 50)";

/**
 * Card height. A pinned card starts `pin` down and the deepest one another
 * `peek × (n-1)` below that, so anything taller than the remaining space has
 * its bottom cropped for the entire time you are reading it. Reserve the pin,
 * the full peek run and a little breathing room, then cap (per breakpoint, see
 * the DECK constants) so the card does not grow absurd on a tall screen.
 */
const cardHeight = (deckDepth: number, cap = "42rem") =>
	`min(${cap}, calc(${VH100} - ${deckDepth + 40}px))`;

/**
 * Runway below the deck, before the page's next section.
 *
 * ScrollStack releases the last card's pin half a viewport before this spacer,
 * but the card is still parked `deckDepth` down and stands `cardHeight` tall —
 * and it out-ranks the following section on z-index, so any part of it still on
 * screen when that section arrives paints straight over it. Reserve the card's
 * full on-screen extent, give back the half viewport the pin releases early, and
 * add a margin. Too small and the last card sits on top of the CTA.
 *
 * The half viewport given back is measured in the same small-viewport unit, so
 * it can only ever be *less* than the `innerHeight/2` ScrollStack actually
 * releases — the runway errs long, never short.
 */
const endSpace = (deckDepth: number, cap = "42rem") =>
	`max(10rem, calc(${deckDepth}px + ${cardHeight(deckDepth, cap)} - ${VH50} + 4rem))`;

/**
 * Width of a card's image column. Only ever consumed at >= lg (the grid is a
 * single column below that), so it is measured against the desktop card height.
 *
 * Photographs fill whatever frame they are given, so they keep the default
 * split. A document must be shown whole, and `object-contain` in a frame shaped
 * differently from the document letterboxes it — the frame is therefore cut to
 * the document's own aspect at the card's full height, so it fills the frame
 * exactly, top to bottom, with nothing cropped and no empty bands.
 *
 * Capped so the text column keeps at least 24rem: a 1.41-wide press cutting
 * wants ~70% of a wide card, which is affordable at 1440px and not at 1024px.
 * Below that cap a thin band returns — the alternative is an unreadable column.
 */
const DESKTOP_DEPTH =
	DECK_DESKTOP.pin + DECK_DESKTOP.peek * (recognitions.length - 1);

function figureColumn(r: Recognition) {
	if (r.fit === "cover") return "1.05fr";
	return `min(calc(${cardHeight(DESKTOP_DEPTH)} * ${r.aspect}), calc(100% - 24rem))`;
}

/**
 * Awards & recognitions as a scroll-driven card stack.
 *
 * Each card pins near the top of the viewport and holds at full size for as long
 * as it is the one you are reading. Only when the next card's top edge clears the
 * bottom of the viewport does it begin to recede  shrinking and darkening in
 * step with that card's approach, so the run of awards ends as a physical deck
 * rather than a list you scroll past.
 *
 * `useWindowScroll` keeps the page as the single scroller: ScrollStack drives
 * itself from the app's global Lenis instead of spawning a competing one, and
 * falls back to a plain stack under `prefers-reduced-motion`.
 */
export function RecognitionStack() {
	const { pin, peek, cap } = useDeck();
	const deckDepth = pin + peek * (recognitions.length - 1);
	const CARD_HEIGHT = cardHeight(deckDepth, cap);

	return (
		<>
			{/* `--deck-vh` needs an `@supports` guard to keep its `vh` fallback, and a
			    guard needs a stylesheet — an inline style object cannot hold one. Both
			    the card height and the end spacer are inline styles, so the variable is
			    declared here and inherited down into them. */}
			<style dangerouslySetInnerHTML={{ __html: DECK_VH_CSS }} />
			{/* `stackPosition` is in px, not %: the site header is `fixed` at a *fixed*
			    67px, so a percentage pin slides under it on short viewports. The pin and
			    peek must stay in step with the card's height cap — both come from the
			    same `deckDepth`. */}
			<ScrollStack
				className={DECK_VH_CLASS}
				useWindowScroll
				itemDistance={170}
				itemScale={0.03}
				itemStackDistance={peek}
				stackPosition={`${pin}px`}
				baseScale={0.85}
				dimAmount={0.7}
				endSpace={endSpace(deckDepth, cap)}>
				{recognitions.map((r, i) => {
					const index = String(i + 1).padStart(2, "0");

					return (
						<ScrollStackItem
							key={r.title}
							// The upward shadow is what makes the peeks read as a deck: each
							// card casts onto the one parked behind it.
							itemClassName="w-full max-w-[84rem] border border-steel-200/80 bg-white shadow-[0_40px_90px_-45px_rgba(11,27,58,0.45),0_-10px_28px_-14px_rgba(11,27,58,0.22)]">
							{/* A fixed, uniform card height — ScrollStack derives each card's
						    pin window from its layout offset, so ragged heights make the
						    deck stack unevenly. Same formula at every breakpoint, so it is
						    an inline style rather than six Tailwind variants. */}
							<article
								className="flex flex-col lg:grid lg:[grid-template-columns:var(--fig-col)_1fr]"
								style={
									{
										height: CARD_HEIGHT,
										"--fig-col": figureColumn(r),
									} as CSSProperties
								}>
								{/* ── Certificate / photo ── */}
								{/* Stacked below lg: the content sits at its natural height at the
							    bottom and the figure takes the space left above it (`flex-1`), so
							    a short citation yields a taller image rather than a dead white
							    gap, and a long one still fits — the card is capped to hold it.
							    Desktop is side-by-side, so there the figure simply runs the
							    card's full height. */}
								<figure className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-white via-steel-50 to-steel-200 lg:h-full">
									<div
										aria-hidden
										className="absolute inset-0 bg-blueprint [background-size:32px_32px] opacity-40"
									/>
									{/* A radial gradient, not a blurred div: a `filter` inside a
								    card the deck also scales re-rasterises every frame. */}
									<div
										aria-hidden
										className="pointer-events-none absolute inset-0"
										style={{
											backgroundImage:
												"radial-gradient(closest-side, rgba(27,110,194,0.12), transparent)",
										}}
									/>
									<RecognitionMedia
										r={r}
										priority={i === 0}
									/>
									<span
										aria-hidden
										className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-corporate-400/20"
									/>
								</figure>

								{/* ── Content ── */}
								{/* `min-h-0` so this grid row may shrink below its content's
							    intrinsic height instead of pushing the card past its cap. */}
								<div className="relative flex min-h-0 shrink-0 flex-col justify-center px-5 py-4 sm:px-10 sm:py-9 lg:px-12 lg:py-10 xl:px-16 xl:py-14">
									{/* Ghost index, purely decorative depth */}
									<span
										aria-hidden
										className="pointer-events-none absolute right-4 top-2 select-none font-display text-[4rem] font-black leading-none tracking-tightest text-corporate-600/[0.06] sm:right-6 sm:top-3 sm:text-[8rem] lg:text-[11rem]">
										{index}
									</span>

									<div className="relative flex items-center gap-3">
										<span
											aria-hidden
											className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-600 text-white shadow-[0_12px_30px_-10px_rgba(27,110,194,0.6)] sm:size-12 lg:size-14">
											<Icon
												name={r.icon}
												className="size-5 lg:size-6"
											/>
										</span>
										<span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-kicker text-corporate-600 sm:text-xs">
											{r.kind}
											{r.year && (
												<>
													<span
														aria-hidden
														className="h-3 w-px bg-steel-300"
													/>
													<span className="text-steel-500">{r.year}</span>
												</>
											)}
										</span>
									</div>

									{/* Titles run long (a full award citation), so the display size
								    stays a step below the page's other headings — the card's
								    height is capped and the content column may not overflow it.
								    The longest citation sets to five lines at 24px on a 320–390px
								    phone, which is more than the capped card has to give; 20px
								    brings it back to four. Re-asserted at sm and again at lg/xl. */}
									<h3 className="relative mt-2.5 text-balance font-display text-lg font-bold leading-[1.08] tracking-tight text-ink sm:mt-6 sm:text-3xl lg:mt-5 lg:text-[2rem] xl:mt-6 xl:text-[2.4rem]">
										{r.title}
									</h3>

									{/* The awarding body, named exactly as the certificate names it. */}
									<p className="relative mt-2 text-[13px] font-semibold text-corporate-700 sm:mt-4 sm:text-base">
										{r.org}
									</p>

									{/* Clamped below sm only: the capped card cannot hold the longest
									    citation in full on a 640px-tall phone, and a clipped tail reads
									    as a bug where an ellipsis reads as a summary. */}
									<p className="relative mt-1.5 line-clamp-3 max-w-prose text-[13px] leading-snug text-steel-500 sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-relaxed xl:mt-4 xl:text-lg">
										{r.blurb}
									</p>

									<div className="relative mt-3 flex items-center gap-4 sm:mt-8 lg:mt-7 xl:mt-10">
										<span className="text-sm font-semibold tabular-nums text-ink">
											{index}
										</span>
										<span
											aria-hidden
											className="h-px w-16 rounded-full bg-corporate-500"
										/>
										<span className="text-sm font-medium tabular-nums text-steel-400">
											{TOTAL}
										</span>
									</div>
								</div>
							</article>
						</ScrollStackItem>
					);
				})}
			</ScrollStack>
		</>
	);
}

/**
 * The proof inside a card's frame: a still, or — when the recognition has
 * footage — a looping, self-starting YouTube embed.
 *
 * `mute=1` is not a preference, it is the price of admission: every browser
 * blocks an autoplaying video that carries sound, and a blocked player just sits
 * there on a black frame. `loop=1` alone does nothing on a single video — YouTube
 * only honours it when `playlist` names the same id, which is what turns the
 * clip into a one-video playlist that repeats.
 *
 * The player is mounted only once its card nears the viewport, and never before.
 * Nine cards render at once, so embedding all of them up front would pull the
 * YouTube player onto the page for footage most visitors scroll straight past,
 * and would leave a live iframe playing inside a deck that rescales every card
 * on scroll — forcing the player to re-rasterise on every frame. The award
 * photograph stays underneath as the poster, so the frame is never empty while
 * the player loads.
 */
function RecognitionMedia({
	r,
	priority,
}: {
	r: Recognition;
	priority: boolean;
}) {
	const reduce = usePrefersReducedMotion();
	const [near, setNear] = useState(false);
	const frameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = frameRef.current;
		if (!el) return;
		// No observer (old browser, jsdom) → just show it rather than never at all.
		if (typeof IntersectionObserver === "undefined") {
			setNear(true);
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setNear(true);
				io.disconnect(); // one-way: never tear the player down mid-play
			},
			{ rootMargin: "300px" }, // start loading just before it is reached
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const poster = (
		<Image
			src={r.image}
			alt={r.title}
			fill
			sizes="(min-width: 1024px) 55vw, 100vw"
			priority={priority}
			className={
				// Photographs fill the frame; cropping one costs nothing. Certificates
				// and press cuttings are documents — they run edge to edge of the
				// frame's *height* and are never cropped, so `contain` with no padding.
				// The portrait scans are taller than the frame, so contain fits them by
				// height and they end up full-bleed top to bottom.
				r.fit === "cover" ? "object-cover" : "object-contain"
			}
		/>
	);

	if (!r.youtubeId) return poster;

	// A video that starts and loops on its own is exactly what a reduced-motion
	// visitor has asked not to be given, so for them the player loads paused and
	// waits on its own play button.
	const autoplay = !reduce;

	const params = new URLSearchParams({
		autoplay: autoplay ? "1" : "0",
		mute: "1",
		loop: "1",
		playlist: r.youtubeId, // required, or `loop` is ignored on a single video
		playsinline: "1",
		rel: "0",
		modestbranding: "1",
	});

	return (
		<div
			ref={frameRef}
			className="absolute inset-0 size-full bg-ink">
			{poster}
			{near && (
				<iframe
					// -nocookie: no YouTube ad cookie is set on a visitor who only
					// scrolled past the card.
					src={`https://www.youtube-nocookie.com/embed/${r.youtubeId}?${params}`}
					title={r.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
					className="absolute inset-0 size-full border-0"
				/>
			)}
		</div>
	);
}
