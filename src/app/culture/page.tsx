/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { CultureMosaic } from "@/components/culture/CultureMosaic";

export const metadata = {
	title: "Company Culture  Life at Cubiccode | Cubiccode",
	description:
		"A glimpse of life at Cubiccode  the people, moments and everyday culture behind nearly a decade of on-time, customer-centric delivery.",
};

export default function CulturePage() {
	return (
		<>
			<PageHero
				kicker="Life at Cubiccode"
				title="The people behind nearly a decade of on-time delivery."
				subtitle="Lean, agile and obsessed with the outcome  a glimpse of the moments and everyday culture that shape how we work."
				image="/images/Moments/EPCSCL06-GroupPicture.JPG"
				imageAlt="The Cubiccode team"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: "/about" },
					{ label: "Company Culture" },
				]}
			/>

			{/* The hero now carries the page's <h1>, so the mosaic no longer needs
			    its own screen-reader heading or navbar offset. */}
			<section className="relative w-screen overflow-hidden bg-canvas">
				<CultureMosaic />
			</section>
		</>
	);
}
