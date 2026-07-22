/**
 * HTML helpers that run in Node (build/prerender) as well as the browser.
 *
 * WordPress returns titles/excerpts with HTML entities (`&amp;`, `&#8217;`)
 * and excerpts wrapped in `<p>`; Elementor page bodies are deep tag soup.
 * These helpers turn that into plain, safe display text.
 *
 * `sanitizeHtml` uses the `sanitize-html` library (proper DOM-level parsing)
 * rather than fragile regex-based sanitization.
 */

import sanitize from 'sanitize-html';

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
};

/** Decode HTML entities (named + numeric) without a DOM. */
export function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

/** Strip all tags and collapse whitespace, then decode entities. */
export function htmlToText(html: string): string {
  const stripped = html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return decodeEntities(stripped);
}

/**
 * Convert HTML to article text — preserves paragraph/heading/line-break
 * boundaries so the output reads as multi-paragraph text.
 * Removes script/style, Elementor classes, and all other markup.
 */
export function htmlToArticle(html: string): string {
  let out = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');

  out = out.replace(/<\/(p|div|h[1-6]|li|blockquote|section|article)>/gi, '\n\n');

  out = out.replace(/<br\s*\/?>/gi, '\n');

  out = out.replace(/<[^>]+>/g, '');

  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/[ \t]+/g, ' ');
  out = out.replace(/\n +/g, '\n');
  out = out.replace(/ +\n/g, '\n');

  out = decodeEntities(out.trim());

  return out;
}

/**
 * Sanitize raw WordPress HTML for safe rendering with dangerouslySetInnerHTML.
 *
 * Uses the `sanitize-html` library for proper DOM-level parsing instead of
 * fragile regex-based sanitization. Blocks javascript:, data:, vbscript:
 * URL schemes, strips event handlers (`on*`), and removes dangerous elements.
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'hr', 'br',
      'strong', 'em', 'b', 'i', 'u', 's', 'code', 'sup', 'sub',
      'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      'a', 'img',
    ],
    allowedAttributes: {
      'a': ['href'],
      'img': ['src', 'alt'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      'img': ['http', 'https'],
    },
    disallowedTagsMode: 'discard',
    enforceHtmlBoundary: true,
    exclusiveFilter: (frame) => {
      return frame.tag === 'img' && !frame.attribs.src;
    },
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    parser: {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    },
  });
}

/** Plain-text version of a WP title (single line, entities decoded). */
export function cleanTitle(rendered: string): string {
  return decodeEntities(rendered.replace(/<[^>]+>/g, '').trim());
}

/** Plain-text excerpt, truncated to `maxChars` on a word boundary. */
export function cleanExcerpt(rendered: string, maxChars = 220): string {
  const text = htmlToText(rendered).replace(/\[[^\]]*\]/g, '').trim(); // drop [...] read-more shortcodes
  if (text.length <= maxChars) return text;
  const clipped = text.slice(0, maxChars);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}
