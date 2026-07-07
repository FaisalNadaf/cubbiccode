// Authentic Cubiccode company data  extracted from the existing cubiccode.in site.

export const site = {
  name: "Cubiccode",
  legalName: "Cubiccode Digital Media LLP",
  certification: "ISO 9001:2015 Certified",
  founded: 2016,
  tagline:
    "We build websites and web apps that don't just look good  they drive traffic and sales.",
  description:
    "Cubiccode Digital Media LLP is a full-stack ITES company with nearly a decade of expertise  building websites, web applications, custom ERP, SEO and workflow automation for 500+ clients across India. Engineered in India, delivered on time.",
  metaDescription:
    "Cubiccode is a 5x-awarded, ISO 9001:2015 certified web development company with 700+ projects and 500+ clients. Websites, web apps, custom ERP, automation & SEO  engineered in India, delivered on time.",
  url: "https://cubiccode.in",
  educationUrl: "https://cubiccode.org",
  email: "biz@cubiccode.in",
  phones: ["+91 91081 01795", "+91 80502 03399"],
  primaryPhoneRaw: "+919108101795",
  whatsapp: "https://api.whatsapp.com/send?phone=+919108101795",
  whatsappShort: "https://wa.link/qzlm1j",
  proposalCta: "https://wa.link/qzlm1j",
  socials: {
    linkedin: "https://www.linkedin.com/company/cubiccode/mycompany/",
    instagram: "https://www.instagram.com/cubiccode.in/",
    youtube: "https://www.youtube.com/channel/UCinfpxrfs_N4npK7LtSup3g",
    googleBusiness: "https://g.page/cubiccode?share",
  },
  offices: [
    {
      label: "Registered Office  Belagavi",
      lines: [
        "Plot No. 60, Saraf Colony,",
        "Opp. Saraf Residency, Near Dominos Pizza,",
        "RPD Cross, Khanapur Road, Tilakwadi,",
        "Belagavi, Karnataka, India  590006",
      ],
      map: "https://maps.app.goo.gl/7xSdkUUG6Ubc3VPU7",
      coords: { lat: 15.835088, lng: 74.506782 },
    },
    {
      label: "Bengaluru Office",
      lines: [
        "Novel Office, MG Road,",
        "Opposite 1MG Mall,",
        "Bengaluru, Karnataka  560042",
      ],
      map: "https://maps.app.goo.gl/LmYJarmyrMm8cwTy9",
      coords: { lat: 12.9756, lng: 77.6068 },
    },
  ],
};

export type Stat = { value: number; suffix: string; prefix?: string; label: string };

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
    "We build websites and web apps that don't just look good  they drive traffic and sales.",
  subheadline:
    "With 500+ clients and nearly a decade building websites and web apps, Cubiccode is recognised among the 10 Best Web Development Start-ups in India (Silicon India, 2019), named Most Outstanding Web Development Company in Karnataka (AI Global Excellence Awards, 2019), and a Silver winner for Web Application Development Company of the Year at the 16th India Digital Awards 2025. Websites, web apps, customised ERP, SEO and workflow automation  engineered in India, delivered on time.",
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
    text: "Silver  Web App Development Company of the Year, India Digital Awards 2025.",
  },
  {
    icon: "Award",
    text: "Top 10 Web Development Start-ups in India  Silicon India, 2019.",
  },
  {
    icon: "Layers",
    text: "Websites, web apps, custom ERP, SEO & workflow automation  engineered in India, delivered on time.",
  },
];

export const trustBadges = [
  "ISO 9001:2015 Certified",
  "Silicon India  Top 10 Web Developers, India",
  "AI Global Excellence Award 2019",
  "Silver  16th India Digital Awards 2025",
];

export type Award = {
  image: string; // gold award badge  /images/awardsIcons/*.png
  moment: string; // proof photo / certificate  /images/Moments/*
  title: string;
  org: string;
  desc: string;
};

// Award / recognition cards  powers the scroll-stack showcase in "Why Cubiccode".
export const awards: Award[] = [
  {
    image: "/images/awardsIcons/a.png",
    moment: "/images/Moments/paper.jpg",
    title: "Top 10 Web Development Start-ups in India",
    org: "Silicon India · 2019",
    desc: "Ranked in the Top 10 Web Development Start-ups of 2019 by Silicon India.",
  },
  {
    image: "/images/awardsIcons/a.png",
    moment: "/images/Moments/business-excellence-certificate1.jpg",
    title: "Most Outstanding Web Development Company",
    org: "AI Global Excellence Awards · Karnataka · 2019",
    desc: "Awarded Most Outstanding Web Development Company 2019 (Karnataka) by AI Global Excellence Awards.",
  },
  {
    image: "/images/awardsIcons/a.png",
    moment: "/images/Moments/award-bg.jpg",
    title: "Top 3 Web Designers in Belgaum",
    org: "BestThreeRated",
    desc: "Recognized as one of the Top 3 Web Designers in Belgaum by BestThreeRated.",
  },
  {
    image: "/images/awardsIcons/a.png",
    moment: "/images/Moments/india-excellence-award-certificate1.jpg",
    title: "Silver  Web Application Development Company of the Year",
    org: "16th India Digital Awards · 2025",
    desc: "Won Silver in Web Application Development Company of the Year at the 16th India Digital Awards.",
  },
];

