/**
 * Headless WordPress integration for theaceservices.com.
 *
 * Import from here:
 *   `import { getInsights, type Insight } from '@/src/services/wordpress'`
 *   `import { getProjects, type Project } from '@/src/services/wordpress'`
 *   `import { getTestimonials, type Testimonial } from '@/src/services/wordpress'`
 *
 * The client is SSR/prerender-safe and is intended to be called from
 * Vike `+data` functions or Next.js server components so content is fetched
 * at build/render time.
 *
 * CMS reality: theaceservices.com has only `posts` and `pages` (no ACF, no
 * CPTs). Domain-specific content (projects, testimonials, FAQ, etc.) is
 * modeled as Pages with slug-prefix conventions. When ACF + CPTs are added,
 * the adapter functions can be updated to point at the new endpoints.
 */

// Types — re-export everything for consumers
export type {
  WPRendered,
  WPPost,
  WPPage,
  WPCategory,
  WPMediaSize,
  WPMedia,
  WPEmbedded,
  WPPaginationHeaders,
  WPListResponse,
  WPListQuery,
  WPPostQuery,
  WPPageQuery,
} from './types';

// HTML sanitization helpers
export { decodeEntities, htmlToText, cleanTitle, cleanExcerpt } from './html';

// Content view models and API functions
export type {
  Insight,
  ServicePage,
  Page,
  Project,
  Testimonial,
  FAQItem,
  Solution,
  Stat,
} from './content';

export {
  // Config
  INSIGHT_CATEGORY_IDS,
  SERVICE_PAGE_SLUGS,

  // Adapters
  toInsight,
  toServicePage,
  toPage,
  toProject,
  toTestimonial,
  toFAQItem,
  toSolution,
  toStat,

  // Posts / Blog
  getPosts,
  getInsights,

  // Pages (generic)
  getPages,
  getPageBySlug,

  // Service pages (curated)
  getServicePage,
  getServicePages,

  // Domain-specific
  getProjects,
  getTestimonials,
  getFAQItems,
  getSolutions,
  getStats,
} from './content';

// Client primitives
export {
  wpGet,
  wpGetList,
  wpGetListSafe,
  wpBaseUrl,
  WordPressError,
} from './client';
