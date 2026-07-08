/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { BrandSplash } from "@/components/splash/BrandSplash";
import { groupCompanyBySlug } from "@/content/groupCompanies";

const brand = groupCompanyBySlug("digital-marketing")!;

export const metadata = brand.meta;

export default function DigitalMarketingPage() {
	return <BrandSplash brand={brand} />;
}
