/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { CertificateGallery } from "@/components/certifications/CertificateGallery";
import { site } from "@/content/site";

export const metadata = {
	title: "Certifications  ISO 9001:2015 & Quality Standards | Cubiccode",
	description:
		"Cubiccode Digital Media LLP is ISO 9001:2015 certified. A formally audited quality management system means consistent, reliable, high-quality delivery on every project, every time.",
};

export default function CertificationsPage() {
	return (
		<>
			<PageHero
				kicker="Credentials"
				title="Legitimate, certified, and accountable."
				subtitle="With years of trusted service and every legal registration in place, we take pride in being a company you can depend on."
				image="/images/about/parallax-2.jpg"
				imageAlt="Cubiccode's quality-certified delivery process"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: "/about" },
					{ label: "Certifications" },
				]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href={site.proposalCta}
						external
						variant="accent"
						arrow>
						Start a project
					</Button>
					<Button
						href="/achievements"
						variant="outline">
						See our awards
					</Button>
				</div>
			</PageHero>

			{/* Certificate gallery */}
			<section className="section relative overflow-hidden bg-canvas-soft">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_25%,#000,transparent)] opacity-50" />
				<div className="container-x relative">
					<CertificateGallery />
				</div>
			</section>
		</>
	);
}
