'use client';

import { HelpCircle } from 'lucide-react';
import { FAQItem } from '../types';

const questions: FAQItem[] = [
  {
    id: 'faq_01',
    question: 'How long does a construction estimate take?',
    answer: 'ACE SERVICES typically delivers detailed cost estimates within 3 to 5 business days depending on project complexity. Expedited 24-hour turnaround is available for select scope categories including material takeoffs for residential and light commercial projects.'
  },
  {
    id: 'faq_02',
    question: 'What is a Class 3 construction estimate?',
    answer: 'A Class 3 estimate, as defined by AACE International, provides a budgetary control level of accuracy suitable for project funding authorization — typically within ±10% to ±20% accuracy range. ACE SERVICES delivers all estimates to AACE Class 3 standards using localized material databases and CSI MasterFormat divisions.'
  },
  {
    id: 'faq_03',
    question: 'What is a quantity takeoff in construction?',
    answer: 'A quantity takeoff is the process of measuring and calculating all materials, labor, and equipment quantities from architectural blueprints and specifications. ACE SERVICES uses algorithmic digitization platforms for division-wise material volume counts, ensuring precise procurement data and eliminating on-site waste.'
  },
  {
    id: 'faq_04',
    question: 'How much does a construction cost estimate cost?',
    answer: 'ACE SERVICES provides free preliminary quotes. Full estimate pricing is project-dependent based on square footage, scope complexity, and documentation quality. Use our online calculator for an instant budgetary allocation or contact us for a custom quote tailored to your specific project requirements.'
  },
  {
    id: 'faq_05',
    question: 'What file formats do you accept for blueprints?',
    answer: 'We accept PDF, DWG, DXF, and raster image formats. Our digitization pipeline handles both digital-native files and scanned hard copies. For scanned documents, we perform scale verification and alignment audits to guarantee measurement accuracy before proceeding with quantity takeoffs.'
  },
  {
    id: 'faq_06',
    question: 'Do you work with subcontractors and small contractors?',
    answer: 'Yes — ACE SERVICES supports general contractors, subcontractors, and independent developers across 35 US states. We offer scalable engagement models from single-trade material lists to full-spectrum pre-construction packages, making professional estimating accessible to firms of any size.'
  }
];

/* Split into 3 columns: 2 — 2 — 2 */
const col1 = questions.slice(0, 2);
const col2 = questions.slice(2, 4);
const col3 = questions.slice(4, 6);

/* Curated random heights for the bento masonry effect */
const CARD_HEIGHTS: Record<string, string> = {
  faq_01: 'min-h-[160px]',
  faq_02: 'min-h-[280px]',
  faq_03: 'min-h-[260px]',
  faq_04: 'min-h-[180px]',
  faq_05: 'min-h-[200px]',
  faq_06: 'min-h-[257px]',
};

function FAQCard({ item }: { item: FAQItem }) {
  return (
    <div className={`border border-blueprint-line bg-surface p-5 bracket-corners hover-brackets transition-all duration-300 hover:border-primary group break-inside-avoid mb-4 flex flex-col justify-between ${CARD_HEIGHTS[item.id] ?? 'min-h-[240px]'}`}>
      <div>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 border border-blueprint-line bg-background bracket-corners group-hover:border-primary transition-colors flex-shrink-0">
            <HelpCircle className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-[family-name:var(--font-space)] font-bold text-sm leading-snug text-on-background group-hover:text-primary transition-colors duration-300">
            {item.question}
          </h3>
        </div>
        <div className="mt-3 ml-12">
          <p className="font-sans text-xs leading-relaxed text-on-surface-variant">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      <div className="flex flex-col">
        {col1.map((item) => (
          <FAQCard key={item.id} item={item} />
        ))}
      </div>
      <div className="flex flex-col">
        {col2.map((item) => (
          <FAQCard key={item.id} item={item} />
        ))}
      </div>
      <div className="flex flex-col">
        {col3.map((item) => (
          <FAQCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
