import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { capabilities } from "@/content/capabilities";
import { industries } from "@/content/industries";

/**
 * Every indexable URL, derived from the same route map the pages and nav use —
 * so a new page cannot ship missing from the sitemap, and a renamed slug cannot
 * leave a dead entry behind.
 */

// Money pages first: services, then the proof that sells them.
const PRIORITY: Partial<Record<keyof typeof routes, number>> = {
	home: 1,
	caseStudies: 0.9,
	portfolio: 0.9,
	contact: 0.8,
	clientele: 0.8,
	seoResults: 0.8,
	about: 0.7,
	achievements: 0.6,
	certifications: 0.6,
	dataAnalytics: 0.6,
	digitalMarketing: 0.6,
	careers: 0.5,
	careerjump: 0.5,
	founders: 0.5,
	journey: 0.5,
	culture: 0.4,
	partner: 0.4,
	gdg: 0.4,
	terms: 0.2,
	privacy: 0.2,
};

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	const staticEntries: MetadataRoute.Sitemap = (
		Object.entries(routes) as [keyof typeof routes, string][]
	).map(([key, path]) => ({
		url: `${site.url}${path === "/" ? "" : path}`,
		lastModified,
		changeFrequency: key === "home" ? "weekly" : "monthly",
		priority: PRIORITY[key] ?? 0.5,
	}));

	// Capability pages are the commercial core — ranked just under the homepage.
	const capabilityEntries: MetadataRoute.Sitemap = capabilities.map((c) => ({
		url: `${site.url}${c.path}`,
		lastModified,
		changeFrequency: "monthly",
		priority: 0.9,
	}));

	const industryEntries: MetadataRoute.Sitemap = industries.map((i) => ({
		url: `${site.url}${i.path}`,
		lastModified,
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [...staticEntries, ...capabilityEntries, ...industryEntries];
}
