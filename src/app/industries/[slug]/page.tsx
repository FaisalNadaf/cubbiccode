/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BadgeCheck, Clock, ShieldCheck, Users } from "lucide-react";
import { industries, industryBySlug } from "@/content/industries";
import { industryImage, industrySolutionImages } from "@/content/serviceImages";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { SolutionsSequence } from "@/sections/industries/SolutionsSequence";
import { HowWeDoItBetter } from "@/sections/shared/HowWeDoItBetter";
import { TheResult } from "@/sections/shared/TheResult";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
	return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const ind = industryBySlug(slug);
	if (!ind) return { title: "Industry not found" };
	return {
		title: `${ind.title}  ${site.name}`,
		description: ind.subheadline,
	};
}

const trustPoints = [
	{
		icon: ShieldCheck,
		title: site.certification,
		text: "A formally certified quality process  consistent, reliable delivery on every project.",
	},
	{
		icon: Users,
		title: "500+ clients served",
		text: "Nearly a decade of building for businesses across India and beyond.",
	},
	{
		icon: Clock,
		title: "On-time delivery",
		text: "Clear timelines and disciplined execution  we ship when we say we will.",
	},
	{
		icon: BadgeCheck,
		title: "Affordable quality",
		text: "Enterprise-grade engineering at prices that make sense for your sector.",
	},
];

export default async function IndustryPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const ind = industryBySlug(slug);
	if (!ind) notFound();

	const others = industries.filter((i) => i.slug !== ind.slug);

	return (
		<>
			<PageHero
				kicker="Industry"
				title={ind.headline}
				subtitle={ind.subheadline}
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Industries", href: "/industries/manufacturing" },
					{ label: ind.title },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href={site.proposalCta}
						external
						arrow
						variant="accent"
						size="lg">
						{ind.cta}
					</Button>
					<Button
						href="/case-studies"
						variant="outline"
						size="lg">
						See Our Work
					</Button>
				</div>
			</PageHero>

			{/* ============ THE PROBLEM ============ */}
			<section className="section relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
					<Reveal direction="right">
						<div>
							<span className="kicker">The reality today</span>
							<p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-steel-700 lg:text-2xl">
								{ind.problem}
							</p>
						</div>
					</Reveal>

					<Reveal
						direction="left"
						delay={0.1}>
						<div className="relative">
							<div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 size-48 rounded-3xl bg-blueprint [background-size:24px_24px] opacity-60" />
							<div className="relative overflow-hidden rounded-4xl border border-steel-200 shadow-lift">
								<div className="relative aspect-[4/3] w-full">
									<Image
										src={industryImage(ind.slug)}
										alt={ind.title}
										fill
										sizes="(min-width: 1024px) 45vw, 90vw"
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
								</div>
								<div className="absolute inset-x-0 bottom-0 p-7">
									<span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
										<Icon
											name={ind.icon}
											className="size-4 text-corporate-600"
										/>
										{ind.title}
									</span>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</section>

			{/* ============ HOW WE HELP ============ */}
			<SolutionsSequence
				title={ind.title}
				icon={ind.icon}
				solutions={ind.solutions}
				images={industrySolutionImages(ind.slug, ind.solutions.length)}
			/>

			{/* ============ HOW WE DO IT BETTER ============ */}
			<HowWeDoItBetter
				blocks={ind.better}
				cta={ind.cta}
			/>

			{/* ============ THE RESULT ============ */}
			<TheResult outcomes={ind.result} />
		</>
	);
}
