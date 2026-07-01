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
    title: 'Structural Data Ingestion',
    desc: 'Transmit your blueprints architectural layouts, site measurements, scope narratives, or custom municipal constraints through our bank-grade secure server channel.',
    icon: Database,
    benchmarks: [
      'Zoning compliance check',
      'Duplicate & missing document scan',
      'Scale verification & alignment audit'
    ],
    output: 'Validated CAD specifications & client scope constraints'
  },
  {
    id: 2,
    num: '02',
    title: 'Algorithmic Quantity Takeoff',
    desc: 'Our quantity surveyors perform exhaustive computational dissection utilizing localized material standards-databases and professional digitization platforms.',
    icon: Laptop,
    benchmarks: [
      'Precise structural grid tracking',
      'Division-wise material volume count',
      'Zonal labor efficiency calculations'
    ],
    output: 'Raw cost-multipliers and takeoff draft schedule'
  },
  {
    id: 3,
    num: '03',
    title: 'Dual-Stage verification review',
    desc: 'All programmatic estimates undergo parallel reviews by principal civil engineers to filter any variances or localized market rate fluctuations before compilation.',
    icon: ShieldAlert,
    benchmarks: [
      'AACE Class 3 regulatory limits check',
      'Localized vendor rate confirmation',
      'Weather & timeline buffer alignment'
    ],
    output: 'Peer-reviewed, safety-certified estimate set'
  },
  {
    id: 4,
    num: '04',
    title: 'Delivery Protocol Transmission',
    desc: 'Instant delivery of final cost-schedules including completely interactive Microsoft Excel spreadsheets and stamped PDF dossiers designed for presentation.',
    icon: BadgeCheck,
    benchmarks: [
      'CSI Division format structure',
      'Editable formula arrays unlocked',
      'Drafting sheets metadata compilation'
    ],
    output: 'Excel BOQ matrix & architectural stamps'
  }
];
