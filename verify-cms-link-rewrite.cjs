// Minimal runnable check for normalizeInternalLink() in src/services/wordpress/html.ts.
// Mirrors the sanitize-html config directly (no ts-loader available here).
const sanitize = require('sanitize-html');
const assert = require('assert');

function normalizeInternalLink(href) {
  const isCmsHost = /^(?:https?:)?\/\/cms\.theaceservices\.com/i.test(href);
  const match = /^(?:https?:)?\/\/(?:cms\.|www\.)?theaceservices\.com(\/.*)?$/i.exec(href);

  const raw = match
    ? (match[1] ?? '/')
    : href.startsWith('/') && !href.startsWith('//')
      ? href
      : null;
  if (raw === null) return href;

  if (isCmsHost && raw.startsWith('/wp-content/')) return href;

  const cut = raw.search(/[?#]/);
  const path = cut === -1 ? raw : raw.slice(0, cut);
  const suffix = cut === -1 ? '' : raw.slice(cut);
  const needsSlash = !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path);

  return `https://theaceservices.com${path}${needsSlash ? '/' : ''}${suffix}`;
}

function sanitizeHtml(html) {
  return sanitize(html, {
    allowedTags: ['p', 'a', 'img'],
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href) attribs.href = normalizeInternalLink(attribs.href);
        return { tagName, attribs };
      },
    },
    allowedAttributes: { a: ['href'], img: ['src', 'alt'] },
    allowedSchemes: ['http', 'https'],
  });
}

// Real cases pulled from the live posts. Elementor authors internal links
// both with and without a trailing slash; the site canonicalises to one, so
// both forms must come out slashed or every body link costs a 308 hop.
const input = `<p><a href="https://cms.theaceservices.com/warehouses-development/">Warehouse development services</a>
and <a href="https://cms.theaceservices.com/commercial-construction/">Construction planning</a>
and the <a href="https://cms.theaceservices.com/">homepage</a>.</p>
<p><a href="https://cms.theaceservices.com/cost-estimating">construction cost estimating</a>
and <a href="https://cms.theaceservices.com/shop-drawing-services">MEP shop drawings</a>
and <a href="https://cms.theaceservices.com/quantity-surveyor-services?ref=blog#top">quantity surveyor</a>.</p>
<p>Authored against the public host instead, which is what the live blog
posts actually carry: <a href="https://theaceservices.com/cost-estimating">cost estimating</a>
and <a href="https://www.theaceservices.com/permit-set-services">permit sets</a>
and root-relative <a href="/3d-rendering-services">renderings</a>.</p>
<p>External links stay untouched: <a href="https://example.com/page">external</a>.</p>
<img src="https://cms.theaceservices.com/wp-content/uploads/2026/01/image-8.jpeg" alt="x">
<a href="https://cms.theaceservices.com/wp-content/uploads/2024/10/estimate.pdf">PDF</a>`;

const out = sanitizeHtml(input);

assert(!out.includes('href="https://cms.theaceservices.com/warehouses-development'), 'page link not rewritten');
assert(out.includes('href="https://theaceservices.com/warehouses-development/"'), 'expected rewritten warehouse link');
assert(out.includes('href="https://theaceservices.com/commercial-construction/"'), 'expected rewritten commercial link');
assert(out.includes('href="https://theaceservices.com/"'), 'expected rewritten homepage link');

// The regression this file exists for: slashless links must gain the slash.
assert(out.includes('href="https://theaceservices.com/cost-estimating/"'), 'slashless link must gain a trailing slash');
assert(out.includes('href="https://theaceservices.com/shop-drawing-services/"'), 'slashless link must gain a trailing slash');
assert(
  out.includes('href="https://theaceservices.com/quantity-surveyor-services/?ref=blog#top"'),
  'slash goes before the query/hash, which is preserved',
);

// The regression that actually shipped: links already on the public host
// were passed straight through, slashless, and 308'd on every click.
assert(out.includes('href="https://theaceservices.com/cost-estimating/"'), 'public-host link must gain a trailing slash');
assert(out.includes('href="https://theaceservices.com/permit-set-services/"'), 'www host must normalise and gain a slash');
assert(out.includes('href="https://theaceservices.com/3d-rendering-services/"'), 'root-relative link must gain a slash');
assert(out.includes('href="https://example.com/page"'), 'external links must be left alone');

assert(out.includes('src="https://cms.theaceservices.com/wp-content/uploads/2026/01/image-8.jpeg"'), 'image src must stay on CMS host');
assert(out.includes('href="https://cms.theaceservices.com/wp-content/uploads/2024/10/estimate.pdf"'), 'PDF asset link must stay on CMS host');
assert(!out.includes('estimate.pdf/'), 'asset filenames must not gain a trailing slash');

console.log('OK: all assertions passed');
console.log(out);
