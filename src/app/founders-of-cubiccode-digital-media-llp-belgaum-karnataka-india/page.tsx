/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { founderMessage, founders, type Founder } from "@/content/company";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.founders);

/** First sentence + remainder — used to lift a line out as a pull quote. */
function splitFirst(p: string): [string, string] {
	const i = p.indexOf(". ");
	return i === -1 ? [p, ""] : [p.slice(0, i + 1), p.slice(i + 2)];
}

/** Everything but the final sentence, then the final sentence. */
function splitLast(p: string): [string, string] {
	const i = p.lastIndexOf(". ");
	return i === -1 ? ["", p] : [p.slice(0, i + 1), p.slice(i + 2)];
}

/**
 * A founder's portrait, or an initials monogram while no photo is set.
 * Never renders a broken image  see `Founder.photo` in content/company.ts.
 */
function FounderPortrait({ founder }: { founder: Founder }) {
	if (!founder.photo) {
		return (
			<span
				aria-hidden
				className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-xl font-bold tracking-tight text-white ring-1 ring-corporate-500/20 sm:size-24">
				{founder.initials}
			</span>
		);
	}

	return (
		<span className="relative size-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-steel-200 sm:size-24">
			<Image
				src={founder.photo}
				alt={`${founder.name}, ${founder.role} of Cubiccode`}
				fill
				sizes="96px"
				// Inline, not a Tailwind class: the value comes from content, and the
				// class scanner only sees literal class strings, so `object-[…]` built
				// from a variable would be purged.
				style={{ objectPosition: founder.photoPosition ?? "center" }}
				className="object-cover"
			/>
		</span>
	);
}

export default function FoundersPage() {
	const [opening, approach, pricing, promise] = founderMessage.paragraphs;
	const [pullQuote, pricingRest] = splitFirst(pricing);
	const [promiseBody, closingLine] = splitLast(promise);

	return (
		<>
			<PageHero
				kicker={founderMessage.greeting}
				title={founderMessage.title}
				subtitle={founderMessage.role}
				image="/images/Headerimages/founders.JPG"
				imageAlt="The founders of Cubiccode at the studio"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: routes.about },
					{ label: "Message From the Founders" },
				]}
			/>

			<section className="section relative bg-canvas-soft">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute inset-0 bg-radial-fade" />
					<div className="absolute -left-32 top-24 size-[26rem] rounded-full bg-corporate-500/10 blur-[150px]" />
					<div className="absolute -right-32 bottom-10 size-[24rem] rounded-full bg-ink/[0.07] blur-[150px]" />
				</div>

				<div className="container-x relative">
					{/* One centred column. The card is wide; the prose inside is capped
					    at ~72 characters, which is as wide as body text can run before
					    the eye loses the start of the next line. */}
					<Reveal
						delay={0.1}
						className="mx-auto w-full max-w-5xl">
						<article className="relative overflow-hidden rounded-4xl border border-steel-200 bg-white px-6 py-10 shadow-card sm:px-12 sm:py-14 lg:px-20 lg:py-16">
							{/* letterhead */}
							<header className="flex flex-wrap items-center justify-between gap-2 border-b border-steel-200 pb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-steel-500">
								<span className="text-ink">Cubiccode Digital Media LLP</span>
								<span>Est. 2016</span>
							</header>

							{/* oversized quote glyph, purely decorative */}
							<span
								aria-hidden
								className="pointer-events-none absolute -top-6 right-4 select-none font-serif text-[8rem] italic leading-none text-steel-100 sm:text-[11rem]">
								&rdquo;
							</span>

							<RevealGroup className="relative mx-auto mt-10 max-w-[72ch] space-y-6 text-[17px] leading-[1.75] text-steel-600">
								<RevealItem
									as="p"
									className="text-pretty first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.5rem] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-corporate-600">
									{opening}
								</RevealItem>

								<RevealItem
									as="p"
									className="text-pretty">
									{approach}
								</RevealItem>

								<RevealItem as="div">
									<blockquote className="relative rounded-r-2xl border-l-[3px] border-corporate-500 bg-corporate-50/70 py-5 pl-6 pr-5 font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl">
										{pullQuote}
									</blockquote>
								</RevealItem>

								{pricingRest && (
									<RevealItem
										as="p"
										className="text-pretty">
										{pricingRest}
									</RevealItem>
								)}

								<RevealItem
									as="p"
									className="text-pretty">
									{promiseBody}
								</RevealItem>

								<RevealItem
									as="p"
									className="text-balance font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
									{closingLine}
								</RevealItem>
							</RevealGroup>

							{/* ── Signature + founder portraits ── */}
							<div className="mx-auto mt-12 max-w-[72ch] border-t border-steel-200 pt-9">
								<p className="font-serif text-3xl italic leading-none text-ink max-lg:leading-tight sm:text-[2.25rem]">
									{founderMessage.signature.trim()}
								</p>

								<ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
									{founders.map((f) => (
										<li
											key={f.name}
											className="flex items-center gap-4 rounded-3xl border border-steel-200 bg-canvas-soft p-4 transition-colors duration-300 hover:border-corporate-200">
											<FounderPortrait founder={f} />
											<div className="min-w-0">
												<p className="truncate font-display text-base font-semibold leading-tight text-ink max-lg:whitespace-normal sm:text-lg">
													{f.name}
												</p>
												<p className="mt-1 text-[12.5px] text-steel-500">
													{f.role}
												</p>
											</div>
										</li>
									))}
								</ul>
							</div>
						</article>
					</Reveal>
				</div>
			</section>
		</>
	);
}
