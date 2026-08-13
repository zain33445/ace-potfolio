'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shield, Heart, ShieldCheck, Compass, Check, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Reveal from '@/src/components/Reveal';
import RenderOnViewport from '@/src/components/RenderOnViewport';
import { useCountUp } from '@/src/hooks/useCountUp';

const About3D = dynamic(() => import('@/src/components/About3D'), {
  ssr: false,
});

const features = [
  {
    title: 'Innovation and creativity',
    desc: 'Pushing boundaries with cutting-edge solutions for every project.',
  },
  {
    title: 'Making lives easier',
    desc: 'Streamlining construction processes for seamless execution.',
  },
  {
    title: 'Fine engineering only with us',
    desc: 'Precision-driven results backed by ISO-standard practices.',
  },
];

const philosophyPillars = [
  {
    icon: Shield,
    title: 'Safety',
    desc: 'Safety is our unwavering commitment at The ACE Services, where every project is executed with the highest standards to ensure the well-being of all stakeholders.',
  },
  {
    icon: Heart,
    title: 'Customer Service',
    desc: 'We place our clients at the center of everything we do, delivering responsive, transparent, and dedicated support throughout every project phase.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    desc: 'We uphold the highest ethical standards in every interaction, ensuring trust, honesty, and accountability in all our dealings.',
  },
];

const processSteps = [
  {
    num: '01',
    title: 'Total initial planning',
    desc: 'The ACE Services excels in total initial planning, providing a strategic foundation for seamless and successful project execution.',
  },
  {
    num: '02',
    title: 'First working process',
    desc: 'At The ACE Services, our first working process embodies precision and strategic planning, laying the foundation for successful project execution.',
  },
  {
    num: '03',
    title: 'Affordable price',
    desc: 'The ACE Services offers quality solutions at an affordable price, making excellence accessible to all.',
  },
];

const software = [
  'PlanSwift',
  'Bluebeam',
  'PlanSwift',
  'Bluebeam',
];

/** Count-up number that starts when scrolled into view */
function StatCounter({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [started, setStarted] = useState(false);
  const { formatted, startAnimation } = useCountUp({
    end,
    duration: 2,
    start: 1,
    easing: 'easeOut',
    suffix,
    decimals: 0,
    startOnMount: false,
  });

  // Keep the latest `startAnimation` in a ref so the observer is set up once
  // on mount. Its identity changes across renders, which would otherwise tear
  // down and recreate the observer (and disconnect before it can fire).
  const startAnimationRef = useRef(startAnimation);
  startAnimationRef.current = startAnimation;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimationRef.current();
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h3
      ref={ref}
      className="font-space text-4xl md:text-5xl font-extrabold text-primary mb-2 font-mono tabular-nums tracking-tight"
    >
      {started ? formatted : `1${suffix}`}
    </h3>
  );
}

