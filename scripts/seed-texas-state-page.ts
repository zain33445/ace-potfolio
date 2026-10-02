/**
 * Seeds the Texas statePage document from the approved draft.
 * Idempotent: createOrReplace on a fixed _id, so re-running overwrites in place.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@sanity/client';

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const ID = 'state-page-texas';

let n = 0;
const key = () => `k${(n += 1).toString(36)}`;

const pt = (paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }));

async function main() {
  const services = await c.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "service"]{ _id, slug }`,
  );
  const ref = (slug: string) => {
    const hit = services.find((s) => s.slug === slug);
    if (!hit) throw new Error(`no service doc for slug "${slug}"`);
    return { _type: 'reference', _ref: hit._id, _weak: true };
  };

  const doc = {
    _id: ID,
    _type: 'statePage',
    title: 'Construction and Estimation Services in Texas',
    slug: 'texas',
    state: 'Texas',
    stateAbbreviation: 'TX',

    overview: pt([
      "The ACE Services provides construction and estimation services in Texas, including cost estimating, quantity surveying, MEP and structural shop drawings, 3D architectural rendering, and stamped permit sets, to general contractors, subcontractors, and developers across Houston, Dallas–Fort Worth, Austin, and San Antonio. Projects are delivered in 24–48 hours, priced to AACE Class 3 accuracy (±10–20%), and built on CSI MasterFormat standards, with a Houston-based team that understands Texas permitting, wind-load requirements, and regional labor and material pricing firsthand.",
      "Texas is the largest construction market in the United States, with roughly 925,000 construction workers statewide and sustained double-digit growth in data center, industrial, and multifamily development. That scale is exactly why Texas general contractors and subcontractors face the sharpest version of a national problem: in-house estimating teams can't keep pace with bid volume, and a single missed takeoff or uncoordinated shop drawing costs real money on a market this competitive. The ACE Services was built to solve that, as a Texas-based outsourced estimating and pre-construction partner that plugs directly into your existing bidding and project workflow.",
    ]),

    whyOutsource: pt([
      "Texas's construction boom is a double-edged sword for contractors. More projects mean more bid opportunities, but also more pressure on in-house estimating departments that were never built to handle this volume. The contractors winning the most work in Texas right now share a common pattern: they treat estimating, takeoffs, and shop drawing coordination as an outsourced, specialized function, not a side task squeezed in between site visits.",
      "That shift is reflected directly in what Texas contractors are searching for. Terms like outsource estimating services, freelance estimating services, quantity surveyor services, and construction estimating services near me are seeing significant and growing search volume statewide, a clear signal that Texas GCs and subs are actively looking for exactly the kind of partner we are.",
    ]),

    searchTerms: [
      'outsource estimating services',
      'freelance estimating services',
      'quantity surveyor services',
      'construction estimating services near me',
    ],

    servicesIntro:
      "The ACE Services supports every phase of Texas pre-construction, from first takeoff to stamped permit set:",

    services: [
      { _key: key(), _type: 'object', service: ref('cost-estimating'), description: "detailed, CSI MasterFormat-organized quantity takeoffs and cost estimates for residential, commercial, and industrial Texas projects, reviewed through a two-stage quality process before delivery." },
      { _key: key(), _type: 'object', service: ref('shop-drawing-services'), description: "coordinated, fabrication-ready drawings that resolve mechanical, electrical, plumbing, and structural clashes before they reach a Texas job site." },
      { _key: key(), _type: 'object', service: ref('3d-rendering-services'), description: "photorealistic visuals for owner presentations, investor decks, and Texas municipal design review boards." },
      { _key: key(), _type: 'object', service: ref('permit-set-services'), description: "stamped, reviewer-ready permit documentation built around the specific submission checklist of the Texas jurisdiction you're filing in, from the City of Houston to Dallas, Austin, and San Antonio permitting offices." },
      { _key: key(), _type: 'object', service: ref('blueprint-estimation'), description: "full blueprint-to-quantity takeoffs for complex commercial and multifamily Texas drawing sets." },
      { _key: key(), _type: 'object', service: ref('quantity-surveyor-services'), description: "AACE-aligned quantity surveying for Texas developers and institutional owners who need a defensible, third-party-reviewed number for financing or bid evaluation." },
      { _key: key(), _type: 'object', service: ref('warehouses-development'), description: "cost estimating for the pre-engineered metal buildings, tilt-up concrete, and high-bay distribution facilities driving Texas's industrial boom along the I-35 and I-45 corridors." },
      { _key: key(), _type: 'object', service: ref('freelance-estimation'), description: "flexible, project-by-project or ongoing estimating support for Texas firms that need bid-ready numbers without the overhead of a full-time estimating department." },
      { _key: key(), _type: 'object', service: ref('project-management'), description: "critical path method scheduling and pre-construction planning support for Texas commercial and industrial builds." },
      { _key: key(), _type: 'object', service: ref('commercial-construction'), description: "the same proven estimating process we deliver nationwide, applied to Texas-specific material pricing and labor rates." },
      { _key: key(), _type: 'object', service: ref('healthcare-buildings'), description: "specialized estimating for Texas's fast-growing healthcare, hospitality, and school-construction sectors." },
      { _key: key(), _type: 'object', service: ref('architectural-services'), description: "supporting design documentation and structural analysis for Texas project teams." },
    ],

    primaryCity: {
      _type: 'object',
      name: 'Houston',
      isHeadquarters: true,
      intro: pt([
        "Houston is home base for The ACE Services, and it shows in how we approach every Houston-area project. Houston's construction market is defined by a mix of energy-sector industrial work, dense urban multifamily development, and rapid suburban commercial growth, each with its own takeoff and permitting nuances. Our team routinely handles:",
      ]),
      bullets: [
        "Industrial and petrochemical-adjacent facility estimating, including specialized MEP scope common to Houston's energy corridor",
        "High-volume multifamily and mixed-use commercial takeoffs for Houston's fast-moving residential development market",
        "Houston construction estimating company-level turnaround, because we're local, Houston project teams get same-market responsiveness, not an out-of-state call center",
        "City of Houston and Harris County permit set preparation, built to match local plan review requirements from day one",
      ],
      closing:
        "If you're searching for a construction estimating company in Houston that already understands wind-load design requirements, local material supply timelines, and the City of Houston's permitting process, that local knowledge is built into every estimate we deliver.",
    },

    secondCity: {
      _type: 'object',
      name: 'Dallas–Fort Worth',
      intro: pt([
        "Dallas–Fort Worth is one of the fastest-growing commercial and industrial construction markets in Texas, and it's also where we see some of the highest demand for pre-construction planning and scheduling support specifically, not just takeoffs. Dallas contractors are actively searching for construction schedule management in Dallas, TX, construction project planning in Dallas, and CPM scheduling services, and for good reason: DFW's project volume makes disciplined, critical-path scheduling just as important as an accurate cost estimate. Our Dallas-focused support includes:",
      ]),
      bullets: [
        "CPM scheduling and construction project planning for commercial, industrial, and multifamily DFW projects, sequencing trades realistically against real material lead times",
        "Quantity takeoffs and cost estimates calibrated to current Dallas-Fort Worth labor and material pricing, which has moved independently of other Texas submarkets given DFW's construction volume",
        "Shop drawing coordination for the dense, fast-track commercial and data center projects defining North Texas's current growth cycle",
        "Permit set preparation aligned to Dallas, Fort Worth, Plano, and surrounding municipality submission requirements",
      ],
      closing:
        "Whether you're a general contractor managing multiple concurrent DFW bids or a developer who needs a defensible schedule and budget before breaking ground, our Dallas-area clients get the same 24–48 hour turnaround and two-stage quality review as every other Texas project we take on.",
    },

    restOfState: [
      { _key: key(), _type: 'object', label: 'Austin', description: "fast-track commercial, tech-sector office, and residential development estimating in one of the country's tightest labor and material markets" },
      { _key: key(), _type: 'object', label: 'San Antonio', description: "a mix of military, healthcare, and institutional construction estimating, alongside steady residential and light commercial growth" },
      { _key: key(), _type: 'object', label: 'El Paso, Corpus Christi, and the Rio Grande Valley', description: "industrial, logistics, and distribution-focused estimating tied to Texas's cross-border trade corridors" },
      { _key: key(), _type: 'object', label: 'Statewide rural and secondary markets', description: "remote estimating support for Texas contractors anywhere in the state, delivered through the same digital takeoff and shop drawing process we use in our largest metros" },
    ],

    whyChooseUsOverride: [],

    stateSpecific: [
      { _key: key(), _type: 'object', topic: 'tax', detail: "No state income tax, but high commercial property tax a factor that shapes Texas developers' overall project economics and financing timelines" },
      { _key: key(), _type: 'object', topic: 'weather', detail: "Wind-load and hurricane-zone structural requirements along the Gulf Coast, affecting structural takeoffs for Houston, Corpus Christi, and coastal projects" },
      { _key: key(), _type: 'object', topic: 'growth', detail: "Rapid industrial and data center growth along the I-35 and I-45 corridors, driving up demand, and lead times, for structural steel and MEP equipment statewide" },
      { _key: key(), _type: 'object', topic: 'permits', detail: "Municipality-specific permitting, since Houston, Dallas, Austin, and San Antonio each run independent plan review processes with their own checklists and turnaround expectations" },
      { _key: key(), _type: 'object', topic: 'labour', detail: "Regional labor cost variation, since DFW, Houston, and Austin labor rates have diverged meaningfully as each market's construction volume has grown at a different pace" },
    ],

    faqs: [
      { _key: key(), _type: 'object', question: 'What construction and estimation services does The ACE Services offer in Texas?', answer: "We provide construction cost estimating, quantity surveying, MEP and structural shop drawings, 3D architectural rendering, permit set preparation, blueprint estimation, and CPM scheduling for residential, commercial, industrial, healthcare, hospitality, and educational projects throughout Texas." },
      { _key: key(), _type: 'object', question: 'Do you offer construction estimating services in Houston specifically?', answer: "The ACE Services is headquartered in Houston and has deep familiarity with Houston and Harris County permitting, wind-load design requirements, and the energy-sector industrial work that defines much of the local market." },
      { _key: key(), _type: 'object', question: 'Can you handle CPM scheduling and project planning for Dallas-area projects?', answer: "Yes. Dallas–Fort Worth project planning and construction schedule management are among our most requested services in North Texas, given the pace and volume of DFW's current construction cycle." },
      { _key: key(), _type: 'object', question: 'How fast can I get a construction estimate for a Texas project?', answer: "Most Texas projects receive a complete, reviewed estimate within 24 to 48 hours of receiving a drawing set, depending on project size and complexity." },
      { _key: key(), _type: 'object', question: 'Do you work with contractors outside of Houston, Dallas, Austin, and San Antonio?', answer: "Yes. We support contractors and developers anywhere in Texas, including secondary and rural markets, through the same digital takeoff and remote shop drawing process used on our largest metro projects." },
      { _key: key(), _type: 'object', question: 'Is your estimating accurate enough to use for a competitive Texas bid?', answer: "Every estimate is built to AACE Class 3 accuracy (±10% to ±20%) and passes through a two-stage internal review before delivery, which is why our Texas clients maintain an 89% average bid win rate." },
    ],

    cta: {
      _type: 'object',
      heading: 'Ready to Bid Smarter on Your Next Texas Project?',
      body: "Whether you need a single cost estimate, a full quantity surveyor package, or ongoing outsourced estimating support across Houston, Dallas, Austin, San Antonio, or anywhere else in Texas, contact The ACE Services or run our instant project calculator to see what your next Texas project should cost, before you submit your bid.",
    },

    seoTitle: 'Construction and Estimation Services in Texas | The ACE Services',
    seoDescription:
      'Houston-based construction and estimation services in Texas: cost estimating, quantity surveying, shop drawings, permit sets and CPM scheduling. AACE Class 3, 24–48h turnaround.',
    excludeFromSitemap: false,
  };

  const res = await c.createOrReplace(doc);
  console.log('written:', res._id, res._type);

  const back = await c.fetch<Record<string, unknown>>(
    `*[_type == "statePage" && slug == $slug][0]{
       "slug": slug,
       "state": state,
       "overviewParas": count(overview),
       "whyParas": count(whyOutsource),
       "searchTerms": count(searchTerms),
       "services": count(services),
       "cities": [primaryCity.name, secondCity.name],
       "hq": primaryCity.isHeadquarters,
       "cityBullets": count(primaryCity.bullets) + count(secondCity.bullets),
       "restOfState": count(restOfState),
       "topics": stateSpecific[].topic,
       "faqs": count(faqs),
       "ctaHeading": cta.heading,
       "brokenRefs": count(services[!(service->slug != null)]),
       "linkedSlugs": services[].service->slug
     }`,
    { slug: 'texas' },
  );

  console.log('\nread back:');
  for (const [k, v] of Object.entries(back)) {
    console.log(`  ${k}: ${Array.isArray(v) ? v.join(', ') : JSON.stringify(v)}`);
  }

  const text = await c.fetch<string[]>(`*[_id == $id][0]{
    "t": overview[].children[].text
  }[].t`, { id: ID }).catch(() => [] as string[]);
  const words = text.join(' ').split(/\s+/).filter(Boolean).length;
  console.log(`\n  overview words: ${words}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e.message); process.exit(1); });