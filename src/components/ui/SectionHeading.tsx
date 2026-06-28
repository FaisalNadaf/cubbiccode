import { cn } from "@/lib/utils";
import { SplitReveal } from "./SplitReveal";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  className,
  light = false,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <Reveal>
          <span className={cn("kicker", align === "center" && "justify-center")}>
            {kicker}
          </span>
        </Reveal>
      )}
      <SplitReveal
        as="h2"
        className={cn(
          "mt-5 text-pretty text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[2.9rem]",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </SplitReveal>
      {intro && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed sm:text-lg",
              light ? "text-steel-200" : "text-steel-600"
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
