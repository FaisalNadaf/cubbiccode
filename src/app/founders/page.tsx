/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { founderMessage, founders } from "@/content/company";

export const metadata = {
	title: "Message From the Founders | Cubiccode",
	description:
		"A message from Sarvesh Kakkeri & Shivani Jadhav, co-founders of Cubiccode Digital Media LLP  on building the company they wished existed, taking ownership of every outcome, and delivering premium work at honest pricing.",
};

const MILESTONES = [
	{ value: "2016", label: "Founded" },
	{ value: "500+", label: "Clients" },
	{ value: "700+", label: "Projects" },
];

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
				image="/images/about/parallax-2.jpg"
				imageAlt="The founders of Cubiccode"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: "/about" },
					{ label: "Message From the Founders" },
				]}
			/>

		<section className="section relative bg-canvas-soft">
			{/* No `overflow-hidden` on the section: it would become the sticky
			    containing block and stop the portrait from sticking. The
			    decorative layer clips itself instead. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-radial-fade" />
				<div className="absolute -left-32 top-24 size-[26rem] rounded-full bg-corporate-500/10 blur-[150px]" />
				<div className="absolute -right-32 bottom-10 size-[24rem] rounded-full bg-ink/[0.07] blur-[150px]" />
			</div>

			<div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
				{/* ── Left · founders portrait (sticks while the letter scrolls) ── */}
				<div className="lg:sticky lg:top-28 lg:self-start">
					<Reveal direction="right">
						<figure className="relative overflow-hidden rounded-4xl border border-steel-200 bg-ink shadow-lift">
							<div className="relative aspect-[4/5]">
								<Image
									src="/images/about/about-main.png"
									alt="Sarvesh Kakkeri and Shivani Jadhav, co-founders of Cubiccode"
									fill
									priority
									sizes="(max-width: 1024px) 100vw, 40vw"
									className="object-cover object-center"
								/>
								<div
									aria-hidden
									className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
								/>
							</div>
							<figcaption className="absolute inset-x-5 bottom-5 flex items-center gap-2 text-[12.5px] font-medium text-white/90">
								<span className="size-1.5 shrink-0 rounded-full bg-corporate-400" />
								{founderMessage.role}
							</figcaption>
						</figure>
					</Reveal>

					<Reveal
						delay={0.15}
						className="mt-5">
						<dl className="grid grid-cols-3 divide-x divide-steel-200 rounded-3xl border border-steel-200 bg-white py-5 shadow-soft">
							{MILESTONES.map((m) => (
								<div
									key={m.label}
									className="px-3 text-center">
									<dt className="font-display text-2xl font-bold tracking-tight text-ink">
										{m.value}
									</dt>
									<dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-500">
										{m.label}
									</dd>
								</div>
							))}
						</dl>
					</Reveal>
				</div>

				{/* ── Right · the letter (the hero above carries the kicker + h1) ── */}
				<div className="flex flex-col">
					<Reveal delay={0.2}>
						<article className="relative overflow-hidden rounded-4xl border border-steel-200 bg-white px-6 py-9 shadow-card sm:px-10 sm:py-11 lg:px-14 lg:py-14">
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

							<RevealGroup className="relative mt-8 max-w-[68ch] space-y-6 text-[17px] leading-[1.75] text-steel-600">
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

							{/* ── Signature + founder names ── */}
							<div className="mt-10 border-t border-steel-200 pt-8">
								<p className="font-serif text-3xl italic leading-none text-ink sm:text-[2.25rem]">
									{founderMessage.signature.trim()}
								</p>

								<ul className="mt-7 flex flex-wrap items-center gap-x-10 gap-y-5">
									{founders.map((f) => (
										<li
											key={f.name}
											className="flex items-center gap-3.5">
											<span
												aria-hidden
												className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-base font-bold tracking-tight text-white ring-1 ring-corporate-500/20">
												{f.initials}
											</span>
											<div>
												<p className="font-display text-base font-semibold leading-tight text-ink">
													{f.name}
												</p>
												<p className="text-[12.5px] text-steel-500">{f.role}</p>
											</div>
										</li>
									))}
								</ul>
							</div>
						</article>
					</Reveal>
				</div>
			</div>
			</section>
		</>
	);
}
