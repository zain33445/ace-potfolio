/**
 * cost-model.mjs
 *
 * Parsing + validation for ACE estimate PDFs. Shared by extract-pdfs.mjs
 * (fresh extraction from the CMS) and reconcile-projects.mjs (repair of the
 * committed JSON without a re-crawl).
 *
 * Four bugs this module exists to fix, all verified against source PDFs:
 *
 *  1. The field previously named `costPerSf` was BID per SF, not cost per SF.
 *     The old regexes for `suggestedBid` and `costPerSf` matched the same row
 *     of the summary table — group 1 was the bid, group 2 the per-SF figure ON
 *     THE BID ROW. suggestedBid/area === costPerSf held for 33/38 records.
 *     Cost and bid differ by overhead+profit+insurance+contingency (1.16-1.40x,
 *     median 1.26x), so publishing one as the other overstates cost by ~26%.
 *
 *  2. Extraction ran on every PDF regardless of category. Only GENERAL
 *     CONTRACTOR and SUB CONTRACTORS samples are estimates; 3D RENDERS,
 *     PERMIT SETS and SHOP DRAWINGS are drawing sets. A drawing whose title
 *     block happens to carry "BUILDING GSF" passes the old guard, after which
 *     the division regex matches any `NNNN CAPS <number> $` run in a schedule
 *     and fabricates CSI divisions for a project that has no estimate.
 *
 *  3. Some PDFs carry TWO summary tables (alternates / scenarios). The old
 *     division regex used /g over the whole document and accumulated divisions
 *     from every table, while the totals used .match() and took whichever came
 *     first. Freshman Hill divSum was 1.75x its estimatedCost, the asphalt
 *     estimate 1.66x. Parsing is now bounded to the first summary block.
 *
 *  4. Per-SF used BUILDING GSF unconditionally. Site/civil projects also carry
 *     SITE GSF and price against it. Wildlife Pickleball Park is BUILDING GSF
 *     299 / SITE GSF 211,266; dividing $1,056,720 by 299 yields $3,534/sf.
 *     The basis is now chosen explicitly and recorded in `areaBasisKind`.
 */

/* ── Category gate (bug 2) ───────────────────────────────────── */

/** Only these sample categories are cost estimates. */
export const COST_CATEGORIES = new Set(['GENERAL CONTRACTOR', 'SUB CONTRACTORS']);

export function isCostCategory(category) {
  return COST_CATEGORIES.has(category);
}

/* ── Tunables ────────────────────────────────────────────────── */

/**
 * Above this $/sf a "building" basis is treated as implausible and the site
 * basis is used instead. Highest verified real building rate in the set is
 * $588/sf (Heinzsman Residence), so 1000 leaves generous headroom while still
 * catching the pickleball park at $3,534/sf.
 */
const IMPLAUSIBLE_BUILDING_RATE = 1000;

/** Fractional tolerance for cross-checks against figures printed in the PDF. */
const TOLERANCE = 0.02;

/* ── Helpers ─────────────────────────────────────────────────── */

const normalize = (t) => t.replace(/\s+/g, ' ').trim();
const toInt = (s) => parseInt(String(s).replace(/,/g, ''), 10);

/**
 * Bug 3: restrict parsing to the first summary table so alternates elsewhere
 * in the document cannot contribute divisions or totals.
 *
 * Neither "GENERAL SUMMARY" nor "TOTAL TRADE COST" is a usable boundary. In
 * pdfjs content order both labels are emitted AFTER the table they describe,
 * and the bid amount is often separated from its label by a page header:
 *
 *   pickleball  ... TAX 5% 47,552 $ 20.50 $ 1,225,795 $ 528.40 $ TOTAL TRADE COST
 *   freshman    ... TAX 4.5% 69,808 $ 12.97 $ 1,977,880 $ 367.56 $ Project Name:
 *                   Sunset Terrace ... TOTAL TRADE COST
 *   carwash     ... TAX 4.5% 8,775 $ 1.70 $ 238,888 $ 46.40 $ GENERAL SUMMARY
 *
 * What does hold everywhere: the summary ends with a run of markup rows that
 * each carry a percentage (OVERHEAD AND PROFIT / INSURANCE / CONTINGENCY /
 * TAX), and the bid is the first `amount $ perSf $` row after them with NO
 * percentage attached.
 */
