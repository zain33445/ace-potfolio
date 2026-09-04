import type { Metadata } from 'next';
import Link from 'next/link';
import { PERSON_ID, personSchema } from '@/src/lib/schema';

const PAGE_URL = 'https://theaceservices.com/authors/abdul-manan-zafar/';

export const metadata: Metadata = {
  title: { absolute: 'Engr. Abdul Manan Zafar — CEO, The ACE Services' },
  description:
    'Civil engineer and CEO of The ACE Services. BSc Civil Engineering (UET Lahore), NEBOSH IGC certified, six years in construction. Reviews the estimating content published here.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Engr. Abdul Manan Zafar — CEO, The ACE Services',
    description:
      'Civil engineer and CEO of The ACE Services. BSc Civil Engineering (UET Lahore), NEBOSH IGC certified, six years in construction. Reviews the estimating content published here.',
    url: PAGE_URL,
  },
};

const CREDENTIALS = [
  'BSc Civil Engineering, UET Lahore, 2020',
  'NEBOSH IGC',
  'Six years in construction, since 2020',
];

export default function AbdulMananZafarAuthorPage() {
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-blueprint-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Link href="/" className="transition-colors hover:text-primary">
              HOME
            </Link>
            <span>/</span>
            <span className="text-primary">ABDUL MANAN ZAFAR</span>
          </div>

          <div className="grid gap-12 md:grid-cols-12 md:items-start">
            <div className="md:col-span-3">
              <div className="relative aspect-square h-[32vh] w-[32vh] overflow-hidden border border-blueprint-line bg-surface bracket-corners">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cms.theaceservices.com/wp-content/uploads/2024/11/Engr._Abdul_Manan-removebg-preview.png"
                  alt="Engr. Abdul Manan Zafar — CEO of The ACE Services"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-9">
              <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-5xl">
                Engr. Abdul Manan Zafar
              </h1>
              <p className="mt-2 font-mono text-base font-bold uppercase tracking-wider text-primary">
                Chief Executive Officer, The ACE Services
              </p>

              <ul className="mt-6 space-y-1 font-mono text-sm uppercase tracking-wider text-on-surface-variant">
                {CREDENTIALS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://pk.linkedin.com/in/abdul-manan-3390121b1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
                >
                  LinkedIn
                </a>
                <Link
                  href="/about-us/"
                  className="inline-flex items-center gap-2 border border-blueprint-line px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-on-background transition-all hover:border-primary hover:text-primary"
                >
                  About The ACE Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20 text-justify">
        <div className="space-y-6 font-sans leading-relaxed text-on-surface-variant">
          <p>
            Abdul Manan Zafar is a civil engineer and the founder of The ACE Services, a
            pre-construction estimating firm serving general contractors across the United States.
          </p>

          <p>
            He graduated in civil engineering from the University of Engineering and Technology,
            Lahore in 2020, having studied at NFC IEFR Faisalabad, and holds a NEBOSH International
            General Certificate in occupational health and safety. He completed his pre-engineering
            studies at WAPDA Cadet College Tarbela.
          </p>

          <p>
            His site experience began in August 2020 as a subcontractor on the DHA Multan project,
            working with the National Logistics Cell on kerb stone fixing, tuff paving and water
            supply laying. He joined Kohistan Builders &amp; Developers in Islamabad in 2021, then
            returned to lead project engineering on two B+G+4 commercial buildings at CITI Housing
            Faisalabad, running design coordination, contractor and vendor management, and QA/QC
            across both. He has also worked on Lahore&rsquo;s Zarkon Heights and on multi-storey
            apartment projects in Islamabad, and spent time in the UAE in 2022 studying the
            international construction market.
          </p>

          <p>He founded The ACE Services on returning, and now leads its estimating team.</p>

          <h2 className="pt-4 font-[family-name:var(--font-space)] text-xl font-bold text-on-background">
            What he reviews here
          </h2>

          <p>
            Engr. Zafar reviews the construction estimating and pre-construction articles published
            on this site for technical accuracy. Articles he has reviewed carry a &ldquo;Reviewed
            by&rdquo; line linking to this page. He is not the author of those articles &mdash; the
            review covers their engineering and cost content.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'ProfilePage',
                '@id': `${PAGE_URL}#webpage`,
                url: PAGE_URL,
                name: 'Engr. Abdul Manan Zafar — CEO, The ACE Services',
                mainEntity: { '@id': PERSON_ID },
              },
              personSchema,
            ],
          }),
        }}
      />
    </main>
  );
}
