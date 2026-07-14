#!/usr/bin/env node

/**
 * extract-pdfs.mjs
 *
 * One-time script: fetches all project samples from WordPress, downloads each PDF,
 * extracts cost data via PDF text parsing, and writes a JSON file at
 * src/data/extracted-projects.json.
 *
 * Usage:  npm run extract
 */

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/* ── Paths ──────────────────────────────────────────────────── */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.resolve(__dirname, '..', 'src', 'data', 'extracted-projects.json');

/* ── WP Samples page URL ────────────────────────────────────── */

const WP_SAMPLES_URL = 'https://theaceservices.com/wp-json/wp/v2/pages?slug=samples&_embed=true';

/* ─── Category mapping ───────────────────────────────────────── */

const TAB_CATEGORIES = {
  1: 'GENERAL CONTRACTOR',
  2: 'SUB CONTRACTORS',
  3: '3D RENDERS',
  4: 'PERMIT SETS',
  5: 'SHOP DRAWINGS',
};

/* ─── Helpers ─────────────────────────────────────────────────── */

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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sanitizeProjectName(raw) {
  return raw.replace(/^\d+\s*[.|)]?\s*\|?\s*/, '').trim();
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/* ─── WP Samples HTML parser ────────────────────────────────── */

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

/* ─── Cost extraction from PDF text ──────────────────────────── */

function parseProjectCosts(text) {
  const clean = normalizeWhitespace(text);

  // Building GSF
  const areaMatch = clean.match(/BUILDING\s+(?:GSF|SF|AREA)\s+([\d,]+)/i);
  if (!areaMatch) return null;
  const totalAreaSqFt = parseInt(areaMatch[1].replace(/,/g, ''));
  if (isNaN(totalAreaSqFt)) return null;

  // Total trade cost (before Overhead)
  const totalMatch = clean.match(/([\d,]+)\s*\$\s*[\d.]+\s*\$\s*OVERHEAD\s+AND\s+PROFIT/i);
  const estimatedCost = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : 0;

  // Suggested bid (last big number before TOTAL TRADE COST)
  const bidMatch = clean.match(/([\d,]+)\s*\$\s*[\d.]+\s*\$\s*TOTAL\s+TRADE\s+COST/i);
  const suggestedBid = bidMatch ? parseInt(bidMatch[1].replace(/,/g, '')) : 0;

  // Cost per SF
  const cpsfMatch = clean.match(/[\d,]+\s*\$\s*([\d.]+)\s*\$\s*TOTAL\s+TRADE\s+COST/i);
  const costPerSf = cpsfMatch ? parseFloat(cpsfMatch[1]) : 0;

  // Division breakdown
  const divRegex = /(\d{4,5})\s+([A-Z][A-Z\s,;&/()\-.]+?)\s+([\d,]+)\s+\$/g;
  const costDivisions = [];
  let divMatch;
  while ((divMatch = divRegex.exec(clean)) !== null) {
    const cost = parseInt(divMatch[3].replace(/,/g, ''));
    if (!isNaN(cost) && cost > 0) {
      costDivisions.push({
        csiCode: divMatch[1],
        name: divMatch[2].trim().replace(/\s+/g, ' ').replace(/,$/, ''),
        cost,
      });
    }
  }

  if (costDivisions.length === 0) return null;

  // Build CSI divisions list
  const csiDivisions = costDivisions.map((d) => `${d.csiCode} ${d.name}`);

  return {
    totalAreaSqFt,
    estimatedCost: estimatedCost || costDivisions.reduce((s, d) => s + d.cost, 0),
    suggestedBid: suggestedBid || Math.round((estimatedCost || costDivisions.reduce((s, d) => s + d.cost, 0)) * 1.3),
    costPerSf: costPerSf || Math.round(((estimatedCost || costDivisions.reduce((s, d) => s + d.cost, 0)) / totalAreaSqFt) * 100) / 100,
    costDivisions,
    csiDivisions: csiDivisions.sort(),
  };
}

async function extractProjectPdf(pdfUrl, title) {
  try {
    const resp = await fetch(pdfUrl);
    if (!resp.ok) {
      console.warn(`  ⚠ HTTP ${resp.status} for ${title}`);
      return null;
    }
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
    console.warn(`  ⚠ PDF error for "${title}": ${err.message}`);
    return null;
  }
}