const COST_ROW_RE = /([\d,]+)\s*\$\s*([\d.,]+)\s*\$\s*OVERHEAD\s+AND\s+PROFIT/i;
const AMOUNT_ROW_RE =
  /(?:(\d+(?:\.\d+)?)\s*%\s*)?(?:([\d,]+(?:\.\d+)?)|-)\s*\$\s*(?:([\d,]+(?:\.\d+)?)|-)\s*\$/g;

/** Locates the cost row, the bid row, and where the first summary ends. */
export function findTotals(normalized) {
  const cost = normalized.match(COST_ROW_RE);
  if (!cost) return null;

  AMOUNT_ROW_RE.lastIndex = cost.index + cost[0].length;
  let m;
  while ((m = AMOUNT_ROW_RE.exec(normalized)) !== null) {
    if (m[1] || !m[2]) continue; // a markup row, or a dash placeholder
    return {
      estimatedCost: toInt(cost[1]),
      suggestedBid: toInt(m[2]),
      bidPerSf: m[3] ? parseFloat(m[3].replace(/,/g, '')) : 0,
      blockEnd: m.index + m[0].length,
    };
  }
  return null;
}

export function firstSummaryBlock(normalized) {
  const t = findTotals(normalized);
  return t ? normalized.slice(0, t.blockEnd) : normalized;
}

/* ── Area basis (bug 4) ──────────────────────────────────────── */

export function resolveAreaBasis(buildingGsf, siteGsf, estimatedCost) {
  const b = buildingGsf > 0 ? buildingGsf : 0;
  const s = siteGsf > 0 ? siteGsf : 0;
  if (!b && !s) return { areaBasis: 0, areaBasisKind: 'none' };
  if (!s) return { areaBasis: b, areaBasisKind: 'building' };
  if (!b) return { areaBasis: s, areaBasisKind: 'site' };
  const buildingRate = estimatedCost / b;
  return buildingRate > IMPLAUSIBLE_BUILDING_RATE
    ? { areaBasis: s, areaBasisKind: 'site' }
    : { areaBasis: b, areaBasisKind: 'building' };
}

/* ── Parse one estimate PDF's text ───────────────────────────── */

