'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, ChevronLeft, ChevronRight } from 'lucide-react';

import React from 'react';

const ThreeScene = React.lazy(() => import('./EstimationMachine/ThreeScene'));

import { steps, STEP_COUNT } from '../constants/processSteps';

export default function ProcessFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const sceneRef = useRef<any>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const currentStepRef = useRef(0);
  const targetRef = useRef(activeStep);
  const [isMobile, setIsMobile] = useState(false);

  /* ── Responsive detection ── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  /* ── IntersectionObserver: highlight step when its card fills the viewport ── */
  useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setActiveStep(idx + 1);
            }
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  /* ── Stable callback ref (only fires on mount/unmount, not every render) ── */
  const sceneRefCallback = useCallback((node: any) => {
    sceneRef.current = node;
    if (node) setSceneReady(true);
  }, []);

  /* ── Persistent 3D animation loop (starts once, never restarts) ── */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const fns = [
      scene.playStep1,
      scene.playStep2,
      scene.playStep3,
      scene.playStep4,
    ] as Array<((speed?: number) => Promise<void>) | undefined>;

    let cancelled = false;

    const loop = async () => {
      while (true) {
        if (cancelled) return;

        const current = currentStepRef.current;
        const target = targetRef.current;

        if (current === target) {
          await new Promise((r) => setTimeout(r, 200));
          continue;
        }

        try {
          if (target > current) {
            const fn = fns[current];
            if (typeof fn !== 'function') {
              await new Promise((r) => setTimeout(r, 500));
              continue;
            }
            await fn(1.5);
            if (cancelled) return;
            currentStepRef.current = current + 1;
          } else {
            scene.reset();
            currentStepRef.current = 0;
          }
        } catch {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    };

    loop();

    return () => {
      cancelled = true;
    };
  }, [sceneReady]);

  /* ── Just update the target ref (no restart!) ── */
  useEffect(() => {
    targetRef.current = activeStep;
  }, [activeStep]);

  /* ── Click step card → scroll to it ── */
  const handleStepClick = (idx: number) => {
    setActiveStep(idx + 1);
    stepRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ── Mobile: send card to back on tap ── */
  const sendToBack = () => {
    setActiveStep((prev) => (prev >= STEP_COUNT ? 1 : prev + 1));
  };
  const sendToFront = () => {
    setActiveStep((prev) => (prev <= 1 ? STEP_COUNT : prev - 1));
  };

  /* ── Shared 3D scene ── */
  const sceneBlock = (
    <div className="h-[300px] md:h-[500px] border border-blueprint-line bg-surface relative p-4 bracket-corners cursor-move">
      <div className="absolute top-4 left-4 font-mono text-sm text-on-surface-variant z-10 flex items-center gap-1.5 font-bold">
        <ClipboardCheck className="w-4 h-4 text-primary" />
        SYSTEM: PROCESS_CLIPBOARD_MESH
      </div>
      <div className="w-full h-full absolute inset-0">
        <React.Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <span className="font-mono text-sm text-primary animate-pulse">Loading 3D scene…</span>
          </div>
        }>
          <ThreeScene ref={sceneRefCallback} />
        </React.Suspense>
      </div>
      <div className="absolute top-4 right-4 z-10 font-mono text-sm text-primary">
        {activeStep}/{STEP_COUNT}
      </div>
    </div>
  );

  /* ── Mobile: stacked cards layout ── */
  if (isMobile) {
    return (
      <div ref={sectionRef} className="px-6 py-16 space-y-8">
        {/* Heading */}
        <div>
          <span className="font-mono text-sm text-primary block mb-2 font-bold">
            Operational Flow
          </span>
          <h2 className="font-space font-bold text-3xl text-on-background tracking-tight">
            Our Process.
          </h2>
        </div>

        {/* 3D Scene */}
        {sceneBlock}

        {/* Stacked cards */}
        <div className="relative h-[100px] w-full">
          {steps.map((step, i) => {
            const offset = step.id - activeStep;
            const normalised = offset < 0 ? offset + STEP_COUNT : offset;
            const isFront = normalised === 0;

            return (
              <motion.div
                key={step.id}
                className="absolute inset-0"
                animate={{
                  y: normalised * -8,
                  scale: 1 - normalised * 0.04,
                  opacity: normalised > 3 ? 0 : 1 - normalised * 0.15,
                  zIndex: STEP_COUNT - normalised,
                  rotateZ: normalised === 0 ? 0 : (normalised % 2 === 0 ? 1.5 : -1.5),
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                onClick={isFront ? sendToBack : undefined}
                style={{ cursor: isFront ? 'pointer' : 'default' }}
              >
                <div
                  className={` w-full border bracket-corners p-3 flex flex-col justify-start transition-colors duration-300 ${
                    isFront
                      ? 'bg-surface border-primary shadow-lg'
                      : 'bg-surface/80 border-blueprint-line/40'
                  }`}
                >
                  <span className="font-mono text-sm text-primary font-bold tracking-widest mb-1">
                    PROCESS_STEP
                  </span>
                  <h3 className={`font-space font-bold text-xl ${isFront ? 'text-primary' : 'text-on-background/50'}`}>
                    {step.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nav arrows */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={sendToFront}
            className="w-10 h-10 border border-blueprint-line bg-surface bracket-corners flex items-center justify-center hover:border-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-on-background" />
          </button>
          <span className="font-mono text-sm text-primary font-bold">
            {activeStep} / {STEP_COUNT}
          </span>
          <button
            onClick={sendToBack}
            className="w-10 h-10 border border-blueprint-line bg-surface bracket-corners flex items-center justify-center hover:border-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-on-background" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Desktop: sticky scene + one-card-at-a-time step cards ── */
  return (
    <div ref={sectionRef}>
      {/* Heading */}
      <div className="">
        <span className="font-mono text-sm text-primary block mb-5 font-bold">
          Operational Flow
        </span>
        <h2 className="font-space font-bold text-4xl md:text-5xl text-on-background tracking-tight">
          Our Process.
        </h2>
      </div>

      <div className="flex flex-col h-full md:flex-row gap-12">
        {/* Left: 3D scene (sticky, centered) */}
        <div className="w-full md:w-1/2">
          <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center">
            {sceneBlock}
          </div>
        </div>

        {/* Right: Step cards — each min-h-screen so only one is visible at a time */}
        <div className="w-full md:w-1/2">
          {steps.map((step, i) => {
            const isOpen = activeStep === step.id;
            const isDone = activeStep > step.id;

            return (
              <div
                key={step.id}
                ref={(el) => { stepRefs.current[i] = el; }}
                onClick={() => handleStepClick(i)}
                className="min-h-screen flex items-center py-20"
              >
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`w-full flex gap-4 p-6 border rounded-sm bracket-corners relative overflow-hidden transition-colors duration-300 cursor-pointer ${
                    isOpen
                      ? 'bg-surface border-primary'
                      : isDone
                        ? 'bg-surface/60 border-primary/30'
                        : 'bg-background/40 border-blueprint-line/20 hover:border-blueprint-line'
                  }`}
                >
                  {(isOpen || isDone) && (
                    <div
                      className={`absolute left-0 top-0  w-1 ${isOpen ? 'bg-primary' : 'bg-primary/30'}`}
                    />
                  )}

                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
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
                      className={`font-space font-bold text-2xl transition-colors duration-300 ${
                        isOpen
                          ? 'text-primary'
                          : isDone
                            ? 'text-on-background/60'
                            : 'text-on-background/40'
                      }`}
                    >
                      {step.title}
                    </h3>

                    <div className="mt-3">
                      <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
                        {step.desc}
                      </p>

                      <div className="border-t border-dashed border-blueprint-line/60 pt-3 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-sm font-semibold text-on-surface-variant">
                        <div>
                          <span className="block text-primary uppercase font-mono text-xs mb-1 font-bold">
                            Verifications
                          </span>
                          <ul className="space-y-1.5">
                            {step.benchmarks.map((v, j) => (
                              <li key={j} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                <span>{v}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="block text-primary uppercase font-mono text-xs mb-1 font-bold">
                            Milestone Deliverable
                          </span>
                          <span className="text-on-background bg-background px-2 py-0.5 border border-blueprint-line/60 block truncate">
                            {step.output}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
