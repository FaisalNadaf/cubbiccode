# Cubiccode — Industrial Corporate Website

A premium, industrial-corporate website for **Cubiccode Digital Media LLP**, built with Next.js 15.
Strict **light theme** (steel / corporate-blue / deep-navy accents), visual-first, and animation-rich
— engineered to communicate trust, authority and scale.

All copy, statistics, client names, testimonials, awards and case studies are the **real Cubiccode
content** extracted from the existing cubiccode.in site.

## Tech stack

- **Next.js 15** (App Router, Server Components, SSG) + **TypeScript**
- **Tailwind CSS** (custom industrial design system)
- **Framer Motion** — reveals, mega-menu, carousels, 3D-tilt
- **GSAP + ScrollTrigger** — pinned horizontal scroll, split-text reveals
- **Lenis** — smooth scroll (wired into the GSAP ticker)
- **SplitType** — line-clipped heading reveals
- **react-countup** — animated metrics
- **Embla Carousel** — testimonials
- **lucide-react** — icons

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (34 routes, fully static)
npm start
```

> **Windows / OneDrive note:** building inside a OneDrive-synced folder can intermittently lock
> `.next` files (causing a `_document.js` / `middleware-manifest` worker error). If that happens,
> pause OneDrive sync during `npm run build`, or move the project off the synced path. A clean
> `.next` build with no other `node` process running completes successfully.

## Project structure

```
src/
  app/                     # routes (home, who-we-are, capabilities, industries, work, contact, legal)
    capabilities/[slug]/   # 6 service pages (data-driven)
    industries/[slug]/     # 9 industry pages (data-driven)
    sitemap.ts, robots.ts  # SEO
  components/
    layout/   Navbar (glass mega-menu, hide-on-scroll), Footer, PageHero, CTASection
    ui/       Button, Reveal, SplitReveal, Marquee, Stat (CountUp), SectionHeading,
              Magnetic, Cursor, ScrollProgress, Icon, Logo
    providers/SmoothScroll (Lenis)
  sections/home/           # the 9 home-page sections
  content/                 # ALL real Cubiccode content as typed data (single source of truth)
public/
  brand/                   # logo, favicon
  images/                  # clients, certificates, portfolio, testimonials, about, press
```

To change any copy, stat, client, award or case study, edit the files in **`src/content/`** —
the whole site reads from there.

## Adding real media later (drop-in points)

The current build uses crafted CSS / blueprint / gradient visuals as premium stand-ins wherever no
real asset existed in the source mirror. To upgrade to real footage/photography, drop files into
`public/` and wire them in:

| Where | What to add | File to edit |
|-------|-------------|--------------|
| Hero background | `public/video/hero.mp4` montage | `src/sections/home/Hero.tsx` (replace the CSS beam/particle layer with a muted autoplay `<video>`) |
| Founder section | founder portrait + intro video | `src/app/founders/page.tsx` (replace the monogram panel + 16:9 placeholder) |
| Culture page | team / office photos | `src/app/culture/page.tsx` (culture-wall mosaic tiles) |
| Portfolio | the remaining ~36 project screenshots | add to `public/images/portfolio/`, reference in `src/content/portfolio.ts` |
| Testimonials | video testimonials | `src/sections/home/Testimonials.tsx` |

## Notes

- **Accessibility / reduced motion:** all heavy animation (Lenis, GSAP, split-text, custom cursor)
  is disabled under `prefers-reduced-motion`.
- **SEO:** dynamic metadata per route, sitemap, robots, semantic headings, fully static output.
- The contact form is client-side only (no backend in this repo): on submit it surfaces the real
  WhatsApp / email / phone channels. Wire it to an API route or form service to capture leads.
```
