"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CTASection } from "@/components/layout/CTASection";
import { Button } from "@/components/ui/Button";
import { featuredProjects, websiteProjects } from "@/content/portfolio";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const bentoSpans = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-12",
];

const categories = ["All", ...Array.from(new Set(websiteProjects.map((p) => p.category)))];

export default function PortfolioPage() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? websiteProjects
        : websiteProjects.filter((p) => p.category === active),
    [active]
  );

  return (
    <>
      {/* Hero (non-PageHero, since client) */}
      <section className="relative overflow-hidden border-b border-steel-200 bg-canvas pb-16 pt-36 lg:pb-20 lg:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-radial-fade" />
          <div className="absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(75%_55%_at_50%_0%,#000,transparent)]" />
        </div>

        <div className="container-x relative">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="kicker"
            >
              Website portfolio
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tightest text-ink sm:text-5xl lg:text-6xl"
            >
              Crafted with love. <span className="text-gradient">Built with passion.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 text-pretty text-lg leading-relaxed text-steel-600"
            >
              A living showcase of 42+ live websites we&apos;ve designed, engineered and
              shipped — for manufacturers, hospitals, schools, retailers and startups
              across India and beyond. Every one is in production. Visit them yourself.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button href={site.proposalCta} external variant="accent" arrow>
                Get a Proposal
              </Button>
              <Button href="/case-studies" variant="outline">
                View case studies
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured bento grid */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="kicker">Featured launches</span>
              <h2 className="mt-5 text-pretty text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl">
                Flagship websites, captured live
              </h2>
              <p className="mt-5 text-base leading-relaxed text-steel-600 sm:text-lg">
                A handful of our favourite builds — hover to open them in a new tab.
              </p>
            </div>
          </div>

          <div className="mt-12 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-12">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                className={cn("min-h-[260px] sm:min-h-0", bentoSpans[i])}
              >
                <a
                  href={`https://${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block h-full overflow-hidden rounded-3xl border border-steel-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift"
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} — built by Cubiccode`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 lg:p-6">
                    <div className="translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
                      <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                        {p.category}
                      </span>
                      <h3 className="mt-2.5 text-lg font-semibold text-white lg:text-xl">
                        {p.name}
                      </h3>
                      <p className="text-[12.5px] text-steel-300">{p.url}</p>
                    </div>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable full grid */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="kicker">The full library</span>
              <h2 className="mt-5 text-pretty text-3xl font-semibold leading-[1.08] text-ink sm:text-4xl">
                Every live website, in one place
              </h2>
              <p className="mt-5 text-base leading-relaxed text-steel-600 sm:text-lg">
                Filter by what you&apos;re looking for. Each card links straight to the
                live site.
              </p>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = active === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-white" : "text-steel-600 hover:text-ink"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-ink shadow-soft"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full border border-steel-200 bg-white" />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            layout
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.a
                  key={p.url}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
                  href={`https://${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift"
                >
                  {/* blueprint texture */}
                  <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:30px_30px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-corporate-400/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between">
                    {/* monogram */}
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-steel-200 bg-canvas-soft font-display text-xl font-bold text-ink transition-colors duration-300 group-hover:border-corporate-200 group-hover:bg-white group-hover:text-corporate-600">
                      {p.name.charAt(0)}
                    </span>
                    <span className="inline-flex rounded-full border border-steel-200 bg-canvas-soft px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-steel-500">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-pretty text-xl font-semibold leading-snug text-ink">
                    {p.name}
                  </h3>

                  <div className="relative mt-auto flex items-center gap-1.5 pt-6 text-[13.5px] font-medium text-steel-500 transition-colors group-hover:text-corporate-600">
                    <span className="truncate">{p.url}</span>
                    <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
