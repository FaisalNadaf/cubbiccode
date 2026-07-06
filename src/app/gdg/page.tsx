/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import {
  Users,
  CalendarDays,
  Code2,
  Heart,
  Megaphone,
  MapPin,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata = {
  title: "GDG Belgaum — The Developer Community Cubiccode Supports",
  description:
    "Cubiccode proudly supports GDG Belgaum, a Google Developer Group bringing local developers together through meetups and events like DevFest Belgaum. A community initiative.",
};

const pillars = [
  {
    icon: Code2,
    title: "Developers, together",
    text: "GDG Belgaum brings together engineers, students and tech enthusiasts to learn modern tools, frameworks and Google technologies.",
  },
  {
    icon: CalendarDays,
    title: "Meetups & DevFest",
    text: "From hands-on sessions to flagship events like DevFest Belgaum, the community creates space to learn, build and connect.",
  },
  {
    icon: Heart,
    title: "Powered by passion",
    text: "It's volunteer-run and community-first — knowledge shared freely, friendships made and local talent given a stage.",
  },
];

export default function GdgPage() {
  return (
    <>
      <PageHero
        kicker="Community initiative"
        title="GDG Belgaum — a home for developers in our city"
        subtitle="Cubiccode is proud to support GDG Belgaum, a local Google Developer Group that brings the region's builders together to learn, share and grow."
        image="/images/Moments/DSC_5539.JPG"
        imageAlt="The GDG Belgaum developer community at DevFest"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "GDG Belgaum" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-4 py-2 text-sm font-medium text-steel-600 shadow-soft">
            <MapPin className="size-4 text-corporate-500" /> Belagavi, Karnataka
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-4 py-2 text-sm font-medium text-steel-600 shadow-soft">
            <Users className="size-4 text-corporate-500" /> Open to all developers
          </span>
        </div>
      </PageHero>

      {/* Community blurb */}
      <section className="relative overflow-hidden bg-canvas py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <Reveal>
              <div>
                <span className="kicker">
                  <Megaphone className="size-[14px]" /> About the community
                </span>
                <h2 className="mt-5 text-pretty font-display text-3xl font-bold leading-[1.1] tracking-tightest text-ink sm:text-4xl">
                  A developer community, supported with pride
                </h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-steel-600">
                  <p>
                    Google Developer Groups are local communities of developers
                    interested in Google&apos;s technologies — from Android and web to
                    cloud and AI. GDG Belgaum brings that spirit to our city, with
                    meetups, talks and hands-on sessions open to everyone.
                  </p>
                  <p>
                    As a local technology company, Cubiccode is glad to play a small
                    part — including building the website for{" "}
                    <span className="font-semibold text-ink">DevFest Belgaum</span>,
                    the community&apos;s flagship event. We believe a stronger local
                    developer ecosystem lifts everyone.
                  </p>
                  <p className="text-base text-steel-500">
                    GDG Belgaum is an independent, volunteer-run community initiative.
                    Cubiccode supports it as a contributor and well-wisher.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div className="relative overflow-hidden rounded-5xl border border-white/10 bg-ink p-8 text-white shadow-card lg:p-10">
                <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:36px_36px] opacity-[0.16]" />
                <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-corporate-500/25 blur-3xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-corporate-200">
                    <Code2 className="size-3.5" /> Why it matters
                  </span>
                  <p className="mt-6 text-pretty font-display text-2xl font-semibold leading-snug tracking-tight">
                    &ldquo;Communities like GDG Belgaum turn curious learners into
                    confident builders — right here in our city.&rdquo;
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                    <div className="bg-ink p-5">
                      <p className="font-display text-2xl font-bold tracking-tightest text-white">
                        Meetups
                      </p>
                      <p className="mt-1 text-sm text-steel-300">
                        Talks, workshops & code labs
                      </p>
                    </div>
                    <div className="bg-ink p-5">
                      <p className="font-display text-2xl font-bold tracking-tightest text-white">
                        DevFest
                      </p>
                      <p className="mt-1 text-sm text-steel-300">
                        The flagship annual event
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative overflow-hidden bg-canvas-soft py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-60" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="What the community is about"
            title="Learn, build and belong"
          />

          <RevealGroup
            stagger={0.1}
            className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {pillars.map((p) => (
              <RevealItem key={p.title}>
                <div className="flex h-full flex-col rounded-4xl border border-steel-200 bg-white p-8 text-center shadow-soft">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
                    <p.icon className="size-5" />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-steel-600">{p.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <p className="max-w-xl leading-relaxed text-steel-600">
                Want to collaborate, speak at a meetup, or have Cubiccode support a
                community event? We&apos;d love to hear from you.
              </p>
              <Button href="/contact" arrow>
                Get in touch
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
