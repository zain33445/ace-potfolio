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
  summary?: string;
  /** Raw sanitized HTML content from WP — for full-page rendering */
  rawContent?: string;
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

  return {
    title: stripHtml(page.title?.rendered),
    summary: resolveSummary(page.excerpt, page.content),
    rawContent: sanitizeElementorHtml(page.content?.rendered),
  };
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
    title: stripHtml(page.title?.rendered),
    summary: resolveSummary(page.excerpt, page.content),
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
    title: stripHtml(page.title?.rendered),
    summary: resolveSummary(page.excerpt, page.content),
  }));
}
