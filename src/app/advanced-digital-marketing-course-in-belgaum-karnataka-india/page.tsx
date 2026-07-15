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

const brand = groupCompanyBySlug("digital-marketing")!;

export const metadata = buildMetadata(pageSeo.digitalMarketing);

export default function DigitalMarketingPage() {
	return (
		<>
			<PageHero
				kicker={brand.kicker}
				title={splashHeadlineText(brand)}
				subtitle={brand.subtitle}
				image="/images/Headerimages/x3.jpg.jpeg"
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
