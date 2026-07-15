/** @format */

export type WebsiteProject = {
	name: string;
	url: string;
	category: "Website" | "E-commerce" | "Web App" | "Education" | "Healthcare";
};

// Featured projects with real local screenshots in /public/images/portfolio
export const featuredProjects: (WebsiteProject & {
	image: string;
	blurb: string;
})[] = [
	{
		name: "Harsha & Rakesh Salon",
		url: "harsharakesh.com",
		category: "E-commerce",
		image: "/images/portfolio/harsharakes.jpg",
		blurb:
			"An elegant booking-first experience with online ordering, gift cards and a polished mobile flow.",
	},
	{
		name: "Madhtara",
		url: "madhtara.com",
		category: "E-commerce",
		image: "/images/portfolio/madhtara.jpg",
		blurb:
			"A refined 925-silver jewellery storefront collection-led merchandising, tactile product galleries and a checkout tuned to convert.",
	},{
		name: "The School Excel",
		url: "theschoolexcel.com",
		category: "Education",
		image: "/images/portfolio/theschoolexce.jpeg",
		blurb:
			"A modern school website warm storytelling, clear admissions pathways and parent-friendly information architecture.",
	},
	{
		name: "Positron",
		url: "positron-he.com",
		category: "Website",
		image: "/images/portfolio/positron.jpeg",
		blurb:
			"A heat-transfer engineering site that turns complex thermal-management capability into a clear, credible story.",
	},
	{
		name: "Foraam",
		url: "foraam.com",
		category: "E-commerce",
		image: "/images/portfolio/FORAAM.jpg",
		blurb:
			"An ethnic-wear label brought online editorial lookbooks, rich product styling and a frictionless, mobile-first checkout.",
	},
	{
		name: "Simple",
		url: "simple.life",
		category: "Website",
		image: "/images/portfolio/simple.lif.jpeg",
		blurb:
			"A clean, modern lifestyle brand site minimal by design, fast to load and built to make a confident first impression.",
	},

	{
		name: "23DC Architects",
		url: "23dcarchitects.com",
		category: "Website",
		image: "/images/portfolio/23dcarchitects.jpg",
		blurb:
			"A premium architecture and interior design studio online cinematic project galleries, refined editorial layouts and a calm visual system that puts the built work front and centre.",
	},
	{
		name: "Mabda Global",
		url: "mabdaglobal.com/en",
		category: "Website",
		image: "/images/portfolio/MabdaGroup.jpg",
		blurb:
			"A B2B supply-chain brand site that positions a global industrial trade network with clarity, authority and trust.",
	},
	{
		name: "Prions Biotech",
		url: "prionsbiotech.com",
		category: "Website",
		image: "/images/portfolio/prionsbiotec.jpg",
		blurb:
			"A research-grade brand site with a fast, content-driven catalogue and a clean, publication-ready visual system.",
	},
	{
		name: "RareU",
		url: "rareu.in",
		category: "E-commerce",
		image: "/images/portfolio/RAREU.jpg",
		blurb:
			"A premium streetwear drop-shop bold visual identity, immersive product pages and a checkout built for launch-day rushes.",
	},
	{
		name: "Avenore Events",
		url: "avenoreevents.com",
		category: "Website",
		image: "/images/portfolio/avenoreevent.jpeg",
		blurb:
			"A premium events brand brought to life cinematic galleries, service storytelling and enquiry flows that turn browsers into bookings.",
	},
	{
		name: "Creintors",
		url: "creintors.com",
		category: "Website",
		image: "/images/portfolio/creintors.jpg",
		blurb:
			"A multi-division engineering group site hydraulics, environmental and automation unified under one clean corporate system.",
	},

	{
		name: "Julrey",
		url: "julrey.com",
		category: "E-commerce",
		image: "/images/portfolio/julre.jpeg",
		blurb:
			"A jewellery label online curated collections, rich product close-ups and a smooth, trust-building shopping flow.",
	},
	{
		name: "The Silver Ora",
		url: "thesilverora.com",
		category: "E-commerce",
		image: "/images/portfolio/thesilveror.jpeg",
		blurb:
			"A 925-silver jewellery boutique elegant collection browsing, certified-purity trust cues and a frictionless mobile checkout.",
	},
	{
		name: "IMA Curve",
		url: "imacurve.com",
		category: "E-commerce",
		image: "/images/portfolio/IMACURVE.jpg",
		blurb:
			"A women's streetwear store with high-energy merchandising, quick browsing and a conversion-first mobile checkout.",
	},
	{
		name: "FORCE Scholar",
		url: "forcescholar.com",
		category: "Education",
		image: "/images/portfolio/forcescholar.png",
		blurb:
			"The Foundation of Research in Careers & Education online a career exploration lab for high-school students, built around discovery calls and a clear path into the programme.",
	},
	{
		name: "Woodpecker Exotica",
		url: "woodpeckerexotica.com",
		category: "Website",
		image: "/images/portfolio/woodpeckerexotic.jpg",
		blurb:
			"An immersive resort experience cinematic imagery, smooth scroll storytelling and frictionless enquiries.",
	},
	{
		name: "Aishwarya Cottons",
		url: "aishwaryacottons.com",
		category: "E-commerce",
		image: "/images/portfolio/aishwaryacotton.jpg",
		blurb:
			"A conversion-focused storefront with rich merchandising, instant search and a checkout built to sell.",
	},

	{
		name: "Ankur Jewels",
		url: "ankurjewels.com",
		category: "E-commerce",
		image: "/images/portfolio/AnkurJewels.jpg",
		blurb:
			"A traditional-meets-modern jewellery store with curated collections, price-point filtering and a smooth, trust-building checkout.",
	},
	{
		name: "Kiramee",
		url: "kirameejewel.com",
		category: "E-commerce",
		image: "/images/portfolio/Kiramee.jpg",
		blurb:
			"A luxe lab-grown diamond boutique with custom-design journeys, certified-purity trust badges and an elegant shopping flow.",
	},

	{
		name: "Sassy Kids",
		url: "sassykids.in",
		category: "E-commerce",
		image: "/images/portfolio/SassyKids.jpg",
		blurb:
			"A playful kids-fashion storefront with vibrant merchandising, fast catalogue browsing and a parent-friendly checkout.",
	},
	{
		name: "Kajal Agrawal",
		url: "kajalagrawal.com",
		category: "E-commerce",
		image: "/images/portfolio/KajalAgrawal.jpg",
		blurb:
			"A handcrafted-fashion brand site that tells the story behind every weave, pairing editorial design with a clean commerce flow.",
	},
	{
		name: "Dimensions Verse",
		url: "dimensionsverse.com",
		category: "E-commerce",
		image: "/images/portfolio/dimensionsverse.jpg",
		blurb:
			"A modern retail storefront built on a fast, scalable commerce stack designed to launch clean and grow.",
	},

	{
		name: "Topex Enterprise",
		url: "topexenterprise.com",
		category: "Website",
		image: "/images/portfolio/TopEXEnterprise.jpg",
		blurb:
			"A one-stop industrial-supply brand site structured product categories, brand credibility and clear enquiry paths.",
	},

	{
		name: "Scheppers",
		url: "scheppers.in",
		category: "Website",
		image: "/images/portfolio/schepper.jpg",
		blurb:
			"An engineering and infrastructure group told as one story service divisions, group companies and clientele under a single, confident corporate system.",
	},

	{
		name: "Prithvi Metals",
		url: "prithvimetals.com",
		category: "Website",
		image: "/images/portfolio/prithvimetal.jpg",
		blurb:
			"A precision-engineering site for a Tier-2 Indian Defence supplier machining and surface-treatment capability laid out industry by industry, with the credibility a BrahMos-programme partner has to project.",
	},

	{
		name: "Prasad Engineering",
		url: "prasadengineering.in",
		category: "Website",
		image: "/images/portfolio/prasadengineerin.jpg",
		blurb:
			"An ISO-certified aluminium casting and engineering manufacturer, with capability, industries and quality systems put in front of export-ready buyers heading straight for a quote.",
	},

	{
		name: "Roshni Boutique",
		url: "roshniboutiques.com",
		category: "E-commerce",
		image: "/images/portfolio/roshniboutique.jpg",
		blurb:
			"A women-owned ethnic-wear boutique online occasion-led collections, inclusive plus-size ranges, pre-orders and a wholesale enquiry path running alongside the retail checkout.",
	},
];

