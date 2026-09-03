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

/**
 * Normalise an internal in-content link to the canonical public-site form.
 *
 * Two separate problems, one fix, because authors produce both forms and a
 * link only has to be wrong once to cost a hop:
 *
 * 1. Wrong host. Elementor authors links against `cms.theaceservices.com`,
 *    the domain its WYSIWYG editor runs on — but that is the headless
 *    WordPress backend (`Disallow: /` in robots.txt, `noindex`), never meant
 *    to be browsed. A reader who clicks one lands on the raw, unstyled
 *    backend, and the link equity flows to a domain Google won't index.
 *
 * 2. Missing trailing slash. The public site canonicalises to trailing
 *    slashes, so `/cost-estimating` 308-redirects to `/cost-estimating/`.
 *    Links are hand-authored both ways and against both hosts — the live
 *    blog posts carry `https://theaceservices.com/cost-estimating`, which
 *    has the right host and still costs a redirect. Left alone, the blog's
 *    entire internal link graph runs through 308s.
 *
 * `/wp-content/*` links are the one legitimate exception to the host rewrite:
 * those are real asset files (PDFs, images) that only exist on the CMS host.
 * Asset filenames (`…/estimate.pdf`) never gain a slash, on either host, and
 * a query or hash is preserved after it.
 */
const INTERNAL_LINK_RE =
  /^(?:https?:)?\/\/(?:cms\.|www\.)?theaceservices\.com(\/.*)?$/i;

