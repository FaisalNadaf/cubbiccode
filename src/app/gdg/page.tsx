/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { BrandSplash } from "@/components/splash/BrandSplash";
import { groupCompanyBySlug } from "@/content/groupCompanies";

const brand = groupCompanyBySlug("gdg")!;

export const metadata = brand.meta;

export default function GdgPage() {
	return <BrandSplash brand={brand} />;
}