// Full live website portfolio (44 projects) from cubiccode.in
export const websiteProjects: WebsiteProject[] = [
	{ name: "Scheppers", url: "scheppers.in", category: "Website" },
	{
		name: "Prasad Engineering",
		url: "prasadengineering.in",
		category: "Website",
	},
	{ name: "FORCE Scholar", url: "forcescholar.com", category: "Education" },
	{ name: "Prions Biotech", url: "prionsbiotech.com", category: "Website" },
	{ name: "Avenore Events", url: "avenoreevents.com", category: "Website" },
	{ name: "BridgeNow", url: "bridge-now.de", category: "Website" },
	{
		name: "The School Excel",
		url: "theschoolexcel.com",
		category: "Education",
	},
	{ name: "Simple", url: "simple.life", category: "Website" },
	{
		name: "Harsha & Rakesh Salon",
		url: "harsharakesh.com",
		category: "E-commerce",
	},
	{ name: "Roupa Mood Shop", url: "moodshop.pt", category: "E-commerce" },
	{
		name: "Woodpecker Exotica",
		url: "woodpeckerexotica.com",
		category: "Website",
	},
	{
		name: "Dr. Sanjay Porwal",
		url: "drsanjayporwal.com",
		category: "Healthcare",
	},
	{ name: "Cleancode", url: "cleancode.club", category: "Website" },
	{
		name: "Roshni Boutique",
		url: "roshniboutiques.com",
		category: "E-commerce",
	},
	{ name: "JD Group India", url: "jdgroupindia.com", category: "Website" },
	{ name: "Aroma Galaxy", url: "aromagalaxy.in", category: "E-commerce" },
	{
		name: "Heramb Enterprises",
		url: "herambenterprises.in",
		category: "Website",
	},
	{ name: "Fintree Advisors", url: "fintreeadvisors.com", category: "Website" },
	{ name: "SBGAMCH", url: "sbgamch.org", category: "Healthcare" },
	{
		name: "Universal Traders India",
		url: "universaltradersindia.com",
		category: "Website",
	},
	{
		name: "Aishwarya Cottons",
		url: "aishwaryacottons.com",
		category: "E-commerce",
	},
	{
		name: "Kamadhenu School",
		url: "kamadhenuschool.in",
		category: "Education",
	},
	{ name: "Topex Enterprise", url: "topexenterprise.com", category: "Website" },
	{ name: "Mustash Events", url: "mostashevents.com", category: "Website" },
	{ name: "AXIOM Solutions", url: "axiom-india.in", category: "Website" },
	{
		name: "Modular InfoTech (Singapore)",
		url: "modular-infotech.com.sg",
		category: "Website",
	},
	{ name: "New India Metals", url: "newindiametals.com", category: "Website" },
	{ name: "Meet and Greet", url: "meetandgreet.life", category: "Website" },
	{ name: "Prithvi Metals", url: "prithvimetals.com", category: "Website" },
	{ name: "Synapsis Techno", url: "synapsistechno.in", category: "Website" },
	{
		name: "People Tree College",
		url: "peopletreecollege.com",
		category: "Education",
	},
	{ name: "Salgaocar Law Review", url: "theslr.com", category: "Website" },
	{
		name: "Jambagi PU College",
		url: "jambagipucollege.com",
		category: "Education",
	},
	{ name: "DevFest Belgaum", url: "devfestbelgaum.in", category: "Website" },
	{
		name: "Indus Nepal Rudraksha",
		url: "indusnepalrudraksha.com",
		category: "E-commerce",
	},
	{
		name: "Planet Hydraulics",
		url: "planethydraulics.com",
		category: "Website",
	},
	{ name: "Creative Miura", url: "creativemiura.com", category: "Website" },
	{ name: "P-XR.CH", url: "p-xr.ch", category: "Website" },
	{ name: "BL Sciences", url: "blsciences.com", category: "Healthcare" },
	{
		name: "Akshar Vidya Vihar",
		url: "aksharvidyavihar.com",
		category: "Education",
	},
	{
		name: "Jijamata Mahila Bank",
		url: "jijamatamahilabank.co.in",
		category: "Website",
	},
	{ name: "Jagvin", url: "jagvin.com", category: "Website" },
	{
		name: "United Educators Foundation",
		url: "uefindia.in",
		category: "Education",
	},
	{ name: "Dandeli Jungle Edge", url: "dandeliresort.in", category: "Website" },
];

