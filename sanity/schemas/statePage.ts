import { defineType, defineField } from 'sanity';

/**
 * statePage — one document per state location page.
 *
 * Field names map 1:1 onto the blocks in
 * seo/state-location-page-template.md, so filling in the schema is the same
 * exercise as filling in the template:
 *
 *   {title}                  -> title, slug, state
 *   {overview}               -> overview
 *   {why_contractors_outsource} -> whyOutsource, searchTerms
 *   {services}               -> servicesIntro, services
 *   {home_city}              -> primaryCity
 *   {second_city}            -> secondCity
 *   {rest_of_state}          -> restOfState
 *   {why_choose_us}          -> whyChooseUsOverride (optional, see below)
 *   {state_specific}         -> stateSpecific
 *   {faq}                    -> faqs
 *   {cta}                    -> cta
 *
 * Deliberately NOT a field: the seven {why_choose_us} proof points. They are
 * identical on every state page (89% win rate, 2,893+ projects, AACE Class 3,
 * ISO 9001-aligned two-stage review, CSI MasterFormat, 24-48h, PlanSwift and
 * Bluebeam), so they live in code as a single constant. Copying them into 50
 * documents guarantees they drift apart. Use whyChooseUsOverride only to
 * reword the whole block for one state.
 */
export default defineType({
  name: 'statePage',
  title: 'State Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Full page title, e.g. "Construction and Estimation Services in Texas"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'State name only, lowercase: "texas". The URL is built as /construction-estimation-services-in-{slug}/',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { name: 'lowercase words joined by hyphens' }),
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      description: 'Display name, e.g. "Texas". Used in headings and prose.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stateAbbreviation',
      title: 'State Abbreviation',
      type: 'string',
      description: 'Two-letter code, e.g. "TX".',
      validation: (Rule) => Rule.uppercase().length(2),
    }),

    // {overview} — two paragraphs
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      description: '{overview} — two paragraphs. What we do, who for, turnaround, accuracy class, and why we know this state.',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // {why_contractors_outsource}
    defineField({
      name: 'whyOutsource',
      title: 'Why Contractors Outsource',
      type: 'array',
      description: '{why_contractors_outsource} — the pressure real contractors in this state are under, and why in-house teams cannot keep up.',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'searchTerms',
      title: 'Search Terms',
      type: 'array',
      description: 'The 3-5 phrases people in this state actually type. Used to render the "that search volume is the signal" sentence. Real terms only, no invented volume figures.',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.min(3).max(5),
    }),

    // {services}
    defineField({
      name: 'servicesIntro',
      title: 'Services Intro',
      type: 'string',
      description: 'One lead-in sentence, e.g. "We support every phase of Texas pre-construction, from first takeoff to stamped permit set:"',
    }),
    defineField({
      name: 'services',
      title: 'Services Listed',
      type: 'array',
      description: '{services} — the template lists twelve. Reference the service doc so the link can never break; the description is the state-specific sentence.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'service',
              title: 'Service',
              type: 'reference',
              to: [{ type: 'service' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'State-specific description',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: { title: 'service.title', subtitle: 'description' },
            prepare: ({ title, subtitle }) => ({ title: title ?? 'Pick a service', subtitle }),
          },
        },
      ],
      validation: (Rule) => Rule.min(6),
    }),

    // {home_city}
    defineField({
      name: 'primaryCity',
      title: 'Primary City',
      type: 'object',
      description: '{home_city} — for Texas this is Houston. Turn on Headquarters only for states where we actually have an office.',
      fields: [
        { name: 'name', title: 'City', type: 'string', validation: (Rule) => Rule.required() },
        {
          name: 'isHeadquarters',
          title: 'This is our headquarters',
          type: 'boolean',
          description: 'Adds the "home base" framing. Leave off for states with no ACE office — claiming a base we do not have is the fastest way to lose trust.',
          initialValue: false,
        },
        {
          name: 'intro',
          title: 'Intro',
          type: 'array',
          description: 'What this city\'s construction market is made of.',
          of: [{ type: 'block' }],
          validation: (Rule) => Rule.required().min(1),
        },
        {
          name: 'bullets',
          title: 'What we handle here',
          type: 'array',
          description: 'Four bullets of real local detail. The template calls for four.',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.min(3).max(6),
        },
        {
          name: 'closing',
          title: 'Closing line',
          type: 'text',
          rows: 2,
          description: 'The local detail that proves it, e.g. City of Houston and Harris County plan review.',
        },
      ],
    }),

    // {second_city}
    defineField({
      name: 'secondCity',
      title: 'Second City',
      type: 'object',
      description: '{second_city} — the other big metro, and what makes it different from the first.',
      fields: [
        { name: 'name', title: 'City', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'intro', title: 'Intro', type: 'array', of: [{ type: 'block' }], validation: (Rule) => Rule.min(1) },
        { name: 'bullets', title: 'What we handle here', type: 'array', of: [{ type: 'string' }], validation: (Rule) => Rule.min(3).max(6) },
        { name: 'closing', title: 'Closing line', type: 'text', rows: 2 },
      ],
    }),

    // {rest_of_state}
    defineField({
      name: 'restOfState',
      title: 'Rest of State',
      type: 'array',
      description: '{rest_of_state} — one line each for the third and fourth city, two smaller ones, and statewide remote support.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Place', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', title: 'One line', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'description' },
          },
        },
      ],
      validation: (Rule) => Rule.min(3),
    }),

    // {why_choose_us} — leave empty to use the site-wide constants
    defineField({
      name: 'whyChooseUsOverride',
      title: 'Proof Points Override',
      type: 'array',
      description: 'Leave EMPTY on almost every page. Empty means the site-wide list renders: 89% bid win rate, 2,893+ projects, AACE Class 3, ISO 9001-aligned two-stage review, CSI MasterFormat, 24-48 hours, PlanSwift and Bluebeam. Only fill this to reword the whole block for one state.',
      of: [{ type: 'string' }],
    }),

    // {state_specific} — the block that stops the page being a duplicate
    defineField({
      name: 'stateSpecific',
      title: 'State-Specific Considerations',
      type: 'array',
      description: '{state_specific} — exactly five, one per topic. This is the only block that makes the page genuinely about this state; everything else could belong to any page.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'topic',
              title: 'Topic',
              type: 'string',
              options: {
                list: [
                  { title: 'Tax & project economics', value: 'tax' },
                  { title: 'Weather or code requirements', value: 'weather' },
                  { title: 'Growth corridors', value: 'growth' },
                  { title: 'Permitting', value: 'permits' },
                  { title: 'Regional labour rates', value: 'labour' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'detail',
              title: 'Detail',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'topic', subtitle: 'detail' },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().length(5).error('The template calls for exactly five — one per topic'),
    }),

    // {faq}
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: '{faq} — six questions. Answers stay mostly the same across states, swap the place names.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
          },
        },
      ],
      validation: (Rule) => Rule.min(4),
    }),

    // {cta}
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      description: '{cta} — the closing heading and paragraph. The calculator link is global and always appended.',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'body', title: 'Body', type: 'text', rows: 3 },
      ],
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Leave empty to use "{title} | The ACE Services".',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Leave empty to build one from the overview.',
    }),
    defineField({
      name: 'excludeFromSitemap',
      title: 'Exclude from sitemap',
      type: 'boolean',
      description: 'Set only for a duplicate or thin state page you still want reachable.',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'State', name: 'stateAsc', by: [{ field: 'state', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', state: 'state', slug: 'slug' },
    prepare: ({ title, state, slug }) => ({ title: title ?? 'Untitled', subtitle: `${state ?? '—'} · /${slug ?? '—'}/` }),
  },
});