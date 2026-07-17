/** @format */

// Awards, recognitions, certifications, journey, culture values & founder story.
// Authoritative Cubiccode data.

export type Recognition = {
	title: string;
	/** The awarding body, as printed on the certificate. */
	org: string;
	/** One sentence of context — the citation, the venue, what it was for. */
	blurb: string;
	year?: string;
	kind: "Award" | "Recognition" | "Talk" | "Certification";
	/** Name of a lucide icon registered in `src/components/ui/Icon.tsx`. */
	icon: string;
	/** The proof: the certificate scan, press cutting or stage photograph. */
	image: string;
	/**
	 * YouTube id of the footage of the award itself. When set, the card's figure
	 * becomes a player: `image` stays on as its poster frame and the embed is only
	 * fetched once someone presses play. Nothing autoplays — the card is inside a
	 * deck that scales on scroll, and a live iframe there re-rasterises every frame.
	 */
	youtubeId?: string;
	/**
	 * Certificates and press cuttings are documents — they must be shown whole
	 * (`contain`) or the text is cropped away. Photographs may fill the frame
	 * (`cover`), since cropping a photo costs nothing.
	 */
	fit: "contain" | "cover";
	/**
	 * The image's natural width ÷ height. A `contain` document is shown at the
	 * card's full height, so its frame is widened to exactly this ratio — that is
	 * the only way a document fills the frame top-to-bottom without being cropped.
	 * Wrong value ⇒ empty bands return. Measure, don't guess.
	 */
	aspect: number;
	/** Surfaced in the four-card "Awards & Recognition" row on the home page. */
	featured?: boolean;
};

/**
 * Every award, honour and recognition Cubiccode holds — the single source of
 * truth, transcribed from the certificate scans and press cuttings in
 * `/public/images`. The achievements page, the home-page award row and the
 * journey timeline all read from here, so a title, year or certificate pairing
 * is corrected in exactly one place.
 *
 * Chronological. Every entry names the artefact that proves it; do not add one
 * without a certificate, cutting or photograph to point `image` at.
 */
