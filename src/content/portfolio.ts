export type WebsiteProject = {
  name: string;
  url: string;
  category: "Website" | "E-commerce" | "Web App" | "Education" | "Healthcare";
};

// Featured projects with real local screenshots in /public/images/portfolio
export const featuredProjects: (WebsiteProject & { image: string; blurb: string })[] = [
  { name: "Prions Biotech", url: "prionsbiotech.com", category: "Website", image: "/images/portfolio/prions-biotech.jpg", blurb: "A research-grade brand site with a fast, content-driven catalogue and a clean, publication-ready visual system." },
  { name: "Woodpecker Exotica", url: "woodpeckerexotica.com", category: "Website", image: "/images/portfolio/woodpecker-exotic.jpg", blurb: "An immersive resort experience — cinematic imagery, smooth scroll storytelling and frictionless enquiries." },
  { name: "Aishwarya Cottons", url: "aishwaryacottons.com", category: "E-commerce", image: "/images/portfolio/aishwarya-cottons.png", blurb: "A conversion-focused storefront with rich merchandising, instant search and a checkout built to sell." },
  { name: "CityIndex WebApp", url: "cityindexinvestment.com", category: "Web App", image: "/images/portfolio/city-index.jpg", blurb: "A data-dense investment platform with real-time dashboards, secure portals and automated reporting." },
  { name: "Laxis Analytics", url: "laxisanalytics.com", category: "Website", image: "/images/portfolio/laxis-analytics.jpg", blurb: "A crisp product marketing site that turns a complex analytics suite into a clear, compelling story." },
  { name: "Harsha & Rakesh Salon", url: "harsharakesh.com", category: "E-commerce", image: "/images/portfolio/harsha-rakesh.jpg", blurb: "An elegant booking-first experience with online ordering, gift cards and a polished mobile flow." },
];