export type NavLink = {
  label: string;
  href: string;
  desc?: string;
  icon?: string; // lucide-react icon name
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
          { label: "About Us", href: "/about", desc: "Nearly a decade of building the web", icon: "Building2" },
          { label: "Achievements", href: "/achievements", desc: "Awards, recognitions & press", icon: "Award" },
          { label: "Message From Founders", href: "/founders", desc: "The vision behind Cubiccode", icon: "Quote" },
        ],
      },
      {
        heading: "Our Story",
        links: [
          { label: "Our Journey", href: "/journey", desc: "2016 → today, milestone by milestone", icon: "Milestone" },
          { label: "Company Culture", href: "/culture", desc: "How we think, build & ship", icon: "HeartHandshake" },
          { label: "Certifications", href: "/certifications", desc: "ISO 9001:2015 & quality standards", icon: "BadgeCheck" },
        ],
      },
    ],
    feature: {
      title: "500+ businesses trust Cubiccode",
      text: "From local startups to Tata Sky, Asian Paints & Cognizant.",
      href: "/about",
      cta: "Our story",
    },
  },
  {
    label: "Capabilities",
    columns: [
      {
        heading: "Build",
        links: [
          { label: "Website Design & Development", href: "/capabilities/website-development", desc: "Fast, responsive, conversion-driven sites", icon: "MonitorSmartphone" },
          { label: "Web Application Development", href: "/capabilities/web-application-development", desc: "SaaS, dashboards & portals at scale", icon: "AppWindow" },
          { label: "Custom ERP Software", href: "/capabilities/custom-erp", desc: "One source of truth for your operations", icon: "Boxes" },
        ],
      },
      {
        heading: "Grow",
        links: [
          { label: "Workflow Automation", href: "/capabilities/workflow-automation", desc: "Automate the repetitive, scale the rest", icon: "Workflow" },
          { label: "SEO & Domain Authority", href: "/capabilities/seo", desc: "Rank, attract & convert organic traffic", icon: "TrendingUp" },
     
        ],
      },
    ],
    feature: {
      title: "End-to-end digital engineering",
      text: "Strategy, design, engineering & growth  under one roof.",
      href: "/capabilities/website-development",
      cta: "Explore capabilities",
    },
  },
  {
    label: "Industries",
    columns: [
      {
        heading: "Sectors we serve",
        links: [
          { label: "Industries & Manufacturing", href: "/industries/manufacturing", icon: "Factory" },
          { label: "Education & Training", href: "/industries/education", icon: "GraduationCap" },
          { label: "Logistics & Transport", href: "/industries/logistics", icon: "Truck" },
          { label: "Healthcare", href: "/industries/healthcare", icon: "Stethoscope" },
          { label: "Construction & Real Estate", href: "/industries/construction", icon: "Building2" },
        ],
      },
      {
        heading: "More sectors",
        links: [
          { label: "SMEs", href: "/industries/smes", icon: "Store" },
          { label: "Retail Chains & Franchises", href: "/industries/retail", icon: "ShoppingBag" },
          { label: "HR & Staffing Agencies", href: "/industries/staffing", icon: "Users" },
          { label: "New Start-ups", href: "/industries/startups", icon: "Rocket" },
        ],
      },
    ],
    feature: {
      title: "Built for your sector",
      text: "Domain-specific workflows, not generic templates.",
      href: "/industries/manufacturing",
      cta: "See all industries",
    },
  },
  {
    label: "Work",
    columns: [
      {
        heading: "Portfolio",
        links: [
          { label: "Clientele", href: "/clientele", desc: "500+ brands across India", icon: "Users" },
          { label: "Website Portfolio", href: "/portfolio", desc: "42+ live websites", icon: "LayoutGrid" },
        ],
      },
      {
        heading: "Proof",
        links: [
          { label: "Web App & ERP Case Studies", href: "/case-studies", desc: "Platforms running real businesses", icon: "LineChart" },
          { label: "SEO Results", href: "/capabilities/seo", desc: "Rankings & organic growth", icon: "TrendingUp" },
        ],
      },
    ],
    feature: {
      title: "700+ builds delivered",
      text: "Our web apps run real businesses at scale.",
      href: "/case-studies",
      cta: "View case studies",
    },
  },
  {
    label: "More",
    links: [
      { label: "Become a Sales Partner", href: "/partner", desc: "Grow with us", icon: "Handshake" },
      { label: "Join the Team", href: "/careers", desc: "Open roles", icon: "Briefcase" },
      { label: "CareerJump", href: "/careerjump", desc: "Career acceleration", icon: "Rocket" },
      { label: "Advanced Data Analytics", href: "/data-analytics", desc: "With Generative AI", icon: "BarChart3" },
      { label: "Advanced Digital Marketing", href: "/digital-marketing", desc: "Performance marketing", icon: "Megaphone" },
      { label: "GDG Belgaum", href: "/gdg", desc: "Google Developer Group", icon: "Code2" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
