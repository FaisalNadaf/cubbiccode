/** @format */

"use client";

import { Rocket, Users, Star } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-9";

/**
 * Example usage of <HeroSection />, themed for Cubiccode.
 * Drop into any page (e.g. app/page.tsx) or preview in isolation.
 */
export function HeroSectionDemo() {
	return (
		<HeroSection
			title={
				<>
					Websites that take <br /> ownership of your outcome
				</>
			}
			subtitle="Cubiccode designs, builds and maintains high-performing websites for 500+ brands — a cross-functional team on every engagement, long after launch."
			actions={[
				{
					text: "Get a Proposal",
					href: "/contact",
					variant: "accent",
				},
				{
					text: "See our work",
					href: "/journey",
					variant: "outline",
				},
			]}
			stats={[
				{
					value: "700+",
					label: "Projects shipped",
					icon: <Rocket className="size-5" />,
				},
				{
					value: "500+",
					label: "Happy clients",
					icon: <Users className="size-5" />,
				},
				{
					value: "1M+",
					label: "Daily visitors",
					icon: <Star className="size-5" />,
				},
			]}
			images={[
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
			]}
		/>
	);
}

export default HeroSectionDemo;