export default function AboutPageClient() {
  return (
    <section className="min-h-screen bg-background pt-20">
      {/* ── Breadcrumb ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto pt-8 pb-4">
        <nav className="font-mono text-xs text-on-surface-variant tracking-wider">
          <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-primary font-bold">ABOUT</span>
        </nav>
      </div>

      {/* ── Hero: Who We Are ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24">
        <Reveal type="fadeUp">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono text-sm text-primary font-bold block">[ABOUT_US]</span>
              <h1 className="font-space text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-background tracking-tighter leading-tight">
                Bringing Your Ideas and Innovations to Life
              </h1>
              <p className="font-sans text-lg text-on-surface-variant leading-relaxed font-medium">
                The ACE Services is a renowned and forward-thinking solutions provider committed to
                excellence across various domains. As a top construction &amp; estimation company in
                the United States, we specialize in delivering precise, innovative, and reliable
                services across multiple states. With a legacy built on expertise and cutting-edge
                technology, our dedicated team is driven by a strong commitment to quality, safety,
                and client satisfaction. At The ACE Services, we consistently strive to exceed
                expectations, making us your trusted partner for seamless project execution and
                successful outcomes across the U.S.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 pt-2">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-2 bg-surface border border-blueprint-line px-4 py-2.5 bracket-corners"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-sans text-sm font-bold text-on-background">{f.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-primary/90 transition-colors"
                >
                  Consult Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* 3D Model — hidden on mobile, shown from md up */}
            <div className="hidden md:block lg:col-span-5 h-[400px] md:h-[480px] border border-blueprint-line bg-surface relative p-4 bracket-corners bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="absolute top-4 left-4 font-mono text-sm text-primary font-bold z-10 block">
                [MASSING_MODEL: FLR_PLN_01]
              </div>
              <RenderOnViewport
                className="w-full h-full"
                placeholder={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="font-mono text-sm text-primary animate-pulse">Loading 3D...</div>
                  </div>
                }
              >
                <About3D />
              </RenderOnViewport>
              <div className="absolute bottom-4 left-4 font-mono text-xs text-on-surface-variant opacity-75 z-10 bg-background/90 px-2 py-1 border border-blueprint-line">
                Active volumetric viewport tracking
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── CEO Section ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <div className="h-[400px] md:h-[500px] lg:h-[560px] border border-blueprint-line bg-surface relative bracket-corners bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                <img
                  src="https://theaceservices.com/wp-content/uploads/2024/11/Engr._Abdul_Manan-removebg-preview.png"
                  alt="Engr. Abdul Manan Zafar — CEO of The ACE Services"
                  className="h-full w-full object-contain p-4"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-4 font-mono text-xs text-primary font-bold tracking-wider bg-background/90 px-2 py-1 border border-blueprint-line">
                  [CEO_PORTRAIT]
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="font-mono text-sm text-primary font-bold block">[LEADERSHIP]</span>
              <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
                Meet Our CEO
              </h2>
              <h3 className="font-space text-xl font-bold text-primary">
                Engr. Abdul Manan Zafar
              </h3>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Abdul Manan Zafar, a seasoned civil engineer and the visionary CEO of The ACE
                Services, Top Construction &amp; Estimation Company, brings over half a decade of
                experience in the construction industry. Having worked with prestigious national and
                international firms, he has honed his expertise in delivering innovative, efficient,
                and high-quality solutions.
              </p>
              <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                Under his leadership, The ACE Services thrives on a foundation of precision, excellence,
                and client-centric values, shaping the company into a trusted name in the
                pre-construction sector. His commitment to advancing the industry through innovation
                and sustainable practices continues to drive The ACE Services toward success.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  'Innovative Thinker',
                  'Expert in Construction Dynamics',
                  'Client-Centric Approach',
                  'Commitment to Excellence',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-sans text-sm font-semibold text-on-background">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-primary/90 transition-colors"
                >
                  Consult Now <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Proven Results (Stats) ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="text-center mb-12">
            <span className="font-mono text-sm text-primary font-bold tracking-wider">[PROVEN_RESULTS]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter mt-2">
              Proven Results
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { end: 2893, suffix: '+', label: 'Total Projects Estimated' },
              { end: 35, suffix: '', label: '+ US States Served' },
              { end: 89, suffix: '%', label: 'Bid Win Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 border border-blueprint-line bg-surface bracket-corners">
                <StatCounter end={stat.end} suffix={stat.suffix} />
                <p className="font-sans text-base text-on-surface-variant font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Company Vision and Purpose ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="font-mono text-sm text-primary font-bold tracking-wider">[VISION_AND_PURPOSE]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
              Company Vision and Purpose
            </h2>
            <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
              The ACE Services – Top Construction &amp; Estimation Company aims to lead the industry
              through innovative construction and estimation solutions, prioritizing excellence,
              quality, and sustainability. Our vision is to reshape landscapes, crafting enduring
              structures and inspiring a future built on integrity. Committed to client satisfaction,
              each project at The ACE Services reflects our dedication to excellence, safety, and
              contributing to a resilient world.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ── Trusted Experts ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-12 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            {[
              'Trusted Construction and Estimating Experts',
              'Top-Rated Construction and Estimation Agency',
              'Industry-Leading Construction & Estimation Service',
            ].map((heading) => (
              <h3 key={heading} className="font-space text-lg md:text-xl font-bold text-on-background">
                {heading}
              </h3>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Pillars of Excellence ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="text-center mb-12">
            <span className="font-mono text-sm text-primary font-bold tracking-wider">[PILLARS_OF_EXCELLENCE]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter mt-2">
              Our Working Philosophy
            </h2>
            <p className="font-sans text-base text-on-surface-variant leading-relaxed max-w-3xl mx-auto mt-4">
              At The ACE Services, our working philosophy revolves around a commitment to excellence,
              innovation, and client satisfaction. We believe in precision, integrity, and continuous
              improvement, ensuring that every project reflects our dedication to quality. With a
              forward-thinking mindset, we embrace cutting-edge technology and industry best
              practices, aiming to exceed expectations and create lasting value for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-8 border border-blueprint-line bg-surface bracket-corners text-center space-y-4"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 border border-primary flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-space text-xl font-bold text-on-background">{pillar.title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* ── Process Steps ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="p-8 border border-blueprint-line bg-surface bracket-corners space-y-4">
                <span className="font-mono text-4xl font-extrabold text-primary/20">{step.num}</span>
                <h3 className="font-space text-xl font-bold text-on-background">{step.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Skills / Software ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] mx-auto py-16 md:py-24 border-t border-blueprint-line">
        <Reveal type="fadeUp">
          <div className="text-center mb-12">
            <span className="font-mono text-sm text-primary font-bold tracking-wider">[OUR_SKILLS]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter mt-2">
              Professional Building and Estimation Consultancy
            </h2>
            <p className="font-sans text-base text-on-surface-variant leading-relaxed max-w-3xl mx-auto mt-4">
              The efficiency of our company at The ACE Services is reflected in streamlined processes,
              prompt delivery, and a commitment to optimizing every aspect of our operations for
              client satisfaction.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-mono text-sm text-primary font-bold tracking-wider text-center mb-6">
              SOFTWARE WE USE FOR TAKEOFFS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {software.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="p-6 border border-blueprint-line bg-surface bracket-corners flex items-center justify-center"
                >
                  <span className="font-space text-lg font-bold text-on-background">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="font-sans text-base text-on-surface-variant leading-relaxed">
              The ACE Services, top construction and estimation company, specialize in delivering
              precise, efficient, and reliable support for pre-construction and project execution
              needs. With a focus on innovation and accuracy, we use industry-leading tools like
              PlanSwift and Bluebeam to streamline processes and enhance project outcomes.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
