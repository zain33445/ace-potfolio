import type { MetadataRoute } from 'next';
import { services } from '@/src/data/services';
import { getAllProjects } from '@/src/data/projects';
import { getPosts } from '@/src/services/wordpress/content';

const BASE_URL = 'https://theaceservices.com';

// Regenerate the sitemap in the background at most hourly (ISR).
// New blog posts / projects appear here without a redeploy; if
// WordPress is unreachable the last generated sitemap is served.
export const revalidate = 3600;

// Real WP post slugs are plain lowercase ASCII words joined by hyphens.
// WordPress occasionally produces junk slugs from spam/garbled titles
// (e.g. emoji titles get percent-encoded into the slug itself, like
// "%f0%9f%8f%a8-hotel-..."). Those pass the /[slug] route's permissive
// SLUG_RE (which allows \p{So} symbol chars) but never resolve to a post,
// so they 404/noindex. Don't submit anything that isn't a plain-ASCII slug.
const REAL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Known-junk WP posts that are plain-ASCII (so they pass REAL_SLUG_RE above)
// but shouldn't be indexed. WP has a known spam/test-content problem here;
// add to this list as more turn up rather than one-off patching each route.
const BLOG_SLUG_DENYLIST = new Set(['test-post']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    // JS widget with ~100 words of indexable content — not worth a top-3 priority.
    { url: `${BASE_URL}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.1 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.1 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Exclude projects with no real stats (area/cost both 0) — noindexed
  // in projects/[slug]/page.tsx until they carry real data.
  const projectRoutes: MetadataRoute.Sitemap = getAllProjects()
    .filter((p) => p.totalAreaSqFt > 0 || p.estimatedCost > 0)
    .map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await getPosts({ per_page: 100 });
    blogRoutes = result.data
      .filter((post) => REAL_SLUG_RE.test(post.slug) && !BLOG_SLUG_DENYLIST.has(post.slug))
      .map((post) => ({
        url: `${BASE_URL}/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch {
    // WordPress unreachable during build
  }

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
}
