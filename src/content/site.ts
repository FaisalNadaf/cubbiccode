/** @format */

// Authentic Cubiccode company data  extracted from the existing cubiccode.in site.

import { recognitions } from "./company";
import { capabilities } from "./capabilities";
import { industries } from "./industries";
import { routes } from "@/lib/routes";

/** Canonical URL for a capability / industry, by its internal id. Throws at
 *  build time on a typo rather than shipping a dead nav link. */
const capPath = (slug: string) => {
	const c = capabilities.find((x) => x.slug === slug);
	if (!c) throw new Error(`nav: unknown capability "${slug}"`);
	return c.path;
};
const indPath = (slug: string) => {
	const i = industries.find((x) => x.slug === slug);
	if (!i) throw new Error(`nav: unknown industry "${slug}"`);
	return i.path;
};

export type Office = {
	id: string; // stable key  legal pages reference the "registered" office by id
	label: string;
	lines: string[];
	map: string; // "get directions" link
	coords?: { lat: number; lng: number }; // present → embedded map by pin, else by address
};

export const site = {
	name: "Cubiccode",
	legalName: "Cubiccode Digital Media LLP",
	certification: "ISO 9001:2015 Certified",
	founded: 2016,
	tagline:
		"We build websites and web apps that don't just look good they drive traffic and sales.",
	description:
		"Cubiccode Digital Media LLP is a full-stack ITES company with nearly a decade of expertise building websites, web applications, custom ERP, SEO and workflow automation for 500+ clients across India. Engineered in India, delivered on time.",
	metaDescription:
		"Cubiccode is a 5x-awarded, ISO 9001:2015 certified web development company with 700+ projects and 500+ clients. Websites, web apps, custom ERP, automation & SEO engineered in India, delivered on time.",
	url: "https://cubiccode.in",
	educationUrl: "https://cubiccode.org",
	email: "biz@cubiccode.in",
	emails: ["biz@cubiccode.in", "sales@cubiccode.org"],
	/** Applications go here, with `email` copied in. */
	hrEmail: "hr@cubiccode.org",
	phones: ["+91 91081 01795", "+91 80502 03399", "+91 91871 10657"],
	primaryPhoneRaw: "+919108101795",
	whatsapp: "https://api.whatsapp.com/send?phone=+919108101795",
	whatsappShort: "https://wa.link/qzlm1j",
	/** The Google Maps place pin — drops you on the business, not on a search
	 *  results page the way the office `map` query links do. Used by the floating
	 *  contact dock, where the tap has to land somewhere unambiguous. */
	mapShort: "https://maps.app.goo.gl/88ACjAZE8rhZij3R6",
	proposalCta: routes.contact,
	socials: {
		linkedin: "https://www.linkedin.com/company/cubiccode/mycompany/",
		instagram: "https://www.instagram.com/cubiccode.in/",
		youtube: "https://www.youtube.com/channel/UCinfpxrfs_N4npK7LtSup3g",
		googleBusiness: "https://g.page/cubiccode?share",
		glassdoor:
			"https://www.glassdoor.co.in/Reviews/Cubiccode-Digital-Media-Reviews-E4267180.htm",
	},
	offices: [
		{
			id: "work",
			label: "Work Office Belagavi",
			lines: [
				"75/1B, Cubiccode Office, First Floor,",
				"Besides Subhas Photo Studio,",
				"Above Bolas DryFruits, Ashoka Heights,",
				"Deshmukh Road, Tilakawadi,",
				"Belagavi, Karnataka, India 590006",
			],
			map: "https://www.google.com/maps/search/?api=1&query=Cubiccode%20Office%20Ashoka%20Heights%20Deshmukh%20Road%20Tilakawadi%20Belagavi%20590006",
		},
		{
			id: "registered",
			label: "Registered Office Belagavi",
			lines: [
				"Plot No. 60, Saraf Colony,",
				"Opp. Saraf Residency, Near Dominos Pizza,",
				"RPD Cross, Khanapur Road, Tilakwadi,",
				"Belagavi, Karnataka, India 590006",
			],
			map: "https://maps.app.goo.gl/7xSdkUUG6Ubc3VPU7",
			coords: { lat: 15.835088, lng: 74.506782 },
		},
		{
			id: "bengaluru",
			label: "Bengaluru Office",
			lines: [
				"Novel Office, MG Road,",
				"Opposite 1MG Mall,",
				"Bengaluru, Karnataka 560042",
			],
			map: "https://maps.app.goo.gl/LmYJarmyrMm8cwTy9",
			coords: { lat: 12.9756, lng: 77.6068 },
		},
	] as Office[],
};

// The legally-registered office  used verbatim on Terms & Privacy. Referenced
// by id so reordering the display list (e.g. work office first) never changes it.
export const registeredOffice =
	site.offices.find((o) => o.id === "registered") ?? site.offices[0];

