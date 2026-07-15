/** @format */

import { featuredProjects } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/carousel";
import type { ShowcaseSlide } from "@/content/showcase";
import { routes } from "@/lib/routes";

// The sites featured on the home page, shown in this order.
const HOME_SHOWCASE_URLS = [
	"thesilverora.com",
	"simple.life",
	"positron-he.com",
	"harsharakesh.com",
	"madhtara.com",
	"foraam.com",
	"mabdaglobal.com/en",
	"kajalagrawal.com",
	"woodpeckerexotica.com",
	"rareu.in",
];

// Curated featured projects mapped into the shared carousel's slide shape.
const slides: ShowcaseSlide[] = HOME_SHOWCASE_URLS.map((url) =>
	featuredProjects.find((p) => p.url === url),
)
	.filter((p): p is (typeof featuredProjects)[number] => Boolean(p))
	.map((p) => ({
		id: p.url,
		eyebrow: p.category,
		title: p.name,
		description: p.blurb,
		cta: { label: "Visit site", href: `https://${p.url}` },
		image: p.image,
	}));

export function PortfolioShowcase() {
	return (
		// Height-locked to the viewport only at lg. Below it the heading plus the
		// carousel's wrapping thumbnail rail leave the card almost no room, so the
		// section is allowed to grow and scroll instead.
		<section className="relative flex h-auto w-full flex-col mt-20 overflow-hidden bg-canvas-soft lg:h-screen lg:w-screen">
			{/* Ambient brand-colour blur shades */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-0">
				<div className="absolute -left-28 top-1/4 size-[26rem] rounded-full bg-corporate-400/20 blur-[130px]" />
				<div className="absolute -right-20 bottom-[-4rem] size-[30rem] rounded-full bg-corporate-500/15 blur-[150px]" />
				<div className="absolute left-1/2 top-[-6rem] size-80 -translate-x-1/2 rounded-full bg-ink/10 blur-[120px]" />
			</div>

			<div className="container-x relative z-10 flex h-full flex-col py-8 lg:py-10">
				{/* Heading row  fixed at top */}
				<div className="flex shrink-0 flex-col items-start justify-between gap-5 md:flex-row md:items-center px-0 lg:px-10">
					<SectionHeading
						kicker="Our work"
						title="700+ builds. Here are a few we're proud of."
						intro="A glimpse of the brands we've helped launch, scale and grow."
					/>
					<Button
						href={routes.portfolio}
						variant="outline"
						arrow
						className="shrink-0">
						View full portfolio
					</Button>
				</div>

				{/* Carousel fills + is centred in the remaining space (capped on big screens).
				    `fill` needs a definite height or the absolutely-positioned slide
				    collapses, so below lg  where there is no viewport-locked space to
				    flex into  the rail is given an explicit one instead. It grows with
				    the breakpoint because the card stacks its 16/10 image under the copy
				    until lg puts them side by side. */}
				<div className="mt-6 flex h-[760px] min-h-0 items-center sm:h-[820px] md:h-[940px] lg:mt-8 lg:h-auto lg:flex-1">
					<Carousel
						slides={slides}
						theme="light"
						fill
						className="max-h-none lg:max-h-[600px]"
					/>
				</div>
			</div>
		</section>
	);
}
