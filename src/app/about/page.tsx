import type { Metadata } from 'next';
import AboutPageClient from '@/src/components/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us — Top Construction & Estimation Company',
  description:
    'The ACE Services is a top pre-construction estimation firm with 2,893 projects estimated and an 89% bid win rate. Precision quantity surveying, AACE Class 3 cost estimates, and dual-stage QA across the US.',
  alternates: {
    canonical: 'https://www.theaceservices.com/about',
  },
  openGraph: {
    title: 'About Us | The ACE Services — Top Cost Estimation Company in the US',
    description:
      'With 2,893 projects estimated and an 89% bid win rate, The ACE Services delivers precision pre-construction estimation, material takeoffs, and quantity surveying nationwide.',
    url: 'https://www.theaceservices.com/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
