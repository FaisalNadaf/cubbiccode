"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { values } from "@/content/company";

const card: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function ValuesGrid() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
      className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {values.map((v, i) => (
        <motion.article
          key={v.title}
          variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : card}
          whileHover={reduce ? undefined : { y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-8 shadow-soft transition-shadow duration-300 hover:shadow-lift"
        >
          {/* Hover glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-corporate-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex items-center justify-between">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 transition-all duration-300 group-hover:bg-corporate-600 group-hover:text-white">
              <Icon name={v.icon} className="size-7" />
            </span>
            <span className="font-display text-5xl font-bold leading-none text-steel-100 transition-colors duration-300 group-hover:text-corporate-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="relative mt-7 text-xl font-semibold text-ink">{v.title}</h3>
          <p className="relative mt-3 text-pretty leading-relaxed text-steel-600">
            {v.text}
          </p>
        </motion.article>
      ))}
    </motion.div>
  );
}
