import { Compass, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import Reveal from '../../../components/Reveal';
import RenderOnViewport from '../../../components/RenderOnViewport';

const About3D = dynamic(() => import('../../../components/About3D'), {
  ssr: false,
});

export default function AboutSection() {
  return (
    <div id="about" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-background relative">
      <Reveal type="fadeUp">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs text-primary font-bold block">[ABOUT_US]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
              Who We Are
            </h2>
            <p className="font-sans text-base text-on-surface-variant leading-relaxed font-medium">
              At The ACE Services, we don&rsquo;t just provide numbers; we provide the foundation for successful project execution. With a track record of 2,893 projects estimated and a verified 89% bid win rate, we have established ourselves as a dominant force in the pre-construction space. Our mission is to reshape the industry through innovation, excellence, and a commitment to sustainability, ensuring every structure we support is built to endure.
            </p>

            <div className="border-t border-b border-blueprint-line/40 py-5 my-2">
              <span className="font-mono text-[10px] text-[#FF6B00] font-bold tracking-wider block uppercase mb-1.5">[DIFFERENTIATOR_REPORT]</span>
              <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
                <strong>What Makes Us Different:</strong> We eliminate human error through a robust two-stage checking process. Every takeoff and estimate is scrutinized by a dedicated team and finalized by Senior Consultants before it ever reaches your desk. We combine this rigorous oversight with international ISO standards of construction to deliver a level of precision that &ldquo;freelance&rdquo; estimators cannot match.
              </p>
            </div>

            <div className="pt-2 space-y-4">
              <h3 className="font-space text-lg font-bold text-on-background flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" /> Our Core Values
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-sm text-on-surface-variant">
                <li className="flex flex-col gap-1.5 bg-surface p-4 border border-blueprint-line bracket-corners">
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4 text-primary" />
                    <strong className="text-on-background font-bold uppercase font-space text-xs">Precision over Guesswork</strong>
                  </div>
                  <span>Where every detail counts and every estimate matters.</span>
                </li>
                <li className="flex flex-col gap-1.5 bg-surface p-4 border border-blueprint-line bracket-corners">
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4 text-primary" />
                    <strong className="text-on-background font-bold uppercase font-space text-xs">Technological Leadership</strong>
                  </div>
                  <span>Leveraging PlanSwift and Bluebeam to streamline complex workflows.</span>
                </li>
                <li className="flex flex-col gap-1.5 bg-surface p-4 border border-blueprint-line bracket-corners">
                  <div className="flex items-center gap-2 text-primary">
                    <Check className="w-4 h-4 text-primary" />
                    <strong className="text-on-background font-bold uppercase font-space text-xs">Long-Term Partnerships</strong>
                  </div>
                  <span>We don&rsquo;t just build structures; we build lasting collaborations for shared success.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 h-[400px] md:h-[480px] border border-blueprint-line bg-surface relative p-4 bracket-corners bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="absolute top-4 left-4 font-mono text-xs text-primary font-bold z-10 block">
              [MASSING_MODEL: FLR_PLN_01]
            </div>
            <RenderOnViewport className="w-full h-full" placeholder={<div className="w-full h-full flex items-center justify-center"><div className="font-mono text-xs text-primary animate-pulse">Loading 3D...</div></div>}>
              <About3D />
            </RenderOnViewport>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-on-surface-variant opacity-75 z-10 bg-background/90 px-2 py-1 border border-blueprint-line">
              Active volumetric viewport tracking
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
