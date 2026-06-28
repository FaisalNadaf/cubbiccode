"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack } from "@/content/tech";
import { cn } from "@/lib/utils";

/**
 * TECH ECOSYSTEM — an interactive radial hub.
 *
 * The Cubiccode logo sits at the centre; every technology orbits it and is wired
 * back to the hub with a connector that has a corporate-blue pulse flowing along
 * it ("blood flow"). The whole constellation tilts in 3D toward the cursor, a
 * glow trails the pointer, and hovering a node focuses its line + reveals its
 * stack. Below `lg` it collapses to a clean icon grid.
 */

const SPRING = { stiffness: 120, damping: 18, mass: 0.4 };
const FLOW_DASH = 14; // length of the travelling pulse (px)

export function TechEcosystem() {
  return (
    <section className="relative overflow-hidden bg-[#070809] py-20 text-white lg:py-28">
      {/* dotted texture + ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-600/10 blur-[140px]"
      />
  
      <div className="container-x relative">
        <SectionHeading
          align="center"
          light
          kicker="Technologies we work with"
          title="One stack, wired end to end."
          intro="Frontend to backend, cloud to AI, automation to analytics — every layer connects back to the way we build."
        />

        {/* Desktop: interactive radial hub */}
        <div className="relative mt-10 hidden lg:block">
          <RadialHub />
        </div>

        {/* Mobile / tablet: icon grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {techStack.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-corporate-500/15 text-corporate-300 ring-1 ring-inset ring-white/10">
                <Icon name={cat.icon} className="size-5" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Radial hub ──────────────────────────────────────────────────────────── */

function RadialHub() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1100, h: 640 });
  const [hovered, setHovered] = useState<number | null>(null);

  // Measure the stage so nodes + SVG share one pixel coordinate space.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pointer-driven tilt + glow.
  const mx = useMotionValue(0); // -0.5..0.5
  const my = useMotionValue(0);
  const gx = useMotionValue(size.w / 2);
  const gy = useMotionValue(size.h / 2);
  const rotateY = useSpring(useTransform(mx, (v) => v * 14), SPRING);
  const rotateX = useSpring(useTransform(my, (v) => v * -14), SPRING);
  const glowX = useSpring(gx, { stiffness: 120, damping: 22 });
  const glowY = useSpring(gy, { stiffness: 120, damping: 22 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gx.set(x);
    gy.set(y);
    if (!reduce) {
      mx.set(x / rect.width - 0.5);
      my.set(y / rect.height - 0.5);
    }
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(null);
  };

  // Node geometry on an ellipse around the centre.
  const cx = size.w / 2;
  const cy = size.h / 2;
  const nodes = useMemo(() => {
    const rx = size.w * 0.42;
    const ry = size.h * 0.4;
    const cX = size.w / 2;
    const cY = size.h / 2;
    return techStack.map((cat, i) => {
      const angle = (i / techStack.length) * Math.PI * 2 - Math.PI / 2;
      return {
        cat,
        x: cX + rx * Math.cos(angle),
        y: cY + ry * Math.sin(angle),
      };
    });
  }, [size]);

  return (
    <div
      className="relative h-[600px] w-full lg:h-[660px]"
      style={{ perspective: 1300 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Pointer-trailing glow (screen space) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-0 size-[420px] rounded-full bg-corporate-500/15 blur-[110px]"
        style={{ left: glowX, top: glowY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Tilting constellation */}
      <motion.div
        ref={wrapRef}
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Connector lines */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
          fill="none"
        >
          {nodes.map((n, i) => {
            const len = Math.hypot(n.x - cx, n.y - cy);
            const active = hovered === i;
            const dim = hovered !== null && !active;
            return (
              <g key={i}>
                {/* faint base wire */}
                <line
                  x1={n.x}
                  y1={n.y}
                  x2={cx}
                  y2={cy}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                />
                {/* flowing pulse */}
                {!reduce && (
                  <motion.line
                    x1={n.x}
                    y1={n.y}
                    x2={cx}
                    y2={cy}
                    stroke="#4F9DFF"
                    strokeWidth={active ? 3 : 2}
                    strokeLinecap="round"
                    strokeDasharray={`${FLOW_DASH} ${len}`}
                    animate={{ strokeDashoffset: [0, -(FLOW_DASH + len)] }}
                    transition={{
                      duration: Math.max(0.9, len / (active ? 320 : 150)),
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.12,
                    }}
                    style={{
                      filter: "drop-shadow(0 0 5px rgba(79,157,255,0.9))",
                      opacity: dim ? 0.2 : active ? 1 : 0.85,
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tech nodes */}
        {nodes.map((n, i) => {
          const active = hovered === i;
          const dim = hovered !== null && !active;
          const below = n.y > cy;
          return (
            <div
              key={n.cat.label}
              className="absolute"
              style={{ left: n.x, top: n.y, transform: "translate(-50%, -50%)" }}
              onMouseEnter={() => setHovered(i)}
            >
              <motion.div
                animate={{ scale: active ? 1.12 : 1, opacity: dim ? 0.55 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex w-[116px] cursor-default flex-col items-center gap-2 rounded-2xl border bg-white/[0.04] px-3 py-3 backdrop-blur-sm transition-colors duration-300",
                  active ? "border-corporate-400/70 bg-white/[0.08]" : "border-white/12"
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl ring-1 ring-inset ring-white/10 transition-colors duration-300",
                    active
                      ? "bg-corporate-500 text-white"
                      : "bg-corporate-500/15 text-corporate-300"
                  )}
                >
                  <Icon name={n.cat.icon} className="size-5" />
                </span>
                <span className="text-center text-[10.5px] font-semibold uppercase tracking-wide text-white/75">
                  {n.cat.label}
                </span>
              </motion.div>

              {/* Stack tooltip */}
              {active && (
                <motion.div
                  initial={{ opacity: 0, y: below ? -6 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "absolute left-1/2 z-30 w-48 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0c0e13] p-2.5 shadow-2xl",
                    below ? "bottom-full mb-2" : "top-full mt-2"
                  )}
                >
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {n.cat.items.slice(0, 6).map((it) => (
                      <span
                        key={it}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/65"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Centre hub — Cubiccode logo */}
        <div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: "translate(-50%, -50%) translateZ(40px)" }}
        >
          {/* glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-500/30 blur-3xl"
          />
          {/* pulsing rings */}
          {!reduce &&
            [0, 1].map((r) => (
              <motion.span
                key={r}
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-corporate-400/40"
                animate={{ scale: [0.7, 1.5], opacity: [0.5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: r * 1.5,
                }}
              />
            ))}
          <div className="relative flex items-center justify-center rounded-2xl border border-white/15 bg-white px-6 py-4 shadow-[0_0_60px_rgba(79,157,255,0.55)]">
            <Image
              src="/brand/logo.png"
              alt="Cubiccode Digital Media LLP"
              width={170}
              height={44}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
