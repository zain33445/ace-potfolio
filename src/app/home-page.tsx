'use client';

import dynamic from 'next/dynamic';
import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';

const HeroSection = dynamic(() => import('@/src/components/Home/sections/HeroSection'), { ssr: false });
const SolutionsSection = dynamic(() => import('@/src/components/Home/sections/SolutionsSection'), { ssr: false });
const WhyChooseUsSection = dynamic(() => import('@/src/components/Home/sections/WhyChooseUsSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/src/components/Home/sections/TestimonialsSection'), { ssr: false });
const CalculatorStripBanner = dynamic(() => import('@/src/components/Home/sections/CalculatorStripBanner'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/src/components/Home/sections/ProjectsSection'), { ssr: false });
const ProcessSection = dynamic(() => import('@/src/components/Home/sections/ProcessSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/src/components/Home/sections/FAQSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/src/components/Home/sections/ContactSection'), { ssr: false });

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
      <HeroSection products={products} />
      <SolutionsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CalculatorStripBanner />
      <ProjectsSection />
      <ProcessSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
