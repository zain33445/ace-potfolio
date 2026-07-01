import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface ContactFormState {
  projectName: string;
  name: string;
  email: string;
  scopeDetails: string;
  areaSqFt: string;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  referenceId: string;
}

export default function ContactRequest() {
  const [form, setForm] = useState<ContactFormState>({
    projectName: '',
    name: '',
    email: '',
    scopeDetails: '',
    areaSqFt: '25000',
    isSubmitting: false,
    hasSubmitted: false,
    referenceId: ''
  });

  const generateReference = (zip: string = 'ACE') => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `REF-${zip}-${result}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName || !form.name || !form.email) return;

    setForm(prev => ({ ...prev, isSubmitting: true }));

    // Simulate database / transmission latency
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        isSubmitting: false,
        hasSubmitted: true,
        referenceId: generateReference(form.projectName.slice(0, 3).toUpperCase())
      }));
    }, 1500);
  };

  const handleReset = () => {
    setForm({
      projectName: '',
      name: '',
      email: '',
      scopeDetails: '',
      areaSqFt: '25000',
      isSubmitting: false,
      hasSubmitted: false,
      referenceId: ''
    });
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border border-blueprint-line bg-surface rounded-none overflow-hidden" id="contact">
      {/* LEFT ORANGE INFO GRID */}
      <div className="bg-primary p-8 md:p-12 flex flex-col justify-between text-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="space-y-6 relative z-10">
          <div className="font-mono text-xs tracking-widest text-[#FFDFCC] uppercase font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFDFCC] animate-pulse" />
            [ESTIMATION_INTEGRITY_PORTAL]
          </div>
          <h2 className="font-space font-bold text-3xl md:text-4xl leading-tight">
            Submit Your Plans for a Precision Quote
          </h2>
          <p className="font-sans text-sm md:text-base opacity-95 leading-relaxed font-medium">
            Upload your blueprints or email them directly to our team. We provide a comprehensive, individual review of your project scope, complexity, and trades to deliver a quote that fits your specific needs.
          </p>
          <div className="border-t border-white/20 pt-6 mt-6">
            <p className="font-sans text-xs md:text-sm italic opacity-90 leading-relaxed font-semibold">
              &ldquo;Bid deadlines wait for no one. Don’t let a lack of capacity or inaccurate data cost you your next project. Put our precision-driven team to work for you today.&rdquo;
            </p>
          </div>
        </div>

        <div className="font-mono text-[10px] space-y-1 opacity-75 mt-12 relative z-10">
          <div className="flex items-center gap-1.5 uppercase font-bold">
            <ShieldCheck className="w-4 h-4 text-[#FFDFCC]" /> Secure SSL Encrypted channel established
          </div>
          <div>EST_SYS_COORD: 32.7767° N | 96.7970° W (DFW HQ)</div>
        </div>
      </div>

      {/* RIGHT INPUT PANEL */}
      <div className="p-8 md:p-12 relative flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!form.hasSubmitted ? (
            <motion.form
              key="contact-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">
                  [PROJ_ID] Project Designation *
                </label>
                <input
                  type="text"
                  required
                  name="projectName"
                  value={form.projectName}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-sans text-sm text-on-background outline-none transition-colors bracket-corners"
                  placeholder="e.g. Dallas Center Renovation Stage-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">
                    [CLIENT_ID] Full Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-sans text-sm text-on-background outline-none transition-colors bracket-corners"
                    placeholder="E.g. Captain Vance"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">
                    [EMAIL_CHANNEL] Comm Link *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-sans text-sm text-on-background outline-none transition-colors bracket-corners"
                    placeholder="yourname@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">
                  [BLUEPRINT_EST] Estimated Total Area (SF)
                </label>
                <input
                  type="number"
                  name="areaSqFt"
                  value={form.areaSqFt}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-mono text-sm text-on-background outline-none transition-colors bracket-corners"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold mb-2">
                  [SCHEMATIC_DETAILS] Scope of Work & Guidelines
                </label>
                <textarea
                  name="scopeDetails"
                  value={form.scopeDetails}
                  onChange={handleInputChange}
                  className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-sans text-sm text-on-background outline-none transition-colors bracket-corners resize-none"
                  placeholder="Specify material types, target schedules, Division structures or general comments..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={form.isSubmitting}
                className="w-full bg-on-background text-white font-mono text-xs font-bold py-4 hover:bg-primary transition-colors duration-200 uppercase tracking-widest bracket-corners flex items-center justify-center gap-2"
              >
                {form.isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ANALYZING PLAN METRICS...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    Submit Your Project Now
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="contact-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 py-6"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full border border-green-200 mx-auto flex items-center justify-center text-green-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-space font-bold text-2xl text-on-background">
                  Payload Received & Certified.
                </h3>
                <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-on-background">{form.name}</strong>. Your project parameter set for <strong>{form.projectName}</strong> is loaded in our queue. A surveyor is reviewing the schematics.
                </p>
              </div>

              {/* Reference ticket */}
              <div className="mx-auto max-w-sm p-4 bg-background border border-blueprint-line rounded-lg font-mono text-xs text-left space-y-2">
                <div className="flex border-b border-dashed border-blueprint-line pb-2 justify-between font-bold">
                  <span>METADATA RECEIPT</span>
                  <span className="text-primary">SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span>Ticket reference:</span>
                  <span className="font-bold text-on-background">{form.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Authorized Comm:</span>
                  <span className="text-on-background">{form.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Area Allocated:</span>
                  <span className="text-on-background">{parseInt(form.areaSqFt).toLocaleString()} SF</span>
                </div>
                <div className="border-t border-dashed border-blueprint-line pt-2 text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Survey team flagged for 24h follow-up.
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 bg-background border border-blueprint-line text-on-surface-variant hover:text-primary hover:border-primary font-mono text-[10px] font-bold px-5 py-2.5 transition-all bracket-corners uppercase"
              >
                <Layers className="w-3.5 h-3.5" /> Track Another Schematic Envelope
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