export const recognitions: Recognition[] = [
	{
		title: "Best Youngest Digital Marketing Teacher in India",
		org: "Indian Education Awards",
		blurb:
			"Presented to co-founder Sarvesh Kakkeri for his contribution to digital education, after his first year of training students in Belgaum.",
		year: "2018",
		kind: "Award",
		icon: "GraduationCap",
		image: "/images/Moments/DSC_7895.JPG",
		youtubeId: "8pesjkSey9M",
		fit: "cover",
		aspect: 1.51,
	},
	{
		title: "10 Best Web Development Start-ups in India",
		org: "Silicon India",
		blurb:
			"Ranked 5th in the country in Silicon India's survey of 2019's top web development start-ups — one of only ten firms listed, and the only one from Belagavi.",
		year: "2019",
		kind: "Recognition",
		icon: "Trophy",
		image: "/images/Moments/paper.jpg",
		fit: "contain",
		aspect: 1.15, // measured: 1007 × 875. Guessing here is what puts bands back.
		featured: true,
	},
	{
		title: "Silver — Web Application Development Company of the Year",
		org: "16th India Digital Awards",
		blurb:
			"Cubiccode Digital Media LLP took Silver at the IAMAI's 16th India Digital Awards, for enterprise-grade web application work.",
		year: "2026",
		kind: "Award",
		icon: "Medal",
		image: "/images/Moments/varrrn.jpeg",
		fit: "cover",
		aspect: 1.9,
		featured: true,
	},

	{
		title: "On the TEDx Stage",
		org: "TEDxSJEC",
		blurb:
			"Co-founder Sarvesh Kakkeri delivered his first TEDx talk, on teaching in the digital age, to an audience of students and aspiring entrepreneurs.",
		year: "2020",
		kind: "Talk",
		icon: "Mic",
		image: "/images/Moments/2020.jpg",
		fit: "cover",
		aspect: 0.92,
	},
	{
		title: "Most Innovative and Creative Web Solution of the Year",
		org: "Brandscouncil Ratings Conclave & Awards",
		blurb:
			"Presented at Hotel Radisson, Mumbai on 28 July 2021, following the second phase of the Brandscouncil Ratings Survey.",
		year: "2021",
		kind: "Award",
		icon: "Star",
		image: "/images/certificates/brandcounselling.jpg",
		fit: "contain",
		aspect: 0.75,
	},
	{
		title:
			"Most Innovative & Futuristic Training Platform of the Year, South India",
		org: "Educational Excellence Awards & Conference",
		blurb:
			"Presented by BeginUp Research Intelligence at the Taj West End, Bengaluru, citing our quality training, technology courses and outstanding trainers.",
		year: "2023",
		kind: "Recognition",
		icon: "BookOpen",
		image: "/images/certificates/educationale.jpg",
		fit: "contain",
		aspect: 0.75,
	},
	{
		title: "Most Outstanding Web Development Company",
		org: "AI Global Excellence Awards",
		blurb:
			"Acquisition International's Business Excellence Awards named Cubiccode Karnataka's most outstanding web development company of 2019.",
		year: "2019",
		kind: "Award",
		icon: "Award",
		image: "/images/certificates/business-excellence-certificate.jpg",
		fit: "contain",
		aspect: 0.75,
		featured: true,
	},
	{
		title: "Best Overall Website Design",
		org: "India Excellence Awards",
		blurb:
			"Awarded to Cubiccode in the Best Overall Website Design category at the India Excellence Awards, presented by blindwink.",
		year: "2020",
		kind: "Award",
		icon: "Sparkles",
		image: "/images/certificates/india-excellence-award-certificate.jpg",
		fit: "contain",
		aspect: 0.75,
		featured: true,
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
			"Registered under the Goods & Services Tax a fully compliant, tax-registered business.",
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
			"An internationally recognised, formally audited quality management system the backbone of our consistent, reliable delivery.",
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
	/**
	 * How `image` sits in the slide's frame. Photos default to `cover` and fill it.
	 * A press cutting or certificate is a document and must be shown whole, so it is
	 * `contain`ed — the frame is then cut to `aspect` so the document fills it top to
	 * bottom with nothing cropped and no empty bands.
	 */
	fit?: "cover" | "contain";
	/** `image`'s natural width ÷ height. Required with `fit: "contain"`. Measure, don't guess. */
	aspect?: number;
	/**
	 * YouTube id of footage for this milestone. When set, the slide's photo frame
	 * becomes a muted, looping player with `image` as its poster; the embed is only
	 * mounted while this slide is the one on screen, never before.
	 */
	youtubeId?: string;
};

// Our Journey  authoritative milestones.
export const journey: Milestone[] = [
	{
		year: "2016",
		title: "Cubiccode is founded",
		text: "Founded by Shivani Jadhav and Sarvesh Kakkeri in a small Belagavi office, driven by one bold vision — to become a trusted digital growth partner for businesses.",
		image: "/images/Moments/2016.jpeg",
	},
	{
		year: "2017",
		title: "Bridging the skills gap",
		text: "We began training students in Belgaum to close the gap between academic learning and real industry work, crossing 100 students trained in our very first year.",
		image: "/images/Moments/WhatsAppImage2017-10-13at10.14.12AM1.jpeg",
		// // image2: "/images/Moments/WhatsAppImage2017-10-13at10.14.12AM2.jpeg",
	},
	{
		year: "2018",
		title: "A teacher honoured",
		text: "In recognition of his work in digital education, Managing Director Sarvesh Kakkeri was named Best Youngest Digital Marketing Teacher in India at the Indian Education Awards.",
		image: "/images/Moments/Screenshot 2026-07-17 113701.png",	
		youtubeId: "8pesjkSey9M",
	},
	{
		year: "2019",
		title: "National recognition & 250+ companies",
		text: "Named a Top 10 Web Development Start-up of 2019 by Silicon India and Karnataka's Most Outstanding Web Development Company — the year we served 250+ companies.",
		image: "/images/Moments/paper.jpg",
		// A newspaper collage — a document, not a photo. contain + the measured
		// aspect show it whole; object-cover in the 16/10 frame cropped its top and
		// bottom rows away.
		fit: "contain",
		aspect: 1.163, // measured: 1007 × 875
	},
	{
		year: "2020",
		title: "On the TEDx stage",
		text: "Sarvesh Kakkeri delivered his first TEDx Talk, sharing ideas and experiences to inspire students, professionals and aspiring entrepreneurs across the region.",
		image: "/images/Moments/IMG_7820.JPG",
		// image2: "/images/Moments/2020.jpg",
	},
	{
		year: "2021",
		title: "Most Innovative & Creative Web Solution",
		text: "At the Brandscouncil Ratings Conclave & Awards in Mumbai, Cubiccode received the Certificate of Achievement for Most Innovative and Creative Web Solution of the Year.",
		image: "/images/Moments/award-bg.jpg",
		// image2: "/images/Moments/brandcounselling1.jpg",
		// image2Certificate: true,
	},
	{
		year: "2022",
		title: "GDG Belgaum & DevFest",
		text: "We became the organiser of Google Developer Group Belgaum, growing it to 4,500+ developers and making DevFest 2022 the fifth largest in the country that year.",
		image: "/images/Moments/devfest2022_2.jpg",
		// // image2: "/images/Moments/WhatsAppImage2024-06-08at11.50.15AM.jpeg",
	},
	{
		year: "2023",
		title: "Most Innovative & Futuristic Training Platform",
		text: "Our training arm was named South India's Most Innovative & Futuristic Training Platform of 2023 at the Educational Excellence Awards, held at the Taj West End, Bengaluru.",
		image: "/images/Moments/79074b8b-a3d8-4bf9-accb-708b6acb57a1.jpg",
		// image2: "/images/Moments/EducationalE.jpg",
		// image2Certificate: true,
	},
	{
		year: "2024",
		title: "1,000+ students trained",
		text: "Our sister arm, the Belgaum Institute of Data Analytics & Digital Marketing with AI, crossed 1,000+ students trained for careers across the technology sector.",
		image: "/images/Headerimages/x3.jpg.jpeg",
	},
	{
		year: "2025",
		title: "Silver at the India Digital Awards",
		text: "We won Silver for Web Application Development Company of the Year at the IAMAI's 16th India Digital Awards — national recognition for our enterprise web work.",
		image: "/images/Moments/varrrn.jpeg",
	},
	{
		year: "2026",
		title: "Our new office",
		text: "Ten years on from the room we started in, we moved into a new home for the team — space to build, to train, and to host the community that grew around us.",
		image: "/images/Headerimages/Screenshot 2026-07-14 230346.png",
		// image2: "/images/Headerimages/_DSC9889.JPG",
	},
];

export type Value = {
	icon: string;
	title: string;
	text: string;
	/**
	 * The printed plate as it hangs on the Belagavi office wall, scanned out of
	 * the culture deck. Order matters: `values` runs in wall order (left to
	 * right, top to bottom), and each plate is pinned to its own value here so a
	 * reordered list can never silently mismatch a card to someone else's plate.
	 */
	plate: string;
};

// Company Culture  the twelve principles.
export const values: Value[] = [
	{
		icon: "ShieldCheck",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0002.jpg",
		title: "Ownership Over Excuses",
		text: "Take responsibility. Own the outcome. Never wait to be told twice. Solve problems.",
	},
	{
		icon: "Zap",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0003.jpg",
		title: "Speed With Excellence",
		text: "Move fast. Maintain quality. Execute with precision. Delays kill momentum.",
	},
	{
		icon: "Target",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0004.jpg",
		title: "Outcome Oriented",
		text: "Effort matters, but being busy means nothing. Results matter more. Deliver measurable impact.",
	},
	{
		icon: "BookOpen",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0005.jpg",
		title: "Curiosity & Continuous Learning",
		text: "Stay adaptable. Keep learning. Keep improving. Stay ahead.",
	},
	{
		icon: "TrendingUp",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0006.jpg",
		title: "Raise The Standard",
		text: "Good is not enough. Excellence is the expectation.",
	},
	{
		icon: "Scale",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0007.jpg",
		title: "Integrity Always",
		text: "Do the right thing even when nobody is watching.",
	},
	{
		icon: "MessagesSquare",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0008.jpg",
		title: "Open & Honest Feedback Without Ego",
		text: "Great teams grow through direct, transparent communication.",
	},
	{
		icon: "Lightbulb",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0009.jpg",
		title: "Solution First Thinking",
		text: "Bring solutions, not just problems.",
	},
	{
		icon: "HeartHandshake",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0010.jpg",
		title: "Respect For People",
		text: "Professionalism, empathy and mutual respect at all times.",
	},
	{
		icon: "BadgeCheck",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0011.jpg",
		title: "Reliability Builds Trust",
		text: "Do what you said you would do every single time. Commitment to your deadlines.",
	},
	{
		icon: "Compass",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0012.jpg",
		title: "Purpose Driven Work",
		text: "Understand the “why” behind everything we do.",
	},
	{
		icon: "Users",
		plate:
			"/images/companyCulture/Cubiccode Company Culture and ethics_page-0013.jpg",
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
		text: "We take ownership of your outcome as if it were our own and we won't consider the job done until the work moves your business forward.",
	},
];

// Founders.
export type Founder = {
	name: string;
	role: string;
	initials: string;
	/**
	 * Portrait in /public  a square crop reads best. Drop the file in and set
	 * the path here; until then the signature block falls back to an initials
	 * monogram rather than rendering a broken image.
	 */
	photo?: string;
	/**
	 * `object-position` for the square crop, defaulting to the centre. Both press
	 * portraits are full-body shots against the logo wall with the founder well
	 * off-centre, so an unaided centre crop lands on the wall, not the face.
	 */
	photoPosition?: string;
	/** Personal LinkedIn profile — surfaced as an icon link on the founder card. */
	linkedin?: string;
};

export const founders: Founder[] = [
	{
		name: "Sarvesh Kakkeri",
		role: "Co-Founder",
		initials: "SK",
		photo: "/images/press/sarvesh-kakkeri.jpg",
		photoPosition: "12% center",
		linkedin: "https://www.linkedin.com/in/sarveshkakkeri/",
	},
	{
		name: "Shivani Jadhav",
		role: "Co-Founder",
		initials: "SJ",
		photo: "/images/press/shivani-jadhav.jpg",
		photoPosition: "center 8%",
		linkedin: "https://www.linkedin.com/in/shivani-jadhav14/",
	},
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
		"We're an IT company that turns ideas into software that works. Websites, web apps, custom ERP, automation and AI we design it, build it, and ship it on time. Engineered in India, trusted by 500+ businesses.",
	storySupport:
		"From a single Belagavi office in 2016 to teams in Belagavi and Bengaluru, one obsession has never changed building technology that moves your business forward.",
	story: [
		"Cubiccode Digital Media LLP began in 2016 as the brainchild of co-founders Sarvesh Kakkeri and Shivani Jadhav. From a small office in Belagavi, we set out with a simple, stubborn idea that a business website shouldn't just look good, it should be fast, reliable, and built to drive real sales.",
		"That idea resonated. By 2018 we'd served 150+ clients. By 2019 we were named one of the 10 Best Web Development Start-ups in India by Silicon India and Most Outstanding Web Development Company in Karnataka at the AI Global Excellence Awards. Today, nearly a decade in, we've delivered 700+ projects, powered over a million daily visitors, and earned the trust of brands from local champions to Tata Sky, Asian Paints, Cognizant, Tech Mahindra and more.",
		"We're still that same team at heart lean, agile, obsessed with the outcome. The office is bigger. The ambition is the same.",
	],
	vision:
		"To become a recognized digital growth company that helps businesses build powerful web experiences, dominate search and AI platforms, and generate sustainable online growth through innovative technology, web solutions, and AI-driven visibility strategies.",
	mission:
		"To deliver a wide range of quality services, creative solutions, exceptional after-sales support, and superfast on-time delivery, so that every client we serve grows because they worked with us.",
	clientele:
		"We've worked with small start-ups and large corporations alike, but we love projects that excite us and people as passionate as we are. We stay lean and build agile cross-functional teams run weekly sprints and evolve through collaboration to make sure every client gets exactly what they need.",
};
