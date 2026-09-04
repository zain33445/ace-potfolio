import type { Metadata } from 'next';

/**
 * `projects/page.tsx` is a client component, so it cannot export metadata
 * itself. This layout carries the index page's head; `projects/[slug]` sets
 * its own metadata and overrides these.
 */
export const metadata: Metadata = {
  title: { absolute: 'Our Projects | Construction Estimating Portfolio' },
  description:
    'Browse 58+ completed estimates, renderings, shop drawings and permit sets delivered nationwide. View our work and request your free quote today.',
  alternates: {
    canonical: 'https://theaceservices.com/projects/',
  },
  openGraph: {
    title: 'Our Projects | Construction Estimating Portfolio',
    description:
      'Browse 58+ completed estimates, renderings, shop drawings and permit sets delivered nationwide. View our work and request your free quote today.',
    url: 'https://theaceservices.com/projects/',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
