/**
 * Every capability and industry page lives at the root of the domain, on a flat
 * keyword-first URL (see `content/capabilities.ts` / `content/industries.ts`).
 *
 * Two sibling dynamic segments cannot both sit at the root — Next refuses two
 * routes that resolve to the same path — so this single `[slug]` route owns the
 * space and dispatches on which content set claims the slug. Static folders
 * (/contact-details-…, /web-application-development-portfolio, …) still win over
 * it, and `dynamicParams = false` 404s anything neither list knows.
 *
 * @format
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { capabilities, capabilityByPathSegment } from "@/content/capabilities";
import { industries, industryByPathSegment } from "@/content/industries";
import { buildMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { CapabilityView } from "./capability-view";
import { IndustryView } from "./industry-view";

export const dynamicParams = false;

export function generateStaticParams() {
	return [...capabilities, ...industries].map((entry) => ({
		slug: entry.path.slice(1),
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const entry = capabilityByPathSegment(slug) ?? industryByPathSegment(slug);
	if (!entry) return {};
	return buildMetadata({
		title: entry.metaTitle,
		description: entry.metaDescription,
		path: entry.path,
		keywords: [entry.title, `${entry.title} in Belgaum`, `${entry.title} India`],
	});
}

export default async function SlugPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const cap = capabilityByPathSegment(slug);
	const ind = cap ? undefined : industryByPathSegment(slug);
	const entry = cap ?? ind;
	if (!entry) notFound();

	return (
		<>
			<JsonLd
				data={[
					serviceJsonLd({
						name: entry.title,
						description: entry.metaDescription,
						path: entry.path,
					}),
					breadcrumbJsonLd([
						{ name: "Home", path: "/" },
						{ name: entry.title, path: entry.path },
					]),
				]}
			/>
			{cap ?
				<CapabilityView cap={cap} />
			:	<IndustryView ind={ind!} />}
		</>
	);
}
