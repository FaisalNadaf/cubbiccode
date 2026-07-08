/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { BrandSplash } from "@/components/splash/BrandSplash";
import { groupCompanyBySlug } from "@/content/groupCompanies";

const brand = groupCompanyBySlug("careerjump")!;

export const metadata = brand.meta;

export default function CareerJumpPage() {
	return <BrandSplash brand={brand} />;
}
