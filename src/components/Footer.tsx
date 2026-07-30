'use client';

import { useRouter } from 'next/navigation';
import { TextRepel } from '@/src/components/ui/text-repel';
// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ
// Font used - https://compressa.preusstype.com/
  
import TextPressure from '@/src/components/ui/TextPressure';

// Note:
// Make sure the font you're using supports all the variable properties. 
// React Bits does not take responsibility for the fonts used


export default function Footer() {
  const router = useRouter();

  const navItems = [
    { label: 'BLOGS', href: '/blog' },
    { label: 'SERVICES', href: '/services' },
    { label: 'PRICING', href: '/pricing' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
    { label: 'CALCULATOR', href: '/calculator' },
  ];

  const standards = ['CSI MASTERFORMAT', 'AACE CLASS 3 INDEX', 'ISO 9001 METRICS'];

  const communication = [
    'est-control@ace-services.io',
    '+1 (800) 555-QS77',
    'Dallas Head Office',
  ];

  return (
    <footer className="bg-primary relative border-t border-white/10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]">
      <div className="w-full mx-auto md:px-5 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16 align-center justify-items-center">
          {/* Left: Brand + tagline */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            <br />
            <br />
            <TextRepel
              text="Parametric estimating precision for general builders, civil engineers, and trade specialists nationwide. Eliminating manual error thresholds."
              className="font-sans text-lg text-white/80 max-w-sm leading-relaxed font-semibold"
              radius={80}
              strength={50}
              mode="repel"
            /><br/>
            <TextRepel
              text="[EST_SYS_CORE_V.2.5.0_ACTIVE]"
              className="font-mono text-xs text-white/60 m-auto text-center uppercase tracking-widest font-bold"
              radius={60}
              strength={35}
              mode="repel"
            />
          </div>

          {/* Right: 3-column grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {/* Navigation */}
            <div className="flex flex-col gap-4">
              <TextRepel
                text="[NAVIGATION]"
                className="font-mono text-sm text-center text-white tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {navItems.map((item) => (
                <TextRepel
                  key={item.href}
                  text={item.label}
                  className="text-left font-sans text-sm font-semibold text-white/70 hover:text-white transition-colors link-underline w-fit cursor-pointer"
                  radius={60}
                  strength={35}
                  mode="repel"
                  onClick={() => router.push(item.href)}
                />
              ))}
            </div>

            {/* Standards */}
            <div className="flex flex-col gap-4">
              <TextRepel
                text="[STANDARDS]"
                className="font-mono text-sm text-white tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {standards.map((item) => (
                <TextRepel
                  key={item}
                  text={item}
                  className="font-sans text-sm text-white/70 font-semibold"
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
                className="font-mono text-sm text-white tracking-wider font-bold"
                radius={60}
                strength={35}
                mode="repel"
              />
              {communication.map((item) => (
                <TextRepel
                  key={item}
                  text={item}
                  className="font-sans text-sm text-white/70 font-semibold cursor-pointer"
                  radius={60}
                  strength={35}
                  mode="repel"
                />
              ))}
            </div>
          </div>
        </div>

<div style={{position: 'relative', height: '300px'}}>
  <TextPressure
    text="THE ACE SERVICES"
    flex
    alpha={false}
    stroke={false}
    width
    weight
    italic={false}
    textColor="#FFFFFF"
    strokeColor="#5227FF"
    minFontSize={36}
  />
</div>
        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <TextRepel
              text="©2026 ACE SERVICES. ALL CODES SECURED."
              className="font-mono text-sm text-white/70 font-bold"
              radius={80}
              strength={35}
              mode="repel"
            />
            <span className="hidden md:inline text-white/30">|</span>
            <a
              href="/privacy-policy"
              className="font-mono text-sm text-white/70 hover:text-white transition-colors"
            >
              PRIVACY POLICY
            </a>
            <span className="hidden md:inline text-white/30">|</span>
            <a
              href="/terms-and-conditions"
              className="font-mono text-sm text-white/70 hover:text-white transition-colors"
            >
              TERMS &amp; CONDITIONS
            </a>
          </div>
          <TextRepel
            text="LAT: 32.7767° N | LONG: 96.7970° W | BLUEPRINT RECT_X_COORD"
            className="font-mono text-xs text-white/40"
            radius={80}
            strength={35}
            mode="repel"
          />
        </div>
      </div>


    </footer>
  );
}
