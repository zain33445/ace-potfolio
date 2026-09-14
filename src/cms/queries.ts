/**
 * CMS query layer for editable service marketing copy.
 *
 * The four services are defined statically in `src/data/services.ts`. Their
 * editable marketing copy (title + summary) is sourced from WordPress pages
 * keyed by the same slug — the site is a stock WP install (no custom post
 * types), so service content lives as standard pages in the headless CMS.
 *
 * `getServicePage` is SSR/build-safe and never throws: it resolves through the
 * shared WordPress REST client and returns `null` on any miss or network error
 * so the static defaults in `services.ts` always remain the fallback.
 */

import { wpGetList, wpGetListSafe } from '@/src/services/wordpress/client';
import type { WPPage, WPRendered } from '@/src/services/wordpress/types';

export interface ServicePageCopy {
  title?: string;
  /** Overrides `title` for the <title> tag only; the H1 still uses `title`. */
  seoTitle?: string;
  /** Overrides the generated meta description only; the on-page summary is untouched. */
  seoDescription?: string;
  summary?: string;
  /** Raw sanitized HTML content from WP — for full-page rendering */
  rawContent?: string;
}

/**
 * Slug-keyed overrides for WP pages whose CMS copy targets the wrong query.
 *
 * `/warehouses-development` earns 450 impressions/mo at position 68 for
 * "data warehouse development services" — a SERP owned entirely by software
 * companies (Google Cloud, Databricks, ScienceSoft). `/hotels-development`
 * matches "hotel development it services" at 69. Both pages read as though
 * ACE builds the buildings: "development" 12-14x, "estimat*" 7-8x, and zero
 * mentions of takeoffs or quantity surveying. The WP title feeds BOTH the
 * <title> and the H1, so a CMS-only edit cannot give them different text.
 *
 * Renaming the URLs would be wrong — six blog posts already 301 into
 * /warehouses-development (Cluster A in src/middleware.ts), so a rename
 * creates two-hop chains. The fix is the copy, not the URL.
 *
 * The copy describes the deliverable and claims no first-hand project
 * evidence, because there is none: extracted-projects.json holds zero
 * warehouse records, and its single hotel record (Doubletree By Hilton) is
 * empty (0 sf, $0, no CSI divisions). These titles stop the wrong-intent
 * bleed; they will not make either page rank. See item 7 of
 * seo/seo-todo-2026-09-01.md.
 *
 * ponytail: these override the CMS rather than replacing it. The page BODY
 * (rawContent) is still CMS-owned and still development-framed — that half
 * has to be edited in WordPress (pages 5115 and 5109). Delete the matching
 * entry here once a page's CMS copy is corrected at the source.
 */
const CMS_COPY_OVERRIDES: Record<string, Pick<ServicePageCopy, 'title' | 'summary'>> = {
  'warehouses-development': {
    title: 'Warehouse Construction Cost Estimating and Quantity Takeoffs',
    summary:
      'Warehouse construction cost estimating and quantity takeoffs. Send us your drawings and you get quantities counted off the plans, unit pricing broken out by CSI division and a total you can bid. Most jobs come back in 24 to 48 hours. And to be clear, this is estimating for warehouse buildings. Not data warehousing.',
  },
  'hotels-development': {
    title: 'Hotel Construction Cost Estimating and Quantity Takeoffs',
    summary:
      'Hotel construction cost estimating and quantity takeoffs. We price new builds, conversions and renovations, and break the numbers out per key and per square foot so you can check them against your own historicals before you bid. Costs come back by CSI division with the quantities behind them. Usually in 24 to 48 hours.',
  },
};

/**
 * Hand-written <title> and meta description for CMS-driven service pages.
 *
 * These only touch the head: `seoTitle` is emitted as the absolute <title>
 * (no " | The ACE Services" template suffix) and `seoDescription` replaces the
 * first-paragraph excerpt as the meta description. The H1 and body copy stay
 * CMS-owned, so editing a page in WordPress will not silently undo them.
 *
 * Statically-defined services carry the same two fields in data/services.ts.
 */
