/**
 * Document cache policy.
 *
 * Next.js serves every prerendered page with `Cache-Control: s-maxage=31536000`
 * — a shared-cache lifetime of one year. That is safe on a CDN that is purged
 * as part of the deploy, and fatal on one that is not: our CDN (Hostinger's
 * `hcdn`) simply held the HTML, so visitors kept being served documents from
 * builds that no longer existed.
 *
 * That breaks the page rather than merely dating it. Every `<script>` in a Next
 * document is content-hashed (`webpack-<hash>.js`), and a deploy replaces those
 * files rather than adding to them — the previous build's chunks are deleted.
 * So year-old HTML asks for chunks that now 404: nothing hydrates, and when the
 * runtime does boot far enough to hit a missing chunk React throws and the page
 * is replaced by "Application error: a client-side exception has occurred".
 *
 * The asset headers are already right — content-hashed files under
 * `/_next/static` are genuinely immutable and are excluded below so they keep
 * their one-year `immutable`. It is only the *document*, which names those
 * hashes, that must not outlive the build it was rendered from. A minute of
 * shared cache plus a five-minute stale-while-revalidate window keeps the CDN
 * doing its job (a deploy propagates in about a minute instead of a year) while
 * the browser is told to always revalidate, so no visitor holds a stale copy
 * of its own.
 */

import { NextResponse } from "next/server";

/**
 * `max-age=0, must-revalidate` targets the browser, `s-maxage` the CDN. They
 * are deliberately different: a private cache has nothing to gain from holding
 * a document that names build assets, while the shared cache in front of the
 * origin still absorbs the traffic.
 */
const DOCUMENT_CACHE_CONTROL =
	"public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=300";

export function middleware() {
	const response = NextResponse.next();
	response.headers.set("Cache-Control", DOCUMENT_CACHE_CONTROL);
	return response;
}

export const config = {
	/**
	 * Documents only. `/_next/static` and `/_next/image` are excluded so their
	 * correct `immutable` headers survive, and the file-extension tail leaves
	 * everything served straight out of `public/` (images, fonts, favicon,
	 * sitemap, robots) on its own default caching.
	 */
	matcher: [
		"/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|woff|woff2|ttf|otf|mp4|webm|pdf)$).*)",
	],
};
