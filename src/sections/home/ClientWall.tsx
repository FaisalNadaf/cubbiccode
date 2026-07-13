/** @format */

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { featuredClients, namedClients } from "@/content/clients";

function LogoCell({ name, logo }: { name: string; logo: string }) {
	return (
		<div className="mx-3 flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-steel-200 bg-white p-3 shadow-soft">
			<Image
				src={logo}
				alt={name}
				width={200}
				height={96}
				className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
			/>
		</div>
	);
}

function NameChip({ name }: { name: string }) {
	return (
		<span className="mx-2 inline-flex shrink-0 items-center rounded-full border border-steel-200 bg-canvas-soft px-4 py-2 text-sm font-medium text-steel-600">
			{name}
		</span>
	);
}

export function ClientWall() {
	// split named clients into two rows for the chip marquees
	const half = Math.ceil(namedClients.length / 2);
	const rowA = namedClients.slice(0, half);
	const rowB = namedClients.slice(half);

	// split featured logos so each marquee row shows a distinct set
	const logoHalf = Math.ceil(featuredClients.length / 2);
	const logosA = featuredClients.slice(0, logoHalf);
	const logosB = featuredClients.slice(logoHalf);

	return (
		<section className="section relative overflow-hidden bg-canvas">
			<div className="container-x">
				<SectionHeading
					align="center"
					kicker="Trusted by"
					title="The brands that trust us to build."
					intro="From local champions to household names we're honoured to serve 500+ businesses across almost every state in the country."
				/>
			</div>

			<div className="mt-14 space-y-4">
				<Marquee speed={44}>
					{logosA.map((c) => (
						<LogoCell
							key={c.name}
							{...c}
						/>
					))}
				</Marquee>
				<Marquee
					speed={50}
					reverse>
					{logosB.map((c) => (
						<LogoCell
							key={c.name}
							name={c.name}
							logo={c.logo}
						/>
					))}
				</Marquee>
			</div>

			<div className="container-x mt-12 flex justify-center">
				<Reveal>
					<Link
						href="/clientele"
						className="group tap-target-h inline-flex items-center gap-3 rounded-full border border-steel-200 bg-canvas-soft px-5 py-2.5 text-sm text-steel-600 transition-colors duration-300 hover:border-corporate-300 hover:bg-white hover:text-ink">
						<span className="font-display text-xl font-bold text-ink">
							500+
						</span>
						most trusted companies, served globally
						<ArrowRight className="size-4 text-steel-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-corporate-600" />
					</Link>
				</Reveal>
			</div>
		</section>
	);
}
