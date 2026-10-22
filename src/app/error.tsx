/**
 * Page-level boundary. The navbar and footer survive here — only the route's
 * own content is replaced — so unlike `global-error.tsx` this can use the
 * site's stylesheet and components, and reads as a page rather than a crash.
 *
 * @format
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

/** Mirrors lib/chunk-recovery — the messages a missing build asset produces. */
const CHUNK_ERROR = /Loading chunk|Loading CSS chunk|dynamically imported module/i;

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// A document older than the deployed build asking for a deleted chunk.
		// Retrying the render cannot conjure the file back; a fresh document can.
		// See lib/chunk-recovery.
		if (CHUNK_ERROR.test(error?.message ?? "")) {
			const url = new URL(window.location.href);
			url.searchParams.set("cc-reload", String(Date.now()));
			window.location.replace(url.toString());
		}
	}, [error]);

	return (
		<section className="relative flex min-h-[80vh] items-center overflow-hidden bg-canvas pt-24 [@media(max-width:1023.98px)]:min-h-[80dvh]">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-radial-fade" />
				<div className="absolute inset-0 bg-grid-steel [background-size:46px_46px] [-webkit-mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
			</div>
			<div className="container-x relative text-center">
				<p className="kicker justify-center">Something went wrong</p>
				<h1 className="mx-auto mt-5 font-display text-5xl font-bold tracking-tightest text-ink sm:text-6xl md:text-7xl lg:text-8xl">
					This page didn&apos;t load
				</h1>
				<p className="mx-auto mt-5 max-w-md text-lg text-steel-600">
					An unexpected error interrupted it. Trying again usually clears
					this — and if it doesn&apos;t, we&apos;d like to hear about it.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button
						onClick={() => reset()}
						arrow>
						Try again
					</Button>
					<Button
						href={routes.contact}
						variant="outline">
						Contact us
					</Button>
				</div>
				{error?.digest && (
					<p className="mt-6 text-sm text-steel-600/70">
						Reference: {error.digest}
					</p>
				)}
			</div>
		</section>
	);
}
