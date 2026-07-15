/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { BrandSplash } from "@/components/splash/BrandSplash";
import {
	groupCompanyBySlug,
	splashHeadlineText,
	splashWordmarkText,
} from "@/content/groupCompanies";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

const brand = groupCompanyBySlug("gdg")!;

export const metadata = buildMetadata(pageSeo.gdg);

export default function GdgPage() {
	return (
		<>
			<PageHero
				kicker={brand.kicker}
				title={splashHeadlineText(brand)}
				subtitle={brand.subtitle}
				image="/images/Headerimages/_DSC9889.JPG"
				imageAlt={splashWordmarkText(brand)}
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: splashWordmarkText(brand) },
				]}
			/>
			<BrandSplash brand={brand} />
		</>
	);
}
