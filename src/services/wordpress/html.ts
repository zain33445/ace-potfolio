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

/**
 * Convert HTML to article text — preserves paragraph/heading/line-break
 * boundaries so the output reads as multi-paragraph text.
 * Removes script/style, Elementor classes, and all other markup.
 */
export function htmlToArticle(html: string): string {
  // Kill scripts and styles entirely
  let out = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Block-level closing tags → double newline (paragraph break)
  out = out.replace(/<\/(p|div|h[1-6]|li|blockquote|section|article)>/gi, '\n\n');

  // <br> → single newline
  out = out.replace(/<br\s*\/?>/gi, '\n');

  // Strip remaining tags
  out = out.replace(/<[^>]+>/g, '');

  // Normalize whitespace: collapse 3+ newlines to 2, trim lines
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/[ \t]+/g, ' ');
  out = out.replace(/\n +/g, '\n');
  out = out.replace(/ +\n/g, '\n');

  // Decode entities
  out = decodeEntities(out.trim());

  return out;
}

/**
 * Sanitize raw WordPress HTML for safe rendering with dangerouslySetInnerHTML.
 *
 * Keeps structural formatting tags (headings, lists, blockquotes, images,
 * tables, etc.) but:
 *  - Removes <script>, <style>, <iframe>, <object>, <embed>, <form>, etc.
 *  - Unwraps <div>, <span>, <section>, <article>, <header>, <footer>, etc.
 *  - Strips all class, style, id, and data-* attributes from safe tags
 *  - Allows only href on <a>, only src + alt on <img>
 *  - Removes HTML comments
 */
export function sanitizeHtml(html: string): string {
  // 1. Remove dangerous elements entirely (including content)
  const DANGEROUS_WRAPPED = /<(script|style|iframe|object|embed|noscript)[^>]*>[\s\S]*?<\/\1>/gi;
  const DANGEROUS_VOID = /<(input|button|canvas|video|audio|source|track)[^>]*\/?>/gi;
  let out = html
    .replace(DANGEROUS_WRAPPED, '')
    .replace(DANGEROUS_VOID, '');

  // 2. Strip HTML comments (Gutenberg/Elementor markers)
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Unwrap container tags — remove tag, keep inner content
  const UNWRAP = /<\/?(div|span|section|article|header|footer|nav|main|aside|address|details|summary|dialog|data|time|mark|ruby|rt|rp|bdi|bdo|wbr|font|center|strike|tt|big|small)[^>]*>/gi;
  out = out.replace(UNWRAP, '');

  // 4. Safe block/inline tags — strip all attributes
  const SAFE_TAGS = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'blockquote', 'pre', 'hr', 'br',
    'strong', 'em', 'b', 'i', 'u', 's', 'code', 'sup', 'sub',
    'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  ];

  for (const tag of SAFE_TAGS) {
    out = out.replace(new RegExp(`<${tag}(\\s[^>]*)?>`, 'gi'), `<${tag}>`);
  }

  // 5. <a> — keep only href
  out = out.replace(/<a\s([^>]*)>/gi, (match) => {
    const href = match.match(/href="([^"]*)"/i);
    return href ? `<a href="${href[1]}">` : '<a>';
  });

  // 6. <img> — keep only src and alt
  out = out.replace(/<img\s([^>]*)>/gi, (match) => {
    const src = match.match(/src="([^"]*)"/i);
    const alt = match.match(/alt="([^"]*)"/i);
    const parts = ['<img'];
    if (src) parts.push(`src="${src[1]}"`);
    if (alt) parts.push(`alt="${alt[1]}"`);
    return `${parts.join(' ')} />`;
  });

  // 7. Remove any remaining unknown tags (strip tags, keep inner content)
  const ALLOWED = new Set([...SAFE_TAGS, 'a', 'img']);
  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g, (match, tagName) => {
    return ALLOWED.has(tagName.toLowerCase()) ? match : '';
  });

  // 8. Normalize whitespace
  out = out.replace(/\r\n/g, '\n');
  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/[ \t]+/g, ' ');
  out = out.replace(/>\s+</g, '>\n<');
  out = out.trim();

  return out;
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
