#!/usr/bin/env node

/**
 * extract-pdfs.mjs
 *
 * Fetches project samples from the WordPress CMS, downloads each PDF, and
 * writes src/data/extracted-projects.json.
 *
 * Cost parsing and validation live in ./cost-model.mjs — see the header there
 * for the five bugs this pipeline previously had.
 *
 * Usage:  npm run extract
 *         npm run extract -- --dry   (parse and report, write nothing)
 */

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  isCostCategory,
  parseProjectCosts,
  validate,
  VERIFIED_OVERRIDES,
} from './cost-model.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'extracted-projects.json');
const DRY = process.argv.includes('--dry');

/**
 * The CMS moved to cms.theaceservices.com in a76d1d0; the old
 * theaceservices.com/wp-json path now 404s against the Next.js app.
 */
const WP_SAMPLES_URL =
  'https://cms.theaceservices.com/wp-json/wp/v2/pages?slug=samples&_embed=true';

const TAB_CATEGORIES = {
  1: 'GENERAL CONTRACTOR',
  2: 'SUB CONTRACTORS',
  3: '3D RENDERS',
  4: 'PERMIT SETS',
  5: 'SHOP DRAWINGS',
};

/* ── Helpers ─────────────────────────────────────────────────── */

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

const slugify = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const sanitizeProjectName = (raw) => raw.replace(/^\d+\s*[.|)]?\s*\|?\s*/, '').trim();

function getScopeFromCategory(category) {
  return (
    {
      'GENERAL CONTRACTOR': ['Complete Cost Estimation', 'Quantity Takeoff'],
      'SUB CONTRACTORS': ['MEP Takeoff', 'Trade-Specific Estimate'],
      '3D RENDERS': ['3D Visualization', 'Design Review'],
      'PERMIT SETS': ['Permit Drawing Check', 'Structural Stamping'],
      'SHOP DRAWINGS': ['Shop Drawing Review', 'Fabrication Detailing'],
    }[category] ?? ['Cost Estimation', 'Quantity Takeoff']
  );
}

function describe(title, category, costs) {
  if (!costs) return `${title} — ${category.toLowerCase()} project.`;
  const sample = costs.costDivisions.map((d) => d.name).slice(0, 3).join(', ');
  const basis = costs.areaBasisKind === 'site' ? 'site area' : 'GSF';
  return (
    `Cost estimation for ${title} spanning ${costs.areaBasis.toLocaleString()} SF ` +
    `${basis} across ${costs.costDivisions.length} trade divisions including ${sample}. ` +
    `AACE Class 3 estimate delivered with full quantity takeoff and bid preparation.`
  );
}

/** Zero-valued cost fields, so every record has the same shape. */
const EMPTY_COSTS = {
  hasEstimate: false,
  buildingGsf: 0,
  siteGsf: 0,
  areaBasis: 0,
  areaBasisKind: 'none',
  totalAreaSqFt: 0,
  estimatedCost: 0,
  suggestedBid: 0,
  costPerSf: 0,
  bidPerSf: 0,
  bidPerSfPrinted: 0,
  costDivisions: [],
  csiDivisions: [],
};

/* ── WP Samples HTML parser (unchanged) ──────────────────────── */

function parseSamplesHtml(html) {
  const projects = [];
  let idCounter = 1;

  const tabBoundaryRegex = /data-tab-index="(\d+)"[^>]*class="[^"]*elementor-element-([a-f0-9]+)/g;
  const tabBoundaries = [];
  let match;
  while ((match = tabBoundaryRegex.exec(html)) !== null) {
    tabBoundaries.push({ index: parseInt(match[1]), elementId: match[2], pos: match.index });
  }

  for (let i = 0; i < tabBoundaries.length; i++) {
    const tab = tabBoundaries[i];
    const nextPos = i < tabBoundaries.length - 1 ? tabBoundaries[i + 1].pos : html.length;
    const tabHtml = html.substring(tab.pos, nextPos);
    const category = TAB_CATEGORIES[tab.index] ?? `TAB_${tab.index}`;

    const imageBoxParts = tabHtml.split('lakit-imagebox text-center');
    for (let j = 1; j < imageBoxParts.length; j++) {
      const box = imageBoxParts[j];
      const imgMatch = box.match(/src="(https?:\/\/[^"]+)"/);
      if (!imgMatch) continue;
      const titleMatch = box.match(/lakit-imagebox__title_text[^>]*>([^<]+)</);
      if (!titleMatch) continue;
      const pdfMatch = box.match(/href="([^"]*\.pdf)"/i);
      if (!pdfMatch) continue;

      const pdfUrl = pdfMatch[1].startsWith('http') ? pdfMatch[1] : `https:${pdfMatch[1]}`;
      projects.push({
        id: idCounter++,
        title: decodeEntities(titleMatch[1].trim()),
        titleClean: sanitizeProjectName(decodeEntities(titleMatch[1].trim())),
        category,
        imageUrl: imgMatch[1],
        pdfUrl,
      });
    }
  }
  return projects;
}

