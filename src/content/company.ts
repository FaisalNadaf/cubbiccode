/** @format */

// Awards, recognitions, certifications, journey, culture values & founder story.
// Authoritative Cubiccode data.

export type Award = {
	title: string;
	org: string;
	year?: string;
	image?: string;
	kind: "Award" | "Recognition" | "Certification";
};

export const awards: Award[] = [
	{
		title: "10 Best Web Development Start-ups in India",
		org: "Silicon India",
		year: "2019",
		kind: "Recognition",
		image: "/images/certificates/india-excellence-award-certificate.jpg",
	},
	{
		title: "Most Outstanding Web Development Company in Karnataka",
		org: "AI Global Excellence Awards",
		year: "2019",
		kind: "Award",
		image: "/images/certificates/brandcounselling.jpg",
	},
	{
		title: "Silver  Web Application Development Company of the Year",
		org: "16th India Digital Awards",
		year: "2025",
		kind: "Award",
		image: "/images/certificates/business-excellence-certificate.jpg",
	},
	{
		title: "Best Website Designing & Development Company in Belgaum, Karnataka",
		org: "Regional Recognition",
		kind: "Recognition",
		image: "/images/certificates/educationale.jpg",
	},
	{
		title: "Best Youngest Digital Marketing Teacher in India",
		org: "Indian Education Awards (supported by Zee Business) · Sarvesh Kakkeri",
		year: "2019",
		kind: "Award",
		image: "/images/no.png",
	},
	{
		title: "TEDx Speaker  “A New Age Teacher”",
		org: "TEDx Stage · Co-founder Sarvesh Kakkeri",
		kind: "Recognition",
		image: "/images/no.png",
	},
	{
		title: "ISO 9001:2015 Certified Company",
		org: "Quality Management Systems",
		kind: "Certification",
		image: "/images/no.png",
	},
];

export type CertificateImage = {
	src: string;
	title: string;
	agency: string;
	description: string;
};

export const certificateImages: CertificateImage[] = [
	{
		src: "/images/certificates/Cubiccode_LLP_-_Certificate_of_Incorporation_(1)_page-0001.jpg",
		title: "Certificate of Incorporation",
		agency: "Ministry of Corporate Affairs",
		description:
			"Cubiccode Digital Media LLP, formally incorporated and registered under the LLP Act.",
	},
	{
		src: "/images/certificates/cubic_code_gst_certificate_(1)_page-0001.jpg",
		title: "GST Registration Certificate",
		agency: "Government of India",
		description:
			"Registered under the Goods & Services Tax  a fully compliant, tax-registered business.",
	},

	{
		src: "/images/certificates/Cubiccode_NGO_page-0001.jpg",
		title: "NGO Registration",
		agency: "Registered Non-Profit",
		description:
			"Our social initiative, formally registered to give back through education and community work.",
	},
	{
		src: "/images/certificates/ISO Certificate.jpeg",
		title: "ISO 9001:2015 Certified",
		agency: "Quality Management System",
		description:
			"An internationally recognised, formally audited quality management system  the backbone of our consistent, reliable delivery.",
	},
];

export type Milestone = {
	year: string;
	title: string;
	text: string;
	/** Primary photo for the journey slideshow (in /public/images/Moments). */
	image?: string;
	/** Optional secondary photo layered behind the primary for depth. */
	image2?: string;
	/** True when `image2` is a portrait document (a certificate)  renders in a taller, fully-visible frame instead of a cropped landscape one. */
	image2Certificate?: boolean;
};