const SEO_OVERRIDES: Record<string, Pick<ServicePageCopy, 'seoTitle' | 'seoDescription'>> = {
  'blueprint-estimation': {
    seoTitle: 'Blueprint Estimation Services | Accurate Takeoffs',
    seoDescription:
      'Accurate blueprint estimation and quantity takeoffs prepared directly from your construction plans. Request a free blueprint estimation quote today.',
  },
  'electrical-estimation': {
    seoTitle: 'Electrical Estimating Services | The ACE Services',
    seoDescription:
      'Accurate electrical material takeoffs and cost estimates for subcontractors nationwide. Request a free electrical estimating quote in 24-48 hours.',
  },
  'residential-estimating': {
    seoTitle: 'Residential Construction Estimating | The ACE Services',
    seoDescription:
      'Fast, accurate residential cost estimates and material takeoffs for builders and homeowners. Get your free residential estimate quote today.',
  },
  'structural-services': {
    seoTitle: 'Structural Management Services | The ACE Services',
    seoDescription:
      'Structural design, analysis and cross-discipline coordination for safe, code-compliant construction. Request a free structural management quote today.',
  },
  'residential-construction': {
    seoTitle: 'Residential Construction | The ACE Services',
    seoDescription:
      'Cost estimating, drafting and permit sets for residential builds and developments nationwide. Get a free residential construction estimate quote today.',
  },
  'commercial-construction': {
    seoTitle: 'Commercial Construction Estimating | The ACE Services',
    seoDescription:
      'AACE Class 3 cost estimates, shop drawings and permit sets for commercial construction projects. Request your free commercial construction quote now.',
  },
  'industrial-construction': {
    seoTitle: 'Industrial Construction Estimating | The ACE Services',
    seoDescription:
      'Cost estimating and documentation for plants, warehouses and industrial facility construction. Get a free industrial construction estimate quote today.',
  },
  'bridges-construction': {
    seoTitle: 'Bridge Construction Estimating Services',
    seoDescription:
      'Specialized cost estimating and quantity takeoffs for bridge and infrastructure construction projects. Request a free bridge construction quote today.',
  },
  'warehouses-development': {
    seoTitle: 'Warehouse Development & Estimating Services',
    seoDescription:
      'Cost estimating, drafting and permits for warehouse and distribution center development projects. Get your free warehouse development quote today.',
  },
  'hotels-development': {
    seoTitle: 'Hotel Development & Construction Estimating',
    seoDescription:
      'Cost estimating and construction documentation for hospitality and hotel development projects. Request a free hotel development estimate quote now.',
  },
  'healthcare-buildings': {
    seoTitle: 'Healthcare Construction Estimating Services',
    seoDescription:
      'Precise cost estimating and permit sets for hospitals, clinics and healthcare facility construction. Get a free healthcare construction estimate today.',
  },
  'educational-buildings': {
    seoTitle: 'Educational Building Estimating Services',
    seoDescription:
      'Accurate cost estimating and construction documentation for schools and campus building projects. Request your free educational project quote now.',
  },
};

/** Apply any slug override on top of the copy resolved from WordPress. */
function withOverrides(slug: string, copy: ServicePageCopy): ServicePageCopy {
  return { ...copy, ...CMS_COPY_OVERRIDES[slug], ...SEO_OVERRIDES[slug] };
}

