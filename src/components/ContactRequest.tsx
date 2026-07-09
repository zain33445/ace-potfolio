'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, RefreshCw, Building2, Factory, Home, Upload, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { FileUpload } from '@/src/components/ui/file-upload';

const PROJECT_TYPES = [
  { id: 'residential', label: 'Residential', icon: Home, color: 'from-amber-500/10 to-orange-500/10' },
  { id: 'commercial', label: 'Commercial', icon: Building2, color: 'from-blue-500/10 to-cyan-500/10' },
  { id: 'industrial', label: 'Industrial', icon: Factory, color: 'from-emerald-500/10 to-teal-500/10' },
] as const;

const SCALE_OPTIONS = [
  { id: 'small', label: 'Small', range: 'Under 5,000 SF', icon: '□' },
  { id: 'medium', label: 'Medium', range: '5,000 – 25,000 SF', icon: '□□' },
  { id: 'large', label: 'Large', range: '25,000 – 100,000 SF', icon: '□□□' },
  { id: 'xlarge', label: 'X-Large', range: '100,000+ SF', icon: '□□□□' },
] as const;

interface ContactFormState {
  projectType: string;
  scale: string;
  files: File[];
  name: string;
  email: string;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  referenceId: string;
}

const EASE = [0.32, 0.72, 0, 1] as const;

