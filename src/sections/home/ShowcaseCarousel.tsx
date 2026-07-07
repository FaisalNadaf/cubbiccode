/** @format */

import { Carousel } from "@/components/ui/carousel";
import { showcaseSlides } from "@/content/showcase";

/**
 * Dark, minimal stage for the premium showcase carousel  the white outlines
 * and glassy card read best against a near-black canvas with a soft top glow.
 */
export function ShowcaseCarousel() {
	return (
		<section className="relative overflow-hidden bg-[#0A0B0D] py-20 text-white lg:py-28">
			{/* Soft top glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)]"
			/>
			<div className="container-x relative">
				<Carousel slides={showcaseSlides} />
			</div>
		</section>
	);
}
