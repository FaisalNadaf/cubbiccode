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
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.certifications);

export default function CertificationsPage() {
	return (
		<>
			<PageHero
				kicker="Credentials"
				title="Legitimate, certified, and accountable."
				subtitle="With years of trusted service and every legal registration in place, we take pride in being a company you can depend on."
				image="/images/Headerimages/Screenshot 2026-07-14 211158.png"
				imageAlt="Cubiccode's framed certificates, including the ISO 9001:2015 and incorporation certificates"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: routes.about },
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
						href={routes.achievements}
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
