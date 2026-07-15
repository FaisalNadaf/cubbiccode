/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { Hero } from "@/sections/home/Hero";
import { WhyTrust } from "@/sections/home/WhyTrust";
import { StatsBand } from "@/sections/home/StatsBand";
import { CapabilitiesShowcase } from "@/sections/home/CapabilitiesShowcase";
import { IndustriesGrid } from "@/sections/home/IndustriesGrid";
import { PortfolioShowcase } from "@/sections/home/PortfolioShowcase";
import { ClientWall } from "@/sections/home/ClientWall";
import { Testimonials } from "@/sections/home/Testimonials";
import { TechEcosystem } from "@/sections/home/TechEcosystem";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.home);

export default function HomePage() {
	return (
		<>
			<Hero />
			<WhyTrust />
			<StatsBand />
			<CapabilitiesShowcase />
			<IndustriesGrid />
			<PortfolioShowcase />
			<ClientWall />
			<Testimonials />
			<TechEcosystem />
		</>
	);
}
