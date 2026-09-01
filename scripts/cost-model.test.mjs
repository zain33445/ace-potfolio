#!/usr/bin/env node
/**
 * Self-check for cost-model.mjs. Run: node scripts/cost-model.test.mjs
 *
 * Fixtures mirror the real PDF summary layout (post-whitespace-normalisation),
 * including the two-summary-table shape that caused divisions to double-count.
 */

import assert from 'node:assert/strict';
import {
  isCostCategory,
  firstSummaryBlock,
  resolveAreaBasis,
  parseProjectCosts,
  validate,
} from './cost-model.mjs';

/* Fixtures use real pdfjs content order: values follow their labels, the
   "GENERAL SUMMARY" heading is emitted AFTER the table, and the bid row ends
   the block. Two tables = the Freshman Hill shape. */
const TWO_SUMMARY = [
  'Project Name: Freshman Hill Scope: GC Without MEP',
  'BUILDING GSF 2,650 SITE GSF 39,478 DIVISION NO. DESCRIPTION TOTAL DIV. COST TOTAL DIV. COST (PER SF)',
  '1000 GENERAL REQUIREMENTS 75,000 $ 28.30 $',
  '3000 CONCRETE 500,000 $ 188.68 $',
  '5000 METALS 976,280 $ 368.41 $',
  '1,551,280 $ 585.39 $ OVERHEAD AND PROFIT 15% 232,692 $ 87.81 $ INSURANCE 2% 31,026 $ 11.71 $',
  '1,977,880 $ 746.37 $ TOTAL TRADE COST GENERAL SUMMARY SUGGESTED BID',
  'BUILDING GSF 2,650 SITE GSF 39,478 DIVISION NO. DESCRIPTION',
  '1000 GENERAL REQUIREMENTS 60,000 $ 22.64 $',
  '3000 CONCRETE 400,000 $ 150.94 $',
  '1,158,570 $ 437.20 $ OVERHEAD AND PROFIT 15% 173,795 $ 65.58 $',
  '1,477,260 $ 557.46 $ TOTAL TRADE COST GENERAL SUMMARY SUGGESTED BID',
].join(' ');

/* Site/civil project — the Wildlife Pickleball Park shape. */
const SITE_WORK = [
  'Project Name: Wildlife Pickleball Park Scope: GC',
  'BUILDING GSF 299 SITE GSF 211,266 DIVISION NO. DESCRIPTION TOTAL DIV. COST TOTAL DIV. COST (PER SF)',
  '1000 GENERAL REQUIREMENTS 50,400 $ 168.56 $',
  '32000 EXTERIOR IMPROVEMENTS 1,006,320 $ 3.35 $',
  '1,056,720 $ 456 $ OVERHEAD AND PROFIT 10% 105,671.96 $ 45.55 $',
  '1,225,795 $ 5.80 $ TOTAL TRADE COST GENERAL SUMMARY SUGGESTED BID',
].join(' ');

/* ── bug 2: category gate ────────────────────────────────────── */
assert.equal(isCostCategory('GENERAL CONTRACTOR'), true);
assert.equal(isCostCategory('SUB CONTRACTORS'), true);
for (const c of ['3D RENDERS', 'PERMIT SETS', 'SHOP DRAWINGS']) {
  assert.equal(isCostCategory(c), false, `${c} must not be parsed for costs`);
}

/* ── bug 3: only the first summary table is parsed ───────────── */
const block = firstSummaryBlock(TWO_SUMMARY.replace(/\s+/g, ' ').trim());
assert.ok(block.endsWith('1,977,880 $ 746.37 $'), 'block ends at the first bid row');
assert.ok(!block.includes('1,477,260'), 'second table must be excluded');
assert.equal((block.match(/OVERHEAD AND PROFIT/gi) || []).length, 1, 'one markup block only');

const two = parseProjectCosts(TWO_SUMMARY);
assert.equal(two.costDivisions.length, 3, 'must not absorb second table divisions');
const twoSum = two.costDivisions.reduce((s, d) => s + d.cost, 0);
assert.equal(twoSum, 1_551_280);
assert.equal(two.estimatedCost, 1_551_280);
assert.equal(two.suggestedBid, 1_977_880, 'bid must come from the first table');

/* ── bug 1: bidPerSf vs derived costPerSf ────────────────────── */
assert.equal(two.bidPerSf, 746.37, 'per-SF on the bid row is the BID rate');
assert.equal(two.costPerSf, 585.39, 'costPerSf is derived from estimatedCost');
assert.ok(two.costPerSf < two.bidPerSf, 'cost per SF must be below bid per SF');

/* ── bug 4: area basis for site work ─────────────────────────── */
assert.deepEqual(resolveAreaBasis(2650, 39478, 1_551_280), {
  areaBasis: 2650,
  areaBasisKind: 'building',
});
assert.deepEqual(resolveAreaBasis(299, 211266, 1_056_720), {
  areaBasis: 211266,
  areaBasisKind: 'site',
});

const site = parseProjectCosts(SITE_WORK);
assert.equal(site.areaBasisKind, 'site');
assert.equal(site.areaBasis, 211_266);
assert.equal(site.costPerSf, 5, '$5.00/sf on site area, not $3,534/sf on 299 sf');
assert.equal(site.bidPerSf, 5.8, 'bid per SF read from the bid row');

/* ── validation ──────────────────────────────────────────────── */
assert.deepEqual(validate(two), [], 'clean building record');
assert.deepEqual(validate(site), [], 'clean site record');

assert.ok(
  validate({ ...two, suggestedBid: 1000 }).some((r) => r.includes('suggestedBid')),
  'bid below cost must be caught',
);
assert.ok(
  validate({
    ...two,
    costDivisions: [...two.costDivisions, { csiCode: '9999', name: 'DUPE', cost: 900_000 }],
  }).some((r) => r.includes('divisions sum')),
  'double-counted divisions must be caught',
);
assert.ok(
  validate({ ...site, areaBasis: 299, areaBasisKind: 'building' }).some((r) =>
    r.includes('implausible building rate'),
  ),
  'implausible $/sf must be caught',
);

console.log('cost-model: all checks passed');
