"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HeroSection = dynamic(
  () => import("@/src/components/Home/sections/ChromaticHero"),
);
const WhyChooseUsSection = dynamic(
  () => import("@/src/components/Home/sections/WhyChooseUsSection"),
);
// const ProcessSection = dynamic(
//   () => import("@/src/components/Home/sections/ProcessSection"),
//   { ssr: false },
// );

// Sections with no browser API usage — SSR for CLS prevention
const SolutionsSection = dynamic(
  () => import("@/src/components/Home/sections/SolutionsSection"),
);
// const TestimonialsSection = dynamic(() => import('@/src/components/Home/sections/TestimonialsSection'));
const TrustSignalsSection = dynamic(
  () => import("@/src/components/Home/sections/TrustSignalsSection"),
);
const CalculatorStripBanner = dynamic(
  () => import("@/src/components/Home/sections/CalculatorStripBanner"),
);
const ProjectsSection = dynamic(
  () => import("@/src/components/Home/sections/ProjectsSection"),
);
const FAQSection = dynamic(
  () => import("@/src/components/Home/sections/FAQSection"),
);
const ContactSection = dynamic(
  () => import("@/src/components/Home/sections/ContactSection"),
  { ssr: false },
);

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SolutionsSection />
      <div className="min-h-[400px]">
        <WhyChooseUsSection />
      </div>
      {/* <TestimonialsSection /> */}
      <TrustSignalsSection />
      <CalculatorStripBanner />
      <ProjectsSection />
      {/* <div className="hidden md:block">
        <ProcessSection />
      </div> */}
      <ContactSection />
      <FAQSection />
    </div>
  );
}