export function parseProjectCosts(rawText) {
  const block = firstSummaryBlock(normalize(rawText));

  const grab = (re) => {
    const m = block.match(re);
    return m ? toInt(m[1]) : 0;
  };

  const buildingGsf = grab(/BUILDING\s+GSF\s+([\d,]+)/i);
  const siteGsf = grab(/SITE\s+GSF\s+([\d,]+)/i);
  if (!buildingGsf && !siteGsf) return null;

  const totals = findTotals(block);
  if (!totals) return null;

  // Cross-check: the overhead percentage and its amount imply the cost base.
  //   pickleball 105,671.96 / 0.10 = 1,056,720
  //   freshman     232,692   / 0.15 = 1,551,280
  const oandp = block.match(
    /OVERHEAD\s+AND\s+PROFIT\s+(\d+(?:\.\d+)?)\s*%\s*\$?\s*([\d,.]+)/i,
  );
  const oandpPct = oandp ? parseFloat(oandp[1]) : 0;
  const impliedCost =
    oandp && oandpPct > 0
      ? Math.round(parseFloat(String(oandp[2]).replace(/,/g, '')) / (oandpPct / 100))
      : 0;

  // Divisions, bounded to this summary block only (bug 3).
  const divRegex = /(\d{4,5})\s+([A-Z][A-Z\s,;&/()\-.]+?)\s+([\d,]+)\s+\$/g;
  const costDivisions = [];
  let m;
  while ((m = divRegex.exec(block)) !== null) {
    const cost = toInt(m[3]);
    if (Number.isFinite(cost) && cost > 0) {
      costDivisions.push({
        csiCode: m[1],
        name: m[2].trim().replace(/\s+/g, ' ').replace(/,$/, ''),
        cost,
      });
    }
  }
  if (costDivisions.length === 0) return null;

  // Bug 1: the per-SF figure on the bid row is BID per SF, not cost per SF.
  // It is also unreliable — several PDFs compute their per-SF column against a
  // basis that matches neither BUILDING GSF nor SITE GSF (pickleball prints
  // 528.40, freshman 367.56, neither reproducible from their own totals). So
  // it is kept only as `bidPerSfPrinted` for cross-checking; `bidPerSf` is
  // always derived from suggestedBid / areaBasis, which is arithmetic we can
  // do reliably once cost, bid and basis are known.
  const { estimatedCost, suggestedBid, bidPerSf: bidPerSfPrinted } = totals;

  const { areaBasis, areaBasisKind } = resolveAreaBasis(
    buildingGsf,
    siteGsf,
    estimatedCost,
  );

  return {
    buildingGsf,
    siteGsf,
    areaBasis,
    areaBasisKind,
    estimatedCost,
    suggestedBid,
    // Bug 1: both derived, never read off the bid row.
    costPerSf: areaBasis > 0 ? round2(estimatedCost / areaBasis) : 0,
    bidPerSf: areaBasis > 0 ? round2(suggestedBid / areaBasis) : 0,
    bidPerSfPrinted,
    costDivisions,
    csiDivisions: costDivisions.map((d) => `${d.csiCode} ${d.name}`).sort(),
    impliedCost,
  };
}

const round2 = (n) => Math.round(n * 100) / 100;

/* ── Validation ──────────────────────────────────────────────── */

/**
 * Returns reasons the record's NUMBERS are wrong and must not be published.
 * Empty array means every invariant held. Softer observations that do not
 * invalidate cost or bid go to `note()` instead.
 */
export function validate(rec) {
  const reasons = [];
  const { estimatedCost: c, suggestedBid: b, areaBasis: a, costDivisions: dv } = rec;

  if (!(a > 0)) reasons.push('no usable area basis');
  if (!(c > 0)) reasons.push('estimatedCost missing');
  if (b > 0 && b < c) reasons.push(`suggestedBid (${b}) < estimatedCost (${c})`);

  if (dv?.length) {
    const sum = dv.reduce((s, d) => s + d.cost, 0);
    if (c > 0 && Math.abs(sum - c) / c > TOLERANCE) {
      reasons.push(`divisions sum ${sum} != estimatedCost ${c} (${(sum / c).toFixed(2)}x)`);
    }
  }

  if (rec.impliedCost > 0 && c > 0) {
    if (Math.abs(rec.impliedCost - c) / c > TOLERANCE) {
      reasons.push(`overhead-implied cost ${rec.impliedCost} != estimatedCost ${c}`);
    }
  }

  if (rec.areaBasisKind === 'building' && c > 0 && a > 0) {
    const rate = c / a;
    if (rate > IMPLAUSIBLE_BUILDING_RATE) {
      reasons.push(`implausible building rate $${round2(rate)}/sf`);
    }
  }

  return reasons;
}

/**
 * Recompute every derived field from the record's own totals. Call after any
 * mutation of estimatedCost / suggestedBid / area.
 *
 * Both per-SF figures are derived; the PDF's printed per-SF column is kept
 * separately as bidPerSfPrinted and only cross-checked, never published.
 */
export function derive(rec) {
  const { areaBasis, areaBasisKind } = resolveAreaBasis(
    rec.buildingGsf,
    rec.siteGsf,
    rec.estimatedCost,
  );
  rec.areaBasis = areaBasis;
  rec.areaBasisKind = areaBasisKind;
  rec.costPerSf = areaBasis > 0 ? round2(rec.estimatedCost / areaBasis) : 0;
  rec.bidPerSf = areaBasis > 0 ? round2(rec.suggestedBid / areaBasis) : 0;
  return rec;
}

