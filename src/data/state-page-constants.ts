/**
 * state-page-constants.ts
 *
 * Values shared by every /locations page. They live here rather than in each
 * Sanity document on purpose: the numbers below are claims about the whole
 * company, so they must read identically on all 50 state pages. Storing them
 * per-document guarantees they drift, and "ISO 9001-aligned" quietly becoming
 * "ISO 9001 certified" on one page is the kind of error that is both
 * irreversible once indexed and easy to miss in review.
 *
 * A statePage document only overrides the list if
 * `whyChooseUsOverride` is non-empty.
 */

export const LOCATION_SERVICE_SEGMENT = 'construction-and-estimation-services';

/** URL for a state page: /locations/{serviceSlug}+{stateSlug}/ */
export function locationPath(serviceSlug: string, stateSlug: string): string {
  return `/locations/${serviceSlug}+${stateSlug}/`;
}

/** Parses "construction-and-estimation-services+texas" back into its parts. */
export function parseLocationSlug(
  param: string,
): { serviceSlug: string; stateSlug: string } | null {
  const decoded = decodeURIComponent(param);
  const parts = decoded.split('+');
  if (parts.length !== 2) return null;
  const [serviceSlug, stateSlug] = parts.map((p) => p.trim());
  if (!serviceSlug || !stateSlug) return null;
  return { serviceSlug, stateSlug };
}

/**
 * The {why_choose_us} block. Seven points, identical on every page.
 *
 * Wording is deliberate and load-bearing:
 * - "AACE Class 3" / "±10% to ±20%" — never imply a tighter class.
 * - "ISO 9001-aligned", never "certified". Certification is a stronger claim
 *   that has not been substantiated.
 * - 89% is framed as an average across completed projects, never a promise.
 */
export const WHY_CHOOSE_US: ReadonlyArray<string> = [
  '89% average bid win rate across completed projects, driven by accurate, defensible estimates rather than guesswork',
  '2,893+ completed projects nationwide, with a substantial and growing share based in {STATE}',
  'AACE Class 3 estimate accuracy (±10% to ±20%), the industry standard for a bankable, bid-ready number',
  'ISO 9001-aligned quality process, including a mandatory two-stage review: one estimator prepares the takeoff, a senior consultant audits it, before anything reaches your desk',
  'CSI MasterFormat organization on every estimate, so your numbers map directly to how {STATE} subcontractors and suppliers actually quote',
  '24–48 hour turnaround, built for the pace of a market where bid deadlines don\u2019t wait',
  'PlanSwift and Bluebeam-based digital takeoffs, calibrated precisely to each {STATE} project\u2019s drawing set',
];

/** Replaces the {STATE} placeholder with the real state name. */
export function proofPoints(state: string, override?: string[] | null): string[] {
  const list = override && override.length > 0 ? override : [...WHY_CHOOSE_US];
  return list.map((line) => line.replaceAll('{STATE}', state));
}