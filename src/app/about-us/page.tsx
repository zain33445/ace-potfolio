import type { Metadata } from 'next';
import AboutPageClient from '@/src/components/AboutPageClient';

export const metadata: Metadata = {
  title: { absolute: 'About The ACE Services | Construction Estimating Team' },
  description:
    'Meet the nationwide estimating team behind 2,893+ delivered projects and an 89% bid win rate for contractors. Contact us to start your project today.',
  alternates: {
    canonical: 'https://theaceservices.com/about-us/',
  },
  openGraph: {
    title: 'About The ACE Services | Construction Estimating Team',
    description:
      'Meet the nationwide estimating team behind 2,893+ delivered projects and an 89% bid win rate for contractors. Contact us to start your project today.',
    url: 'https://theaceservices.com/about-us/',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
