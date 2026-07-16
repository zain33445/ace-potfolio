'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/src/components/Home/sections/HeroSection';
import SolutionsSection from '@/src/components/Home/sections/SolutionsSection';
import WhyChooseUsSection from '@/src/components/Home/sections/WhyChooseUsSection';
import TestimonialsSection from '@/src/components/Home/sections/TestimonialsSection';
import CalculatorStripBanner from '@/src/components/Home/sections/CalculatorStripBanner';
import ProjectsSection from '@/src/components/Home/sections/ProjectsSection';
import ProcessSection from '@/src/components/Home/sections/ProcessSection';
import FAQSection from '@/src/components/Home/sections/FAQSection';
import ContactSection from '@/src/components/Home/sections/ContactSection';
import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';
const BackgroundShader = dynamic(() => import('@/src/components/BackgroundShader'), {
  ssr: false,
});

export default function HomePage({
  products,
}: {
  /** Optional CMS product cards for the hero parallax. */
  products?: HeroParallaxProduct[];
}) {
  return (
    <>
      {/* <BackgroundShader /> */}
      <HeroSection products={products} />
      <SolutionsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CalculatorStripBanner />
      <ProjectsSection />
      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
