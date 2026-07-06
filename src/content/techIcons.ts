// Maps every technology in `techStack` to an icon component.
//
// Real brand logos come from Simple Icons (react-icons/si). A handful of brands
// were removed from Simple Icons for trademark reasons (AWS, Azure, Magento,
// the Adobe apps, Canva, Twilio, ChatGPT/DALL·E, Midjourney, Ahrefs, …) — those
// fall back to a well-matched Lucide glyph so every tool still shows an icon.

import type { ComponentType, CSSProperties } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiBootstrap,
  SiRedux,
  SiPhp,
  SiLaravel,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiCodeigniter,
  SiGraphql,
  SiFlutter,
  SiPwa,
  SiWordpress,
  SiWoocommerce,
  SiShopify,
  SiStrapi,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiGooglecloud,
  SiDigitalocean,
  SiCloudflare,
  SiCpanel,
  SiGit,
  SiGithub,
  SiGitlab,
  SiDocker,
  SiVercel,
  SiNetlify,
  SiClaude,
  SiGooglegemini,
  SiPerplexity,
  SiZapier,
  SiN8N,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiGoogletagmanager,
  SiSemrush,
  SiFigma,
  SiRazorpay,
  SiStripe,
  SiPaypal,
  SiWhatsapp,
} from "react-icons/si";
import {
  Cloud,
  ShoppingBag,
  Infinity as InfinityIcon,
  Bot,
  Sparkles,
  ImageIcon,
  Workflow,
  Zap,
  Webhook,
  LineChart,
  Search,
  Bug,
  Building2,
  PenTool,
  Image as ImgIcon,
  Palette,
  CreditCard,
  MessageCircle,
} from "lucide-react";

export type TechIcon = ComponentType<{
  className?: string;
  style?: CSSProperties;
}>;

const MAP: Record<string, TechIcon> = {
  // Frontend
  React: SiReact,
  "Next.js": SiNextdotjs,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
  Bootstrap: SiBootstrap,
  Redux: SiRedux,
  // Backend
  PHP: SiPhp,
  Laravel: SiLaravel,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  Python: SiPython,
  CodeIgniter: SiCodeigniter,
  "REST/GraphQL": SiGraphql,
  // Mobile
  "React Native": SiReact,
  Flutter: SiFlutter,
  PWAs: SiPwa,
  // CMS & E-Commerce
  WordPress: SiWordpress,
  WooCommerce: SiWoocommerce,
  Shopify: SiShopify,
  Magento: ShoppingBag,
  Strapi: SiStrapi,
  // Databases
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Firebase: SiFirebase,
  Redis: SiRedis,
  // Cloud & Hosting
  AWS: Cloud,
  "Google Cloud": SiGooglecloud,
  Azure: Cloud,
  DigitalOcean: SiDigitalocean,
  Cloudflare: SiCloudflare,
  cPanel: SiCpanel,
  // DevOps
  Git: SiGit,
  GitHub: SiGithub,
  GitLab: SiGitlab,
  Docker: SiDocker,
  "CI/CD": InfinityIcon,
  Vercel: SiVercel,
  Netlify: SiNetlify,
  // AI & Content
  Claude: SiClaude,
  Gemini: SiGooglegemini,
  ChatGPT: Bot,
  Perplexity: SiPerplexity,
  Midjourney: ImageIcon,
  "DALL·E": ImgIcon,
  // Workflow Automation
  Zapier: SiZapier,
  Make: Workflow,
  n8n: SiN8N,
  "Power Automate": Zap,
  "Custom API / webhook automations": Webhook,
  // SEO & Analytics
  GA4: SiGoogleanalytics,
  "Search Console": SiGooglesearchconsole,
  "Tag Manager": SiGoogletagmanager,
  SEMrush: SiSemrush,
  Ahrefs: LineChart,
  Moz: Search,
  "Screaming Frog": Bug,
  "Google Business Profile": Building2,
  // Design & Prototyping
  Figma: SiFigma,
  "Adobe XD": PenTool,
  Photoshop: ImgIcon,
  Illustrator: PenTool,
  Canva: Palette,
  // Payments & Integrations
  Razorpay: SiRazorpay,
  Stripe: SiStripe,
  PayU: CreditCard,
  PayPal: SiPaypal,
  Twilio: MessageCircle,
  "WhatsApp Business API": SiWhatsapp,
};

