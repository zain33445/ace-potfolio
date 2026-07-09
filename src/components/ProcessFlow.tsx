'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardCheck } from 'lucide-react';

import ThreeScene from './EstimationMachine/ThreeScene';

import { steps, STEP_COUNT } from '../constants/processSteps';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const sceneRef = useRef<any>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const currentStepRef = useRef(0);

  /* ----------------------------------------------------------------
   * ScrollTrigger: pin the section when the heading reaches the
   * viewport top, then scrub through steps as the user scrolls.
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    // Measure how far the heading sits below the section's top edge
    // so we can delay pinning until the heading arrives at viewport top.
    const sectionTop = section.getBoundingClientRect().top;
    const headingTop = heading.getBoundingClientRect().top;
    const headingOffset = Math.round(headingTop - sectionTop);

    // Create scroll distance for (STEP_COUNT - 1) viewport heights
    // so each step gets roughly 1vh of scroll travel
    const scrollDistance = window.innerHeight * (STEP_COUNT - 1);

    const st = ScrollTrigger.create({
      trigger: section,
      start: `top+=${headingOffset} top`,
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const step = Math.min(
          Math.floor(self.progress * STEP_COUNT) + 1,
          STEP_COUNT,
        );
        setActiveStep(step);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  /* ----------------------------------------------------------------
   * Animate the active card indicator whenever activeStep changes
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const wrappers = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!wrappers.length) return;

    wrappers.forEach((card, i) => {
      const isActive = i === activeStep - 1;
      gsap.to(card, {
        scale: isActive ? 1 : 0.99,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      });
    });
  }, [activeStep]);

  /* ----------------------------------------------------------------
   * Play 3D scene step animations
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const fns = [
      scene.playStep1,
      scene.playStep2,
      scene.playStep3,
      scene.playStep4,
    ];

    const target = activeStep;
    const current = currentStepRef.current;
    if (target === current) return;

    let cancelled = false;

    const play = async () => {
      if (target > current) {
        for (let i = current + 1; i <= target; i++) {
          if (cancelled) return;
          await fns[i - 1](1.5);
          if (cancelled) return;
          currentStepRef.current = i;
        }
      } else {
        scene.reset();
        currentStepRef.current = 0;
        for (let i = 1; i <= target; i++) {
          if (cancelled) return;
          await fns[i - 1](3);
          if (cancelled) return;
          currentStepRef.current = i;
        }
      }
    };

    play();

    return () => {
      cancelled = true;
    };
  }, [activeStep, sceneReady]);

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
    >
      <div className="order-2 lg:order-1 h-[450px] border border-blueprint-line bg-surface relative p-4 bracket-corners cursor-move">
        <div className="absolute top-4 left-4 font-mono text-xs text-on-surface-variant z-10 flex items-center gap-1.5 font-bold">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          SYSTEM: PROCESS_CLIPBOARD_MESH
        </div>

        <div className="w-full h-full absolute inset-0">
          <ThreeScene
            ref={(node) => {
              sceneRef.current = node;
              if (node && !sceneReady) setSceneReady(true);
            }}
          />
        </div>

        <div className="absolute bottom-4 left-4 z-10 bg-background/95 border border-blueprint-line p-3 font-mono text-[10px] space-y-1 shadow-sm max-w-xs">
          <span className="text-primary font-bold uppercase block">
            [STATUS_ACTIVE_STAGES]
          </span>

          <span className="block text-on-background font-sans font-semibold">
            Step {activeStep}: {steps[activeStep - 1]?.title}
          </span>

          <span className="block text-on-surface-variant leading-relaxed text-[9px]">
            {steps[activeStep - 1]?.output}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-primary">
          {activeStep}/{STEP_COUNT}
        </div>
      </div>

      <div className="order-1 lg:order-2 space-y-6">
        <div ref={headingRef}>
          <span className="font-mono text-xs text-primary block mb-2 font-bold">
            [OPERATIONAL_FLOW]
          </span>

          <h2 className="font-space font-bold text-3xl md:text-4xl text-on-background tracking-tight">
            Schematic Methodology.
          </h2>
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const idx = step.id - 1;
            const isOpen = activeStep === step.id;
            const isDone = activeStep > step.id;

            return (
              <div
                key={step.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onClick={() => setActiveStep(step.id)}
                className={`flex gap-4 p-4 border rounded-sm bracket-corners relative overflow-hidden transition-colors duration-300 cursor-pointer ${
                  isOpen
                    ? 'bg-surface border-primary'
                    : isDone
                      ? 'bg-surface/60 border-primary/30'
                      : 'bg-background/40 border-blueprint-line/20 hover:border-blueprint-line'
                }`}
              >
                {(isOpen || isDone) && (
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${isOpen ? 'bg-primary' : 'bg-primary/30'}`}
                  />
                )}

                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-colors duration-300 ${
                    isOpen
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/25'
                      : isDone
                        ? 'border-primary/30 bg-primary/5 text-primary/50'
                        : 'border-blueprint-line bg-surface text-on-surface-variant'
                  }`}
                >
                  {step.num}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-space font-bold text-base transition-colors duration-300 ${
                      isOpen
                        ? 'text-primary'
                        : isDone
                          ? 'text-on-background/60'
                          : 'text-on-background/40'
                    }`}
                  >
                    {step.title}
                  </h3>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
                  >
                    <div className="space-y-3 pt-2">
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                        {step.desc}
                      </p>

                      <div className="border-t border-dashed border-blueprint-line/60 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-[10px] font-semibold text-on-surface-variant">
                        <div>
                          <span className="block text-primary uppercase font-mono text-[9px] mb-1 font-bold">
                            [VERIFICATIONS]
                          </span>

                          <ul className="space-y-1">
                            {step.benchmarks.map((v, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-1.5"
                              >
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                <span>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="block text-primary uppercase font-mono text-[9px] mb-1 font-bold">
                            [MILESTONE_DELIVERABLE]
                          </span>

                          <span className="text-on-background bg-background px-2 py-0.5 border border-blueprint-line/60 block truncate">
                            {step.output}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
