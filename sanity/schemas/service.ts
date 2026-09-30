import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'icon',
      title: 'Icon ID',
      type: 'string',
      description: 'Lucide icon identifier (e.g. SVC_EST)',
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price',
      type: 'string',
    }),
    defineField({
      name: 'turnaround',
      title: 'Turnaround',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA Heading Override',
      type: 'string',
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Description Override',
      type: 'text',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'footnote',
      title: 'Footnote',
      type: 'text',
    }),
    defineField({
      name: 'seoContent',
      title: 'SEO Content',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'body', title: 'Body Paragraphs', type: 'array', of: [{ type: 'text' }] },
        {
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string' },
                { name: 'description', title: 'Description', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'faqs',
          title: 'FAQs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'question', title: 'Question', type: 'string' },
                { name: 'answer', title: 'Answer', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'highlightSection',
          title: 'Highlight Section',
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'body', title: 'Body Paragraphs', type: 'array', of: [{ type: 'text' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'parent',
      title: 'Parent Service Slug',
      type: 'string',
      description: 'Set on sub-services (e.g. 3d-rendering under architectural-services)',
    }),
    defineField({
      name: 'wpContent',
      title: 'WordPress HTML Content',
      type: 'text',
      rows: 20,
      description: 'Full HTML from WP for CMS-only services',
    }),
  ],
  orderings: [
    { title: 'Slug', name: 'slugAsc', by: [{ field: 'slug', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug' },
  },
});
