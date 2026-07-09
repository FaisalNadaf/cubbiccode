"use client";

import { useRef } from "react";
import CountUp from "react-countup";
import { useInView, useReducedMotion } from "framer-motion";

export function CountStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();

  // Reduced motion: render the final formatted value immediately — no count-up,
  // no spinning digits. The number is content, so it must be readable at rest.
  const settled = `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return (
    <span ref={ref} className={className}>
      {reduce ? (
        settled
      ) : inView ? (
        <CountUp
          end={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={duration}
          separator=","
          useEasing
        />
      ) : (
        <>
          {prefix}0{suffix}
        </>
      )}
    </span>
  );
}
