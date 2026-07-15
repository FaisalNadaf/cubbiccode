/**
 * One metadata builder for every page.
 *
 * Each page passes its title, description, keywords and canonical path; this
 * fills in the rest (canonical URL, Open Graph, Twitter card, robots hints) so
 * no page can ship with a missing canonical or a duplicate social card.
 *
 * @format
 */

import type { Metadata } from "next";
import { site } from "@/content/site";

/** 1200×630 is what OG scrapers want; the logo is what we have. */
const OG_IMAGE = "/brand/logo.png";

/** Keywords every page inherits, on top of its own. */
const BASE_KEYWORDS = [
	"Cubiccode",
	"Cubiccode Digital Media LLP",
	"web development company in Belgaum",
	"website designing company in Belgaum",
	"web development company in Karnataka",
	"web development company in India",
	"ISO 9001:2015 certified web development company",
];

export const absoluteUrl = (path: string) =>
	path === "/" ? site.url : `${site.url}${path}`;

export type PageMeta = {
	/** Full <title>, written out in the legacy keyword-first house style. */
	title: string;
	description: string;
	/** Canonical path, e.g. routes.about — always starts with "/". */
	path: string;
	keywords?: string[];
};

export function buildMetadata({
	title,
	description,
	path,
	keywords = [],
}: PageMeta): Metadata {
	const url = absoluteUrl(path);
	return {
		title,
		description,
		keywords: [...keywords, ...BASE_KEYWORDS],
		alternates: { canonical: url },
		openGraph: {
			type: "website",
			locale: "en_IN",
			url,
			siteName: site.legalName,
			title,
			description,
			images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: site.legalName }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [OG_IMAGE],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
	};
}

/* ----------------------------------------------------------------------- */
/* JSON-LD                                                                  */
/* ----------------------------------------------------------------------- */

/** Belagavi HQ — the address Google should attach the business to. */
const hq = site.offices.find((o) => o.id === "registered") ?? site.offices[0];

export function organizationJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${site.url}/#organization`,
		name: site.legalName,
		alternateName: site.name,
		url: site.url,
		logo: absoluteUrl("/brand/logo.png"),
		image: absoluteUrl(OG_IMAGE),
		description: site.metaDescription,
		email: site.email,
		telephone: site.phones,
		foundingDate: String(site.founded),
		areaServed: "IN",
		priceRange: "$$",
		address: {
			"@type": "PostalAddress",
			streetAddress: hq.lines.slice(0, -1).join(", "),
			addressLocality: "Belagavi",
			addressRegion: "Karnataka",
			addressCountry: "IN",
		},
		hasCredential: site.certification,
		sameAs: Object.values(site.socials),
	};
}

export function websiteJsonLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${site.url}/#website`,
		url: site.url,
		name: site.legalName,
		publisher: { "@id": `${site.url}/#organization` },
		inLanguage: "en-IN",
	};
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}

export function serviceJsonLd({
	name,
	description,
	path,
}: {
	name: string;
	description: string;
	path: string;
}) {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name,
		description,
		url: absoluteUrl(path),
		serviceType: name,
		provider: { "@id": `${site.url}/#organization` },
		areaServed: [
			{ "@type": "City", name: "Belagavi" },
			{ "@type": "City", name: "Bengaluru" },
			{ "@type": "Country", name: "India" },
		],
	};
}
