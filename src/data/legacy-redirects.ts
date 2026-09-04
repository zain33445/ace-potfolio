// Legacy URLs → 301 permanent redirect to the canonical consolidated target.
// Sources: the 15 cannibalizing blog posts identified in
// seo/orphan-and-consolidation-plan-2026-08-24.md (Ahrefs confirmed zero
// referring domains on any source, so no equity at risk), plus the slug
// collision reserving /outsource-construction-estimation for the canonical
// /outsourced-construction-estimating.
//
// No imports — consumed by src/middleware.ts, which must stay cheap for the
// Edge bundle, and by src/data/services-cms.ts to keep redirected pages out
// of internal-link candidate lists.
export const LEGACY_301: Record<string, string> = {
  // Cluster A — Warehouse development → /warehouses-development
  '/end-to-end-warehouse-development-services-for-modern-businesses': '/warehouses-development/',
  '/warehouse-development-services-how-warehouses-are-planned-designed-and-built': '/warehouses-development/',
  '/why-your-business-needs-a-professional-warehouse-development-company': '/warehouses-development/',
  '/warehouse-development-services-in-usa-building-efficient-scalable-and-modern-storage-solutions': '/warehouses-development/',
  '/warehouse-development-services-in-usa-building-efficient-spaces-for-modern-businesses': '/warehouses-development/',
  '/warehouse-development-services-in-usa': '/warehouses-development/',
  // Cluster B — Blueprint estimation → /blueprint-estimation
  '/blueprint-estimation-cut-costs-before-you-break-ground': '/blueprint-estimation/',
  '/blueprint-estimation-services-explained-a-step-by-step-construction-guide': '/blueprint-estimation/',
  '/reliable-estimating-services-for-u-s-contractors-from-blueprint-to-completion': '/blueprint-estimation/',
  '/blueprint-estimation-services-usa-the-foundation-of-accurate-construction-planning': '/blueprint-estimation/',
  '/blueprint-estimation-services-in-usa-the-foundation-of-cost-effective-construction': '/blueprint-estimation/',
  '/best-blueprint-estimation-services-in-usa': '/blueprint-estimation/',
  // Cluster C — Quantity surveyor → /quantity-surveyor-services
  '/what-is-a-quantity-surveyor-service-a-complete-construction-guide': '/quantity-surveyor-services/',
  '/quantity-surveyor-services-ensuring-accuracy-and-efficiency-in-construction-projects': '/quantity-surveyor-services/',
  '/quantity-surveyor-services-in-usa-ensuring-precision-and-profitability-in-construction-projects': '/quantity-surveyor-services/',
  // Slug collision — reserve the loser for the canonical outsourced page.
  // BROKEN: /outsourced-construction-estimating/ 404s, so this 301s into a
  // dead end. Repoint at the item-6 outsourcing page when it is built.
  '/outsource-construction-estimation': '/outsourced-construction-estimating/',
  // Cluster D — duplicate electrical page. The WP page at
  // /electrical-estimation/ carried the same <title> as the repo route
  // below and targeted the same KD-0 keyword, so the two cannibalised
  // each other. The repo route wins: FAQPage schema, the Division 26
  // project evidence, and it is in the sitemap (the WP page never was).
  '/electrical-estimation': '/electrical-estimating-services/',
  // Duplicate lead-capture page — /contact-us/ is the canonical form.
  '/quick-quote': '/contact-us/',
};
