/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { ZoomParallax } from "@/components/ui/ZoomParallax";
import { featuredProjects } from "@/content/portfolio";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.portfolio);

export default function PortfolioPage() {
	return (
		<>
			<PageHero
				kicker="Website portfolio"
				title="Crafted with love. Built with passion."
				subtitle="A living showcase of 42+ live websites we've designed, engineered and shipped for manufacturers, hospitals, schools, retailers and startups across India and beyond. Every one is in production. Visit them yourself."
				image="/images/Headerimages/_DSC9823.JPG"
				imageAlt="A Cubiccode developer reviewing a live website build"
				breadcrumb={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}>
				<div className="flex flex-wrap items-center gap-3">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						Get a Proposal
					</Button>
					<Button
						href={routes.caseStudies}
						variant="outline">
						View case studies
					</Button>
				</div>
			</PageHero>

			{/* Featured  immersive scroll-driven zoom parallax */}
			<section className="relative bg-ink text-white">
				<div className="container-x relative z-10 pt-20 lg:pt-28">
					<div className="max-w-2xl">
						<span className="kicker !text-corporate-300">
							Featured launches
						</span>
						<h2 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tightest text-white sm:text-4xl lg:text-5xl">
							Flagship websites, captured live
						</h2>
						<p className="mt-5 text-base leading-relaxed text-steel-300 sm:text-lg">
							A handful of our favourite builds scroll to zoom in.
						</p>
					</div>
				</div>

				<ZoomParallax
					images={featuredProjects.map((p) => ({
						src: p.image,
						alt: `${p.name}  built by Cubiccode`,
						name: p.name,
						href: `https://${p.url}`,
					}))}
				/>
			</section>
		</>
	);
}
