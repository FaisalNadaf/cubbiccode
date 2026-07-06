"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { MapPin } from "lucide-react";
import type { Milestone } from "@/content/company";
import { cn } from "@/lib/utils";

/**
 * SCROLL TIMELINE — a cinematic, scroll-driven slideshow of the company journey.
 *
 * The whole thing is one tall wrapper with a `sticky` viewport inside it. As you
 * scroll the wrapper, a single `scrollYProgress` (0 → 1) drives every slide:
 * each milestone cross-dissolves in and out, its year parallaxes, the photos
 * Ken-Burns-zoom and drift at their own depth, and a corporate-blue caption box
 * slides in from the side — a smooth, fully-animated "slide show on scroll".
 *
 * Layout alternates image-left / image-right per milestone. A clickable year rail
 * on the right tracks (and jumps to) the active chapter. Under
 * `prefers-reduced-motion` it falls back to a clean, static stacked timeline.
 */

export function ScrollTimeline({ items }: { items: Milestone[] }) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticTimeline items={items} />;
  return <PinnedTimeline items={items} />;
}

/* ── Theme + geometry helpers ────────────────────────────────────────────── */

/** Slides alternate dark / light so the backdrop fades dark→light→dark on scroll. */
const isDark = (i: number) => i % 2 === 0;

type Theme = {
  base: string; // backdrop fill
  grid: string; // blueprint line color
  vignette: string; // edge darkening
  year: string; // giant-year text class
  yearShadow: string; // giant-year drop shadow class
  ring: string; // photo frame ring class
  imgOverlay: string; // photo top-gradient class
};

const THEME: Record<"dark" | "light", Theme> = {
  dark: {
    base: "#0B1B3A",
    grid: "rgba(255,255,255,0.07)",
    vignette: "rgba(6,15,32,0.72)",
    year: "text-white",
    yearShadow: "[text-shadow:0_20px_60px_rgba(0,0,0,0.5)]",
    ring: "ring-white/15",
    imgOverlay: "from-ink/55",
  },
  light: {
    base: "#ECF1F8",
    grid: "rgba(15,23,42,0.06)",
    vignette: "rgba(11,27,58,0.10)",
    year: "text-ink",
    yearShadow: "[text-shadow:0_20px_50px_rgba(27,110,194,0.18)]",
    ring: "ring-ink/10",
    imgOverlay: "from-ink/25",
  },
};

const themeOf = (i: number) => (isDark(i) ? THEME.dark : THEME.light);

/** Cross-fade keyframes for slide `i`, with clean first/last page endpoints. */
function opacityStops(i: number, total: number) {
  const seg = 1 / total;
  const c = (i + 0.5) * seg;
  const fade = seg * 0.34;
  let input = [c - 2 * fade, c - fade, c + fade, c + 2 * fade];
  let output = [0, 1, 1, 0];
  if (i === 0) {
    input = [-1, 0, c + fade, c + 2 * fade];
    output = [1, 1, 1, 0];
  }
  if (i === total - 1) {
    input = [c - 2 * fade, c - fade, 1, 2];
    output = [0, 1, 1, 1];
  }
  return { input, output, seg, c, fade };
}

/* ── Scroll-pinned slideshow ─────────────────────────────────────────────── */

