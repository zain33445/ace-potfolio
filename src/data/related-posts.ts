/**
 * Topically-related posts, per post.
 *
 * The related strip used to show the three newest posts, which meant the same
 * three links on all 63 posts — no topical signal at all, and on most pages
 * the links were irrelevant to what the reader was reading.
 *
 * These pairings are computed offline from the post bodies with TF-IDF cosine
 * similarity (scripts/build-related-posts.mjs). Plain word overlap is useless
 * on this blog because every post is about construction estimating; IDF
 * weighting is what makes "warehouse" count and "project" not. Precomputed
 * rather than derived at request time: the inputs only change when a post is
 * published, and the render path should not be doing linear algebra.
 *
 * Regenerate after publishing or retitling a post:
 *   node scripts/build-related-posts.mjs
 *
 * Posts that are 301-redirected into service pages are excluded, so nothing
 * here points at a redirect.
 */

export const RELATED_POSTS: Record<string, readonly string[]> = {
  'accurate-construction-estimating': [
    'your-go-to-estimating-partner-for-projects-in-texas-california-florida-beyond',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'end-to-end-construction-solutions-in-new-york-from-design-to-estimation',
  ],
  'best-outsource-construction-and-estimation-services-in-usa': [
    'how-outsource-estimation-services-help-businesses-save-time-and-money',
    'outsource-estimation-services-to-improve-accuracy-and-maximize-profits',
    'outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors',
  ],
  'blueprint-estimation-experts-serving-builders-across-georgia': [
    'comprehensive-construction-estimating-services-in-ohio',
    'nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development',
    'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter',
  ],
  'bridging-the-gap-nationwide-estimating-services-for-bridges-parks-and-public-infrastructure': [
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
    'cost-effective-construction-services-across-the-usa-quality-meets-precision',
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
  ],
  'building-america-the-ace-services-role-in-developing-residential-and-commercial-projects-nationwide': [
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'nationwide-construction-support-residential-commercial-and-industrial-projects-covered',
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
  ],
  'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa': [
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
  ],
  'commercial-construction-estimation-guide': [
    'residential-construction-estimation-save-thousands',
    'industrial-estimation-the-complete-guide-for-us-contractors',
    'how-construction-estimation-works-in-residential-and-commercial-projects',
  ],
  'commercial-estimation-process-from-takeoffs-to-final-budgets': [
    'how-construction-estimation-works-in-residential-and-commercial-projects',
    'industrial-estimation-explained-cost-planning-for-industrial-construction-projects',
    'what-is-freelance-estimation-a-complete-guide-for-contractors',
  ],
  'comprehensive-construction-estimating-services-in-ohio': [
    'end-to-end-construction-solutions-in-new-york-from-design-to-estimation',
    'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter',
    'residential-and-commercial-construction-solutions-in-texas-powered-by-the-ace-services',
  ],
  'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management': [
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
  ],
  'construction-change-order-causes-prevention': [
    'mep-coordination-clash-detection',
    'how-to-read-construction-blueprints',
    'residential-construction-estimation-save-thousands',
  ],
  'cost-effective-construction-services-across-the-usa-quality-meets-precision': [
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
  ],
  'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them': [
    'educational-building-development-services-in-usa-creating-modern-sustainable-and-inspiring-learning-spaces',
    'everything-you-need-to-know-about-educational-building-construction-services-in-usa',
    'professional-hotels-development-services-in-usa',
  ],
  'educational-building-development-services-in-usa-creating-modern-sustainable-and-inspiring-learning-spaces': [
    'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them',
    'everything-you-need-to-know-about-educational-building-construction-services-in-usa',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
  ],
  'end-to-end-construction-services-in-the-usa-design-estimation-and-development-expertise': [
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
    'nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development',
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
  ],
  'end-to-end-construction-solutions-in-new-york-from-design-to-estimation': [
    'comprehensive-construction-estimating-services-in-ohio',
    'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter',
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
  ],
  'everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights': [
    'everything-you-need-to-know-about-exploring-the-leading-construction-and-estimation-services-in-usa',
    'industrial-estimation-services-usa-the-key-to-smarter-construction-planning',
    'commercial-estimation-process-from-takeoffs-to-final-budgets',
  ],
  'everything-you-need-to-know-about-educational-building-construction-services-in-usa': [
    'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them',
    'educational-building-development-services-in-usa-creating-modern-sustainable-and-inspiring-learning-spaces',
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
  ],
  'everything-you-need-to-know-about-exploring-the-leading-construction-and-estimation-services-in-usa': [
    'everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights',
    'exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers',
    'outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors',
  ],
  'expanding-horizons-construction-estimating-solutions-for-every-u-s-state': [
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
    'nationwide-construction-support-residential-commercial-and-industrial-projects-covered',
  ],
  'exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers': [
    'top-construction-and-estimation-services-in-usa-quality-accuracy-trust',
    'professional-hotels-development-services-in-usa',
    'everything-you-need-to-know-about-exploring-the-leading-construction-and-estimation-services-in-usa',
  ],
  'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america': [
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
  ],
  'from-residential-to-industrial-how-the-ace-services-powers-construction-projects-nationwide': [
    'top-construction-estimation-services-in-the-usa-building-accuracy-across-every-state',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
  ],
  'hotel-development-services-explained-from-planning-to-project-completion': [
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
    'hotel-development-services-in-usa-building-the-future-of-hospitality',
    'professional-hotels-development-services-in-usa',
  ],
  'hotel-development-services-in-usa-building-the-future-of-hospitality': [
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
    'professional-hotels-development-services-in-usa',
    'hotel-development-services-explained-from-planning-to-project-completion',
  ],
  'how-construction-estimation-works-in-residential-and-commercial-projects': [
    'commercial-estimation-process-from-takeoffs-to-final-budgets',
    'industrial-estimation-explained-cost-planning-for-industrial-construction-projects',
    'what-is-freelance-estimation-a-complete-guide-for-contractors',
  ],
  'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects': [
    'hotel-development-services-in-usa-building-the-future-of-hospitality',
    'professional-hotels-development-services-in-usa',
    'hotel-development-services-explained-from-planning-to-project-completion',
  ],
  'how-modern-estimation-tools-are-revolutionizing-construction-projects-across-the-u-s-a': [
    'the-future-of-construction-estimating-u-s-trends-every-contractor-should-know-in-2025',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'end-to-end-construction-services-in-the-usa-design-estimation-and-development-expertise',
  ],
  'how-outsource-estimation-services-help-businesses-save-time-and-money': [
    'outsource-estimation-services-to-improve-accuracy-and-maximize-profits',
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
    'best-outsource-construction-and-estimation-services-in-usa',
  ],
  'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design': [
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
  ],
  'how-to-read-construction-blueprints': [
    'construction-change-order-causes-prevention',
    'permit-sets-for-construction-complete-guide',
    'mep-coordination-clash-detection',
  ],
  'industrial-and-residential-construction-estimation-services-in-illinois': [
    'comprehensive-construction-estimating-services-in-ohio',
    'nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
  ],
  'industrial-estimation-explained-cost-planning-for-industrial-construction-projects': [
    'commercial-estimation-process-from-takeoffs-to-final-budgets',
    'how-construction-estimation-works-in-residential-and-commercial-projects',
    'industrial-estimation-services-usa-the-key-to-smarter-construction-planning',
  ],
  'industrial-estimation-services-usa-the-key-to-smarter-construction-planning': [
    'commercial-estimation-process-from-takeoffs-to-final-budgets',
    'everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights',
    'exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers',
  ],
  'industrial-estimation-the-complete-guide-for-us-contractors': [
    'commercial-construction-estimation-guide',
    'residential-commercial-and-industrial-construction-estimation-in-michigan',
    'industrial-estimation-explained-cost-planning-for-industrial-construction-projects',
  ],
  'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter': [
    'comprehensive-construction-estimating-services-in-ohio',
    'end-to-end-construction-solutions-in-new-york-from-design-to-estimation',
    'top-construction-estimation-services-in-california-building-precision-and-trust-statewide',
  ],
  'mep-coordination-clash-detection': [
    'construction-change-order-causes-prevention',
    'how-to-read-construction-blueprints',
    'why-accurate-estimation-matters-in-large-scale-projects-across-the-usa',
  ],
  'nationwide-construction-support-residential-commercial-and-industrial-projects-covered': [
    'expanding-horizons-construction-estimating-solutions-for-every-u-s-state',
    'building-america-the-ace-services-role-in-developing-residential-and-commercial-projects-nationwide',
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
  ],
  'nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development': [
    'end-to-end-construction-services-in-the-usa-design-estimation-and-development-expertise',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'cost-effective-construction-services-across-the-usa-quality-meets-precision',
  ],
  'outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors': [
    'best-outsource-construction-and-estimation-services-in-usa',
    'how-outsource-estimation-services-help-businesses-save-time-and-money',
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
  ],
  'outsource-estimating-services-a-complete-guide-for-construction-projects': [
    'outsource-estimation-services-to-improve-accuracy-and-maximize-profits',
    'how-outsource-estimation-services-help-businesses-save-time-and-money',
    'what-is-freelance-estimation-a-complete-guide-for-contractors',
  ],
  'outsource-estimation-services-to-improve-accuracy-and-maximize-profits': [
    'how-outsource-estimation-services-help-businesses-save-time-and-money',
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
    'best-outsource-construction-and-estimation-services-in-usa',
  ],
  'outsourcing-construction-estimation-the-smart-move': [
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
    'outsource-estimation-services-to-improve-accuracy-and-maximize-profits',
    'best-outsource-construction-and-estimation-services-in-usa',
  ],
  'permit-sets-for-construction-complete-guide': [
    'how-to-read-construction-blueprints',
    'residential-construction-estimation-save-thousands',
    'commercial-construction-estimation-guide',
  ],
  'professional-hotels-development-services-in-usa': [
    'hotel-development-services-in-usa-building-the-future-of-hospitality',
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
    'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them',
  ],
  'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects': [
    'quantity-surveyor-services-what-they-are-and-why-your-project-needs-them',
    'top-construction-and-estimation-services-in-usa-quality-accuracy-trust',
    'quantity-surveyor-vs-cost-estimator-key-differences',
  ],
  'quantity-surveyor-services-what-they-are-and-why-your-project-needs-them': [
    'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects',
    'quantity-surveyor-vs-cost-estimator-key-differences',
    'top-construction-and-estimation-services-in-usa-quality-accuracy-trust',
  ],
  'quantity-surveyor-vs-cost-estimator-key-differences': [
    'quantity-surveyor-services-what-they-are-and-why-your-project-needs-them',
    'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects',
    'hotel-development-services-explained-from-planning-to-project-completion',
  ],
  'reliable-construction-estimation-and-design-support-in-north-carolina': [
    'residential-and-commercial-construction-solutions-in-texas-powered-by-the-ace-services',
    'end-to-end-construction-solutions-in-new-york-from-design-to-estimation',
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
  ],
  'residential-and-commercial-construction-solutions-in-texas-powered-by-the-ace-services': [
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'why-u-s-developers-choose-the-ace-services-for-accurate-and-timely-estimation',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
  ],
  'residential-commercial-and-industrial-construction-estimation-in-michigan': [
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
    'top-construction-estimation-services-in-the-usa-building-accuracy-across-every-state',
    'industrial-estimation-the-complete-guide-for-us-contractors',
  ],
  'residential-construction-estimation-save-thousands': [
    'commercial-construction-estimation-guide',
    'industrial-estimation-the-complete-guide-for-us-contractors',
    'residential-commercial-and-industrial-construction-estimation-in-michigan',
  ],
  'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services': [
    'comprehensive-construction-solutions-in-the-usa-estimation-design-and-project-management',
    'top-construction-estimation-services-in-the-usa-building-accuracy-across-every-state',
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
  ],
  'the-future-of-construction-estimating-u-s-trends-every-contractor-should-know-in-2025': [
    'how-modern-estimation-tools-are-revolutionizing-construction-projects-across-the-u-s-a',
    'building-stronger-communities-public-educational-and-healthcare-construction-in-the-usa',
    'end-to-end-construction-services-in-the-usa-design-estimation-and-development-expertise',
  ],
  'top-construction-and-estimation-services-in-usa-quality-accuracy-trust': [
    'exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers',
    'educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them',
    'professional-hotels-development-services-in-usa',
  ],
  'top-construction-estimation-services-in-california-building-precision-and-trust-statewide': [
    'why-u-s-developers-choose-the-ace-services-for-accurate-and-timely-estimation',
    'end-to-end-construction-solutions-in-new-york-from-design-to-estimation',
    'leading-construction-estimators-in-pennsylvania-helping-you-build-smarter',
  ],
  'top-construction-estimation-services-in-the-usa-building-accuracy-across-every-state': [
    'from-residential-to-industrial-how-the-ace-services-powers-construction-projects-nationwide',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
    'nationwide-construction-support-residential-commercial-and-industrial-projects-covered',
  ],
  'warehouse-development-in-usa-key-trends-strategies-and-future-opportunities': [
    'what-you-need-to-know-about-warehouse-development-services-in-the-usa',
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
    'state-to-state-construction-estimation-services-why-u-s-contractors-trust-the-ace-services',
  ],
  'what-is-freelance-estimation-a-complete-guide-for-contractors': [
    'outsource-estimating-services-a-complete-guide-for-construction-projects',
    'how-outsource-estimation-services-help-businesses-save-time-and-money',
    'best-outsource-construction-and-estimation-services-in-usa',
  ],
  'what-you-need-to-know-about-warehouse-development-services-in-the-usa': [
    'warehouse-development-in-usa-key-trends-strategies-and-future-opportunities',
    'how-hotel-development-in-usa-helps-build-profitable-hospitality-projects',
    'everything-you-need-to-know-about-educational-building-construction-services-in-usa',
  ],
  'why-accurate-estimation-matters-in-large-scale-projects-across-the-usa': [
    'industrial-estimation-explained-cost-planning-for-industrial-construction-projects',
    'commercial-construction-estimation-guide',
    'commercial-estimation-process-from-takeoffs-to-final-budgets',
  ],
  'why-u-s-developers-choose-the-ace-services-for-accurate-and-timely-estimation': [
    'your-go-to-estimating-partner-for-projects-in-texas-california-florida-beyond',
    'top-construction-estimation-services-in-california-building-precision-and-trust-statewide',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
  ],
  'your-go-to-estimating-partner-for-projects-in-texas-california-florida-beyond': [
    'how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design',
    'from-healthcare-to-educational-buildings-specialized-construction-estimation-across-america',
    'why-u-s-developers-choose-the-ace-services-for-accurate-and-timely-estimation',
  ],
};

/** Related slugs for a post, newest-first fallback handled by the caller. */
export function getRelatedSlugs(slug: string): readonly string[] {
  return RELATED_POSTS[slug] ?? [];
}