export type Stat = {
	value: number;
	suffix: string;
	prefix?: string;
	label: string;
};

// Trust Bar  authoritative stat counters.
export const heroStats: Stat[] = [
	{ value: 700, suffix: "+", label: "Projects Delivered" },
	{ value: 500, suffix: "+", label: "Clients Served" },
	{ value: 1200, suffix: "+", label: "Requirements Completed" },
	{ value: 1, suffix: "M+", label: "Daily Visitors Powered" },
];

// Hero copy.
export const hero = {
	eyebrow: "ISO 9001:2015 Certified · 5x Awarded · Since 2016",
	headline:
		"We build websites and web apps that don't just look good they drive traffic and sales.",
	subheadline:
		"With 500+ clients and nearly a decade building websites and web apps, Cubiccode is recognised among the 10 Best Web Development Start-ups in India (Silicon India, 2019), named Most Outstanding Web Development Company in Karnataka (AI Global Excellence Awards, 2019), and a Silver winner for Web Application Development Company of the Year at the 16th India Digital Awards 2025. Websites, web apps, customised ERP, SEO and workflow automation engineered in India, delivered on time.",
	primaryCta: "Get a Proposal",
	secondaryCta: "Explore Our Work",
};

// Condensed, card-sized highlights derived from the subheadline  used by the
// Screen 2 floating-card collage on the homepage.
export const heroHighlights: { icon: string; text: string }[] = [
	{
		icon: "Users",
		text: "500+ clients and nearly a decade building websites & web apps.",
	},
	{
		icon: "Trophy",
		text: "Silver Web App Development Company of the Year, India Digital Awards 2025.",
	},
	{
		icon: "Award",
		text: "Top 10 Web Development Start-ups in India Silicon India, 2019.",
	},
	{
		icon: "Layers",
		text: "Websites, web apps, custom ERP, SEO & workflow automation engineered in India, delivered on time.",
	},
];

export const trustBadges = [
	"ISO 9001:2015 Certified",
	"Silicon India Top 10 Web Developers, India",
	"AI Global Excellence Award 2019",
	"Silver 16th India Digital Awards 2026",
];

export type Award = {
	image: string; // gold award badge  /images/awardsIcons/*.png
	moment: string; // proof photo / certificate  /images/Moments/*
	title: string;
	org: string;
	desc: string;
};

/**
 * Award cards for the "Why Cubiccode" row on the home page — the four flagship
 * honours, projected from the one authoritative list in `content/company.ts`.
 *
 * Derived, never retyped: this list used to be a hand-written copy and it drifted
 * badly (wrong years, certificates pinned to the wrong award). To promote or
 * demote a card, flip `featured` on the entry in `recognitions`.
 */
export const awards: Award[] = recognitions
	.filter((r) => r.featured)
	.map((r) => ({
		image: "/images/awardsIcons/a.png",
		moment: r.image,
		title: r.title,
		org: [r.org, r.year].filter(Boolean).join(" · "),
		desc: r.blurb,
	}));

export type NavLink = {
	label: string;
	href: string;
	desc?: string;
	icon?: string; // lucide-react icon name
	external?: boolean; // href points to an external site → open in a new tab
};

export type NavGroup = {
	label: string;
	href?: string;
	// mega menu columns
	columns?: { heading: string; links: NavLink[] }[];
	// simple flat menu
	links?: NavLink[];
	feature?: { title: string; text: string; href: string; cta?: string };
};

