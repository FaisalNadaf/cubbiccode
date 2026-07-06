/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowUpRight,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { site } from "@/content/site";

export const metadata = {
  title: "Contact Cubiccode — Let's Build Something That Matters",
  description:
    "Talk to Cubiccode Digital Media LLP about your website, web app, ERP or growth project. Reach us by phone, email or WhatsApp, or visit our Belagavi & Bengaluru offices. We reply within a day.",
};

const socials = [
  { name: "LinkedIn", href: site.socials.linkedin, Icon: Linkedin },
  { name: "Instagram", href: site.socials.instagram, Icon: Instagram },
  { name: "YouTube", href: site.socials.youtube, Icon: Youtube },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact us"
        title="Let's transform your business for a change that matters"
        subtitle="Would you like to discuss a project? Tell us where you are and where you'd like to go — and we'll come back with a clear plan, timeline and proposal, typically within a day."
        image="/images/about/parallax-2.jpg"
        imageAlt="Get in touch with the Cubiccode team"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Main conversion block — form + contact rail */}
      <section className="relative overflow-hidden bg-canvas-soft py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* LEFT — enquiry form */}
            <Reveal direction="up" amount={0.15}>
              <EnquiryForm />
            </Reveal>

            {/* RIGHT — contact rail */}
            <RevealGroup stagger={0.09} className="flex flex-col gap-5">
              {/* Phone card */}
              <RevealItem>
                <div className="group rounded-3xl border border-steel-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-card">
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
                      <Phone className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold uppercase tracking-wider text-steel-400">
                        Call us
                      </p>
                      <div className="mt-1.5 flex flex-col gap-0.5">
                        {site.phones.map((p) => (
                          <a
                            key={p}
                            href={`tel:${p.replace(/\s/g, "")}`}
                            className="font-display text-lg font-semibold tracking-tight text-ink transition-colors hover:text-corporate-600"
                          >
                            {p}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealItem>

              {/* Email card */}
              <RevealItem>
                <a
                  href={`mailto:${site.email}`}
                  className="group block rounded-3xl border border-steel-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
                      <Mail className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold uppercase tracking-wider text-steel-400">
                        Email us
                      </p>
                      <p className="mt-1.5 break-all font-display text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-corporate-600">
                        {site.email}
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-steel-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-corporate-500" />
                  </div>
                </a>
              </RevealItem>

              {/* WhatsApp CTA — accent band */}
              <RevealItem>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.14]" />
                  <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-corporate-500/30 blur-3xl" />
                  <div className="relative flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-corporate-200 ring-1 ring-white/15">
                      <MessageCircle className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-lg font-semibold tracking-tight">
                        Chat on WhatsApp
                      </p>
                      <p className="mt-0.5 text-sm text-steel-300">
                        The fastest way to reach us — usually replies in hours.
                      </p>
                    </div>
                    <ArrowUpRight className="ml-auto size-5 shrink-0 text-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                </a>
              </RevealItem>

              {/* Promise / certification strip */}
              <RevealItem>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-3xl border border-steel-200 bg-white p-5 shadow-soft">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-corporate-50 text-corporate-600">
                      <Clock className="size-[18px]" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-ink">
                        Reply within a day
                      </p>
                      <p className="text-[12.5px] text-steel-500">
                        Often within a few hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-3xl border border-steel-200 bg-white p-5 shadow-soft">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-corporate-50 text-corporate-600">
                      <ShieldCheck className="size-[18px]" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-ink">
                        {site.certification}
                      </p>
                      <p className="text-[12.5px] text-steel-500">
                        Quality you can audit.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealItem>

              {/* Social row */}
              <RevealItem>
                <div className="flex items-center justify-between rounded-3xl border border-steel-200 bg-white px-6 py-4 shadow-soft">
                  <span className="text-[13px] font-medium text-steel-500">
                    Follow our work
                  </span>
                  <div className="flex items-center gap-2">
                    {socials.map(({ name, href, Icon }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={name}
                        className="flex size-10 items-center justify-center rounded-xl border border-steel-200 bg-canvas-soft text-steel-500 transition-colors hover:border-corporate-300 hover:bg-white hover:text-corporate-600"
                      >
                        <Icon className="size-[18px]" />
                      </a>
                    ))}
                  </div>
                </div>
              </RevealItem>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Offices + embedded maps */}
      <section className="relative overflow-hidden bg-canvas py-20 lg:py-28">
        <div className="container-x relative">
          <div className="max-w-3xl">
            <Reveal>
              <span className="kicker">
                <MapPin className="size-[14px]" /> Visit us
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.08] tracking-tightest text-ink sm:text-4xl lg:text-[2.9rem]">
                Two offices, one standard of work
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg leading-relaxed text-steel-600">
                Drop by our registered office in Belagavi or our Bengaluru workspace
                — or simply send your enquiry and we&apos;ll bring the meeting to you.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {site.offices.map((office, i) => (
              <Reveal key={office.label} delay={i * 0.1} amount={0.2}>
                <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-steel-200 bg-white shadow-soft">
                  <div className="p-7 lg:p-8">
                    <div className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
                        <MapPin className="size-[18px]" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                          {office.label}
                        </h3>
                        <address className="mt-2 not-italic leading-relaxed text-steel-600">
                          {office.lines.join(" ")}
                        </address>
                      </div>
                    </div>
                    <a
                      href={office.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-corporate-600 transition-colors hover:text-corporate-700"
                    >
                      Get directions
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </div>
                  <div className="mt-auto border-t border-steel-200">
                    <iframe
                      title={`Map of ${office.label}`}
                      src={`https://www.google.com/maps?q=${office.coords.lat},${office.coords.lng}&z=15&output=embed`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-64 w-full border-0 grayscale-[0.2] lg:h-72"
                    />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
