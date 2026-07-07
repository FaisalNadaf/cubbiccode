/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import { BrandSplash } from "@/components/splash/BrandSplash";
import { groupCompanyBySlug } from "@/content/groupCompanies";

const brand = groupCompanyBySlug("gdg")!;

export const metadata = brand.meta;

export default function GdgPage() {
  return <BrandSplash brand={brand} />;
}
