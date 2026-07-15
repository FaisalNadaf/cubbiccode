/**
 * Title, description, keywords and canonical path for every static page.
 *
 * Written in the house style carried over from the legacy site: the primary
 * keyword phrase first, then the location, then the legal name and the ISO
 * certification. Titles are long on purpose — Google truncates the tail in the
 * SERP but still reads it, and these are the phrases the business ranks for.
 *
 * Capability and industry pages build their own metadata from `content/
 * capabilities.ts` and `content/industries.ts`.
 *
 * @format
 */

import type { PageMeta } from "@/lib/seo";
import { routes, type RouteKey } from "@/lib/routes";

export const pageSeo: Record<RouteKey, PageMeta> = {
	home: {
		path: routes.home,
		title:
			"Best Website and WebApps Designing and Development Company in Belgaum and Bangalore, Karnataka, India - Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company.",
		description:
			"ISO 9001:2015 certified website designing, web application and custom ERP development company in Belgaum and Bangalore, Karnataka, India. 700+ projects, 500+ clients, delivered on time.",
		keywords: [
			"best website development company in Belgaum",
			"web app development company in Bangalore",
			"custom ERP software company in Karnataka",
			"top 10 website developers in India",
		],
	},
	about: {
		path: routes.about,
		title:
			"About Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company - Top Web Designing and Development Company in Belgaum - Top Digital Marketing Company in Belgaum and Bangalore, Karnataka, India",
		description:
			"Founded in 2016 in Belagavi, Cubiccode Digital Media LLP is a full-stack ITES company serving 500+ clients across India with websites, web apps, custom ERP, SEO and automation.",
		keywords: [
			"about Cubiccode Digital Media LLP",
			"top web designing company in Belgaum",
			"IT company in Belagavi",
		],
	},
	achievements: {
		path: routes.achievements,
		title:
			"Awards and Achievements - Top 10 Best Website Developers in India - Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company.",
		description:
			"5x awarded: Silicon India Top 10 Web Development Start-ups in India, AI Global Excellence Award and Silver at the 16th India Digital Awards 2025. Every honour Cubiccode has won.",
		keywords: [
			"award winning web development company India",
			"top 10 web development startups in India",
			"best web app development company award",
		],
	},
	founders: {
		path: routes.founders,
		title:
			"Founders of Cubiccode Digital Media LLP - Top Website and Web Application Development Company in Belgaum, Karnataka, India",
		description:
			"Meet the founders behind Cubiccode Digital Media LLP, the ISO 9001:2015 certified team building websites, web applications and custom ERP from Belgaum and Bangalore since 2016.",
		keywords: [
			"founders of Cubiccode",
			"web development company founders Belgaum",
		],
	},
	journey: {
		path: routes.journey,
		title:
			"Our Journey Since 2016 - Cubiccode Digital Media LLP - ISO 9001:2015 Certified Web Development Company in Belgaum, Karnataka, India",
		description:
			"From a small studio in Belagavi to 700+ projects and 500+ clients across India. The milestones behind nearly a decade of Cubiccode Digital Media LLP.",
		keywords: ["Cubiccode journey", "web development company since 2016"],
	},
	culture: {
		path: routes.culture,
		title:
			"Life at Cubiccode - Company Culture of the Top Web Designing and Development Company in Belgaum, Karnataka, India",
		description:
			"The people, moments and everyday culture behind nearly a decade of on-time, customer-centric delivery at Cubiccode Digital Media LLP, Belgaum and Bangalore.",
		keywords: ["life at Cubiccode", "IT company culture Belgaum"],
	},
	certifications: {
		path: routes.certifications,
		title:
			"ISO 9001:2015 Certified Web Designing and Development Company in Belgaum, Karnataka, India - Cubiccode Digital Media LLP",
		description:
			"Cubiccode Digital Media LLP is ISO 9001:2015 certified with every legal registration in place. An audited quality management system stands behind every website and web app we ship.",
		keywords: [
			"ISO 9001:2015 certified web development company",
			"certified website development company in Karnataka",
		],
	},
	gallery: {
		path: routes.gallery,
		title:
			"Photo Gallery - Life at Cubiccode Digital Media LLP - ISO 9001:2015 Certified Web Development Company in Belgaum, Karnataka, India",
		description:
			"Photographs from life at Cubiccode Digital Media LLP: the team, the milestones, the award nights and the community events, from our Belgaum and Bangalore offices.",
		keywords: [
			"Cubiccode photo gallery",
			"life at Cubiccode Belgaum",
			"IT company team photos Belagavi",
		],
	},
	portfolio: {
		path: routes.portfolio,
		title:
			"Website Designing and Development Portfolio - Top 10 Best Website Developers in India - Cubiccode Digital Media LLP",
		description:
			"42+ live websites designed and developed by Cubiccode Digital Media LLP for brands across Belgaum, Bangalore and India. Explore the website design and development portfolio.",
		keywords: [
			"website development portfolio India",
			"website designing portfolio Belgaum",
			"best website designers in Karnataka",
		],
	},
	caseStudies: {
		path: routes.caseStudies,
		title:
			"Web Application Development Portfolio - Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company.",
		description:
			"Web application and custom ERP case studies from Cubiccode: platforms powering Rs 4,185M+ in transactions and Rs 250 Cr+ in assets at 99.99% uptime, engineered in India.",
		keywords: [
			"web application development portfolio",
			"custom ERP case studies India",
			"web app development company Belgaum",
		],
	},
	clientele: {
		path: routes.clientele,
		title:
			"Our Clientele - 500+ Brands Across India Trust Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company.",
		description:
			"From Tata Sky, Reliance and Cognizant to fast-growing startups, 500+ businesses across India trust Cubiccode Digital Media LLP for websites, web applications, ERP and SEO.",
		keywords: [
			"Cubiccode clients",
			"trusted web development company in India",
		],
	},
	seoResults: {
		path: routes.seoResults,
		title:
			"SEO Results, Rankings and Organic Growth - Best SEO Company in Belgaum and Bangalore, Karnataka, India - Cubiccode Digital Media LLP",
		description:
			"Real ranking and organic-traffic results from Cubiccode's SEO clients. See how the best SEO company in Belgaum, Karnataka grows domain authority, traffic and qualified leads.",
		keywords: [
			"best SEO company in Belgaum",
			"SEO results and rankings",
			"SEO agency Karnataka India",
		],
	},
	contact: {
		path: routes.contact,
		title:
			"Contact Details of Cubiccode Digital Media LLP - ISO 9001:2015 Certified Company - Top Developers and Designers in Belgaum, Karnataka, India",
		description:
			"Contact Cubiccode Digital Media LLP about your website, web app, ERP or SEO project. Call, email or WhatsApp us, or visit our Belgaum and Bangalore offices. We reply within a day.",
		keywords: [
			"contact Cubiccode Digital Media LLP",
			"web development company contact Belgaum",
			"website designers near me Belgaum",
		],
	},
	careers: {
		path: routes.careers,
		title:
			"Careers - Join the Team at Cubiccode Digital Media LLP - Top Web Development Company in Belgaum, Karnataka, India",
		description:
			"Open roles at Cubiccode Digital Media LLP, Belgaum. Join an ISO 9001:2015 certified, 5x-awarded team with 700+ projects and 500+ clients across India.",
		keywords: [
			"web developer jobs in Belgaum",
			"IT jobs Belagavi Karnataka",
			"careers at Cubiccode",
		],
	},
	partner: {
		path: routes.partner,
		title:
			"Become a Sales Partner - Cubiccode Digital Media LLP - ISO 9001:2015 Certified Web Development Company in Belgaum, Karnataka, India",
		description:
			"Partner with Cubiccode Digital Media LLP and earn by referring website, web application, ERP and SEO projects, backed by 700+ builds and 500+ happy clients.",
		keywords: [
			"web development sales partner India",
			"IT reseller partner program Karnataka",
		],
	},
	gdg: {
		path: routes.gdg,
		title:
			"GDG Belgaum - Google Developer Group Community - Cubiccode Digital Media LLP",
		description:
			"Cubiccode backs GDG Belgaum, the Google Developer Group community in Belgaum, Karnataka. Talks, meetups and hands-on sessions for developers across the region.",
		keywords: ["GDG Belgaum", "Google Developer Group Belgaum Karnataka"],
	},
	careerjump: {
		path: routes.careerjump,
		title:
			"CareerJump - Career Acceleration Program in Belgaum, Karnataka, India - Cubiccode Digital Media LLP",
		description:
			"CareerJump by Cubiccode is an industry-led career acceleration program in Belgaum, Karnataka that turns students and freshers into job-ready technology professionals.",
		keywords: [
			"CareerJump Belgaum",
			"career acceleration program Karnataka",
			"placement training Belgaum",
		],
	},
	dataAnalytics: {
		path: routes.dataAnalytics,
		title:
			"Advanced Data Analytics with Generative AI Course in Belgaum and Bangalore, Karnataka, India - Cubiccode Digital Media LLP",
		description:
			"Learn advanced data analytics with Generative AI in Belgaum, Karnataka. A hands-on, industry-led program from the ISO 9001:2015 certified team at Cubiccode Digital Media LLP.",
		keywords: [
			"data analytics course in Belgaum",
			"generative AI training Karnataka",
			"data analytics classes Belagavi",
		],
	},
	digitalMarketing: {
		path: routes.digitalMarketing,
		title:
			"Advanced Digital Marketing Course in Belgaum and Bangalore, Karnataka, India - Cubiccode Digital Media LLP",
		description:
			"Master SEO, performance marketing and social media with Cubiccode's advanced digital marketing training in Belgaum, Karnataka, taught by practitioners running live campaigns.",
		keywords: [
			"digital marketing course in Belgaum",
			"SEO training Karnataka",
			"digital marketing classes Belagavi",
		],
	},
	terms: {
		path: routes.terms,
		title: "Terms and Conditions - Cubiccode Digital Media LLP",
		description:
			"The terms and conditions governing the use of cubiccode.in and the services provided by Cubiccode Digital Media LLP, Belgaum, Karnataka, India.",
	},
	privacy: {
		path: routes.privacy,
		title: "Privacy Policy - Cubiccode Digital Media LLP",
		description:
			"How Cubiccode Digital Media LLP collects, uses and protects the personal information you share with us. Belgaum and Bangalore, Karnataka, India.",
	},
};