/** Strip WP's `{ rendered }` HTML wrappers and decode HTML entities to plain text. */
function stripHtml(rendered: string | undefined): string {
  if (!rendered) return '';
  return rendered
    .replace(/<[^>]*>/g, '')      // strip all HTML tags
    .replace(/&nbsp;/g,  ' ')
    .replace(/&amp;/g,   '&')
    .replace(/&#39;/g,   "'")
    .replace(/&quot;/g,  '"')
    .replace(/&hellip;/g,'…')
    .replace(/&#8230;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    // Remove the WP auto-excerpt trailing marker "[…]" or "[&hellip;]"
    .replace(/\s*\[[\u2026\.]{1,3}\]\s*$/g, '')
    .replace(/\s*\[\s*&hellip;\s*\]\s*$/g,  '')
    .replace(/\s*…\s*$/g,                   '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract the first substantial paragraph (≥ 80 chars) from WP HTML content.
 * Skips short hero headings and labels, returning a real descriptive sentence.
 */
function extractFirstParagraph(html: string | undefined): string {
  if (!html) return '';
  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
  for (const match of paragraphs) {
    const text = stripHtml(match[1]);
    if (text.length >= 80) {
      if (text.length <= 500) return text;
      // Trim to nearest word boundary at ~500 chars
      const cut = text.lastIndexOf(' ', 500);
      return text.slice(0, cut > 0 ? cut : 500);
    }
  }
  // No long paragraph found — fall back to stripping everything
  const fallback = stripHtml(html);
  if (fallback.length <= 500) return fallback;
  const cut = fallback.lastIndexOf(' ', 500);
  return fallback.slice(0, cut > 0 ? cut : 500);
}

/** Resolve a summary: prefer first real content paragraph, fall back to excerpt. */
function resolveSummary(excerpt: WPRendered | undefined, content: WPRendered | undefined): string {
  // Elementor-built pages always auto-generate excerpts from hero heading text,
  // which is useless. Always try extracting the first real paragraph from content first.
  const fromContent = extractFirstParagraph(content?.rendered);
  if (fromContent) return fromContent;
  // Fall back to excerpt (stripped of WP truncation marker)
  return stripHtml(excerpt?.rendered);
}

/**
 * Sanitize Elementor-generated WP page HTML to plain semantic HTML.
 *
 * Strategy: INCLUDE-ONLY — extract content exclusively from Elementor
 * text-editor and heading widgets. Everything else (testimonials, star
 * ratings, process steps, carousels) is silently ignored.
 */
function sanitizeElementorHtml(html: string | undefined): string {
  if (!html) return '';

  // Only these Elementor widget types contain real service content
  const CONTENT_WIDGET_TYPES = ['text-editor', 'heading'];

  const ALLOWED_TAGS = new Set([
    'h2','h3','h4','h5','h6',
    'p','ul','ol','li',
    'strong','b','em','blockquote','br',
  ]);

  const contentPieces: string[] = [];

  // Find every Elementor widget that matches an allowed type
  const widgetRegex = /data-widget_type="([^"]+)"/gi;
  let m: RegExpExecArray | null;

  while ((m = widgetRegex.exec(html)) !== null) {
    const widgetType = m[1].split('.')[0]; // e.g. "text-editor" from "text-editor.default"
    if (!CONTENT_WIDGET_TYPES.includes(widgetType)) continue;

    // Find the opening <div of this widget (walk back to the nearest <div before the match)
    const beforeMatch = html.lastIndexOf('<div', m.index);
    if (beforeMatch === -1) continue;

    // Locate the elementor-widget-container inside this widget
    const containerMarker = html.indexOf('elementor-widget-container', beforeMatch);
    if (containerMarker === -1) continue;

    // Find end of the container's opening tag
    const containerTagEnd = html.indexOf('>', containerMarker);
    if (containerTagEnd === -1) continue;

    // The content sits between the container's opening tag and its first </div>
    // (text-editor / heading content never has nested <div>s)
    const contentStart = containerTagEnd + 1;
    const contentEnd   = html.indexOf('</div>', contentStart);
    if (contentEnd === -1) continue;

    const raw = html.slice(contentStart, contentEnd).trim();
    if (raw) contentPieces.push(raw);
  }

  // Fallback: no Elementor structure found — use the whole html
  const combined = contentPieces.length > 0 ? contentPieces.join('\n') : html;

  // Strip h1 (already rendered in the page hero header)
  let result = combined.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '');

  // Allowlist — strip disallowed tags but preserve their text
  result = result.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/gi, (tag, name) =>
    ALLOWED_TAGS.has(name.toLowerCase()) ? tag : ''
  );

  // Tidy up
  return result
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}


/**
 * Fetch editable copy for a single service from the CMS.
 *
 * @param slug - the service slug (must match `src/data/services.ts`).
 * @returns `{ title, summary }` from the matching WP page, or `null` when the
 *          page doesn't exist or the CMS is unreachable.
 */
export async function getServicePage(
  slug: string,
): Promise<ServicePageCopy | null> {
  const { data } = await wpGetListSafe<WPPage>('/pages', {
    slug,
    _fields: ['slug', 'title', 'excerpt', 'content'],
  });

  const page = data[0];
  if (!page) return null;

  return withOverrides(page.slug, {
    title: stripHtml(page.title?.rendered),
    summary: resolveSummary(page.excerpt, page.content),
    rawContent: sanitizeElementorHtml(page.content?.rendered),
  });
}

/**
 * Fetch editable copy for multiple services from the CMS in a single request.
 * Throws if the CMS is unreachable (so callers can use a hard fallback).
 */
export async function getServicePages(
  slugs: string[],
): Promise<(ServicePageCopy & { slug: string })[]> {
  const { data } = await wpGetList<WPPage>('/pages', {
    slug__in: slugs,
    _fields: ['slug', 'title', 'excerpt', 'content'],
  });

  return data.map((page) => ({
    slug: page.slug,
    ...withOverrides(page.slug, {
      title: stripHtml(page.title?.rendered),
      summary: resolveSummary(page.excerpt, page.content),
    }),
  }));
}

/**
 * Fetch editable copy for ALL pages in the CMS.
 * Throws if the CMS is unreachable.
 */
export async function getAllServicePages(): Promise<(ServicePageCopy & { slug: string })[]> {
  const { data } = await wpGetList<WPPage>('/pages', {
    per_page: 100,
    _fields: ['slug', 'title', 'excerpt', 'content'],
  });

  return data.map((page) => ({
    slug: page.slug,
    ...withOverrides(page.slug, {
      title: stripHtml(page.title?.rendered),
      summary: resolveSummary(page.excerpt, page.content),
    }),
  }));
}
