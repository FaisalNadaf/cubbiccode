import Link from "next/link";
import { Linkedin, Instagram, Youtube, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { site, nav } from "@/content/site";
import { Wordmark } from "@/components/ui/Logo";

const socialLinks = [
  { href: site.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: site.socials.instagram, icon: Instagram, label: "Instagram" },
  { href: site.socials.youtube, icon: Youtube, label: "YouTube" },
];

// Flatten nav groups into footer columns (skip Home/Contact singletons handled elsewhere)
const footerColumns = nav
  .filter((g) => g.columns || g.links)
  .map((g) => ({
    label: g.label,
    links: (g.columns
      ? g.columns.flatMap((c) => c.links)
      : g.links ?? []
    ).slice(0, 6),
  }));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-steel-300">
      {/* Blueprint texture */}
      <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-corporate-600/20 blur-3xl" />

      <div className="container-x relative">
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-20">
          {/* Brand + mission */}
          <div className="lg:col-span-4">
            <Wordmark className="text-white" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-400">
              {site.legalName} — an {site.certification.toLowerCase()} company.
              Our mission is to provide quality services, creative solutions and
              superfast on-time delivery that helps every business grow.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-steel-300 transition-all hover:border-corporate-400 hover:bg-white/5 hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {footerColumns.map((col) => (
              <div key={col.label}>
                <h4 className="text-[11px] font-semibold uppercase tracking-kicker text-steel-500">
                  {col.label}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-steel-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-kicker text-steel-500">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-4 text-[13.5px]">
              {site.offices.map((office) => (
                <li key={office.label} className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-corporate-400" />
                  <a
                    href={office.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-relaxed text-steel-400 transition-colors hover:text-white"
                  >
                    <span className="block font-medium text-steel-300">
                      {office.label}
                    </span>
                    {office.lines.join(" ")}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-corporate-400" />
                <a href={`tel:${site.primaryPhoneRaw}`} className="hover:text-white">
                  {site.phones.join(" · ")}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-corporate-400" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline opacity-20" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 py-7 text-[12.5px] text-steel-500 md:flex-row">
          <p>
            © {site.founded} {site.legalName} · {site.certification} · All Rights
            Reserved · Designed with <span className="text-corporate-400">❤</span>{" "}
            in INDIA 🇮🇳
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <a
              href={site.educationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              cubiccode.org <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
