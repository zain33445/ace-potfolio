'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, ChevronRight, Upload, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { EstimationInputs, CostBreakdown } from '../../../types';
import { projectTypes } from './projectTypes';

type Inputs = EstimationInputs;

export default function StepReview({
  inputs, setInputs, breakdown, transmitted, onTransmit, uploadedFile, setUploadedFile, submitStatus,
}: {
  inputs: Inputs; setInputs: (i: Inputs) => void; breakdown: CostBreakdown; transmitted: boolean; onTransmit: () => void;
  uploadedFile: File | null; setUploadedFile: (f: File | null) => void;
  submitStatus: 'idle' | 'sending' | 'success' | 'error';
}) {
  const projectTypeLabel = projectTypes.find((t) => t.value === inputs.projectType)?.label ?? inputs.projectType;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-mono text-sm text-green-500 tracking-widest uppercase font-bold">Step 4 of 4</h4>
        <p className="font-space text-xl text-on-background mt-1 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" /> Estimate ready for review
        </p>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Verify your selections below, then attach any plans or drawings and submit for a human expert review.
        </p>
      </div>

      <div className="bg-background border border-blueprint-line p-4 space-y-3">
        {[
          { label: 'Project Type', value: projectTypeLabel },
          { label: 'Floor Area', value: `${inputs.areaSqFt.toLocaleString()} sq ft` },
          { label: 'Complexity', value: `${inputs.complexity}${inputs.complexity === 'simple' ? ' (0.85x)' : inputs.complexity === 'high' ? ' (1.35x)' : ' (1.00x)'}` },
          { label: 'Delivery', value: inputs.turnaroundSpeed === 'standard' ? '48 Hours' : '24 Hours (Rush)' },
          { label: 'Region', value: `Zip ${inputs.zipCode || '75001'}` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center font-mono text-sm">
            <span className="text-on-surface-variant">{row.label}</span>
            <span className="text-on-background font-bold uppercase">{row.value}</span>
          </div>
        ))}
        <div className="border-t border-blueprint-line pt-3 flex justify-between items-center">
          <span className="font-mono text-sm text-on-surface-variant">Estimated Total</span>
          <span className="font-space font-bold text-3xl text-primary">${breakdown.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Email Input */}
      <div className="bg-background border border-blueprint-line p-4">
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-2">
          Email Address <span className="text-red-500">*</span>
        </p>
        <input
          type="email"
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
          placeholder="you@example.com"
          required
          className="w-full bg-surface border border-blueprint-line px-3 py-2 font-mono text-sm text-on-background placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* File Upload */}
      <div className="bg-background border border-blueprint-line p-4">
        <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
          <Upload className="w-3.5 h-3.5 text-primary" /> Attach Plans / Drawings (optional)
        </p>

        {uploadedFile ? (
          <div className="flex items-center justify-between bg-surface border border-blueprint-line p-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-mono text-sm text-on-background truncate">{uploadedFile.name}</p>
                <p className="font-mono text-xs text-on-surface-variant">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="p-1 hover:bg-surface-variant rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-blueprint-line p-4 text-center hover:border-primary hover:bg-surface/50 transition-all duration-200 cursor-pointer group"
          >
            <Upload className="w-5 h-5 text-on-surface-variant group-hover:text-primary mx-auto mb-1 transition-colors" />
            <span className="font-mono text-xs text-on-surface-variant group-hover:text-primary transition-colors">
              Click to upload PDF, DWG, DXF, PNG, or JPG files
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={onTransmit}
        disabled={transmitted || submitStatus === 'sending'}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-primary text-white font-mono text-base font-bold uppercase tracking-widest py-3.5 bracket-corners transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
      >
        {submitStatus === 'sending' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting Estimate...
          </span>
        ) : submitStatus === 'success' || transmitted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> Estimate Submitted Successfully
          </motion.span>
        ) : submitStatus === 'error' ? (
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Submission Failed — Try Again
          </span>
        ) : (
          <>Get Human Estimate <ChevronRight className="w-4 h-4" /></>
        )}
      </motion.button>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-50 border border-green-300 p-3 text-center"
        >
          <p className="font-mono text-xs text-green-700 uppercase tracking-wider font-bold">
            Your estimate has been submitted. A senior estimator will review your details and contact you within 24 hours.
          </p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-300 p-3 text-center"
        >
          <p className="font-mono text-xs text-red-700 uppercase tracking-wider font-bold">
            Something went wrong. Please try again or contact us directly.
          </p>
        </motion.div>
      )}
    </div>
  );
}
