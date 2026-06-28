"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Subtle dual-ring custom cursor. Desktop pointer devices only. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setActive(!!target.closest("a,button,[data-cursor],input,textarea"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{ left: x, top: y }}
        className="pointer-events-none fixed z-[90] hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-600 lg:block"
        animate={{ width: active ? 8 : 6, height: active ? 8 : 6 }}
      />
      <motion.div
        style={{ left: ringX, top: ringY }}
        className="pointer-events-none fixed z-[90] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40 lg:block"
        animate={{
          width: active ? 56 : 34,
          height: active ? 56 : 34,
          borderColor: active ? "rgba(27,110,194,0.6)" : "rgba(11,27,58,0.35)",
          backgroundColor: active ? "rgba(27,110,194,0.06)" : "rgba(27,110,194,0)",
        }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
      />
    </>
  );
}