export const nav: NavGroup[] = [
	{ label: "Home", href: "/" },
	{
		label: "Who We Are",
		columns: [
			{
				heading: "The Company",
				links: [
					{
						label: "About Us",
						href: routes.about,
						desc: "Nearly a decade of building the web",
						icon: "Building2",
					},
					{
						label: "Achievements",
						href: routes.achievements,
						desc: "Awards, recognitions & press",
						icon: "Award",
					},
					{
						label: "Message From Founders",
						href: routes.founders,
						desc: "The vision behind Cubiccode",
						icon: "Quote",
					},
					{
						label: "Photo Gallery",
						href: routes.gallery,
						desc: "Nearly a decade, in photographs",
						icon: "Camera",
					},
				],
			},
			{
				heading: "Our Story",
				links: [
					{
						label: "Our Journey",
						href: routes.journey,
						desc: "2016 → today, milestone by milestone",
						icon: "Milestone",
					},
					{
						label: "Company Culture",
						href: routes.culture,
						desc: "How we think, build & ship",
						icon: "HeartHandshake",
					},
					{
						label: "Certifications",
						href: routes.certifications,
						desc: "ISO 9001:2015 & quality standards",
						icon: "BadgeCheck",
					},
				],
			},
		],
		feature: {
			title: "500+ businesses trust Cubiccode",
			text: "From local startups to Tata Sky, Asian Paints & Cognizant.",
			href: routes.about,
			cta: "Our story",
		},
	},
	{
		label: "Capabilities",
		columns: [
			{
				heading: "Build",
				links: [
					{
						label: "Website Design & Development",
						href: capPath("website-development"),
						desc: "Fast, responsive, conversion-driven sites",
						icon: "MonitorSmartphone",
					},
					{
						label: "Web Application Development",
						href: capPath("web-application-development"),
						desc: "SaaS, dashboards & portals at scale",
						icon: "AppWindow",
					},
					{
						label: "Custom ERP Software",
						href: capPath("custom-erp"),
						desc: "One source of truth for your operations",
						icon: "Boxes",
					},
				],
			},
			{
				heading: "Grow",
				links: [
					{
						label: "Workflow Automation",
						href: capPath("workflow-automation"),
						desc: "Automate the repetitive, scale the rest",
						icon: "Workflow",
					},
					{
						label: "SEO & Domain Authority",
						href: capPath("seo"),
						desc: "Rank, attract & convert organic traffic",
						icon: "TrendingUp",
					},
				],
			},
		],
		feature: {
			title: "End-to-end digital engineering",
			text: "Strategy, design, engineering & growth under one roof.",
			href: capPath("website-development"),
			cta: "Explore capabilities",
		},
	},
	{
		label: "Industries",
		columns: [
			{
				heading: "Sectors we serve",
				links: [
					{
						label: "Industries & Manufacturing",
						href: indPath("manufacturing"),
						icon: "Factory",
					},
					{
						label: "Education & Training",
						href: indPath("education"),
						icon: "GraduationCap",
					},
					{
						label: "Logistics & Transport",
						href: indPath("logistics"),
						icon: "Truck",
					},
					{
						label: "Healthcare",
						href: indPath("healthcare"),
						icon: "Stethoscope",
					},
					{
						label: "Construction & Real Estate",
						href: indPath("construction"),
						icon: "Building2",
					},
				],
			},
			{
				heading: "More sectors",
				links: [
					{ label: "SMEs", href: indPath("smes"), icon: "Store" },
					{
						label: "Retail Chains & Franchises",
						href: indPath("retail"),
						icon: "ShoppingBag",
					},
					{
						label: "HR & Staffing Agencies",
						href: indPath("staffing"),
						icon: "Users",
					},
					{
						label: "New Start-ups",
						href: indPath("startups"),
						icon: "Rocket",
					},
				],
			},
		],
		feature: {
			title: "Built for your sector",
			text: "Domain-specific workflows, not generic templates.",
			href: indPath("manufacturing"),
			cta: "See all industries",
		},
	},
	{
		label: "Work",
		columns: [
			{
				heading: "Portfolio",
				links: [
					{
						label: "Clientele",
						href: routes.clientele,
						desc: "500+ brands across India",
						icon: "Users",
					},
					{
						label: "Website Portfolio",
						href: routes.portfolio,
						desc: "42+ live websites",
						icon: "LayoutGrid",
					},
					{
						label: "Web App & ERP Case Studies",
						href: routes.caseStudies,
						desc: "Platforms running real businesses",
						icon: "LineChart",
					},
					{
						label: "SEO & AEO Results",
						href: routes.seoResults,
						desc: "Rankings & organic growth",
						icon: "TrendingUp",
					},
				],
			},
		],
		feature: {
			title: "700+ builds delivered",
			text: "Our web apps run real businesses at scale.",
			href: routes.caseStudies,
			cta: "View case studies",
		},
	},
	{
		label: "More",
		links: [
			// { label: "Become a Sales Partner", href: "/partner", desc: "Grow with us", icon: "Handshake" },
			{
				label: "Join the Team",
				href: routes.careers,
				desc: "Open roles",
				icon: "Briefcase",
			},
			{
				label: "CareerJump",
				href: "https://careerjump.co.in/",
				desc: "Career acceleration",
				icon: "Rocket",
				external: true,
			},
			{
				label: "Advanced Data Analytics",
				href: "https://dataanalyticsbelgaum.com/",
				desc: "With Generative AI",
				icon: "BarChart3",
				external: true,
			},
			{
				label: "Advanced Digital Marketing",
				href: "https://digitalmarketingbelgaum.com/",
				desc: "Performance marketing",
				icon: "Megaphone",
				external: true,
			},
			{
				// The site 301s http → https; link straight to https to skip the hop.
				label: "DevOps Engineering",
				href: "https://devops.cubiccode.in/",
				desc: "Docker, Kubernetes & AWS",
				icon: "GitBranch",
				external: true,
			},
			{
				label: "Full Stack Web Development",
				href: "https://fullstackweb.cubiccode.in/",
				desc: "Job-oriented course",
				icon: "Layers",
				external: true,
			},
			{
				label: "GDG Belgaum",
				href: "https://gdg.community.dev/gdg-belgaum/",
				desc: "Google Developer Group",
				icon: "Code2",
				external: true,
			},
		],
	},
	// { label: "Contact", href: "/contact" },
];
