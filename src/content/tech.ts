// Technologies We Work With — authoritative, categorized stack. Drives the homepage TechEcosystem.

export type TechCategory = {
  icon: string; // lucide-react name
  label: string;
  items: string[];
};

export const techStack: TechCategory[] = [
  {
    icon: "LayoutTemplate",
    label: "Frontend",
    items: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind", "Bootstrap", "Redux"],
  },
  {
    icon: "Server",
    label: "Backend",
    items: ["PHP", "Laravel", "Node.js", "Express", "Python", "CodeIgniter", "REST/GraphQL"],
  },
  {
    icon: "Smartphone",
    label: "Mobile & Cross-Platform",
    items: ["React Native", "Flutter", "PWAs"],
  },
  {
    icon: "ShoppingCart",
    label: "CMS & E-Commerce",
    items: ["WordPress", "WooCommerce", "Shopify", "Magento", "Strapi"],
  },
  {
    icon: "Database",
    label: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis"],
  },
  {
    icon: "Cloud",
    label: "Cloud & Hosting",
    items: ["AWS", "Google Cloud", "Azure", "DigitalOcean", "Cloudflare", "cPanel"],
  },
  {
    icon: "GitBranch",
    label: "DevOps & Deployment",
    items: ["Git", "GitHub", "GitLab", "Docker", "CI/CD", "Vercel", "Netlify"],
  },
  {
    icon: "Sparkles",
    label: "AI & Content",
    items: ["Claude", "Gemini", "ChatGPT", "Perplexity", "Midjourney", "DALL·E"],
  },
  {
    icon: "Workflow",
    label: "Workflow Automation",
    items: ["Zapier", "Make", "n8n", "Power Automate", "Custom API / webhook automations"],
  },
  {
    icon: "LineChart",
    label: "SEO & Analytics",
    items: ["GA4", "Search Console", "Tag Manager", "SEMrush", "Ahrefs", "Moz", "Screaming Frog", "Google Business Profile"],
  },
  {
    icon: "PenTool",
    label: "Design & Prototyping",
    items: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Canva"],
  },
  {
    icon: "CreditCard",
    label: "Payments & Integrations",
    items: ["Razorpay", "Stripe", "PayU", "PayPal", "Twilio", "WhatsApp Business API"],
  },
];
