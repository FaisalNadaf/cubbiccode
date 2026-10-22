/**
 * Last-resort boundary: an error thrown by the root layout itself, which no
 * page-level `error.tsx` can catch. Without this file Next renders its own
 * bare fallback — the unstyled "Application error: a client-side exception has
 * occurred" line, on a blank page, with no way forward but the back button.
 *
 * This replaces the entire document, root layout included, so it carries its
 * own <html>/<body> and cannot rely on the app's stylesheet being present —
 * hence inline styles rather than Tailwind classes. It is also, by definition,
 * rendering because something in the shell already failed, so it depends on
 * nothing but React.
 *
 * @format
 */

"use client";

import { useEffect } from "react";

/** Mirrors lib/chunk-recovery — the messages a missing build asset produces. */
const CHUNK_ERROR = /Loading chunk|Loading CSS chunk|dynamically imported module/i;

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// A chunk that 404s means this document is older than the deployed build
		// (see lib/chunk-recovery). `reset()` would only re-run the same failing
		// render against the same missing file; a fresh document is the only
		// thing that can actually fix it.
		if (CHUNK_ERROR.test(error?.message ?? "")) {
			const url = new URL(window.location.href);
			url.searchParams.set("cc-reload", String(Date.now()));
			window.location.replace(url.toString());
		}
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "24px",
					background: "#F7F7F5",
					color: "#151415",
					fontFamily:
						"ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
				}}>
				<main style={{ maxWidth: "34rem", textAlign: "center" }}>
					<h1
						style={{
							margin: 0,
							fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
							fontWeight: 700,
							letterSpacing: "-0.03em",
						}}>
						Something went wrong
					</h1>
					<p
						style={{
							margin: "1rem 0 0",
							fontSize: "1.05rem",
							lineHeight: 1.6,
							color: "#55555A",
						}}>
						This page hit an unexpected error. Reloading usually clears it.
					</p>
					<div
						style={{
							marginTop: "1.75rem",
							display: "flex",
							gap: "0.75rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}>
						<button
							type="button"
							onClick={() => reset()}
							style={{
								cursor: "pointer",
								border: "1px solid #151415",
								background: "#151415",
								color: "#fff",
								borderRadius: "999px",
								padding: "0.7rem 1.5rem",
								font: "inherit",
								fontWeight: 600,
							}}>
							Try again
						</button>
						{/* A real document request, not next/link: the router is part of
						    what just failed, so a client-side navigation would re-enter
						    the broken tree instead of leaving it. */}
						{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
						<a
							href="/"
							style={{
								border: "1px solid rgba(21,20,21,0.2)",
								borderRadius: "999px",
								padding: "0.7rem 1.5rem",
								color: "#151415",
								textDecoration: "none",
								fontWeight: 600,
							}}>
							Back to home
						</a>
					</div>
					{/* The digest is the only handle on the server-side stack for a
					    minified production error, so it is worth showing when there is
					    one — it is what makes a bug report actionable. */}
					{error?.digest && (
						<p
							style={{
								marginTop: "1.5rem",
								fontSize: "0.8rem",
								color: "#8A8A90",
							}}>
							Reference: {error.digest}
						</p>
					)}
				</main>
			</body>
		</html>
	);
}