/** Icon for a technology name, falling back to a generic sparkles glyph. */
export function getTechIcon(name: string): TechIcon {
  return MAP[name] ?? Sparkles;
}

// Real brand colors, tuned a touch darker where the canonical hex is too pale to
// read on a light chip (JavaScript, Firebase, Netlify, …). Black-brand marks
// (Next.js, Express, Vercel, GitHub) map to the theme's deep navy.
const COLOR: Record<string, string> = {
  // Frontend
  React: "#61DAFB",
  "Next.js": "#0B1B3A",
  JavaScript: "#EAB308",
  TypeScript: "#3178C6",
  Tailwind: "#06B6D4",
  Bootstrap: "#7952B3",
  Redux: "#764ABC",
  // Backend
  PHP: "#777BB4",
  Laravel: "#FF2D20",
  "Node.js": "#5FA04E",
  Express: "#0B1B3A",
  Python: "#3776AB",
  CodeIgniter: "#EF4223",
  "REST/GraphQL": "#E10098",
  // Mobile
  "React Native": "#61DAFB",
  Flutter: "#02569B",
  PWAs: "#5A0FC8",
  // CMS & E-Commerce
  WordPress: "#21759B",
  WooCommerce: "#96588A",
  Shopify: "#7AB55C",
  Magento: "#EE672F",
  Strapi: "#4945FF",
  // Databases
  MySQL: "#00758F",
  PostgreSQL: "#4169E1",
  MongoDB: "#47A248",
  Firebase: "#F57C00",
  Redis: "#DC382D",
  // Cloud & Hosting
  AWS: "#FF9900",
  "Google Cloud": "#4285F4",
  Azure: "#0078D4",
  DigitalOcean: "#0080FF",
  Cloudflare: "#F38020",
  cPanel: "#FF6C2C",
  // DevOps
  Git: "#F05032",
  GitHub: "#0B1B3A",
  GitLab: "#FC6D26",
  Docker: "#2496ED",
  "CI/CD": "#1B6EC2",
  Vercel: "#0B1B3A",
  Netlify: "#00AD9F",
  // AI & Content
  Claude: "#D97757",
  Gemini: "#8E75B2",
  ChatGPT: "#10A37F",
  Perplexity: "#20808D",
  Midjourney: "#6D28D9",
  "DALL·E": "#10A37F",
  // Workflow Automation
  Zapier: "#FF4A00",
  Make: "#6D00CC",
  n8n: "#EA4B71",
  "Power Automate": "#0066FF",
  "Custom API / webhook automations": "#1B6EC2",
  // SEO & Analytics
  GA4: "#E37400",
  "Search Console": "#4285F4",
  "Tag Manager": "#246FDB",
  SEMrush: "#FF642D",
  Ahrefs: "#054ADA",
  Moz: "#0BA5E0",
  "Screaming Frog": "#22A54F",
  "Google Business Profile": "#4285F4",
  // Design & Prototyping
  Figma: "#F24E1E",
  "Adobe XD": "#FF61F6",
  Photoshop: "#31A8FF",
  Illustrator: "#FF9A00",
  Canva: "#00C4CC",
  // Payments & Integrations
  Razorpay: "#3395FF",
  Stripe: "#635BFF",
  PayU: "#00457C",
  PayPal: "#003087",
  Twilio: "#F22F46",
  "WhatsApp Business API": "#25D366",
};

/** Brand color for a technology, falling back to the corporate blue accent. */
export function getTechIconColor(name: string): string {
  return COLOR[name] ?? "#1B6EC2";
}
