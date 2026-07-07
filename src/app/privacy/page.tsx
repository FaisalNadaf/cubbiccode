/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 *
 * @format
 */

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata = {
	title: "Privacy Policy | Cubiccode",
	description:
		"How Cubiccode Digital Media LLP collects, uses and protects your personal data, your rights, and how to contact us about privacy.",
};

const updated = "22 June 2026";

export default function PrivacyPage() {
	return (
		<>
			<PageHero
				kicker="Legal"
				title="Privacy Policy"
				subtitle={`How ${site.legalName} collects, uses and protects your information, and the choices you have.`}
				breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
			/>

			<section className="relative overflow-hidden bg-canvas py-16 lg:py-24">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative">
					<Reveal>
						<article className="mx-auto max-w-3xl">
							<p className="text-sm text-steel-500">Last updated: {updated}</p>

							<div className="mt-8 space-y-10 text-[15.5px] leading-relaxed text-steel-600">
								<section>
									<p>
										{site.legalName} (&ldquo;Cubiccode&rdquo;, &ldquo;we&rdquo;,
										&ldquo;us&rdquo; or &ldquo;our&rdquo;) respects your privacy
										and is committed to protecting your personal data. This
										policy explains what we collect when you use our website or
										engage our services, how we use it, and the rights available
										to you.
									</p>
								</section>

								<Clause
									n="1"
									title="Information we collect">
									<p>
										We may collect the following, depending on how you interact
										with us:
									</p>
									<ul className="mt-3 space-y-2">
										<ListItem>
											<strong className="text-ink">Contact details</strong> you
											provide through our enquiry form or by email, phone or
											WhatsApp such as your name, email address, phone number
											and message.
										</ListItem>
										<ListItem>
											<strong className="text-ink">Project information</strong>{" "}
											you share with us when discussing or delivering an
											engagement.
										</ListItem>
										<ListItem>
											<strong className="text-ink">Usage data</strong> such as
											your IP address, browser type, pages visited and referring
											source, collected automatically to help us improve the
											site.
										</ListItem>
									</ul>
								</Clause>

								<Clause
									n="2"
									title="How we use your information">
									<p>We use the information we collect to:</p>
									<ul className="mt-3 space-y-2">
										<ListItem>
											respond to your enquiries and provide the services you
											request;
										</ListItem>
										<ListItem>
											communicate with you about projects, proposals and
											support;
										</ListItem>
										<ListItem>
											operate, secure, maintain and improve our website; and
										</ListItem>
										<ListItem>
											comply with our legal and regulatory obligations.
										</ListItem>
									</ul>
									<p className="mt-3">
										We do not sell your personal data, and we only send
										marketing communications where you have agreed to receive
										them.
									</p>
								</Clause>

								<Clause
									n="3"
									title="Cookies & analytics">
									<p>
										Our website may use cookies and similar technologies to
										remember your preferences and understand how the site is
										used. You can control or disable cookies through your
										browser settings; doing so may affect some functionality.
										Where we use analytics tools, they help us measure traffic
										and improve content.
									</p>
								</Clause>

								<Clause
									n="4"
									title="How we share information">
									<p>
										We may share your information with trusted service providers
										who help us operate our website and deliver our services
										(for example, hosting or analytics providers), under
										appropriate confidentiality obligations. We may also
										disclose information where required by law or to protect our
										legal rights. We do not share your data for any other
										purpose without your consent.
									</p>
								</Clause>

								<Clause
									n="5"
									title="Data retention & security">
									<p>
										We retain personal data only for as long as necessary to
										fulfil the purposes described in this policy or as required
										by law. We apply reasonable technical and organisational
										measures to protect your information against loss, misuse
										and unauthorised access. As an ISO 9001:2015 certified
										company, we maintain documented processes around quality and
										information handling.
									</p>
								</Clause>

								<Clause
									n="6"
									title="Your rights">
									<p>
										Subject to applicable law, you may request access to,
										correction of, or deletion of the personal data we hold
										about you, and you may withdraw consent to marketing at any
										time. To exercise any of these rights, please contact us
										using the details below.
									</p>
								</Clause>

								<Clause
									n="7"
									title="Third-party links">
									<p>
										Our website may link to external sites we do not operate.
										This policy does not apply to those sites, and we encourage
										you to review their privacy practices separately.
									</p>
								</Clause>

								<Clause
									n="8"
									title="Changes to this policy">
									<p>
										We may update this Privacy Policy from time to time. The
										latest version will always appear on this page with a
										revised &ldquo;last updated&rdquo; date.
									</p>
								</Clause>
							</div>

							<div className="mt-12 rounded-3xl border border-steel-200 bg-canvas-soft p-6 text-[15px] leading-relaxed text-steel-600 sm:p-7">
								<p className="font-display font-semibold text-ink">
									Contact us about your privacy
								</p>
								<p className="mt-2">
									For any privacy questions or requests, contact{" "}
									{site.legalName} at{" "}
									<a
										href={`mailto:${site.email}`}
										className="font-medium text-corporate-600 hover:text-corporate-700">
										{site.email}
									</a>{" "}
									or call{" "}
									<a
										href={`tel:${site.primaryPhoneRaw}`}
										className="font-medium text-corporate-600 hover:text-corporate-700">
										{site.phones[0]}
									</a>
									. Registered office: {site.offices[0].lines.join(" ")}
								</p>
							</div>
						</article>
					</Reveal>
				</div>
			</section>
		</>
	);
}

function Clause({
	n,
	title,
	children,
}: {
	n: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section>
			<h2 className="font-display text-xl font-bold tracking-tight text-ink">
				<span className="mr-2 text-corporate-500">{n}.</span>
				{title}
			</h2>
			<div className="mt-3">{children}</div>
		</section>
	);
}

function ListItem({ children }: { children: React.ReactNode }) {
	return (
		<li className="flex gap-3">
			<span className="mt-2 size-1.5 shrink-0 rounded-full bg-corporate-400" />
			<span>{children}</span>
		</li>
	);
}
