"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack } from "@/content/tech";
import { getTechIcon, getTechIconColor } from "@/content/techIcons";
import { cn } from "@/lib/utils";

/**
 * TECH ECOSYSTEM — an interactive radial hub on a light canvas.
 *
 * The Cubiccode logo sits at the centre; every capability orbits it and is wired
 * back with a corporate-blue pulse flowing along the connector ("blood flow").
 * Hovering a node dims the rest, brightens its wire and *spreads its individual
 * technologies out around it* as big brand-coloured icons. The constellation
 * tilts gently toward the cursor and a soft glow trails the pointer. Below `lg`
 * it collapses to a clean icon grid. All motion respects reduced-motion.
 */

const SPRING = { stiffness: 120, damping: 20, mass: 0.4 };
const FLOW_DASH = 14; // length of the travelling pulse (px)

export function TechEcosystem() {
  return (
    <section className="relative overflow-hidden bg-canvas py-20 lg:pt-24 lg:pb-40">
      {/* dotted texture + ambient corporate glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,27,58,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-500/10 blur-[150px]"
      />

      <div className="container-x relative">
        <SectionHeading
          align="center"
          kicker="Technologies we work with"
          title="One stack, wired end to end."
          intro="Frontend to backend, cloud to AI, automation to analytics — hover any layer to see the exact tools we build with."
        />

        {/* Desktop: interactive radial hub */}
        <div className="relative mt-28 hidden lg:block">
          <RadialHub />
        </div>

        {/* Mobile / tablet: icon grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {techStack.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-steel-200 bg-white p-4 text-center shadow-soft"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-corporate-50 text-corporate-600 ring-1 ring-inset ring-corporate-100">
                <Icon name={cat.icon} className="size-6" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-steel-600">
                {cat.label}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {cat.items.slice(0, 5).map((it) => {
                  const IconComp = getTechIcon(it);
                  return (
                    <span
                      key={it}
                      className="grid size-7 place-items-center rounded-lg bg-steel-50 ring-1 ring-inset ring-steel-200"
                      title={it}
                    >
                      <IconComp
                        className="size-4"
                        style={{ color: getTechIconColor(it) }}
                      />
                    </span>
                  );
                })}
              </div>
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
  const [size, setSize] = useState({ w: 1180, h: 700 });
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
  const rotateY = useSpring(useTransform(mx, (v) => v * 9), SPRING);
  const rotateX = useSpring(useTransform(my, (v) => v * -9), SPRING);
  const glowX = useSpring(gx, { stiffness: 120, damping: 24 });
  const glowY = useSpring(gy, { stiffness: 120, damping: 24 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gx.set(x);
    gy.set(y);
    // Freeze the tilt while a node is focused so its spread stays steady.
    if (!reduce && hovered === null) {
      mx.set(x / rect.width - 0.5);
      my.set(y / rect.height - 0.5);
    }
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(null);
  };

  // Node geometry on an ellipse around the centre (kept inset so the hover
  // spread has room to breathe without clipping the stage).
  const cx = size.w / 2;
  const cy = size.h / 2;
  const nodes = useMemo(() => {
    // Rounder + taller ellipse so the three nodes stacked on each side don't
    // collide (adjacent side-nodes sit ~0.5·ry apart vertically).
    const rx = size.w * 0.38;
    const ry = size.h * 0.39;
    return techStack.map((cat, i) => {
      const angle = (i / techStack.length) * Math.PI * 2 - Math.PI / 2;
      // Push the two horizontal-pole nodes farther out so their circular
      // hover-spread clears the centre logo and their diagonal neighbours.
      const far =
        cat.label === "SEO & Analytics" || cat.label === "CMS & E-Commerce";
      const rxi = far ? rx * 1.1 : rx;
      return {
        cat,
        angle,
        x: cx + rxi * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
      };
    });
  }, [size, cx, cy]);

  return (
    <div
      className="relative h-[620px] w-full lg:h-[780px]"
      style={{ perspective: 1400 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Pointer-trailing glow (screen space) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-0 size-[440px] rounded-full bg-corporate-400/15 blur-[120px]"
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
                  stroke="rgba(11,27,58,0.12)"
                  strokeWidth={1}
                  style={{ opacity: dim ? 0.4 : 1, transition: "opacity .3s" }}
                />
                {/* flowing pulse */}
                {!reduce && (
                  <motion.line
                    x1={n.x}
                    y1={n.y}
                    x2={cx}
                    y2={cy}
                    stroke="#1B6EC2"
                    strokeWidth={active ? 3 : 1.6}
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
                      filter: "drop-shadow(0 0 5px rgba(27,110,194,0.55))",
                      opacity: dim ? 0.15 : active ? 1 : 0.7,
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tech nodes + their hover spread */}
        {nodes.map((n, i) => {
          const active = hovered === i;
          const dim = hovered !== null && !active;
          return (
            <div
              key={n.cat.label}
              className="absolute"
              style={{
                left: n.x,
                top: n.y,
                transform: "translate(-50%, -50%)",
                zIndex: active ? 40 : 10,
              }}
              onMouseEnter={() => setHovered(i)}
            >
              {/* Spread of individual technologies around the node */}
              <AnimatePresence>
                {active &&
                  n.cat.items.map((it, k) => {
                    const total = n.cat.items.length;
                    // Spread the technologies evenly on *every* side — a full
                    // ring around the node.
                    const a = -Math.PI / 2 + (k / total) * Math.PI * 2;
                    // Push icons clear of the node card, a touch farther the more
                    // there are so they never crowd each other.
                    const R = 150 + Math.min(22, Math.max(0, total - 6) * 9);
                    const dx = Math.cos(a) * R;
                    const dy = Math.sin(a) * R;
                    const IconComp = getTechIcon(it);
                    return (
                      <motion.div
                        key={it}
                        className="pointer-events-none absolute left-1/2 top-1/2 z-50"
                        initial={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
                        animate={{ x: dx, y: dy, scale: 1, opacity: 1 }}
                        exit={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 19,
                          delay: k * 0.03,
                        }}
                      >
                        <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5">
                          <span
                            className="grid size-16 place-items-center rounded-2xl border border-steel-200 bg-white shadow-[0_8px_24px_-6px_rgba(11,27,58,0.25)]"
                            title={it}
                          >
                            <IconComp
                              className="size-8"
                              style={{ color: getTechIconColor(it) }}
                            />
                          </span>
                          <span className="max-w-[104px] truncate rounded-full bg-white px-2 py-0.5 text-center text-[10px] font-semibold text-steel-700 shadow-sm ring-1 ring-steel-200">
                            {it}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              {/* Node card */}
              <motion.div
                animate={{ scale: active ? 1.1 : 1, opacity: dim ? 0.4 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={cn(
                  "relative flex w-[136px] cursor-default flex-col items-center gap-2.5 rounded-2xl border bg-white px-3 py-4 shadow-soft transition-colors duration-300",
                  active ? "border-corporate-300 shadow-card" : "border-steel-200"
                )}
              >
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl ring-1 ring-inset transition-colors duration-300",
                    active
                      ? "bg-corporate-500 text-white ring-corporate-400"
                      : "bg-corporate-50 text-corporate-600 ring-corporate-100"
                  )}
                >
                  <Icon name={n.cat.icon} className="size-7" />
                </span>
                <span className="text-center text-[11px] font-semibold uppercase leading-tight tracking-wide text-steel-600">
                  {n.cat.label}
                </span>
              </motion.div>
            </div>
          );
        })}

        {/* Centre hub — Cubiccode logo */}
        <div
          className="absolute left-1/2 top-1/2 z-20"
          style={{ transform: "translate(-50%, -50%) translateZ(50px)" }}
        >
          {/* glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-400/25 blur-3xl"
          />
          {/* pulsing rings */}
          {!reduce &&
            [0, 1].map((r) => (
              <motion.span
                key={r}
                aria-hidden
                className="absolute left-1/2 top-1/2 -z-10 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-corporate-300/60"
                animate={{ scale: [0.7, 1.6], opacity: [0.55, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: r * 1.5,
                }}
              />
            ))}
          <div className="relative flex items-center justify-center rounded-3xl border border-steel-200 bg-white px-11 py-8 shadow-[0_16px_70px_rgba(27,110,194,0.28)]">
            <Image
              src="/brand/logo.png"
              alt="Cubiccode Digital Media LLP"
              width={240}
              height={64}
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