export type CaseStat = {
	icon: string; // lucide-react icon name
	value?: string; // headline metric (e.g. "₹250 Cr+"); omit for a qualitative capability
	label: string; // short descriptor
};

export type CaseStudy = {
	slug: string;
	name: string;
	category: string;
	tagline: string;
	/** Product screenshot. Intrinsic dimensions travel with the src so the panel
	 *  can render each shot whole  the crops differ per platform, so a shared
	 *  aspect box would either cut UI off or letterbox it. */
	image?: { src: string; width: number; height: number };
	stats: CaseStat[];
	link: string;
};

// Web App & ERP case studies with real production metrics
export const caseStudies: CaseStudy[] = [
	{
		slug: "trader-portfolio-system",
		name: "Trader Portfolio System",
		category: "FinTech · Portfolio Management",
		tagline:
			"A ₹250 Cr+ portfolio management platform for traders and investment firms, with monthly payout automation.",
		image: {
			src: "/images/portfolio/TraderPortfolioSystem-clea.jpg",
			width: 1200,
			height: 655,
		},
		stats: [
			{ icon: "Landmark", value: "₹250 Cr+", label: "Assets under management" },
			{ icon: "Users", value: "3,500+", label: "Clients served" },
			{ icon: "Banknote", value: "₹5 Cr+", label: "Monthly payouts" },
			{ icon: "Server", label: "Core business platform" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
	{
		slug: "event-ticket-hub",
		name: "Event Ticket Hub",
		category: "Marketplace · Ticketing",
		tagline:
			"A scalable ticket selling & reselling platform handling thousands of concurrent users and high transaction volume.",
		image: {
			src: "/images/portfolio/EventTicketHub-clea.jpg",
			width: 1200,
			height: 689,
		},
		stats: [
			{ icon: "Ticket", value: "10K+", label: "Listings / month" },
			{ icon: "IndianRupee", value: "₹1.5 Cr+", label: "Monthly transactions" },
			{ icon: "ShieldCheck", value: "20K+", label: "Secure payments" },
			{ icon: "Activity", value: "99.99%", label: "Platform uptime" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
	{
		slug: "global-hiring-hub",
		name: "Global Hiring Hub",
		category: "HR Tech · Cross-border Hiring",
		tagline:
			"A smart job portal sourcing nursing staff for German clinics, processing thousands of verified applications.",
		image: {
			src: "/images/portfolio/GlobalHiringHub-clea.jpg",
			width: 1200,
			height: 819,
		},
		stats: [
			{ icon: "FileCheck", value: "5,000+", label: "Verified applications" },
			{ icon: "Building2", value: "100+", label: "German clinics" },
			{ icon: "FileText", value: "1,500+", label: "Applications / month" },
			{ icon: "Timer", value: "60%", label: "Faster employer review" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
	{
		slug: "student-branch-management",
		name: "Student & Branch Management",
		category: "EdTech · Multi-center ERP",
		tagline:
			"An end-to-end management platform for an expanding education brand across 30+ centers.",
		image: {
			src: "/images/portfolio/EdTechMulti-centerERP-clea.jpg",
			width: 1200,
			height: 655,
		},
		stats: [
			{ icon: "Building2", value: "30+", label: "Active centers" },
			{ icon: "GraduationCap", value: "1,000+", label: "Students / month" },
			{ icon: "ReceiptText", label: "Automated fee tracking & reminders" },
			{ icon: "QrCode", label: "QR-verified certificates" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
	{
		slug: "industrial-inventory-platform",
		name: "Industrial Inventory & Field Service",
		category: "Industrial · ERP",
		tagline:
			"A custom industrial service & inventory platform with full travel and allowance visibility.",
		image: {
			src: "/images/portfolio/ERPIndustrialInventory-clea.jpg",
			width: 1200,
			height: 655,
		},
		stats: [
			{ icon: "Wrench", value: "5,000+", label: "Service visits / year" },
			{ icon: "Package", label: "Inventory movements tracked" },
			{ icon: "Route", label: "Travel & allowance visibility" },
			{ icon: "LayoutDashboard", label: "Real-time dashboards" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
	{
		slug: "crypto-mlm-platform",
		name: "Crypto Payments Platform",
		category: "Web3 · Payments",
		tagline:
			"A scalable MLM platform with crypto payments, ROI tracking and a referral commission engine.",
		image: {
			src: "/images/portfolio/Web3Payments-clea.jpg",
			width: 1200,
			height: 655,
		},
		stats: [
			{ icon: "Users", value: "3,000+", label: "Users onboarded" },
			{ icon: "Coins", value: "₹7.5 Cr+", label: "Crypto investments" },
			{ icon: "Banknote", value: "₹1.7 Cr+", label: "ROI & commissions paid" },
			{ icon: "Repeat", value: "15K+", label: "Commission transactions" },
		],
		link: "https://www.linkedin.com/company/cubiccode/",
	},
];
