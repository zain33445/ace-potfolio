'use client';

import { TextRepel } from '@/src/components/ui/text-repel';

export default function Footer() {
  const handleClick = (id: string) => {
    window.location.hash = id;
  };

  const navItems = [
    { label: 'SOLUTIONS', id: 'solutions' },
    { label: 'PROJECTS', id: 'projects' },
    { label: 'PROCESS', id: 'process' },
    { label: 'ABOUT', id: 'about' },
  ];

  const standards = ['CSI MASTERFORMAT', 'AACE CLASS 3 INDEX', 'ISO 9001 METRICS'];

  const communication = [
    'est-control@ace-services.io',
    '+1 (800) 555-QS77',
    'Dallas Head Office',
  ];

  return (
    <footer className="bg-surface relative border-t border-blueprint-line bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]">
      <div className="w-full mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          {/* Left: Brand + tagline */}
          <div className="lg:col-span-5 space-y-6">
            <TextRepel
              text="ACE SERVICES"
              className="font-space text-4xl font-extrabold tracking-tighter text-on-background"
              radius={100}
              strength={50}
              mode="repel"
            />
            <TextRepel
              text="Parametric estimating precision for general builders, civil engineers, and trade specialists nationwide. Eliminating manual error thresholds."
              className="font-sans text-lg text-on-surface-variant max-w-sm leading-relaxed font-semibold"
              radius={80}
              strength={50}
              mode="repel"
            />
            <TextRepel
              text="[EST_SYS_CORE_V.2.5.0_ACTIVE]"
              className="font-mono text-xs text-primary uppercase tracking-widest font-bold"
              radius={60}
              strength={35}
              mode="repel"
            />
          </div>

          {/* Right: 3-column grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <TextRepel
                text="[NAVIGATION]"
                className="font-mono text-sm text-primary tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {navItems.map((item) => (
                <TextRepel
                  key={item.id}
                  text={item.label}
                  className="text-left font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors link-underline w-fit cursor-pointer"
                  radius={60}
                  strength={35}
                  mode="repel"
                  onClick={() => handleClick(item.id)}
                />
              ))}
            </div>

            {/* Standards */}
            <div className="flex flex-col gap-4">
              <TextRepel
                text="[STANDARDS]"
                className="font-mono text-sm text-primary tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {standards.map((item) => (
                <TextRepel
                  key={item}
                  text={item}
                  className="font-sans text-sm text-on-surface-variant font-semibold"
                  radius={60}
                  strength={35}
                  mode="repel"
                />
              ))}
            </div>

            {/* Communication */}
            <div className="flex flex-col gap-4">
              <TextRepel
                text="[COMMUNICATION]"
                className="font-mono text-sm text-primary tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {communication.map((item) => (
                <TextRepel
                  key={item}
                  text={item}
                  className="font-sans text-sm text-on-surface-variant font-semibold"
                  radius={60}
                  strength={35}
                  mode="repel"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-blueprint-line flex flex-col md:flex-row justify-between items-center gap-4">
          <TextRepel
            text="©2026 ACE SERVICES. ALL CODES SECURED."
            className="font-mono text-sm text-on-surface-variant font-bold"
            radius={80}
            strength={35}
            mode="repel"
          />
          <TextRepel
            text="LAT: 32.7767° N | LONG: 96.7970° W | BLUEPRINT RECT_X_COORD"
            className="font-mono text-xs text-on-surface-variant opacity-60"
            radius={80}
            strength={35}
            mode="repel"
          />
        </div>
      </div>
    </footer>
  );
}
