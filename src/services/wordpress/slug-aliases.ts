/**
 * Malformed-slug aliases for the WordPress blog.
 *
 * Three real, published posts (category 1) have broken slugs: WordPress
 * percent-encoded an emoji from the post title straight into the slug itself,
 * so the stored slug is literally e.g. "%f0%9f%8f%a8-hotel-development-…". That
 * slug can't be linked or shared, and the emoji URL search engines indexed
 * 404s. The clean ASCII form of the slug does NOT exist as its own post.
 *
 * Until the slugs are renamed in WordPress (the real root fix — this whole file
 * can then be deleted), we serve each post under a clean canonical slug:
 *   - `CANONICAL_TO_WP` maps the clean slug the app exposes → the ugly slug WP
 *     actually stores, so `getPostBySlug` can still fetch the post.
 *   - `WP_TO_CANONICAL` is the reverse, so list adapters rewrite the ugly slug
 *     to the clean one everywhere it surfaces (blog listing, sitemap,
 *     generateStaticParams, canonical/OG URLs).
 * The middleware 301s the emoji/percent-encoded URL to the clean canonical.
 */

export const CANONICAL_TO_WP: Record<string, string> = {
  'warehouse-development-in-usa-key-trends-strategies-and-future-opportunities':
    '%f0%9f%8f%97%ef%b8%8f-warehouse-development-in-usa-key-trends-strategies-and-future-opportunities',
  'hotel-development-services-in-usa-building-the-future-of-hospitality':
    '%f0%9f%8f%a8-hotel-development-services-in-usa-building-the-future-of-hospitality',
  'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects':
    '%f0%9f%a7%ae-quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects',
};

export const WP_TO_CANONICAL: Record<string, string> = Object.fromEntries(
  Object.entries(CANONICAL_TO_WP).map(([canonical, wp]) => [wp, canonical]),
);

/** Clean slug the app exposes → the slug WP stores (identity when not aliased). */
export function wpSlugFor(slug: string): string {
  return CANONICAL_TO_WP[slug] ?? slug;
}

/** Slug WP stores → clean slug the app exposes (identity when not aliased). */
export function canonicalSlugFor(slug: string): string {
  return WP_TO_CANONICAL[slug] ?? slug;
}
