/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CultureValues } from "@/components/culture/CultureValues";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.culture);

export default function CulturePage() {
	return (
		<>
			<PageHero
				kicker="Life at Cubiccode"
				title="The people behind nearly a decade of on-time delivery."
				subtitle="Lean, agile and obsessed with the outcome a glimpse of the moments and everyday culture that shape how we work."
				image="/images/Headerimages/culture.JPG"
				imageAlt="Cubiccode's vision and core values on the studio wall"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: routes.about },
					{ label: "Company Culture" },
				]}
			/>

			{/* The hero carries the page's <h1>, so this section leads with an h2. */}
			<section className="section relative overflow-hidden bg-canvas">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_20%,#000,transparent)] opacity-50" />
				<div className="container-x relative">
					<SectionHeading
						align="center"
						kicker="Company culture & ethics"
						title="The twelve principles we work by."
						intro="The same twelve plates that hang on our office wall in Belagavi  what we hold each other to, every project, every day."
					/>
					<div className="mt-14">
						<CultureValues />
					</div>
				</div>
			</section>
		</>
	);
}
