'use client';

import dynamic from 'next/dynamic';
import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';

const HeroSection = dynamic(() => import('@/src/components/Home/sections/HeroSection'));
const WhyChooseUsSection = dynamic(() => import('@/src/components/Home/sections/WhyChooseUsSection'), { ssr: false });
const ProcessSection = dynamic(() => import('@/src/components/Home/sections/ProcessSection'), { ssr: false });

// Sections with no browser API usage — SSR for CLS prevention
const SolutionsSection = dynamic(() => import('@/src/components/Home/sections/SolutionsSection'));
const TestimonialsSection = dynamic(() => import('@/src/components/Home/sections/TestimonialsSection'));
const CalculatorStripBanner = dynamic(() => import('@/src/components/Home/sections/CalculatorStripBanner'));
const ProjectsSection = dynamic(() => import('@/src/components/Home/sections/ProjectsSection'));
const FAQSection = dynamic(() => import('@/src/components/Home/sections/FAQSection'));
const ContactSection = dynamic(() => import('@/src/components/Home/sections/ContactSection'));

export default function HomePage({
  products,
}: {
  /** Optional CMS product cards for the hero parallax. */
  products?: HeroParallaxProduct[];
}) {
  return (
    /* min-h-screen reserves viewport height so the Footer (rendered
       statically in LayoutShell) doesn't appear at the top of the page
       before the dynamically-imported HeroSection has loaded. */
    <div className="min-h-screen">
      {/* <BackgroundShader /> */}
      {/* Placeholder reserves SSR height so #solutions doesn't shift when hero hydrates — desktop 240vh matches HeroParallax height */}
      <div className="min-h-screen md:min-h-[240vh]">
        <HeroSection products={products} />
      </div>
      <SolutionsSection />
      <div className="min-h-[400px]">
        <WhyChooseUsSection />
      </div>
      <TestimonialsSection />
      <CalculatorStripBanner />
      <ProjectsSection />
      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