// Full live website portfolio (42 projects) from cubiccode.in
export const websiteProjects: WebsiteProject[] = [
  { name: "Prions Biotech", url: "prionsbiotech.com", category: "Website" },
  { name: "Avenore Events", url: "avenoreevents.com", category: "Website" },
  { name: "BridgeNow", url: "bridge-now.de", category: "Website" },
  { name: "The School Excel", url: "theschoolexcel.com", category: "Education" },
  { name: "Simple", url: "simple.life", category: "Website" },
  { name: "Harsha & Rakesh Salon", url: "harsharakesh.com", category: "E-commerce" },
  { name: "Roupa Mood Shop", url: "moodshop.pt", category: "E-commerce" },
  { name: "Woodpecker Exotica", url: "woodpeckerexotica.com", category: "Website" },
  { name: "Dr. Sanjay Porwal", url: "drsanjayporwal.com", category: "Healthcare" },
  { name: "Cleancode", url: "cleancode.club", category: "Website" },
  { name: "Roshni Boutique", url: "roshniboutiques.com", category: "E-commerce" },
  { name: "JD Group India", url: "jdgroupindia.com", category: "Website" },
  { name: "Aroma Galaxy", url: "aromagalaxy.in", category: "E-commerce" },
  { name: "Heramb Enterprises", url: "herambenterprises.in", category: "Website" },
  { name: "Fintree Advisors", url: "fintreeadvisors.com", category: "Website" },
  { name: "SBGAMCH", url: "sbgamch.org", category: "Healthcare" },
  { name: "Universal Traders India", url: "universaltradersindia.com", category: "Website" },
  { name: "Aishwarya Cottons", url: "aishwaryacottons.com", category: "E-commerce" },
  { name: "Kamadhenu School", url: "kamadhenuschool.in", category: "Education" },
  { name: "Topex Enterprise", url: "topexenterprise.com", category: "Website" },
  { name: "Mustash Events", url: "mostashevents.com", category: "Website" },
  { name: "AXIOM Solutions", url: "axiom-india.in", category: "Website" },
  { name: "Modular InfoTech (Singapore)", url: "modular-infotech.com.sg", category: "Website" },
  { name: "New India Metals", url: "newindiametals.com", category: "Website" },
  { name: "Meet and Greet", url: "meetandgreet.life", category: "Website" },
  { name: "Prithvi Metals", url: "prithvimetals.com", category: "Website" },
  { name: "Synapsis Techno", url: "synapsistechno.in", category: "Website" },
  { name: "People Tree College", url: "peopletreecollege.com", category: "Education" },
  { name: "Salgaocar Law Review", url: "theslr.com", category: "Website" },
  { name: "Jambagi PU College", url: "jambagipucollege.com", category: "Education" },
  { name: "DevFest Belgaum", url: "devfestbelgaum.in", category: "Website" },
  { name: "Indus Nepal Rudraksha", url: "indusnepalrudraksha.com", category: "E-commerce" },
  { name: "Planet Hydraulics", url: "planethydraulics.com", category: "Website" },
  { name: "Creative Miura", url: "creativemiura.com", category: "Website" },
  { name: "P-XR.CH", url: "p-xr.ch", category: "Website" },
  { name: "BL Sciences", url: "blsciences.com", category: "Healthcare" },
  { name: "Akshar Vidya Vihar", url: "aksharvidyavihar.com", category: "Education" },
  { name: "Jijamata Mahila Bank", url: "jijamatamahilabank.co.in", category: "Website" },
  { name: "Jagvin", url: "jagvin.com", category: "Website" },
  { name: "Laxis Analytics", url: "laxisanalytics.com", category: "Website" },
  { name: "United Educators Foundation", url: "uefindia.in", category: "Education" },
  { name: "Dandeli Jungle Edge", url: "dandeliresort.in", category: "Website" },
];

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  image?: string;
  stats: { icon: string; label: string }[];
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
    stats: [
      { icon: "💰", label: "₹250+ Crore assets managed" },
      { icon: "👥", label: "3,500+ clients served" },
      { icon: "🔄", label: "₹5+ Crore monthly payouts" },
      { icon: "🏢", label: "Core business platform" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
  {
    slug: "event-ticket-hub",
    name: "Event Ticket Hub",
    category: "Marketplace · Ticketing",
    tagline:
      "A scalable ticket selling & reselling platform handling thousands of concurrent users and high transaction volume.",
    stats: [
      { icon: "🎫", label: "10,000+ ticket listings / month" },
      { icon: "💸", label: "₹1.5 Cr+ monthly transactions" },
      { icon: "🔐", label: "20,000+ secure payments" },
      { icon: "⚡", label: "99.99% platform uptime" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
  {
    slug: "global-hiring-hub",
    name: "Global Hiring Hub",
    category: "HR Tech · Cross-border Hiring",
    tagline:
      "A smart job portal sourcing nursing staff for German clinics, processing thousands of verified applications.",
    stats: [
      { icon: "👥", label: "5,000+ verified nursing applications" },
      { icon: "🏥", label: "100+ German clinics supported" },
      { icon: "📄", label: "1,500+ applications / month" },
      { icon: "⏱", label: "60% faster employer review" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
  {
    slug: "student-branch-management",
    name: "Student & Branch Management",
    category: "EdTech · Multi-center ERP",
    tagline:
      "An end-to-end management platform for an expanding education brand across 30+ centers.",
    stats: [
      { icon: "🏫", label: "30+ active centers managed" },
      { icon: "🎓", label: "1,000+ students / month onboarded" },
      { icon: "💰", label: "Automated fee tracking & reminders" },
      { icon: "📜", label: "QR-verified certificates" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
  {
    slug: "industrial-inventory-platform",
    name: "Industrial Inventory & Field Service",
    category: "Industrial · ERP",
    tagline:
      "A custom industrial service & inventory platform with full travel and allowance visibility.",
    stats: [
      { icon: "🛠️", label: "5,000+ service visits logged / year" },
      { icon: "📦", label: "Thousands of inventory movements" },
      { icon: "💼", label: "Complete travel & allowance visibility" },
      { icon: "📊", label: "Real-time management dashboards" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
  {
    slug: "crypto-mlm-platform",
    name: "Crypto Payments Platform",
    category: "Web3 · Payments",
    tagline:
      "A scalable MLM platform with crypto payments, ROI tracking and a referral commission engine.",
    stats: [
      { icon: "👥", label: "3,000+ users onboarded" },
      { icon: "💰", label: "₹7.5 Cr+ crypto investments" },
      { icon: "🧾", label: "₹1.7 Cr+ ROI & commissions paid" },
      { icon: "🔄", label: "15,000+ commission transactions" },
    ],
    link: "https://www.linkedin.com/company/cubiccode/",
  },
];
