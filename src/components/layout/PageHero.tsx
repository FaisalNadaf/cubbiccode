import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  title,
  subtitle,
  breadcrumb,
  children,
  align = "left",
  className,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-steel-200 bg-canvas pb-16 pt-36 lg:pb-20 lg:pt-44",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(75%_55%_at_50%_0%,#000,transparent)]" />
      </div>

      <div className="container-x relative">
        <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
          {breadcrumb && (
            <Reveal>
              <nav className={cn("mb-6 flex items-center gap-1.5 text-[12.5px] text-steel-500", align === "center" && "justify-center")}>
                {breadcrumb.map((b, i) => (
                  <span key={b.label} className="inline-flex items-center gap-1.5">
                    {b.href ? (
                      <Link href={b.href} className="hover:text-ink">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="text-ink">{b.label}</span>
                    )}
                    {i < breadcrumb.length - 1 && (
                      <ChevronRight className="size-3.5 text-steel-300" />
                    )}
                  </span>
                ))}
              </nav>
            </Reveal>
          )}

          {kicker && (
            <Reveal>
              <span className={cn("kicker", align === "center" && "justify-center")}>
                {kicker}
              </span>
            </Reveal>
          )}

          <SplitReveal
            as="h1"
            play="mount"
            delay={0.1}
            className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tightest text-ink sm:text-5xl lg:text-6xl"
          >
            {title}
          </SplitReveal>

          {subtitle && (
            <Reveal delay={0.25}>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-steel-600">
                {subtitle}
              </p>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.35}>
              <div className="mt-8">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