export default function ContactRequest() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ContactFormState>({
    projectType: '',
    scale: '',
    files: [],
    name: '',
    email: '',
    isSubmitting: false,
    hasSubmitted: false,
    referenceId: '',
  });

  const generateReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REF-${result}`;
  };

  const updateForm = useCallback((updates: Partial<ContactFormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const autoAdvance = useCallback((delay: number = 600) => {
    setTimeout(() => setStep((s) => Math.min(s + 1, 4)), delay);
  }, []);

  const handleProjectTypeSelect = (type: string) => {
    updateForm({ projectType: type });
    autoAdvance(500);
  };

  const handleScaleSelect = (scale: string) => {
    updateForm({ scale });
    autoAdvance(500);
  };

  const handleFilesChange = (files: File[]) => {
    updateForm({ files });
    if (files.length > 0) autoAdvance(800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setForm((prev) => ({ ...prev, isSubmitting: true }));

    setTimeout(() => {
      setForm((prev) => ({
        ...prev,
        isSubmitting: false,
        hasSubmitted: true,
        referenceId: generateReference(),
      }));
    }, 1500);
  };

  const handleReset = () => {
    setStep(1);
    setForm({
      projectType: '',
      scale: '',
      files: [],
      name: '',
      email: '',
      isSubmitting: false,
      hasSubmitted: false,
      referenceId: '',
    });
  };

  const progress = ((step - 1) / 3) * 100;

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-24 md:py-32" id="contact">
      <div className="w-full md:w-[85%] mx-auto">
        <AnimatePresence mode="wait">
          {!form.hasSubmitted ? (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative bg-background border border-blueprint-line/15 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 md:p-12"
            >
              {/* Decorative dot grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Bracket corners */}
              <span className="absolute top-0 left-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute top-0 left-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute top-0 right-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute top-0 right-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute bottom-0 left-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute bottom-0 left-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute bottom-0 right-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute bottom-0 right-0 w-[1px] h-5 bg-primary/30" />
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                className="text-center mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase font-bold">
                    Quick Estimate
                  </span>
                </span>
              </motion.div>

              {/* Progress — centered, labels above dots */}
              <div className="relative z-10 mb-10 mx-auto max-w-lg">
                <div className="flex justify-between mb-3">
                  {[1, 2, 3, 4].map((s) => (
                    <motion.div
                      key={s}
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * s }}
                    >
                      <span className={`font-mono text-[10px] tracking-[0.15em] uppercase ${
                        s <= step ? 'text-on-background font-medium' : 'text-on-surface-variant/40'
                      }`}>
                        {['Type', 'Scale', 'Plans', 'Send'][s - 1]}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          s <= step ? 'bg-primary scale-125' : 'bg-blueprint-line/30'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="h-[2px] bg-blueprint-line/15 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="relative z-10 min-h-[320px]">
                <AnimatePresence mode="wait">
                  {/* STEP 1: Project Type */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="font-mono text-[10px] text-primary/60 tracking-[0.2em]">01</span>
                          <span className="w-8 h-[1px] bg-blueprint-line/20" />
                        </div>
                        <h3 className="font-space font-bold text-2xl md:text-3xl text-on-background mb-2">
                          What are you building?
                        </h3>
                        <p className="font-sans text-sm text-on-surface-variant">
                          Select your project type
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {PROJECT_TYPES.map((type, i) => (
                          <motion.button
                            key={type.id}
                            type="button"
                            onClick={() => handleProjectTypeSelect(type.id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i, duration: 0.4, ease: EASE }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative p-6 rounded-[1.5rem] border transition-all duration-500 ${
                              form.projectType === type.id
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                                : 'border-blueprint-line/30 bg-background hover:border-primary/40 hover:shadow-md hover:shadow-primary/5'
                            }`}
                          >
                            {/* Double-bezel inner highlight */}
                            <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                              form.projectType === type.id
                                ? 'bg-primary text-white scale-110'
                                : 'bg-blueprint-line/10 text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                              <type.icon className="w-6 h-6" />
                            </div>
                            
                            <div className="font-space font-semibold text-on-background mb-1">
                              {type.label}
                            </div>

                            {/* Selection indicator */}
                            <motion.div
                              className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                              animate={{
                                borderColor: form.projectType === type.id ? '#FF6B00' : 'rgba(0,0,0,0.1)',
                                backgroundColor: form.projectType === type.id ? '#FF6B00' : 'transparent',
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {form.projectType === type.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-full"
                                />
                              )}
                            </motion.div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Scale */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="font-mono text-[10px] text-primary/60 tracking-[0.2em]">02</span>
                          <span className="w-8 h-[1px] bg-blueprint-line/20" />
                        </div>
                        <h3 className="font-space font-bold text-2xl md:text-3xl text-on-background mb-2">
                          How large is the project?
                        </h3>
                        <p className="font-sans text-sm text-on-surface-variant">
                          This helps us allocate the right surveyor
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SCALE_OPTIONS.map((option, i) => (
                          <motion.button
                            key={option.id}
                            type="button"
                            onClick={() => handleScaleSelect(option.id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * i, duration: 0.4, ease: EASE }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative p-5 rounded-[1.25rem] border text-center transition-all duration-500 ${
                              form.scale === option.id
                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                                : 'border-blueprint-line/30 bg-background hover:border-primary/40 hover:shadow-md'
                            }`}
                          >
                            <div className="absolute inset-[1px] rounded-[calc(1.25rem-1px)] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                            
                            {/* Visual size indicator */}
                            <div className="flex justify-center gap-0.5 mb-3">
                              {Array.from({ length: i + 1 }).map((_, j) => (
                                <motion.div
                                  key={j}
                                  className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                                    form.scale === option.id ? 'bg-primary' : 'bg-blueprint-line/30'
                                  }`}
                                  animate={{
                                    scale: form.scale === option.id ? 1.1 : 1,
                                  }}
                                />
                              ))}
                            </div>

                            <div className="font-space font-semibold text-sm text-on-background mb-1">
                              {option.label}
                            </div>
                            <div className="font-mono text-[9px] text-on-surface-variant tracking-wider">
                              {option.range}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Prev button */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center pt-2"
                      >
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant/60 hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em]"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          Back
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* STEP 3: Upload Plans */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="font-mono text-[10px] text-primary/60 tracking-[0.2em]">03</span>
                          <span className="w-8 h-[1px] bg-blueprint-line/20" />
                        </div>
                        <h3 className="font-space font-bold text-2xl md:text-3xl text-on-background mb-2">
                          Upload your plans
                        </h3>
                        <p className="font-sans text-sm text-on-surface-variant">
                          Blueprints, drawings, or project documents
                        </p>
                      </div>

                      <FileUpload onChange={handleFilesChange} />

                      {/* Skip option */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-6 pt-2"
                      >
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant/60 hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em]"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          Back
                        </button>
                        <span className="w-[1px] h-3 bg-blueprint-line/20" />
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className="font-mono text-[10px] text-on-surface-variant hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em]"
                        >
                          Skip for now →
                        </button>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* STEP 4: Name, Email & Submit */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center gap-2 mb-3">
                            <span className="font-mono text-[10px] text-primary/60 tracking-[0.2em]">04</span>
                            <span className="w-8 h-[1px] bg-blueprint-line/20" />
                          </div>
                          <h3 className="font-space font-bold text-2xl md:text-3xl text-on-background mb-2">
                            Where do we send the estimate?
                          </h3>
                          <p className="font-sans text-sm text-on-surface-variant">
                            We&apos;ll reach out within 24 hours
                          </p>
                        </div>

                        {/* Narrowed form fields */}
                        <div className="max-w-md mx-auto space-y-4">
                          {/* Name input */}
                          <div className="relative p-[1px] rounded-[1.25rem] bg-gradient-to-b from-blueprint-line/20 to-transparent">
                            <div className="relative rounded-[calc(1.25rem-1px)] bg-background overflow-hidden">
                              <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => updateForm({ name: e.target.value })}
                                className="w-full bg-transparent px-6 py-4 font-sans text-base text-on-background outline-none placeholder:text-on-surface-variant/40"
                                placeholder="Your name"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Email input */}
                          <div className="relative p-[1px] rounded-[1.25rem] bg-gradient-to-b from-blueprint-line/20 to-transparent">
                            <div className="relative rounded-[calc(1.25rem-1px)] bg-background overflow-hidden">
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => updateForm({ email: e.target.value })}
                                className="w-full bg-transparent px-6 py-4 font-sans text-base text-on-background outline-none placeholder:text-on-surface-variant/40"
                                placeholder="your@email.com"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit button - narrowed */}
                        <div className="max-w-md mx-auto">
                          <motion.button
                            type="submit"
                            disabled={form.isSubmitting || !form.email || !form.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full group relative overflow-hidden rounded-full bg-on-background text-white font-mono text-xs font-bold py-4 px-8 uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {/* Button glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            
                            <span className="relative flex items-center justify-center gap-3">
                              {form.isSubmitting ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Transmitting...
                                </>
                              ) : (
                                <>
                                  Get My Estimate
                                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                  </span>
                                </>
                              )}
                            </span>
                          </motion.button>
                        </div>

                        {/* Prev + Trust signals row */}
                        <div className="max-w-md mx-auto">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-between"
                          >
                            <button
                              type="button"
                              onClick={() => setStep(3)}
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant/60 hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em]"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              Back
                            </button>
                            <div className="flex items-center gap-4 font-mono text-[9px] text-on-surface-variant/50 uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                SSL
                              </span>
                              <span>No spam</span>
                              <span>24h</span>
                            </div>
                          </motion.div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* SUCCESS STATE */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative bg-background border border-blueprint-line/15 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 md:p-12 text-center space-y-8"
            >
              {/* Decorative dot grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Bracket corners */}
              <span className="absolute top-0 left-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute top-0 left-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute top-0 right-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute top-0 right-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute bottom-0 left-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute bottom-0 left-0 w-[1px] h-5 bg-primary/30" />
              <span className="absolute bottom-0 right-0 w-5 h-[1px] bg-primary/30" />
              <span className="absolute bottom-0 right-0 w-[1px] h-5 bg-primary/30" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-green-50 border border-green-200 mx-auto flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>

              <div className="space-y-3">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-space font-bold text-3xl text-on-background"
                >
                  Estimate incoming.
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-sans text-sm text-on-surface-variant max-w-sm mx-auto"
                >
                  Thanks, <strong className="text-on-background">{form.name}</strong>. Check <strong className="text-on-background">{form.email}</strong> within 24 hours.
                </motion.p>
              </div>

              {/* Reference ticket */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block p-5 rounded-[1.25rem] bg-background border border-blueprint-line/30"
              >
                <div className="font-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-wider">
                  Reference
                </div>
                <div className="font-mono text-lg font-bold text-on-background tracking-wider">
                  {form.referenceId}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 font-mono text-[10px] text-on-surface-variant hover:text-primary transition-colors duration-300 uppercase tracking-[0.15em]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Start new estimate
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
