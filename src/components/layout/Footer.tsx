"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";
import { site, nav } from "@/content/site";
import { Wordmark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const socialLinks = [
  { href: site.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: site.socials.instagram, icon: Instagram, label: "Instagram" },
  { href: site.socials.youtube, icon: Youtube, label: "YouTube" },
  { href: site.socials.googleBusiness, icon: Globe, label: "Google Business Profile" },
];

// Flatten nav groups into footer columns (Home/Contact singletons handled elsewhere)
const footerColumns = nav
  .filter((g) => g.columns || g.links)
  .map((g) => ({
    label: g.label,
    links: (g.columns
      ? g.columns.flatMap((c) => c.links)
      : g.links ?? []
    ).slice(0, 6),
  }));

/** Text link with corporate underline-sweep hover. */
function SweepLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = cn(
    "group relative inline-flex items-center gap-1 rounded-sm py-1 text-steel-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400",
    className
  );
  const sweep = (
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-corporate-300 transition-transform duration-300 ease-out group-hover:scale-x-100"
    />
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        {sweep}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {sweep}
    </Link>
  );
}

/** Small trust chip — ISO badge, founding year. */
function Chip({ icon: Icon, children }: { icon: typeof BadgeCheck; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-medium text-steel-300">
      <Icon className="size-3.5 text-corporate-300" />
      {children}
    </span>
  );
}

/** Icon tile used by the contact cards. */
function IconTile({ icon: Icon }: { icon: typeof MapPin }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-corporate-500/15 text-corporate-300 ring-1 ring-corporate-400/20 transition-colors duration-300 group-hover:bg-corporate-500/25 group-hover:text-corporate-200">
      <Icon className="size-4" />
    </span>
  );
}

export function Footer() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const viewport = { once: true, amount: 0.15 } as const;

  return (
    <footer className="relative overflow-hidden bg-ink text-steel-300">
      {/* Blueprint texture + ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-corporate-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-24 size-80 rounded-full bg-corporate-500/10 blur-3xl" />

      <div className="container-x relative">
        {/* ── CTA band ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="flex flex-col gap-8 pb-12 pt-16 lg:flex-row lg:items-end lg:justify-between lg:pt-20"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-300">
              <span className="h-px w-8 bg-corporate-300/60" />
              Start a project
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tightest text-white sm:text-4xl">
              Have a project in mind?{" "}
              <span className="text-corporate-300">Let&apos;s build something that matters.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={site.proposalCta}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-corporate-500 px-7 py-3.5 font-display text-[15px] font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-corporate-400 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Get a Proposal
              <ArrowUpRight className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <SweepLink href={`mailto:${site.email}`} className="gap-2 text-sm">
              <Mail className="size-4 text-corporate-300" />
              {site.email}
            </SweepLink>
          </motion.div>
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Brand + nav columns ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-12 lg:py-16"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/blue-star.png"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="size-5 animate-spin-slow opacity-90"
              />
              <Wordmark className="text-white" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-400">
              {site.legalName} — an {site.certification.toLowerCase()} company.
              Our mission is to provide quality services, creative solutions and
              superfast on-time delivery that helps every business grow.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip icon={BadgeCheck}>{site.certification}</Chip>
              <Chip icon={CalendarDays}>Since {site.founded}</Chip>
            </div>
            <div className="mt-7 flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-steel-300 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/60 hover:bg-corporate-500/20 hover:text-white hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <Icon className="size-[18px] transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Nav columns */}
          <nav aria-label="Footer" className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-5">
              {footerColumns.map((col) => (
                <motion.div key={col.label} variants={fadeUp}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-kicker text-steel-400">
                    {col.label}
                  </h4>
                  <ul className="mt-4 space-y-1.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <SweepLink href={link.href} className="text-[13.5px] leading-relaxed">
                          {link.label}
                        </SweepLink>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </nav>
        </motion.div>

        {/* ── Contact cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="pb-14"
        >
          <motion.h3
            variants={fadeUp}
            className="text-[11px] font-semibold uppercase tracking-kicker text-steel-400"
          >
            Get in touch
          </motion.h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.offices.map((office) => (
              <motion.div
                key={office.label}
                variants={fadeUp}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center gap-2.5">
                  <IconTile icon={MapPin} />
                  <h4 className="text-[12.5px] font-semibold text-white">{office.label}</h4>
                </div>
                <address className="mt-3.5 not-italic">
                  <a
                    href={office.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm text-[13px] leading-relaxed text-steel-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400"
                  >
                    {office.lines.join(" ")}
                  </a>
                </address>
              </motion.div>
            ))}

            <motion.div
              variants={fadeUp}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2.5">
                <IconTile icon={Phone} />
                <h4 className="text-[12.5px] font-semibold text-white">Call us</h4>
              </div>
              <ul className="mt-3.5 space-y-1">
                {site.phones.map((p) => (
                  <li key={p}>
                    <a
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className="rounded-sm text-[13px] leading-relaxed text-steel-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400"
                    >
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2.5">
                <IconTile icon={Mail} />
                <h4 className="text-[12.5px] font-semibold text-white">Write to us</h4>
              </div>
              <p className="mt-3.5">
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-sm text-[13px] leading-relaxed text-steel-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400"
                >
                  {site.email}
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-5 py-7 text-[12.5px] text-steel-400 md:flex-row">
          <p className="text-center md:text-left">
            © {site.founded}–{year} {site.legalName} · {site.certification} · All
            Rights Reserved · Designed with <span className="text-corporate-300">❤</span>{" "}
            in INDIA 🇮🇳
          </p>
          <div className="flex items-center gap-5">
            <SweepLink href="/terms" className="text-[12.5px]">
              Terms
            </SweepLink>
            <SweepLink href="/privacy" className="text-[12.5px]">
              Privacy
            </SweepLink>
            <SweepLink href={site.educationUrl} external className="text-[12.5px]">
              cubiccode.org
            </SweepLink>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
              }
              aria-label="Back to top"
              className="group inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-steel-300 transition-all duration-300 hover:-translate-y-1 hover:border-corporate-400/60 hover:bg-corporate-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <ArrowUp className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Giant clipped watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none relative h-20 select-none overflow-hidden sm:h-28 lg:h-40"
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-display text-[6.5rem] font-bold leading-none tracking-tightest text-white/[0.03] sm:text-[9.5rem] lg:text-[13.5rem]">
          CUBICCODE
        </span>
      </div>
    </footer>
  );
}
