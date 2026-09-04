# Proposed Blog Title Rewrites

The 15 WordPress blog posts below currently have titles between 113-128 characters
(displayed page title = WP post title + " | The ACE Services" suffix, 19 chars).
These titles live in WordPress (`cms.theaceservices.com`), not in this repo, so they
cannot be edited here — the Next.js route (`src/app/[slug]/page.tsx`, owned by
another agent) simply passes `post.title` straight through to the page `<title>`.
A human needs to paste the rewrites below into the WordPress editor for each post.

All proposed rewrites are 46-59 characters (pre-suffix), landing at 65-78 with the
site's `| The ACE Services` suffix appended — i.e. still shorter than the originals,
though the current titles don't get a "| The ACE Services" suffix applied by WP
itself, only by this Next.js site's title template. Column "New (full, w/ suffix)"
shows what will actually render in the browser tab / SERP.

| Slug | Current Title | Current Full Len | Proposed New Title | New Title Len | New Full Len (+ suffix) |
|---|---|---|---|---|---|
| `residential-construction-estimation-save-thousands` | Residential Construction Estimation: How Accurate Cost Planning Saves US Homeowners and Contractors Thousands | 128 | Residential Construction Estimating Saves You Thousands | 57 | 76 |
| `educational-building-development-services-in-usa-creating-modern-sustainable-and-inspiring-learning-spaces` | Educational Building Development Services in USA: Creating Modern, Sustainable, and Inspiring Learning Spaces | 128 | Educational Building Construction Estimating Services | 55 | 74 |
| `everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights` | Everything You Need to Know About Blueprint Estimation Services in USA: Process, Benefits, and Cost Insights | 127 | Blueprint Estimation Services: Process, Benefits & Costs | 58 | 77 |
| `exploring-the-top-construction-and-estimation-services-in-usa-a-complete-guide-for-builders-and-developers` | Exploring the Top Construction and Estimation Services in USA: A Complete Guide for Builders and Developers | 126 | Top Construction Estimation Services: A Builder's Guide | 57 | 76 |
| `permit-sets-for-construction-complete-guide` | Permit Sets for Construction Projects: What They Must Include and How to Get Them Right the First Time | 121 | Permit Sets for Construction Projects: Complete Guide | 55 | 74 |
| `building-america-the-ace-services-role-in-developing-residential-and-commercial-projects-nationwide` | Building America: The ACE Services' Role in Developing Residential and Commercial Projects Nationwide | 120 | Building America: Nationwide Construction Estimating | 54 | 73 |
| `everything-you-need-to-know-about-exploring-the-leading-construction-and-estimation-services-in-usa` | Everything You Need to Know About "Exploring the Leading Construction and Estimation Services in USA" | 120 | Leading Construction & Estimation Services in the USA | 55 | 74 |
| `commercial-construction-estimation-guide` | Commercial Construction Estimation: What US Developers and GCs Need to Know to Control Project Costs | 119 | Commercial Construction Estimation: A Cost Control Guide | 58 | 77 |
| `outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors` | Outsource Construction and Estimation Services in USA: Key Advantages for Builders and Contractors" | 118 | Outsourcing Construction Estimation: Key Advantages | 53 | 72 |
| `best-outsource-construction-and-estimation-services-in-usa` | Outsource Construction and Estimation Services in USA: Key Advantages for Builders and Contractors | 117 | Best Construction Estimation Outsourcing Services in USA | 58 | 77 |
| `warehouse-development-services-in-usa-building-efficient-scalable-and-modern-storage-solutions` | Warehouse Development Services in USA: Building Efficient, Scalable, and Modern Storage Solutions | 116 | Warehouse Development Services: Efficient Storage Solutions | 61 | 80 |
| `quantity-surveyor-services-in-usa-ensuring-precision-and-profitability-in-construction-projects` | Quantity Surveyor Services in USA: Ensuring Precision and Profitability in Construction Projects | 115 | Quantity Surveyor Services: Precision & Profitability | 54 | 73 |
| `educational-building-construction-services-in-usa-what-they-are-and-why-your-project-needs-them` | Educational Building Construction Services in USA: What They Are and Why Your Project Needs Them | 115 | Educational Building Construction Services Explained | 53 | 72 |
| `quantity-surveyor-vs-cost-estimator-key-differences` | Quantity Surveyor Services vs. Cost Estimator: What US Construction Professionals Need to Know | 113 | Quantity Surveyor vs. Cost Estimator: Key Differences | 54 | 73 |
| `bridging-the-gap-nationwide-estimating-services-for-bridges-parks-and-public-infrastructure` | Bridging the Gap: Nationwide Estimating Services for Bridges, Parks, and Public Infrastructure | 113 | Nationwide Estimating Services for Public Infrastructure | 57 | 76 |

## Notes

- Rows 9 and 10 (`outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors`
  and `best-outsource-construction-and-estimation-services-in-usa`) are near-duplicate
  posts — same title text, different slugs. This looks like the same duplicate-content
  pattern already addressed in the `5f44284 fix(seo): 301 redirects for consolidated
  duplicate blog posts` commit. Worth checking whether one of these should also be
  redirected/merged rather than both being retitled and left live.
- "New Full Len" includes the automatic `| The ACE Services` suffix Next.js appends
  via the root layout's title template (`src/app/layout.tsx`) — that suffix is NOT
  something WordPress adds; a human pasting these into WP should paste only the
  "Proposed New Title" column text, not the full column.
- A further ~10 posts sit in the 104-110 full-length range (still noticeably over
  Google's ~60-char display budget) — not included here since the task scoped this
  to the 15 worst offenders, but the same rewrite pass is worth extending to them
  in a follow-up.
