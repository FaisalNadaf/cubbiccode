/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import {
  Rocket,
  TrendingUp,
  GraduationCap,
  BadgeCheck,
  Mail,
  MessageCircle,
  Users,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata = {
  title: "Careers at Cubiccode  Join the Team & CareerJump",
  description:
    "Build real products used by 500+ clients. Join Cubiccode Digital Media LLP  an ISO 9001:2015 certified company offering genuine growth, mentorship and training. Apply now.",
};

const values = [
  {
    icon: Rocket,
    title: "Real projects, real impact",
    text: "No busy work. From day one you ship production systems that power ₹4,185M+ in transactions for 500+ clients.",
  },
  {
    icon: TrendingUp,
    title: "Growth you can measure",
    text: "Clear paths, real ownership and the chance to outgrow your role. We promote from within and back ambition.",
  },
  {
    icon: GraduationCap,
    title: "Mentorship & training",
    text: "Learn from engineers who've built at scale. Structured upskilling, code reviews and full-stack training built in.",
  },
  {
    icon: BadgeCheck,
    title: "An ISO-certified home",
    text: "An ISO 9001:2015 certified company with nearly a decade of stability  process, quality and a team that has your back.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers · CareerJump"
        title="Build the web with people who care about the craft"
        subtitle="We're a full-stack team that designs, engineers and grows real products. If you want to do your best work alongside people who'll push you to be better  let's talk."
        image="/images/Moments/devfest2022_2.jpg"
        imageAlt="The Cubiccode team at a community developer event"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={`mailto:${site.email}?subject=Career application`} arrow>
            Apply now
          </Button>
          <Button href={site.whatsapp} external variant="outline">
            Chat on WhatsApp
          </Button>
        </div>
      </PageHero>

      {/* Why join */}
      <section className="relative overflow-hidden bg-canvas py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="Why Cubiccode"
            title="A place to grow, not just a place to work"
            intro="We've spent nearly a decade building a team that ships brilliant work and genuinely enjoys it. Here's what you can expect."
          />

          <RevealGroup
            stagger={0.08}
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {values.map((v) => (
              <RevealItem key={v.title}>
                <div className="group flex h-full gap-5 rounded-4xl border border-steel-200 bg-white p-7 shadow-soft transition-shadow hover:shadow-card lg:p-8">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 transition-colors group-hover:bg-corporate-600 group-hover:text-white">
                    <v.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                      {v.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-steel-600">
                      {v.text}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Openings / general application */}
      <section className="relative overflow-hidden bg-canvas-soft py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-60" />
        <div className="container-x relative">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-5xl border border-steel-200 bg-white shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr]">
              <div className="p-8 lg:p-12">
                <span className="kicker">
                  <Users className="size-[14px]" /> Open applications
                </span>
                <h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.1] tracking-tightest text-ink sm:text-4xl">
                  Don&apos;t see your exact role? Reach out anyway.
                </h2>
                <p className="mt-5 leading-relaxed text-steel-600">
                  We hire across engineering, design, SEO, content and operations 
                  and we&apos;re always glad to meet sharp, curious people. Send your
                  CV and a line about what you&apos;d love to build, and we&apos;ll
                  take it from there.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    href={`mailto:${site.email}?subject=Career application&body=Hi Cubiccode team,%0D%0A%0D%0AI'd love to join. Here's a bit about me:`}
                    arrow
                  >
                    <Mail className="size-4" /> Email your CV
                  </Button>
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-corporate-600 transition-colors hover:text-corporate-700"
                  >
                    <MessageCircle className="size-4" /> Or message us on WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative flex flex-col justify-center gap-5 border-t border-steel-200 bg-ink p-8 text-white lg:border-l lg:border-t-0 lg:p-12">
                <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.14]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-corporate-200">
                    <Sparkles className="size-3.5" /> Life at Cubiccode
                  </span>
                  <ul className="mt-6 space-y-4 text-sm leading-relaxed text-steel-200">
                    {[
                      "Ship work used by household brands and ambitious startups alike.",
                      "Learn fast with mentorship, reviews and full-stack training.",
                      "Belagavi & Bengaluru offices with a collaborative culture.",
                      "Stability of a 2016-founded, ISO-certified company.",
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-corporate-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
