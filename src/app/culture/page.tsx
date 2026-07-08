/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { CultureMosaic } from "@/components/culture/CultureMosaic";

export const metadata = {
	title: "Company Culture  Life at Cubiccode | Cubiccode",
	description:
		"A glimpse of life at Cubiccode  the people, moments and everyday culture behind nearly a decade of on-time, customer-centric delivery.",
};

export default function CulturePage() {
	return (
		<section className="relative min-h-screen w-screen overflow-hidden bg-canvas pt-[82px]">
			<h1 className="sr-only">Company Culture at Cubiccode</h1>
			<CultureMosaic />
		</section>
	);
}
