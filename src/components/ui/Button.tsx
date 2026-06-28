import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./MagneticButton";

const button = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white shadow-soft hover:shadow-lift hover:bg-corporate-700",
        accent:
          "bg-corporate-600 text-white shadow-soft hover:bg-corporate-500 hover:shadow-glow",
        outline:
          "border border-steel-300 bg-white/70 text-ink hover:border-ink hover:bg-white",
        ghost: "text-ink hover:bg-steel-100",
        white: "bg-white text-ink shadow-soft hover:shadow-lift",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-7 text-[15px]",
        lg: "h-14 px-9 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = {
  href?: string;
  external?: boolean;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  external,
  arrow,
  magnetic = true,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(button({ variant, size }), className);

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight className="relative z-10 size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      )}
    </>
  );

  const node = href ? (
    <Link
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </Link>
  ) : (
    <button className={classes} {...props}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
