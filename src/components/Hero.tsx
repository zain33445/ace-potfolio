'use client';

import { HeroParallax } from '@/src/components/ui/hero-parallax';
import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';

/* ──────────────────────────────────────────────────────────────────
   Construction service cards — title, link, thumbnail
   Each links to a relevant section on the single-page site
   ────────────────────────────────────────────────────────────────── */

const constructionProducts: HeroParallaxProduct[] = [
  {
    title: 'Material Takeoffs',
    subtitle: 'PlanSwift + Bluebeam',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1578991624414-276ef23a8e5a?w=600&h=600&fit=crop',
  },
  {
    title: 'Cost Estimation',
    subtitle: 'AACE Class 3',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1554224154-26032dfc0dae?w=600&h=600&fit=crop',
  },
  {
    title: 'Permit Sets',
    subtitle: 'Full Compliance',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop',
  },
  {
    title: 'Project Scheduling',
    subtitle: 'Critical Path Method',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=600&fit=crop',
  },
  {
    title: 'Blueprint Analysis',
    subtitle: '2D/3D Interpretation',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1572072393749-3f65a3b12bd7?w=600&h=600&fit=crop',
  },
  {
    title: 'Value Engineering',
    subtitle: 'Cost Optimization',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1541888946425-d81bb50b8f36?w=600&h=600&fit=crop',
  },
  {
    title: 'Bid Preparation',
    subtitle: 'Competitive Pricing',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=600&fit=crop',
  },
  {
    title: 'Change Order Analysis',
    subtitle: 'Impact Assessment',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1565688534245-05d6b531be25?w=600&h=600&fit=crop',
  },
  {
    title: 'Submittal Reviews',
    subtitle: 'Quality Assurance',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop',
  },
  {
    title: 'LEED Documentation',
    subtitle: 'Sustainability',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop',
  },
  {
    title: 'Scheduling Reports',
    subtitle: 'Progress Tracking',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1553877522-43269d4ea384?w=600&h=600&fit=crop',
  },
  {
    title: 'Risk Analysis',
    subtitle: 'Monte Carlo Simulation',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop',
  },
  {
    title: 'Takeoff Services',
    subtitle: 'Digital Blueprint Quantities',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=600&fit=crop',
  },
  {
    title: 'Estimating',
    subtitle: 'Precision Costing',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1664575198308-3959d15e9e0c?w=600&h=600&fit=crop',
  },
  {
    title: 'Project Controls',
    subtitle: 'Budget & Schedule',
    link: '#services',
    thumbnail:
      'https://images.unsplash.com/photo-1577412647305-991150c7d163?w=600&h=600&fit=crop',
  },
];

export default function Hero() {
  return (
    <>
      <HeroParallax
        products={constructionProducts}
        headerTitle="Precision Construction Estimation"
        headerDescription="The ACE Services delivers data-driven pre-construction support across 35 states. Industry-leading tools like PlanSwift and Bluebeam, rigorous two-stage quality checks, and a verified 89% bid win rate — so you win more work and protect your margins."
      />

      {/* CSS-only marquee — pure GPU compositing, zero JS ticking */}
      <div className="bg-primary text-white py-3.5 border-y border-on-background overflow-hidden relative select-none shrink-0">
        <div className="marquee-track font-mono text-xs font-bold tracking-widest uppercase">
          <span className="marquee-content">
            &spades; 2,893+ PROJECTS COMPLETED &spades; 35 STATES SUPPORTED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
          <span className="marquee-content" aria-hidden="true">
            &spades; 2,893+ PROJECTS COMPLETED &spades; 35 STATES SUPPORTED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
        </div>
      </div>
    </>
  );
}