/* ─── Main ──────────────────────────────────────────────────── */

async function main() {
  console.log('[extract-pdfs] Fetching WP samples...');

  const resp = await fetch(WP_SAMPLES_URL);
  if (!resp.ok) {
    console.error(`Failed to fetch WP samples: HTTP ${resp.status}`);
    process.exit(1);
  }

  const [page] = await resp.json();
  if (!page) {
    console.error('No samples page found');
    process.exit(1);
  }

  // Suppress pdfjs font warnings
  const oldWarn = console.warn;
  console.warn = () => {};

  const samples = parseSamplesHtml(page.content.rendered);
  console.warn = oldWarn;
  console.log(`[extract-pdfs] Found ${samples.length} projects\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    const label = `[${i + 1}/${samples.length}] ${sample.title}`;
    process.stdout.write(`  ${label}... `);

    console.warn = () => {};
    const costs = await extractProjectPdf(sample.pdfUrl, sample.title);
    console.warn = oldWarn;

    if (costs) {
      const slug = slugify(sample.titleClean);
      results.push({
        id: `P-${String(sample.id).padStart(3, '0')}`,
        slug,
        title: sample.title,
        category: sample.category,
        location: 'USA',
        imageUrl: sample.imageUrl,
        pdfUrl: sample.pdfUrl,
        scope: getScopeFromCategory(sample.category),
        totalAreaSqFt: costs.totalAreaSqFt,
        estimatedCost: costs.estimatedCost,
        suggestedBid: costs.suggestedBid,
        costPerSf: costs.costPerSf,
        costDivisions: costs.costDivisions,
        csiDivisions: costs.csiDivisions,
        description: generateDescription(sample.title, costs),
      });
      console.log('✓');
      successCount++;
    } else {
      const slug = slugify(sample.titleClean);
      results.push({
        id: `P-${String(sample.id).padStart(3, '0')}`,
        slug,
        title: sample.title,
        category: sample.category,
        location: 'USA',
        imageUrl: sample.imageUrl,
        pdfUrl: sample.pdfUrl,
        scope: getScopeFromCategory(sample.category),
        totalAreaSqFt: 0,
        estimatedCost: 0,
        suggestedBid: 0,
        costPerSf: 0,
        costDivisions: [],
        csiDivisions: [],
        description: `${sample.title} — ${sample.category.toLowerCase()} cost estimation project.`,
        _fallback: true,
      });
      console.log('✗ (fallback)');
      failCount++;
    }
  }

  console.warn = oldWarn;

  // Write output
  const output = {
    _meta: {
      extracted: new Date().toISOString(),
      total: results.length,
      success: successCount,
      fallback: failCount,
    },
    projects: results,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`\n[extract-pdfs] Done! ${successCount} extracted + ${failCount} fallback`);
  console.log(`[extract-pdfs] Output: ${OUTPUT}`);
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function getScopeFromCategory(category) {
  const scopes = {
    'GENERAL CONTRACTOR': ['Complete Cost Estimation', 'Quantity Takeoff'],
    'SUB CONTRACTORS': ['MEP Takeoff', 'Trade-Specific Estimate'],
    '3D RENDERS': ['3D Visualization', 'Design Review'],
    'PERMIT SETS': ['Permit Drawing Check', 'Structural Stamping'],
    'SHOP DRAWINGS': ['Shop Drawing Review', 'Fabrication Detailing'],
  };
  return scopes[category] ?? ['Cost Estimation', 'Quantity Takeoff'];
}

function generateDescription(title, costs) {
  const sample = costs.costDivisions.map((d) => d.name).slice(0, 3).join(', ');
  const area = costs.totalAreaSqFt.toLocaleString();
  return `Complete cost estimation for ${title} spanning ${area} SF across ${costs.costDivisions.length} trade divisions including ${sample}. AACE Class 3 estimate delivered with full quantity takeoff and bid preparation.`;
}

main().catch((err) => {
  console.error('\n[extract-pdfs] Fatal error:', err);
  process.exit(1);
});
