import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1TagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

export default defineCloudflareConfig({
	incrementalCache: r2IncrementalCache,
	// Without this the tag cache resolves to the "dummy" override, and
	// D1NextModeTagCache short-circuits every method (writeTags /
	// hasBeenRevalidated / getLastRevalidated all no-op) because no
	// NEXT_TAG_CACHE_D1 binding exists. revalidatePath() then returns 200
	// while the cached page stays x-nextjs-cache: HIT — the Sanity webhook
	// silently does nothing. Requires the NEXT_TAG_CACHE_D1 D1 binding in
	// wrangler.jsonc.
	tagCache: d1TagCache,
});
