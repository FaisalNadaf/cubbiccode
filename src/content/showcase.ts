/** @format */

/**
 * Slide data for the premium showcase carousel.
 * Images reference real screenshots already in /public/images/portfolio.
 */
export type ShowcaseSlide = {
	id: string;
	eyebrow: string;
	title: string;
	description: string;
	cta: { label: string; href: string };
	image: string;
};

const P = "/images/portfolio";

export const showcaseSlides: ShowcaseSlide[] = [
	{
		id: "prions-biotech",
		eyebrow: "Website · Biotech",
		title: "Prions Biotech",
		description:
			"A research-grade brand site with a fast, content-driven catalogue and a publication-ready visual system.",
		cta: { label: "Visit site", href: "https://prionsbiotech.com" },
		image: `${P}/prions-biotech.jpg`,
	},
	{
		id: "woodpecker-exotica",
		eyebrow: "Website · Hospitality",
		title: "Woodpecker Exotica",
		description:
			"An immersive resort experience  cinematic imagery, smooth scroll storytelling and frictionless enquiries.",
		cta: { label: "Visit site", href: "https://woodpeckerexotica.com" },
		image: `${P}/woodpecker-exotic.jpg`,
	},
	{
		id: "aishwarya-cottons",
		eyebrow: "E-commerce · Retail",
		title: "Aishwarya Cottons",
		description:
			"A conversion-focused storefront with rich merchandising, instant search and a checkout built to sell.",
		cta: { label: "Visit site", href: "https://aishwaryacottons.com" },
		image: `${P}/aishwarya-cottons.png`,
	},
	{
		id: "city-index",
		eyebrow: "Web App · FinTech",
		title: "CityIndex Investment",
		description:
			"A data-dense investment platform with real-time dashboards, secure portals and automated reporting.",
		cta: { label: "View project", href: "https://cityindexinvestment.com" },
		image: `${P}/city-index.jpg`,
	},
	{
		id: "laxis-analytics",
		eyebrow: "Website · SaaS",
		title: "Laxis Analytics",
		description:
			"A crisp product marketing site that turns a complex analytics suite into a clear, compelling story.",
		cta: { label: "Visit site", href: "https://laxisanalytics.com" },
		image: `${P}/laxis-analytics.jpg`,
	},
	{
		id: "harsha-rakesh",
		eyebrow: "E-commerce · Beauty",
		title: "Harsha & Rakesh Salon",
		description:
			"An elegant booking-first experience with online ordering, gift cards and a polished mobile flow.",
		cta: { label: "Visit site", href: "https://harsharakesh.com" },
		image: `${P}/harsha-rakesh.jpg`,
	},
	{
		id: "trader-portfolio",
		eyebrow: "Platform · FinTech",
		title: "Trader Portfolio System",
		description:
			"A ₹250 Cr+ portfolio management platform serving 3,500+ clients with automated monthly payouts.",
		cta: { label: "Learn more", href: "https://www.linkedin.com/company/cubiccode/" },
		image: `${P}/city-index.jpg`,
	},
	{
		id: "event-ticket-hub",
		eyebrow: "Marketplace · Ticketing",
		title: "Event Ticket Hub",
		description:
			"A high-throughput ticketing marketplace handling ₹1.5 Cr+ monthly transactions at 99.99% uptime.",
		cta: { label: "Learn more", href: "https://www.linkedin.com/company/cubiccode/" },
		image: `${P}/laxis-analytics.jpg`,
	},
	{
		id: "global-hiring-hub",
		eyebrow: "Platform · HR Tech",
		title: "Global Hiring Hub",
		description:
			"A cross-border hiring portal sourcing nursing staff for 100+ German clinics from verified applicants.",
		cta: { label: "Learn more", href: "https://www.linkedin.com/company/cubiccode/" },
		image: `${P}/prions-biotech.jpg`,
	},
	{
		id: "industrial-erp",
		eyebrow: "ERP · Industrial",
		title: "Industrial Field Service",
		description:
			"A custom inventory & field-service ERP with full travel visibility and real-time management dashboards.",
		cta: { label: "Learn more", href: "https://www.linkedin.com/company/cubiccode/" },
		image: `${P}/woodpecker-exotic.jpg`,
	},
];
