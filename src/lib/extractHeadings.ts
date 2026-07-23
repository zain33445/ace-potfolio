/**
 * Extract headings (h2/h3) from sanitized HTML content for table of contents.
 *
 * Runs on the server at render time. Parses the HTML string to:
 *  1. Find all <h2> and <h3> elements
 *  2. Generate URL-safe `id` attributes from heading text
 *  3. Inject those `id`s into the HTML string
 *  4. Return the modified HTML + a structured TOC items array
 */

export interface TocItem {
  id: string;
  tag: 'h2' | 'h3';
  text: string;
  level: number; // 2 or 3
}

export interface ExtractResult {
  items: TocItem[];
  html: string;
}

/**
 * Slugify a heading text into a URL-safe anchor ID.
 * E.g. "What We Do" → "what-we-do"
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse sanitized HTML to extract h2/h3 headings and inject `id` attributes.
 *
 * Returns:
 *  - `items`: structured TOC items with id, tag, text, level
 *  - `html`: the original HTML with `id` attributes injected into heading tags
 */
export function extractHeadings(html: string): ExtractResult {
  const items: TocItem[] = [];
  const seen = new Map<string, number>();

  // Match h2/h3 opening tags with their content
  const headingRegex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const modifiedHtml = html.replace(headingRegex, (match, level: string, attrs: string, content: string) => {
    const tag = `h${level}` as 'h2' | 'h3';
    const text = content.replace(/<[^>]+>/g, '').trim();

    if (!text) return match;

    // Generate unique slug
    let id = slugify(text);
    if (seen.has(id)) {
      const count = seen.get(id)! + 1;
      seen.set(id, count);
      id = `${id}-${count}`;
    } else {
      seen.set(id, 1);
    }

    items.push({ id, tag, text, level: parseInt(level) });

    // Inject id attribute into the opening tag
    const hasId = /id\s*=\s*["']/i.test(attrs);
    if (!hasId) {
      return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
    }
    return match;
  });

  return { items, html: modifiedHtml };
}
