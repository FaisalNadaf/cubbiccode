"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Route transition (App Router `template.tsx` re-mounts on every navigation).
 *
 *  • Content does an OPACITY-ONLY crossfade  no transform/filter, so sticky &
 *    fixed descendants (e.g. the Capabilities sticky panel, the navbar) are not
 *    broken by a transformed ancestor.
 *  • A branded "curtain" wipes up to reveal the new route  but ONLY on client
 *    navigations, never on the first hard load (module flag below), so the very
 *    first paint is instant and there is no reverse-flash of content.
 *  • Fully disabled under prefers-reduced-motion.
 *  • SSR / no-JS safe: see the <noscript> override in app/layout.tsx that forces
 *    [data-route-fade] back to opacity:1 when JS is unavailable.
 */

// Flipped to true after the first load so the curtain only plays on real navs.
let firstLoadDone = false;

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [playCurtain, setPlayCurtain] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (!firstLoadDone) {
      firstLoadDone = true;
      return; // skip the curtain on the initial hard load
    }
    setPlayCurtain(true);
  }, [reduce]);

  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        data-route-fade
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      {playCurtain && (
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.6, ease: CURTAIN_EASE }}
          onAnimationComplete={() => setPlayCurtain(false)}
          style={{ transformOrigin: "top" }}
          className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-ink"
        >
          <div className="absolute inset-0 bg-blueprint [background-size:40px_40px] opacity-[0.14]" />
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-display text-2xl font-bold tracking-tightest text-white"
          >
            cubic<span className="text-corporate-400">code</span>
          </motion.span>
        </motion.div>
      )}
    </>
  );
}