function PinnedTimeline({ items }: { items: Milestone[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.max(0, Math.min(total - 1, Math.floor(v * total)));
    setActive(idx);
  });

  // Jump the page so the chosen chapter lands at its center.
  const jumpTo = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rectTop = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const p = (i + 0.5) / total;
    window.scrollTo({ top: rectTop + p * travel, behavior: "smooth" });
  };

  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // HUD tint tracks the active slide's theme so it stays legible on both.
  const dark = isDark(active);

  return (
    <section
      ref={wrapRef}
      className="relative bg-ink"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Backdrop — a dark/light theme layer per slide, cross-fading on scroll */}
        <div className="absolute inset-0">
          {items.map((m, i) => (
            <ThemeLayer key={m.year} i={i} total={total} progress={scrollYProgress} />
          ))}
        </div>
        <GlowDrift progress={scrollYProgress} />

        {/* Slides */}
        {items.map((m, i) => (
          <Slide key={m.year} m={m} i={i} total={total} progress={scrollYProgress} />
        ))}

        {/* Top progress bar */}
        <motion.div
          style={{ scaleX: barScaleX }}
          className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-corporate-500 via-corporate-300 to-corporate-500"
        />

        {/* Year rail */}
        <div className="pointer-events-auto absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex xl:right-8">
          {items.map((m, i) => {
            const activeItem = i === active;
            return (
              <button
                key={m.year}
                type="button"
                onClick={() => jumpTo(i)}
                className="group flex items-center gap-2.5"
                aria-label={`Go to ${m.year}`}
              >
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums transition-all duration-500",
                    activeItem
                      ? dark
                        ? "text-white"
                        : "text-ink"
                      : dark
                        ? "text-white/35 group-hover:text-white/70"
                        : "text-ink/40 group-hover:text-ink/70"
                  )}
                >
                  {m.year}
                </span>
                <span
                  className={cn(
                    "h-px rounded-full transition-all duration-500",
                    activeItem
                      ? "w-9 bg-corporate-500"
                      : dark
                        ? "w-4 bg-white/25 group-hover:w-6 group-hover:bg-white/50"
                        : "w-4 bg-ink/20 group-hover:w-6 group-hover:bg-ink/40"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.28em]">
            Scroll to explore
          </span>
          <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/30 p-1">
            <motion.span
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1 rounded-full bg-white/80"
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ── One slide ───────────────────────────────────────────────────────────── */

function Slide({
  m,
  i,
  total,
  progress,
}: {
  m: Milestone;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { input, output, seg, c, fade } = opacityStops(i, total);
  const left = i % 2 === 0; // image on the left this slide?
  const side = left ? 1 : -1; // caption enters from this direction
  const t = themeOf(i); // dark on even slides, light on odd

  // Cross-fade opacity (kept in sync with the matching ThemeLayer).
  const opacity = useTransform(progress, input, output);

  // Depth: photos zoom + drift, year parallaxes faster, caption slides in.
  const imgScale = useTransform(progress, [c - seg, c, c + seg], [1.18, 1, 0.94]);
  const imgY = useTransform(progress, [c - seg, c + seg], [60, -60]);
  const img2Y = useTransform(progress, [c - seg, c + seg], [-50, 70]);
  const yearY = useTransform(progress, [c - seg, c + seg], [90, -90]);
  const yearOpacity = useTransform(
    progress,
    [c - fade * 1.7, c - fade * 0.5, c + fade * 0.5, c + fade * 1.7],
    [0, 1, 1, 0]
  );
  const textX = useTransform(
    progress,
    [c - fade * 1.4, c - fade * 0.2, c + fade * 0.2, c + fade * 1.4],
    [side * 110, 0, 0, side * -70]
  );
  const textOpacity = useTransform(
    progress,
    [c - fade * 1.3, c - fade * 0.2, c + fade * 0.5, c + fade * 1.3],
    [0, 1, 1, 0]
  );

  const count = `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 [will-change:opacity]">
      {/* ── DESKTOP composition ──────────────────────────────── */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="relative mx-auto h-full w-full max-w-[1400px] px-10 xl:px-16">
          {/* Giant year */}
          <motion.div
            style={{ y: yearY, opacity: yearOpacity }}
            className={cn(
              "pointer-events-none absolute top-[13%] z-10",
              left ? "right-[6%] text-right" : "left-[6%] text-left"
            )}
          >
            <span
              className={cn(
                "block font-display font-black leading-[0.8] tracking-tightest transition-colors",
                t.year,
                t.yearShadow
              )}
              style={{ fontSize: "clamp(7rem, 13vw, 13rem)" }}
            >
              {m.year}
            </span>
            <span
              className={cn(
                "mt-4 inline-block h-1 w-24 rounded-full bg-corporate-500",
                left ? "ml-auto" : ""
              )}
            />
          </motion.div>

          {/* Photo cluster */}
          <div
            className={cn(
              "absolute top-1/2 z-20 w-[46%] -translate-y-1/2",
              left ? "left-[5%]" : "right-[5%]"
            )}
          >
            <motion.div
              style={{ y: imgY, scale: imgScale }}
              className={cn(
                "relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 shadow-[0_50px_130px_-40px_rgba(0,0,0,0.6)] [will-change:transform]",
                t.ring
              )}
            >
              <Image
                src={m.image ?? "/images/Moments/1.jpg"}
                alt={m.title}
                fill
                sizes="50vw"
                priority={i === 0}
                className="object-cover"
              />
              <div className={cn("absolute inset-0 bg-gradient-to-t via-transparent to-transparent", t.imgOverlay)} />
            </motion.div>

            {m.image2 && (
              <motion.div
                style={{ y: img2Y }}
                className={cn(
                  "absolute -bottom-12 z-30 w-[50%] overflow-hidden rounded-xl ring-1 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] [will-change:transform]",
                  t.ring,
                  left ? "-right-10" : "-left-10"
                )}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={m.image2}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Caption card */}
          <motion.div
            style={{ x: textX, opacity: textOpacity }}
            className={cn(
              "absolute bottom-[13%] z-30 w-[40%] max-w-[520px] [will-change:transform]",
              left ? "right-[6%]" : "left-[6%]"
            )}
          >
            <div className="rounded-2xl bg-corporate-600/95 p-8 shadow-[0_40px_100px_-30px_rgba(11,27,58,0.9)] ring-1 ring-white/10 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2.5 text-corporate-100">
                <span className="h-px w-7 bg-corporate-200/80" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] tabular-nums">
                  {i === 0 ? "Belagavi, Karnataka" : count}
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold leading-tight text-white xl:text-3xl">
                {m.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85 xl:text-[15px]">
                {m.text}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE composition ───────────────────────────────── */}
      <div className="absolute inset-0 lg:hidden">
        <motion.div style={{ scale: imgScale }} className="absolute inset-0 [will-change:transform]">
          <Image
            src={m.image ?? "/images/Moments/1.jpg"}
            alt={m.title}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30" />

        <motion.span
          style={{ y: yearY, opacity: yearOpacity, fontSize: "clamp(4.5rem, 26vw, 8rem)" }}
          className="pointer-events-none absolute right-5 top-[12%] font-display font-black leading-none tracking-tightest text-white/90 [text-shadow:0_10px_40px_rgba(0,0,0,0.6)]"
        >
          {m.year}
        </motion.span>

        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-x-5 bottom-[12%]"
        >
          <div className="rounded-2xl bg-corporate-600/95 p-6 shadow-2xl ring-1 ring-white/10">
            <div className="mb-3 flex items-center gap-2 text-corporate-100">
              {i === 0 ? (
                <MapPin className="size-3.5" />
              ) : (
                <span className="h-px w-6 bg-corporate-200/80" />
              )}
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] tabular-nums">
                {i === 0 ? "Belagavi, Karnataka" : count}
              </span>
            </div>
            <h3 className="font-display text-xl font-bold leading-tight text-white">
              {m.title}
            </h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-white/85">
              {m.text}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Per-slide theme backdrop (cross-fades dark ⇄ light on scroll) ────────── */

function ThemeLayer({
  i,
  total,
  progress,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { input, output } = opacityStops(i, total);
  const opacity = useTransform(progress, input, output);
  const t = themeOf(i);

  return (
    <motion.div
      style={{ opacity, backgroundColor: t.base }}
      className="absolute inset-0 [will-change:opacity]"
    >
      {/* blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
          backgroundSize: "46px 46px",
        }}
      />
      {/* edge vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 50%, transparent 55%, ${t.vignette} 100%)`,
        }}
      />
    </motion.div>
  );
}

/** A single corporate glow that drifts with scroll — reads on both themes. */
function GlowDrift({ progress }: { progress: MotionValue<number> }) {
  const glowY = useTransform(progress, [0, 1], ["-16%", "16%"]);
  const glowX = useTransform(progress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      style={{ y: glowY, x: glowX }}
      className="pointer-events-none absolute left-1/2 top-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-500/20 blur-[140px]"
    />
  );
}

/* ── Reduced-motion / fallback: clean static stack ───────────────────────── */

function StaticTimeline({ items }: { items: Milestone[] }) {
  return (
    <div>
      {items.map((m, i) => {
        const left = i % 2 === 0;
        const dark = isDark(i);
        const t = themeOf(i);
        return (
          <section
            key={m.year}
            className="relative overflow-hidden py-16 lg:py-24"
            style={{ backgroundColor: t.base }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
                backgroundSize: "46px 46px",
              }}
            />
            <div
              className={cn(
                "container-x relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                !left && "lg:[direction:rtl]"
              )}
            >
              <div
                className={cn(
                  "relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 [direction:ltr]",
                  t.ring
                )}
              >
                <Image
                  src={m.image ?? "/images/Moments/1.jpg"}
                  alt={m.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="[direction:ltr]">
                <p
                  className={cn(
                    "font-display text-6xl font-black leading-none tracking-tightest lg:text-7xl",
                    t.year
                  )}
                >
                  {m.year}
                </p>
                <span className="mt-4 inline-block h-1 w-20 rounded-full bg-corporate-500" />
                <h3
                  className={cn(
                    "mt-5 font-display text-2xl font-bold",
                    dark ? "text-white" : "text-ink"
                  )}
                >
                  {m.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 max-w-xl leading-relaxed",
                    dark ? "text-white/75" : "text-steel-600"
                  )}
                >
                  {m.text}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
