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

const brand = groupCompanyBySlug("gdg")!;

export const metadata = brand.meta;

export default function GdgPage() {
	return (
		<>
			<PageHero
				kicker={brand.kicker}
				title={splashHeadlineText(brand)}
				subtitle={brand.subtitle}
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
