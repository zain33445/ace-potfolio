import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1TagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

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
	// Required once the tag cache is live: stale entries are re-rendered in
	// the background by queueing a revalidation request. With the "dummy"
	// queue that throws "FatalError: Dummy queue is not implemented" from
	// revalidateIfRequired() on every stale hit. Needs the
	// NEXT_CACHE_DO_QUEUE durable object binding (DOQueueHandler) plus the
	// WORKER_SELF_REFERENCE service binding it calls back through.
	queue: doQueue,
});