/* ── PDF text -> costs ───────────────────────────────────────── */

async function extractProjectPdf(pdfUrl, title) {
  try {
    const resp = await fetch(pdfUrl);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    const doc = await getDocument({ data: new Uint8Array(buf) }).promise;

    const texts = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      texts.push(content.items.map((item) => item.str).join(' '));
    }
    doc.destroy?.();

    return parseProjectCosts(texts.join('\n'));
  } catch (err) {
    console.warn(`  PDF error for "${title}": ${err.message}`);
    return null;
  }
}

/* ── Main ────────────────────────────────────────────────────── */

async function main() {
  console.log('[extract-pdfs] Fetching WP samples...');
  const resp = await fetch(WP_SAMPLES_URL);
  if (!resp.ok) {
    console.error(`Failed to fetch WP samples: HTTP ${resp.status} from ${WP_SAMPLES_URL}`);
    process.exit(1);
  }
  const [page] = await resp.json();
  if (!page) {
    console.error('No samples page found');
    process.exit(1);
  }

  const oldWarn = console.warn;
  console.warn = () => {};
  const samples = parseSamplesHtml(page.content.rendered);
  console.warn = oldWarn;
  console.log(`[extract-pdfs] Found ${samples.length} samples\n`);

  const results = [];
  let extracted = 0;
  let skipped = 0;
  let suspect = 0;

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    process.stdout.write(`  [${i + 1}/${samples.length}] ${s.title}... `);

    const base = {
      id: `P-${String(s.id).padStart(3, '0')}`,
      slug: slugify(s.titleClean),
      title: s.title,
      category: s.category,
      location: 'USA',
      imageUrl: s.imageUrl,
      pdfUrl: s.pdfUrl,
      scope: getScopeFromCategory(s.category),
    };

    // Bug 2: drawings and renderings are not estimates. Never parse them.
    if (!isCostCategory(s.category)) {
      results.push({ ...base, ...EMPTY_COSTS, description: describe(s.title, s.category, null) });
      console.log('- no estimate (category)');
      skipped++;
      continue;
    }

    console.warn = () => {};
    let costs = await extractProjectPdf(s.pdfUrl, s.title);
    console.warn = oldWarn;

    if (!costs) {
      results.push({ ...base, ...EMPTY_COSTS, description: describe(s.title, s.category, null) });
      console.log('- no estimate (unparsed)');
      skipped++;
      continue;
    }

    const override = VERIFIED_OVERRIDES[s.title];
    if (override) {
      const { evidence, title: newTitle, ...fields } = override;
      Object.assign(costs, fields);
      if (newTitle) base.title = newTitle;
      costs.costPerSf =
        costs.areaBasis > 0
          ? Math.round((costs.estimatedCost / costs.areaBasis) * 100) / 100
          : 0;
      base._verified = evidence;
    }

    const reasons = validate(costs);
    if (reasons.length) suspect++;

    const { impliedCost, ...clean } = costs;
    results.push({
      ...base,
      hasEstimate: true,
      // Alias kept for existing consumers (projects pages, sitemap, home).
      totalAreaSqFt: costs.buildingGsf,
      ...clean,
      description: describe(base.title, s.category, costs),
      ...(reasons.length ? { _suspect: reasons } : {}),
    });

    console.log(reasons.length ? `! suspect: ${reasons[0]}` : 'ok');
    extracted++;
  }

  console.warn = oldWarn;

  const output = {
    _meta: {
      extracted: new Date().toISOString(),
      total: results.length,
      withEstimate: extracted,
      withoutEstimate: skipped,
      suspect,
    },
    projects: results,
  };

  console.log(
    `\n[extract-pdfs] ${extracted} with estimates, ${skipped} without, ${suspect} flagged suspect`,
  );

  if (DRY) {
    console.log('[extract-pdfs] --dry: nothing written');
    return;
  }
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`[extract-pdfs] Output: ${OUTPUT}`);
}

main().catch((err) => {
  console.error('\n[extract-pdfs] Fatal error:', err);
  process.exit(1);
});