/**
 * Applies a hand-verified correction if one exists for `title`, then rederives.
 * Returns { title, evidence } — evidence is undefined when nothing was applied.
 */
export function applyVerifiedOverride(rec, title) {
  const override = VERIFIED_OVERRIDES[title];
  if (!override) {
    derive(rec);
    return { title };
  }
  const { evidence, title: newTitle, ...fields } = override;
  Object.assign(rec, fields);
  derive(rec);
  return { title: newTitle ?? title, evidence };
}

/* ── Hand-verified corrections ───────────────────────────────── */

/**
 * Keyed by project title. Every value below was read directly off the source
 * PDF; the `evidence` string records where. Applied after parsing so a fixed
 * extractor cannot silently reintroduce a known-bad figure.
 */
export const VERIFIED_OVERRIDES = {
  'Wildlife Pickleball Park': {
    buildingGsf: 299,
    siteGsf: 211266,
    areaBasis: 211266,
    areaBasisKind: 'site',
    estimatedCost: 1056720,
    suggestedBid: 1225795,
    evidence:
      'Estimate-Wildlife-Pickleball-Park: header "BUILDING GSF 299 / SITE GSF 211,266". ' +
      'PROJECTED COST 1,056,720 + O&P 10% 105,672 + insurance 15,851 + contingency 4.5% 47,552 ' +
      '+ tax 0 = SUGGESTED BID 1,225,795. Park, not a building: per-SF must use SITE GSF.',
  },
  'AUTOMATED CARWASH FACILITY': {
    buildingGsf: 5148,
    siteGsf: 0,
    estimatedCost: 195010,
    suggestedBid: 238888,
    evidence:
      'Openings-Estimate-NEW-AUTOMATED-CARWASH-FACILITY: summary reads ' +
      '"195,010 $ 38 $ OVERHEAD AND PROFIT 10% 19,501.03 ... TAX 4.5% 8,775 $ 1.70 $ ' +
      '238,888 $ 46.40 $". Stored suggestedBid 253,513 does not appear in the PDF.',
  },
  'Freshman Hill': {
    buildingGsf: 2650,
    siteGsf: 39478,
    estimatedCost: 1551278,
    suggestedBid: 1977880,
    evidence:
      'GC-Sample-Student-Life-Improvements-Freshman-Hill: TWO summary tables. First table ' +
      'cost row prints 1,551,278 and SUGGESTED BID 1,977,880; stored bid 2,016,661 ' +
      'came from mixing both tables.',
  },
  'Polytechnic Institute': {
    title: 'Freshman Hill - Asphalt Work',
    buildingGsf: 2650,
    siteGsf: 39478,
    estimatedCost: 904650,
    suggestedBid: 1153428,
    evidence:
      'Asphalt-Work-Student-Life-Improvements-Freshman-Hill: PDF header reads "Project Name: ' +
      'Freshman Hill". This is the asphalt trade estimate for Freshman Hill, NOT a separate ' +
      'Polytechnic Institute project — the title came from the WordPress imagebox, not the PDF. ' +
      'First-table cost row prints 904,650; first-table SUGGESTED BID 1,153,428.',
  },
};

/**
 * Non-blocking observations. These do not invalidate estimatedCost or
 * suggestedBid, but are worth surfacing when reviewing a record.
 */
export function note(rec) {
  const notes = [];
  if (rec.bidPerSfPrinted > 0 && rec.bidPerSf > 0) {
    const drift = Math.abs(rec.bidPerSfPrinted - rec.bidPerSf) / rec.bidPerSf;
    if (drift > TOLERANCE) {
      notes.push(
        `PDF prints ${rec.bidPerSfPrinted}/sf but suggestedBid/areaBasis is ` +
          `${rec.bidPerSf}/sf - the document's per-SF column uses another basis`,
      );
    }
  }
  if (rec.areaBasisKind === 'site') {
    notes.push('per-SF figures are on SITE area, not building area');
  }
  return notes;
}
