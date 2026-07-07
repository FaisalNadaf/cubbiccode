/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 *
 * @format
 */

import {
	Handshake,
	Search,
	FileSignature,
	Wallet,
	Headphones,
	TrendingUp,
	ShieldCheck,
	Layers,
} from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata = {
	title: "Become a Sales Partner  Grow With Cubiccode",
	description:
		"Refer clients, earn recurring commissions and let Cubiccode handle delivery. Partner with an ISO 9001:2015 certified company trusted by 500+ businesses across India.",
};

const steps = [
	{
		icon: Search,
		title: "Spot the opportunity",
		text: "Anyone in your network who needs a website, web app, ERP or digital growth is a potential referral.",
	},
	{
		icon: Handshake,
		title: "Introduce us",
		text: "Make the connection. Our team runs discovery, scopes the work and presents a clear, professional proposal.",
	},
	{
		icon: FileSignature,
		title: "We deliver",
		text: "Cubiccode handles design, engineering, delivery and support  to the quality our 500+ clients expect.",
	},
	{
		icon: Wallet,
		title: "You earn",
		text: "Receive an attractive commission on closed projects, with transparent tracking every step of the way.",
	},
];

const benefits = [
	{
		icon: TrendingUp,
		title: "Recurring earning potential",
		text: "Strong commissions on every project you bring in  and repeat business as clients grow with us.",
	},
	{
		icon: ShieldCheck,
		title: "A brand you can trust",
		text: "Refer with confidence: an ISO 9001:2015 certified company, founded in 2016, with a proven track record.",
	},
	{
		icon: Layers,
		title: "Full-stack capability",
		text: "Websites, web apps, custom ERP, SEO, training and remote teams  one partner covers nearly any need.",
	},
	{
		icon: Headphones,
		title: "We do the heavy lifting",
		text: "You make the introduction; we manage scoping, delivery and client success end to end.",
	},
];

export default function PartnerPage() {
	return (
		<>
			<PageHero
				kicker="Become a sales partner"
				title="Grow your income by connecting businesses with great software"
				subtitle="Have a network of businesses that need a stronger digital presence? Refer them to Cubiccode, let us handle delivery, and earn for every project that closes."
				image="/images/Moments/devfest2022_2.jpg"
				imageAlt="Partner with the Cubiccode team"
				breadcrumb={[{ label: "Home", href: "/" }, { label: "Sales Partner" }]}>
				<div className="flex flex-wrap items-center gap-4">
					<Button
						href="/contact"
						arrow>
						Become a partner
					</Button>
					<Button
						href={site.whatsapp}
						external
						variant="outline">
						Chat on WhatsApp
					</Button>
				</div>
			</PageHero>

			{/* How it works */}
			<section className="relative overflow-hidden bg-canvas py-20 lg:py-28">
				<div className="pointer-events-none absolute inset-0 bg-radial-fade" />
				<div className="container-x relative">
					<SectionHeading
						align="center"
						kicker="How the partnership works"
						title="Four simple steps from referral to reward"
						intro="A straightforward, transparent model. You bring the relationship  we bring the delivery."
					/>

					<RevealGroup
						stagger={0.08}
						className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{steps.map((s, i) => (
							<RevealItem key={s.title}>
								<div className="group relative flex h-full flex-col rounded-4xl border border-steel-200 bg-white p-7 shadow-soft transition-shadow hover:shadow-card">
									<span className="absolute right-6 top-6 font-display text-3xl font-bold tracking-tightest text-steel-100">
										{String(i + 1).padStart(2, "0")}
									</span>
									<span className="flex size-12 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 transition-colors group-hover:bg-corporate-600 group-hover:text-white">
										<s.icon className="size-5" />
									</span>
									<h3 className="mt-6 font-display text-lg font-bold tracking-tight text-ink">
										{s.title}
									</h3>
									<p className="mt-2 leading-relaxed text-steel-600">
										{s.text}
									</p>
								</div>
							</RevealItem>
						))}
					</RevealGroup>
				</div>
			</section>

			{/* Benefits */}
			<section className="relative overflow-hidden bg-canvas-soft py-20 lg:py-28">
				<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-60" />
				<div className="container-x relative">
					<SectionHeading
						kicker="Why partner with us"
						title="A partnership built to reward the right introductions"
						intro="We invest in our partners because great referrals deserve great returns  and a delivery team that makes you look good."
					/>

					<RevealGroup
						stagger={0.08}
						className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
						{benefits.map((b) => (
							<RevealItem key={b.title}>
								<div className="flex h-full gap-5 rounded-4xl border border-steel-200 bg-white p-7 shadow-soft lg:p-8">
									<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
										<b.icon className="size-5" />
									</span>
									<div>
										<h3 className="font-display text-lg font-bold tracking-tight text-ink">
											{b.title}
										</h3>
										<p className="mt-2 leading-relaxed text-steel-600">
											{b.text}
										</p>
									</div>
								</div>
							</RevealItem>
						))}
					</RevealGroup>

					<Reveal delay={0.1}>
						<div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-4xl border border-steel-200 bg-white p-8 shadow-soft sm:flex-row lg:p-10">
							<div className="max-w-xl">
								<h3 className="font-display text-xl font-bold tracking-tight text-ink">
									Ready to start referring?
								</h3>
								<p className="mt-2 leading-relaxed text-steel-600">
									Send us a quick note about yourself and your network
									we&apos;ll set you up and share everything you need to get
									going.
								</p>
							</div>
							<div className="flex shrink-0 flex-wrap gap-4">
								<Button
									href="/contact"
									arrow>
									Apply to partner
								</Button>
								<Button
									href={site.whatsapp}
									external
									variant="outline">
									WhatsApp us
								</Button>
							</div>
						</div>
					</Reveal>
				</div>
			</section>
		</>
	);
}