// Our Journey  authoritative milestones.
export const journey: Milestone[] = [
	{
		year: "2016",
		title: "Cubiccode is founded",
		text: "Founded by Shivani Jadhav and Sarvesh Kakkeri, we began our journey from a small office with a bold vision  to deliver high-quality web solutions and become a trusted digital growth partner by helping businesses create impactful online experiences.",
		image: "/images/Moments/2016.jpeg",
		image2: "/images/Moments/1.jpg",
	},
	{
		year: "2017",
		title: "Bridging the skills gap",
		text: "We began training students in Belgaum after identifying a significant gap between academic learning and industry requirements. By bridging it with practical, industry-focused training, we trained over 100 students within our first year.",
		image: "/images/Moments/WhatsAppImage2017-10-13at10.14.12AM1.jpeg",
		image2: "/images/Moments/WhatsAppImage2017-10-13at10.14.12AM2.jpeg",
	},
	{
		year: "2018",
		title: "A teacher honoured",
		text: "We've trained numerous successful students who've gone on to build rewarding careers across industries. In recognition of his contribution to digital education, our Managing Director, Sarvesh Kakkeri, was honoured with the Best Youngest Digital Marketing Teacher in India award at the Indian Education Awards.",
		image: "/images/Moments/award-bg.jpg",
		image2: "/images/Moments/business-excellence-certificate1.jpg",
		image2Certificate: true,
	},
	{
		year: "2019",
		title: "National recognition & 250+ companies",
		text: "A major milestone  recognised among the Top 10 Web Development Start-ups of 2019 by Silicon India and awarded Most Outstanding Web Development Company 2019 – Karnataka at the AI Global Excellence Awards. The same year, we delivered web solutions to 250+ companies.",
		image: "/images/Moments/india-excellence-award-certificate1.jpg",
		image2: "/images/Moments/brandcounselling1.jpg",
		image2Certificate: true,
	},
	{
		year: "2020",
		title: "On the TEDx stage",
		text: "Sarvesh Kakkeri delivered his first TEDx Talk, sharing insights, experiences and ideas to inspire students, professionals and aspiring entrepreneurs  further strengthening our commitment to education, innovation and empowering individuals through knowledge.",
		image: "/images/Moments/2020.jpg",
		image2: "/images/Moments/DSC_5539.JPG",
	},
	{
		year: "2022",
		title: "GDG Belgaum & DevFest",
		text: "We became the organizer of the Google Developer Group Belgaum, growing it into a thriving community of 4,500+ developers. Under this leadership, DevFest 2022 became the 5th largest DevFest held in the country that year.",
		image: "/images/Moments/devfest2022_2.jpg",
		image2: "/images/Moments/EPCSCL06-GroupPicture.JPG",
	},
	{
		year: "2024",
		title: "1,000+ students trained",
		text: "Cubiccode's sister arm  the Belgaum Institute of Data Analytics and Digital Marketing with AI  had successfully trained 1,000+ students, helping learners gain practical skills and advance their careers in the technology sector.",
		image: "/images/Moments/WhatsAppImage2024-06-08at11.50.15AM.jpeg",
		image2: "/images/Moments/WhatsAppImage2024-06-08at11.50.16AM.jpeg",
	},
	{
		year: "2025",
		title: "Silver at the India Digital Awards",
		text: "Our expertise in delivering complex web applications and enterprise-grade digital solutions was recognised nationally  we won Silver in the Web Application Development Company of the Year category at the 16th India Digital Awards.",
		image: "/images/Moments/WhatsAppImage2025-11-01at6.28.58PM.jpeg",
		image2: "/images/Moments/WhatsAppImage2025-11-01at6.28.59PM.jpeg",
	},
];

export type Value = {
	icon: string;
	title: string;
	text: string;
};

// Company Culture  the twelve principles.
export const values: Value[] = [
	{
		icon: "ShieldCheck",
		title: "Ownership Over Excuses",
		text: "Take responsibility. Own the outcome. Never wait to be told twice. Solve problems.",
	},
	{
		icon: "Zap",
		title: "Speed With Excellence",
		text: "Move fast. Maintain quality. Execute with precision. Delays kill momentum.",
	},
	{
		icon: "Target",
		title: "Outcome Oriented",
		text: "Effort matters, but being busy means nothing. Results matter more. Deliver measurable impact.",
	},
	{
		icon: "BookOpen",
		title: "Curiosity & Continuous Learning",
		text: "Stay adaptable. Keep learning. Keep improving. Stay ahead.",
	},
	{
		icon: "TrendingUp",
		title: "Raise The Standard",
		text: "Good is not enough. Excellence is the expectation.",
	},
	{
		icon: "Scale",
		title: "Integrity Always",
		text: "Do the right thing  even when nobody is watching.",
	},
	{
		icon: "MessagesSquare",
		title: "Open & Honest Feedback Without Ego",
		text: "Great teams grow through direct, transparent communication.",
	},
	{
		icon: "Lightbulb",
		title: "Solution First Thinking",
		text: "Bring solutions, not just problems.",
	},
	{
		icon: "HeartHandshake",
		title: "Respect For People",
		text: "Professionalism, empathy and mutual respect at all times.",
	},
	{
		icon: "BadgeCheck",
		title: "Reliability Builds Trust",
		text: "Do what you said you would do  every single time. Commitment to your deadlines.",
	},
	{
		icon: "Compass",
		title: "Purpose Driven Work",
		text: "Understand the “why” behind everything we do.",
	},
	{
		icon: "Users",
		title: "Win Together",
		text: "Collaboration over ego. Team success over individual credit. No egos. No silos. One mission.",
	},
];

