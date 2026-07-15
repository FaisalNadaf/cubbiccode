/**
 * Collect.chat — the guarded edge of a third-party global.
 *
 * `launcher.js` appends its widget straight to <body>, outside React, and hangs
 * an API on `window.collectchat` (verified against the bundle: load / open /
 * close / toggle / on / is). The global may never arrive: the script is deferred
 * until the visitor's first interaction, and an ad-blocker or a downed CDN can
 * stop it outright — so nothing here assumes it exists, and the site is expected
 * to work exactly the same when it doesn't.
 *
 * There is also no ready event we can await from outside their bundle, hence the
 * poll in `onCollectChat`.
 *
 * @format
 */

type CollectChatEvent = "open" | "close" | "complete" | "message";

type CollectChatApi = {
	open?: () => void;
	on?: (event: CollectChatEvent, cb: (details?: unknown) => void) => void;
};

/** The bot id, from the embed snippet. Read by `launcher.js` at execution time. */
export const COLLECT_ID = "5c017eed001a8304e04b7ffc";

export const COLLECT_LAUNCHER_SRC = "https://collectcdn.com/launcher.js";

function api(): CollectChatApi | undefined {
	if (typeof window === "undefined") return undefined;
	return (window as unknown as { collectchat?: CollectChatApi }).collectchat;
}

/**
 * Opens the bot. Returns false when the launcher isn't there — still deferred,
 * ad-blocked, or the CDN is down — so the caller can send the visitor somewhere
 * that works instead. A widget that failed to load must never leave someone
 * pressing a button that does nothing.
 */
export function openCollectChat(): boolean {
	const cc = api();
	if (typeof cc?.open !== "function") return false;
	cc.open();
	return true;
}

/**
 * Subscribes once the launcher exists. Polls, because `launcher.js` lands on
 * idle and we deliberately defer it behind the first interaction — a short
 * fixed window would expire before the script had even been requested.
 * Returns a cleanup function.
 */
export function onCollectChat(
	event: CollectChatEvent,
	cb: () => void,
): () => void {
	if (typeof window === "undefined") return () => {};

	let cancelled = false;
	const poll = window.setInterval(() => {
		if (cancelled) return;
		const cc = api();
		if (typeof cc?.on !== "function") return;
		window.clearInterval(poll);
		cc.on(event, cb);
	}, 250);

	// Stop polling for a script that is plainly never coming.
	const giveUp = window.setTimeout(() => window.clearInterval(poll), 30_000);

	return () => {
		cancelled = true;
		window.clearInterval(poll);
		window.clearTimeout(giveUp);
	};
}
