'use client';

import { Database, Laptop, ShieldAlert, BadgeCheck } from 'lucide-react';

export interface Step {
  id: number;
  num: string;
  title: string;
  desc: string;
  icon: any;
  benchmarks: string[];
  output: string;
}

export const STEP_COUNT = 4;

export const steps: Step[] = [
  {
    id: 1,
    num: '01',
    title: 'Send Us Your Files',
    desc: 'Upload your blueprints, drawings, measurements, project details, or any local building requirements through our secure upload system.',
    icon: Database,
    benchmarks: [
      'Building code compliance check',
      'Missing or duplicate file detection',
      'Scale and alignment verification',
    ],
    output: 'Verified drawings and project requirements',
  },
  {
    id: 2,
    num: '02',
    title: 'We Measure Everything',
    desc: 'Our team counts every material you need using local pricing databases and professional measurement tools.',
    icon: Laptop,
    benchmarks: [
      'Accurate structural grid tracking',
      'Material quantities by category',
      'Labor cost estimates by area',
    ],
    output: 'Material quantities and preliminary cost estimates',
  },
  {
    id: 3,
    num: '03',
    title: 'Expert Review',
    desc: 'Senior engineers review all estimates side-by-side to catch errors and adjust for local pricing before finalizing.',
    icon: ShieldAlert,
    benchmarks: [
      'AACE Class 3 standards compliance',
      'Local supplier price verification',
      'Weather and timeline adjustments',
    ],
    output: 'Reviewed and approved cost estimates',
  },
  {
    id: 4,
    num: '04',
    title: 'Get Your Deliverables',
    desc: 'Receive your final cost breakdown in editable Excel spreadsheets and professional PDF reports, ready to share with clients.',
    icon: BadgeCheck,
    benchmarks: [
      'CSI Division format organization',
      'Editable formulas included',
      'Complete documentation package',
    ],
    output: 'Excel bill of quantities and stamped reports',
  },
];