function normalizeInternalLink(href: string): string {
  const isCmsHost = /^(?:https?:)?\/\/cms\.theaceservices\.com/i.test(href);
  const match = INTERNAL_LINK_RE.exec(href);

  // Root-relative links ("/cost-estimating") need the slash too, but must not
  // swallow protocol-relative ones ("//example.com/…").
  const raw = match
    ? (match[1] ?? '/')
    : href.startsWith('/') && !href.startsWith('//')
      ? href
      : null;
  if (raw === null) return href;

  // CMS-hosted assets are the exception: they genuinely live over there.
  if (isCmsHost && raw.startsWith('/wp-content/')) return href;

  const cut = raw.search(/[?#]/);
  const path = cut === -1 ? raw : raw.slice(0, cut);
  const suffix = cut === -1 ? '' : raw.slice(cut);
  const needsSlash = !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path);

  return `https://theaceservices.com${path}${needsSlash ? '/' : ''}${suffix}`;
}

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
 * Strip Rank Math TOC and FAQ blocks from content HTML.
 *
 * The WordPress content includes an embedded table of contents generated
 * by the Rank Math SEO plugin (e.g. `<div id="rank-math-toc">`). Since we
 * render our own TOC sidebar, we strip these blocks to avoid duplication.
 */
function stripRankMathBlocks(html: string): string {
  // Match opening <div id="rank-math-toc"> and balance nested <div> tags
  // to find the matching </div>
  const openRegex = /<div[^>]*\bid\s*=\s*["']rank-math-toc["'][^>]*>/i;
  const match = openRegex.exec(html);
  if (!match) return html;

  const start = match.index;
  let depth = 1;
  let pos = start + match[0].length;

  // Single regex for both open and close div tags — compare by prefix
  const divTag = /<\/?div\b[^>]*>/gi;
  divTag.lastIndex = pos;

  while (depth > 0) {
    const tagMatch = divTag.exec(html);
    if (!tagMatch) break; // malformed HTML — stop

    if (tagMatch[0].startsWith('</')) {
      depth--;
    } else {
      depth++;
    }
    if (depth === 0) {
      pos = tagMatch.index + tagMatch[0].length;
    }
  }

  return html.slice(0, start) + html.slice(pos);
}

/**
 * Sanitize raw WordPress HTML for safe rendering with dangerouslySetInnerHTML.
 *
 * Uses the `sanitize-html` library for proper DOM-level parsing instead of
 * fragile regex-based sanitization. Blocks javascript:, data:, vbscript:
 * URL schemes, strips event handlers (`on*`), and removes dangerous elements.
 *
 * Also strips embedded Rank Math TOC blocks (redundant with our sidebar TOC).
 */
export function sanitizeHtml(html: string): string {
  const cleaned = stripRankMathBlocks(html);
  return sanitize(cleaned, {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'hr', 'br',
      'strong', 'em', 'b', 'i', 'u', 's', 'code', 'sup', 'sub',
      'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      'a', 'img',
    ],
    // The post page renders its own <h1> for the title outside this content
    // blob, so any <h1> inside the body is always a duplicate — Elementor
    // sources sometimes wrap dozens of paragraphs in <h1> (heading soup).
    // Demote to <p>, not <h2>: extractHeadings() turns every h2/h3 into a
    // TOC entry, so retagging as h2 would flood the sidebar TOC with
    // paragraph-length "headings". The content is plain prose, so <p> is
    // also the semantically correct tag.
    transformTags: {
      h1: 'p',
      // Point in-content internal links at the public site, on the canonical
      // trailing-slash URL — see normalizeInternalLink() above.
      a: (tagName, attribs) => {
        if (attribs.href) {
          attribs.href = normalizeInternalLink(attribs.href);
        }
        return { tagName, attribs };
      },
    },
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
    // Rewrite the internal CMS hostname when it appears as visible body
    // text (e.g. "(cms.theaceservices.com)" typed into a paragraph by
    // mistake) so readers/crawlers never see the headless backend's
    // hostname. This only touches text nodes — `src`/`href` attribute
    // values (legitimate asset URLs on the CMS host) are untouched.
    textFilter: (text) => text.replace(/cms\.theaceservices\.com/gi, 'theaceservices.com'),
  });
}

/** Plain-text version of a WP title (single line, entities decoded). */
export function cleanTitle(rendered: string): string {
  return decodeEntities(rendered.replace(/<[^>]+>/g, '').trim());
}

/** Plain-text excerpt, truncated to `maxChars` on a word boundary. */
export function cleanExcerpt(rendered: string, maxChars = 220): string {
  const raw = htmlToText(rendered);
  // WordPress's auto-excerpt clips at 55 words and appends a "[…]" read-more
  // marker. Stripping that marker on its own leaves a sentence that just
  // stops ("…title block and scale first, then site"), which then reads as a
  // typo rather than a truncation wherever the excerpt is shown. Remember
  // that WP truncated, so the ellipsis can be put back below.
  const wasTruncated = /\[[^\]]*\]\s*$/.test(raw.trim());
  const text = raw.replace(/\[[^\]]*\]/g, '').trim();

  if (text.length <= maxChars) {
    return wasTruncated && !/[.!?…]$/.test(text) ? `${text}…` : text;
  }
  const clipped = text.slice(0, maxChars);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}

/**
 * A meta-description-shaped summary taken from the start of a post's body.
 *
 * Preferred over the WP excerpt because these posts open answer-first: the
 * opening sentence is a direct definition of the topic, which is exactly what
 * a search snippet wants. The excerpt, by contrast, is whatever WordPress's
 * 55-word auto-clip happened to land on.
 *
 * Takes whole sentences while they fit. If even the first sentence overruns
 * (about two thirds of this blog), trims on a word boundary and marks it with
 * an ellipsis — never mid-word, never a bare dangling clause.
 */
export function leadDescription(
  html: string,
  { max = 158, min = 110 }: { max?: number; min?: number } = {},
): string | null {
  const text = htmlToText(html);
  if (!text) return null;

  let out = '';
  for (const sentence of text.match(/[^.!?]+[.!?]+/g) ?? []) {
    const next = (out + sentence).trim();
    if (next.length > max) break;
    out = `${next} `;
  }
  out = out.trim();
  if (out.length >= min) return out;

  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const base = lastSpace > min ? clipped.slice(0, lastSpace) : clipped;
  return `${base.replace(/[,;:\s]+$/, '')}…`;
}
