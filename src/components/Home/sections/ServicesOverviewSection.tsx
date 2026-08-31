/**
 * SEO / content section — server-rendered (no "use client"), so the copy
 * ships in the initial HTML and is fully crawlable.
 *
 * Structure:
 *  - Services / Why ACE / Trades: hidden on mobile (hidden md:block) to keep UI clean
 *  - FAQ: always visible; uses <details>/<summary> accordion so mobile users can
 *    expand questions they care about without the section looking cluttered
 */

const services = [
  {
    title: "Construction Estimating Services",
    body: "Our construction estimating services give general contractors and subcontractors bid-ready numbers without the overhead of an in-house estimating department. Every project is priced to AACE Class 3 standards using localized material databases and CSI MasterFormat divisions, so your proposals hold up under scrutiny and protect your margins.",
  },
  {
    title: "Material Takeoffs & Quantity Surveys",
    body: "We measure every material, labor, and equipment quantity directly from your architectural blueprints. Our quantity takeoffs are delivered in clean, auditable spreadsheets using PlanSwift and Bluebeam, so you can drop them straight into your bid or hand them to a supplier for pricing.",
  },
  {
    title: "MEP & Structural Shop Drawings",
    body: "Our shop drawing services turn design intent into fabrication-ready documentation. We coordinate mechanical, electrical, plumbing, structural, and millwork shop drawings to resolve spatial clashes before anything is fabricated or installed — no surprises in the field, no costly rework.",
  },
  {
    title: "3D Architectural Rendering",
    body: "Photorealistic 3D exterior and interior renderings help stakeholders sign off on what they can actually see. We produce architectural renderings for permitting, coordination, and marketing presentations — giving owners and review boards a clear picture before ground is broken.",
  },
  {
    title: "Permit Sets",
    body: "We assemble complete, permit-ready document packages built to the reviewer's checklist, not ours. Stamped permit sets, cost schedules, and material specifications are prepared for municipal submission so your project clears plan review faster and stays on schedule.",
  },
];

const reasons = [
  {
    title: "AACE Class 3 Accuracy",
    body: "Every estimate is built to AACE Class 3 standards — ±10% to ±20% accuracy — using current RSMeans pricing and regionally adjusted labor rates. Your number is defensible to owners, lenders, and plan reviewers.",
  },
  {
    title: "24–48 Hour Turnaround",
    body: "Send us plans in PDF, DWG, or a shared drive link. We return a detailed, line-item estimate ready to bid from. Addendum revisions are turned around the same day so your number is never stale when the deadline hits.",
  },
  {
    title: "No Fixed Overhead",
    body: "You get senior estimator output without salary, benefits, or software licenses. Pay per project, scale up during busy season, and step back when the pipeline quiets — the ACE team flexes with your workload.",
  },
  {
    title: "Full-Service Under One Roof",
    body: "Estimating, takeoffs, shop drawings, renderings, and permit sets are all handled by the same team. One point of contact, consistent documentation standards, and zero coordination gaps between disciplines.",
  },
];


export default function ServicesOverviewSection() {
  return (
    <>
      {/* ── Desktop-only: full prose block ──────────────────────── */}
      <section
        aria-labelledby="services-overview-heading"
        className="hidden md:block w-full bg-white py-20 px-6 md:px-12 lg:px-20 text-slate-900"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="services-overview-heading"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Pre-Construction Services, Delivered Nationwide
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            The ACE Services is a pre-construction partner for general
            contractors, subcontractors, and developers across 35 US states. We
            combine construction estimating, material takeoffs, shop drawings,
            3D architectural rendering, and permit sets under one roof — so you
            can bid more work, win more of it, and build with fewer surprises.
            By outsourcing your estimating and drafting to a dedicated team, you
            get senior-level output in 24 to 48 hours without carrying the fixed
            cost of an in-house department.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.title}>
                <h3 className="text-xl font-bold text-slate-900">
                  <span
                    aria-hidden="true"
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-[#FF6B00] align-middle"
                  />
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Why General Contractors Choose The ACE Services
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Accurate pre-construction numbers determine whether you win the
              bid, protect your margin, and finish on budget. Our estimating
              team has priced projects across residential, commercial, and
              industrial sectors — from single-trade subcontractor bids to
              multi-million dollar ground-up builds. Here is what sets us apart.
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {reasons.map((r) => (
                <div key={r.title}>
                  <h3 className="text-lg font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{r.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Trades &amp; Project Types We Serve
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              We support commercial, residential, and industrial construction
              across the full range of trades — including electrical, HVAC,
              mechanical, plumbing, concrete, masonry, drywall, insulation,
              roofing, sitework, millwork, and flooring. Whether you are a
              general contractor pricing a ground-up commercial build or a
              specialty subcontractor bidding a single scope, our estimating and
              drafting teams scale to the job. From warehouses and hotels to
              schools and multi-family residences, contractors nationwide rely on
              The ACE Services to price, draw, and document their projects
              accurately.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}
