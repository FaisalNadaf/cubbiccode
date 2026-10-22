/**
 * Recovery from a document that outlived its build.
 *
 * See `src/middleware.ts` for the cause. The cache policy there stops new stale
 * documents being *stored*; this is what rescues a visitor already holding one
 * — from the CDN, from their own browser cache, or from a tab left open across
 * a deploy. Nothing in a stale document can be fixed by shipping better code,
 * because the stale document is the old code; the only move available to it is
 * to notice that its assets are gone and go and fetch itself again.
 *
 * Two failure shapes, and neither reaches a React error boundary:
 *
 *  • The runtime chunk 404s. React never boots at all, so there is no boundary
 *    to catch anything. The server-rendered HTML sits there looking correct and
 *    completely dead — no navigation, no menu, no forms.
 *  • A later chunk 404s. React boots, throws mid-render, and Next replaces the
 *    page with "Application error: a client-side exception has occurred".
 *
 * A capture-phase `error` listener installed before Next's own scripts catches
 * both, because both begin as a failed asset load.
 *
 * The reload carries a cache-busting parameter. A plain `location.reload()`
 * would ask the same edge node for the same URL and be handed the same cached
 * document; a URL the CDN has never seen is a guaranteed miss and so a
 * guaranteed fresh build. The parameter is stripped from the address bar as
 * soon as the retry lands, and every page sets its own canonical URL, so it
 * cannot leak into a bookmark or an index.
 */

/** Marks a document as the product of a retry, and busts the CDN cache key. */
const PARAM = "cc-reload";
/** Timestamp of the last retry, so a broken build cannot start a reload loop. */
const KEY = "cc-chunk-reload";
/**
 * A second failure sooner than this is a real fault rather than a stale
 * document — one retry could not fix it and a hundred will not either, so the
 * error is allowed to surface instead.
 */
const COOLDOWN_MS = 30_000;

/**
 * Runs inline in <head>, ahead of every other script, so no chunk can fail
 * before the listener exists. Minified by hand to keep the head small, and
 * written in ES5 with no dependency on anything Next loads — the entire point
 * is that it works when the bundle does not.
 */
export const CHUNK_RECOVERY_SCRIPT = `(function(){var P=${JSON.stringify(
	PARAM,
)},K=${JSON.stringify(KEY)},C=${COOLDOWN_MS};try{var u=new URL(location.href);if(u.searchParams.has(P)){u.searchParams.delete(P);history.replaceState(history.state,"",u.pathname+u.search+u.hash)}}catch(e){}var done=false;function recover(){if(done)return;done=true;var last=0;try{last=parseInt(sessionStorage.getItem(K)||"0",10)||0}catch(e){}if(Date.now()-last<C)return;try{sessionStorage.setItem(K,String(Date.now()))}catch(e){}try{var v=new URL(location.href);v.searchParams.set(P,String(Date.now()));location.replace(v.toString())}catch(e){location.reload()}}addEventListener("error",function(e){var t=e.target;if(!t||t===window)return;var s=t.src||t.href||"";if((t.tagName==="SCRIPT"||t.tagName==="LINK")&&s.indexOf("/_next/static/")>-1)recover()},true);addEventListener("unhandledrejection",function(e){var r=e&&e.reason;var m=r&&(r.message||String(r));if(m&&/Loading chunk|Loading CSS chunk|dynamically imported module/i.test(m))recover()})})();`;
