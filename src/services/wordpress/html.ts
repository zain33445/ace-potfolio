/**
 * Tiny, dependency-free HTML helpers that run in Node (build/prerender) as
 * well as the browser — so no `DOMParser`/`document` reliance.
 *
 * WordPress returns titles/excerpts with HTML entities (`&amp;`, `&#8217;`)
 * and excerpts wrapped in `<p>`; Elementor page bodies are deep tag soup.
 * These helpers turn that into plain, safe display text.
 */

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
