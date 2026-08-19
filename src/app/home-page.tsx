'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const HeroSection = dynamic(() => import('@/src/components/Home/sections/HeroSection'));
const WhyChooseUsSection = dynamic(() => import('@/src/components/Home/sections/WhyChooseUsSection'), { ssr: false });
const ProcessSection = dynamic(() => import('@/src/components/Home/sections/ProcessSection'), { ssr: false });

// Sections with no browser API usage — SSR for CLS prevention
const SolutionsSection = dynamic(() => import('@/src/components/Home/sections/SolutionsSection'));
// const TestimonialsSection = dynamic(() => import('@/src/components/Home/sections/TestimonialsSection'));
const TrustSignalsSection = dynamic(() => import('@/src/components/Home/sections/TrustSignalsSection'));
const CalculatorStripBanner = dynamic(() => import('@/src/components/Home/sections/CalculatorStripBanner'));
const ProjectsSection = dynamic(() => import('@/src/components/Home/sections/ProjectsSection'));
const FAQSection = dynamic(() => import('@/src/components/Home/sections/FAQSection'));
const ContactSection = dynamic(() => import('@/src/components/Home/sections/ContactSection'));

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <section className="mx-auto max-w-4xl px-[var(--spacing-margin-mobile)] py-12 text-center md:px-[var(--spacing-margin-desktop)]">
        <p className="font-sans text-lg leading-relaxed text-on-surface-variant">
          The ACE Services delivers{' '}
          <Link href="/cost-estimating" className="font-semibold text-primary hover:underline">
            construction cost estimating services
          </Link>{' '}
          for general contractors, developers, and subcontractors across the
          United States. Every estimate is prepared to AACE Class 3 accuracy
          using PlanSwift and Bluebeam, with quantity takeoffs, material
          lists, and CSI-organized cost breakdowns. Our nationwide
          pre-construction team turns bids around in 24-48 hours — giving you
          the pricing precision to win more work without carrying inflated
          contingencies.
        </p>
      </section>
      <SolutionsSection />
      <div className="min-h-[400px]">
        <WhyChooseUsSection />
      </div>
      {/* <TestimonialsSection /> */}
      <TrustSignalsSection />
      <CalculatorStripBanner />
      <ProjectsSection />
      <ProcessSection />
      <ContactSection />
      <FAQSection />
    </div>
  );
}
