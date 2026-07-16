import type { Metadata } from 'next';
import AboutSection from '@/src/components/Home/sections/AboutSection';
import StatsSection from '@/src/components/Home/sections/StatsSection';

export const metadata: Metadata = {
  title: 'About Us | ACE SERVICES TOP COST ESTIMATION COMPANY IN THE US',
  description:
    'ACE SERVICES is a top pre-construction estimation firm with 2,893 projects estimated and an 89% bid win rate. Precision quantity surveying, AACE Class 3 cost estimates, and dual-stage QA across the US.',
  alternates: {
    canonical: 'https://www.theaceservices.com/about',
  },
  openGraph: {
    title: 'About Us | ACE SERVICES — Top Cost Estimation Company in the US',
    description:
      'With 2,893 projects estimated and an 89% bid win rate, ACE SERVICES delivers precision pre-construction estimation, material takeoffs, and quantity surveying nationwide.',
    url: 'https://www.theaceservices.com/about',
  },
};

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-background pt-32">
      <AboutSection />
      <StatsSection />
    </section>
  );
}
