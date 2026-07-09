/**
 * Cubiccode Group of Companies  the four brands surfaced under the "More" tab.
 *
 * Each renders as a full-screen brand "gate" (see components/splash/BrandSplash)
 * modelled on the cubiccode.in entry splash: a textured brand-blue field with
 * floating capability pills, a centred wordmark card, a serif-accented headline,
 * a stat row and a single primary CTA that jumps to the brand's live website.
 *
 * NOTE: the stat figures below are illustrative placeholders for the splash
 * layout  swap them for verified numbers before publishing.
 *
 * @format
 */

/** A run of headline text; `em` segments render as the serif-italic accent word. */
export type SplashSegment = { text: string; em?: boolean };

/** One accentable segment of the wordmark shown inside the centre card. */
export type WordmarkSegment = { text: string; accent?: boolean };

export type SplashPill = { icon: string; label: string };
export type SplashStat = { value: string; label: string };

export type SplashTheme = {
	/** CSS background image for the field (gradient string). */
	background: string;
	/** Blurred colour blobs layered over the field for depth. */
	glows: { color: string; className: string }[];
	/** Accent colour for the serif headline word + kicker rule (on the dark field). */
	accentText: string;
	/** Translucent box behind the emphasised headline word. */
	highlightBg: string;
	/** Darker solid brand colour for the card mark + CTA arrow chip (on white). */
	mark: string;
	/** Glass fill + hairline for the floating pills. */
	pillGlass: string;
	pillRing: string;
};

export type GroupCompany = {
	slug: string;
	route: string;
	/** Wordmark shown in the centre card. */
	wordmark: WordmarkSegment[];
	kicker: string;
	headline: SplashSegment[];
	subtitle: string;
	cta: { label: string; href: string };
	stats: SplashStat[];
	pills: SplashPill[];
	theme: SplashTheme;
	meta: { title: string; description: string };
};

/**
 * Shared Cubiccode-blue field  every group company uses the same splash theme
 * (the cubiccode.in entry-gate look), so the four pages read as one family.
 */
const blueTheme: SplashTheme = {
	background: "linear-gradient(160deg,#1B6EC2 0%,#155BA3 42%,#0B2A55 100%)",
	glows: [
		{
			color: "rgba(63,134,208,0.32)",
			className: "left-[8%] top-[12%] size-[38rem]",
		},
		{
			color: "rgba(27,110,194,0.24)",
			className: "right-[6%] bottom-[8%] size-[42rem]",
		},
	],
	accentText: "#cfe0f6",
	highlightBg: "rgba(167,201,237,0.18)",
	mark: "#155BA3",
	pillGlass: "rgba(255,255,255,0.08)",
	pillRing: "rgba(255,255,255,0.16)",
};

