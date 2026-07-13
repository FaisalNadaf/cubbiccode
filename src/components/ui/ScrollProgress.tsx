"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

export function ScrollProgress() {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      // The spring is driven in JS, so the global reduced-motion rule in
      // globals.css (which only neutralises CSS animations/transitions) never
      // reaches it. Track scroll position directly instead.
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-corporate-500 via-corporate-600 to-ink"
    />
  );
}
