import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sections/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    // Tailwind's defaults, plus three breakpoints the navbar needs. The desktop
    // bar has to fit a ~190px logo, six nav pills and a ~225px CTA on one line,
    // which needs roughly 1150px of container width — well past `lg`. These are
    // spelled out here rather than in `extend` so they land in min-width order
    // and utility precedence stays correct (a `navlg:` rule must win over a
    // `navmd:` one).
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      /** Desktop nav turns on: tightest tier that still fits the full bar. */
      navsm: "1100px",
      navmd: "1200px",
      xl: "1280px",
      /** Container has hit its 1360px cap — the bar can breathe from here up. */
      navlg: "1360px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Industrial light-theme system
        ink: {
          DEFAULT: "#0B1B3A", // deep navy  primary text / brand
          900: "#081427",
          800: "#0B1B3A",
          700: "#13284f",
        },
        steel: {
          50: "#F6F8FB",
          100: "#EEF2F7",
          200: "#E1E7EF",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        corporate: {
          DEFAULT: "#1B6EC2", // corporate blue accent
          50: "#EAF2FB",
          100: "#D3E4F6",
          200: "#A7C9ED",
          300: "#6FA6DF",
          400: "#3F86D0",
          500: "#1B6EC2",
          600: "#155BA3",
          700: "#0F4C81",
          800: "#0B3A63",
          900: "#082b4a",
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F8FA",
          silver: "#EDF0F4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "serif"],
      },
      fontSize: {
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "9xl": ["8rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "10xl": ["10rem", { lineHeight: "0.92", letterSpacing: "-0.045em" }],
      },
      letterSpacing: {
        tightest: "-0.045em",
        kicker: "0.22em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(11,27,58,0.06), 0 8px 30px -12px rgba(11,27,58,0.12)",
        card: "0 1px 2px rgba(11,27,58,0.04), 0 12px 40px -16px rgba(11,27,58,0.16)",
        lift: "0 30px 70px -30px rgba(11,27,58,0.28)",
        glow: "0 0 0 1px rgba(27,110,194,0.12), 0 20px 50px -20px rgba(27,110,194,0.35)",
      },
      backgroundImage: {
        "grid-steel":
          "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(27,110,194,0.10) 0%, rgba(255,255,255,0) 70%)",
        "blueprint":
          "linear-gradient(to right, rgba(27,110,194,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,110,194,0.07) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(0deg) scale(1)" },
          "20%": { transform: "rotate(-10deg) scale(1.12)" },
          "45%": { transform: "rotate(9deg) scale(1.12)" },
          "70%": { transform: "rotate(-5deg) scale(1.06)" },
          "85%": { transform: "rotate(3deg) scale(1.03)" },
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration,40s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--marquee-duration,40s) linear infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        float: "float 6s ease-in-out infinite",
        wiggle: "wiggle 0.7s ease-in-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