export const groupCompanies: GroupCompany[] = [
	/* ─────────────────────────────  CareerJump  ───────────────────────────── */
	{
		slug: "careerjump",
		route: "/careerjump",
		wordmark: [{ text: "Career" }, { text: "Jump", accent: true }],
		kicker: "Career Acceleration Platform",
		headline: [
			{ text: "Land the role you " },
			{ text: "deserve", em: true },
			{ text: "  faster." },
		],
		subtitle:
			"CareerJump connects ambitious talent with the right opportunities  resume building, interview prep and direct hiring pipelines that turn potential into placements.",
		cta: { label: "Visit CareerJump", href: "https://careerjump.co.in/" },
		stats: [
			{ value: "10K+", label: "Careers Launched" },
			{ value: "500+", label: "Hiring Partners" },
			{ value: "1:1", label: "Career Mentoring" },
		],
		pills: [
			{ icon: "FileText", label: "Resume Building" },
			{ icon: "MessagesSquare", label: "Interview Prep" },
			{ icon: "Target", label: "Job Matching" },
			{ icon: "ClipboardCheck", label: "Skill Assessments" },
			{ icon: "Compass", label: "Career Coaching" },
			{ icon: "Handshake", label: "Direct Hiring" },
			{ icon: "Briefcase", label: "Placement Support" },
			{ icon: "BadgeCheck", label: "Verified Employers" },
		],
		theme: blueTheme,
		meta: {
			title: "CareerJump  Career Acceleration",
			description:
				"CareerJump connects ambitious talent with the right opportunities  resume building, interview prep and direct hiring pipelines. Part of the Cubiccode group.",
		},
	},

	/* ──────────────────────  Advanced Data Analytics  ─────────────────────── */
	{
		slug: "data-analytics",
		route: "/data-analytics",
		wordmark: [{ text: "Advanced " }, { text: "Data Analytics", accent: true }],
		kicker: "Data Analytics · With Generative AI",
		headline: [
			{ text: "Turn raw data into " },
			{ text: "decisions", em: true },
			{ text: " that move business." },
		],
		subtitle:
			"A hands-on program in Belagavi  Python, SQL, Power BI, machine learning and Generative AI. Build a job-ready analytics portfolio with real datasets and mentor-led projects.",
		cta: {
			label: "Visit Data Analytics",
			href: "https://dataanalyticsbelgaum.com/",
		},
		stats: [
			{ value: "12+", label: "Tools & Frameworks" },
			{ value: "100%", label: "Hands-on Projects" },
			{ value: "1:1", label: "Mentor Support" },
		],
		pills: [
			{ icon: "Code2", label: "Python & SQL" },
			{ icon: "BarChart3", label: "Power BI" },
			{ icon: "BrainCircuit", label: "Machine Learning" },
			{ icon: "Sparkles", label: "Generative AI" },
			{ icon: "LineChart", label: "Data Visualization" },
			{ icon: "Sigma", label: "Statistics" },
			{ icon: "Database", label: "Real Datasets" },
			{ icon: "Briefcase", label: "Placement Assistance" },
		],
		theme: blueTheme,
		meta: {
			title: "Advanced Data Analytics  With Generative AI",
			description:
				"Hands-on Data Analytics training in Belagavi  Python, SQL, Power BI, machine learning and Generative AI with real datasets. Part of the Cubiccode group.",
		},
	},

	/* ─────────────────────  Advanced Digital Marketing  ───────────────────── */
	{
		slug: "digital-marketing",
		route: "/digital-marketing",
		wordmark: [
			{ text: "Advanced " },
			{ text: "Digital Marketing", accent: true },
		],
		kicker: "Digital Marketing · Performance-Driven",
		headline: [
			{ text: "Marketing that drives " },
			{ text: "real growth", em: true },
			{ text: ", not just clicks." },
		],
		subtitle:
			"Master SEO, paid ads, social media and content  a practical digital marketing program in Belagavi with live campaigns, real budgets and measurable ROI.",
		cta: {
			label: "Visit Digital Marketing",
			href: "https://digitalmarketingbelgaum.com/",
		},
		stats: [
			{ value: "8+", label: "Marketing Channels" },
			{ value: "Live", label: "Ad Campaigns" },
			{ value: "ROI", label: "Focused Curriculum" },
		],
		pills: [
			{ icon: "Search", label: "SEO & SEM" },
			{ icon: "MousePointerClick", label: "Google Ads" },
			{ icon: "Megaphone", label: "Meta Ads" },
			{ icon: "Share2", label: "Social Media" },
			{ icon: "PenLine", label: "Content Marketing" },
			{ icon: "Mail", label: "Email Automation" },
			{ icon: "TrendingUp", label: "Analytics" },
			{ icon: "UserRound", label: "Personal Branding" },
		],
		theme: blueTheme,
		meta: {
			title: "Advanced Digital Marketing  Performance-Driven",
			description:
				"Practical Digital Marketing training in Belagavi  SEO, Google & Meta ads, social and content with live campaigns and measurable ROI. Part of the Cubiccode group.",
		},
	},

	/* ────────────────────────────  GDG Belgaum  ───────────────────────────── */
	{
		slug: "gdg",
		route: "/gdg",
		wordmark: [{ text: "GDG " }, { text: "Belgaum", accent: true }],
		kicker: "Google Developer Group · Belagavi",
		headline: [
			{ text: "Where Belgaum's developers " },
			{ text: "build together", em: true },
			{ text: "." },
		],
		subtitle:
			"A community of developers, designers and students exploring Google technologies  meetups, hands-on workshops, study jams and DevFest. Learn, build and belong.",
		cta: {
			label: "Join GDG Belgaum",
			href: "https://gdg.community.dev/gdg-belgaum/",
		},
		stats: [
			{ value: "1000+", label: "Community Members" },
			{ value: "50+", label: "Events Hosted" },
			{ value: "DevFest", label: "Flagship Event" },
		],
		pills: [
			{ icon: "Smartphone", label: "Android" },
			{ icon: "Globe", label: "Web" },
			{ icon: "Cloud", label: "Cloud" },
			{ icon: "Flame", label: "Firebase" },
			{ icon: "Feather", label: "Flutter" },
			{ icon: "Sparkles", label: "AI / ML" },
			{ icon: "BookOpen", label: "Study Jams" },
			{ icon: "PartyPopper", label: "DevFest" },
		],
		theme: blueTheme,
		meta: {
			title: "GDG Belgaum  Google Developer Group",
			description:
				"GDG Belgaum is a community of developers exploring Google technologies through meetups, workshops, study jams and DevFest. Supported by Cubiccode.",
		},
	},
];

export const groupCompanyBySlug = (slug: string): GroupCompany | undefined =>
	groupCompanies.find((c) => c.slug === slug);

/** Flatten the segmented splash headline into plain text for a <PageHero title>. */
export const splashHeadlineText = (brand: GroupCompany) =>
	brand.headline.map((s) => s.text).join("");

/** Flatten the segmented wordmark into plain text for breadcrumbs / alt text. */
export const splashWordmarkText = (brand: GroupCompany) =>
	brand.wordmark.map((w) => w.text).join("");
