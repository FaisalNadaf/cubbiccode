/**
 * Canonical URLs for every static page.
 *
 * Keyword-first slugs, carried over from the legacy cubiccode.in site so the
 * pages that already rank keep their exact URL (contact, case studies, the
 * website- and web-app-development capabilities).
 *
 * This is the single source of truth: nav, footer, CTAs, canonicals and the
 * sitemap all read from here, so a slug can only ever be changed in one place.
 * Capability and industry URLs live next to their copy in `content/*` and are
 * served by the root `[slug]` route.
 *
 * `next.config.mjs` mirrors the legacy → canonical pairs as 301 redirects; if
 * you edit a path here, edit the matching redirect there.
 *
 * @format
 */

export const routes = {
	home: "/",
	about:
		"/about-cubiccode-digital-media-llp-web-development-company-belgaum-karnataka-india",
	achievements:
		"/awards-and-achievements-of-cubiccode-digital-media-llp-belgaum-karnataka-india",
	founders: "/founders-of-cubiccode-digital-media-llp-belgaum-karnataka-india",
	journey:
		"/our-journey-since-2016-cubiccode-digital-media-llp-belgaum-karnataka-india",
	culture: "/life-at-cubiccode-company-culture-belgaum-karnataka-india",
	certifications:
		"/iso-9001-2015-certified-web-development-company-in-belgaum-karnataka-india",
	gallery: "/photo-gallery-of-cubiccode-digital-media-llp-belgaum-karnataka-india",
	portfolio:
		"/best-website-designing-and-development-portfolio-belgaum-karnataka-india",
	/** The legacy URL, reused verbatim — web app & ERP case studies. */
	caseStudies: "/web-application-development-portfolio",
	clientele:
		"/our-clients-500-plus-brands-across-india-cubiccode-digital-media-llp",
	seoResults:
		"/seo-results-rankings-and-organic-growth-cubiccode-digital-media-llp",
	/** The legacy URL, reused verbatim. */
	contact: "/contact-details-cubiccode-digital-media-llp",
	careers:
		"/careers-join-the-team-at-cubiccode-digital-media-llp-belgaum-karnataka-india",
	partner: "/become-a-sales-partner-with-cubiccode-digital-media-llp",
	gdg: "/gdg-belgaum-google-developer-group-community",
	careerjump:
		"/careerjump-career-acceleration-program-belgaum-karnataka-india",
	dataAnalytics:
		"/advanced-data-analytics-with-generative-ai-course-in-belgaum-karnataka-india",
	digitalMarketing:
		"/advanced-digital-marketing-course-in-belgaum-karnataka-india",
	terms: "/terms-and-conditions",
	privacy: "/privacy-policy",
} as const;

export type RouteKey = keyof typeof routes;