export const whyChooseUs = [
	{
		num: "01",
		title: "Proven Track Record",
		text: "With 700+ projects shipped and 500+ clients served, we bring deep experience and a proven record of delivering successful work.",
	},
	{
		num: "02",
		title: "Talented Team",
		text: "Our developers, designers and project managers are passionate about what they do and committed to excellence.",
	},
	{
		num: "03",
		title: "Affordable Quality",
		text: "Because our expertise is in-house and our teams stay lean, we deliver premium, ISO-certified work at honest, value-for-money pricing.",
	},
	{
		num: "04",
		title: "Holistic Approach",
		text: "From design and development to ERP, automation and SEO, we offer a comprehensive suite of services for every digital need.",
	},
	{
		num: "05",
		title: "Customer-Centric",
		text: "We take ownership of your outcome as if it were our own  and we won't consider the job done until the work moves your business forward.",
	},
];

// Founders.
export const founders = [
	{ name: "Sarvesh Kakkeri", role: "Co-Founder", initials: "SK" },
	{ name: "Shivani Jadhav", role: "Co-Founder", initials: "SJ" },
];

// Message from the founders.
export const founderMessage = {
	greeting: "Message from the founders",
	title: "“We built the company we wished existed when we started.”",
	names: "Sarvesh Kakkeri & Shivani Jadhav",
	role: "Co-Founders, Cubiccode Digital Media LLP",
	paragraphs: [
		"When we started Cubiccode in 2016, we kept meeting the same frustrated business owners. They'd paid for a website that didn't bring a single enquiry. They'd bought software that didn't fit how they actually worked. And too often, the agency they trusted had taken the money and vanished. Technology was supposed to grow their business, instead it had become one more problem to manage.",
		"We built Cubiccode to fix exactly that. Our approach has always started with your problem, never our tech stack: we listen first, learn how your business truly runs, and then engineer the right solution, a website that converts, a web app that scales, an ERP Software that ends the spreadsheet chaos, automation that gives your team its hours back.",
		"We also made a decision early on that we've never walked back: world-class work shouldn't come with a world-class invoice. Because our expertise is in-house and our teams stay lean, we deliver premium engineering at honest, value-for-money pricing and we deliver it on the date we promised, not “soon.” That commitment is why 500+ clients have stayed with us, referred us, and grown alongside us, and why we've shipped 700+ projects, trained over 1,000 students, stood on global stages, and been recognised across India for our work.",
		"Whether you're a hospital, a manufacturer, a start-up founder or a retail chain, our promise is the same: we'll take ownership of your outcome as if it were our own, and we won't consider the job done until the work moves your business forward. Your ambition is the reason we exist. Let's build something that matters.",
	],
	signature: " Sarvesh Kakkeri & Shivani Jadhav",
};

// About  story, vision & mission.
export const aboutCopy = {
	eyebrow: "Who we are",
	headline: "Transforming businesses with innovation since 2016.",
	intro:
		"Cubiccode Digital Media LLP is a full-stack ITES company born in Belagavi, now serving 500+ clients nationwide from offices in Belagavi and Bengaluru.",
	storyHeading: "We started with one belief: a website should earn its keep.",
	// Distilled, IT-company positioning for the About "story" band (image + ScrollReveal).
	storyStatement:
		"We're an IT company that turns ideas into software that works. Websites, web apps, custom ERP, automation and AI  we design it, build it, and ship it on time. Engineered in India, trusted by 500+ businesses.",
	storySupport:
		"From a single Belagavi office in 2016 to teams in Belagavi and Bengaluru, one obsession has never changed  building technology that moves your business forward.",
	story: [
		"Cubiccode Digital Media LLP began in 2016 as the brainchild of co-founders Sarvesh Kakkeri and Shivani Jadhav. From a small office in Belagavi, we set out with a simple, stubborn idea  that a business website shouldn't just look good, it should be fast, reliable, and built to drive real sales.",
		"That idea resonated. By 2018 we'd served 150+ clients. By 2019 we were named one of the 10 Best Web Development Start-ups in India by Silicon India and Most Outstanding Web Development Company in Karnataka at the AI Global Excellence Awards. Today, nearly a decade in, we've delivered 700+ projects, powered over a million daily visitors, and earned the trust of brands from local champions to Tata Sky, Asian Paints, Cognizant, Tech Mahindra and more.",
		"We're still that same team at heart  lean, agile, obsessed with the outcome. The office is bigger. The ambition is the same.",
	],
	vision:
		"To become a recognized digital growth company that helps businesses build powerful web experiences, dominate search and AI platforms, and generate sustainable online growth through innovative technology, web solutions, and AI-driven visibility strategies.",
	mission:
		"To deliver a wide range of quality services, creative solutions, exceptional after-sales support, and superfast on-time delivery, so that every client we serve grows because they worked with us.",
	clientele:
		"We've worked with small start-ups and large corporations alike, but we love projects that excite us and people as passionate as we are. We stay lean and build agile  cross-functional teams run weekly sprints and evolve through collaboration to make sure every client gets exactly what they need.",
};
