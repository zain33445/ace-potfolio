'use client';

import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import ContactRequest from '@/src/components/ContactRequest';
import Reveal from '@/src/components/Reveal';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: '16319 Hillside Garden LN\nHouston, TX 77084',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1-281-899-0250',
    href: 'tel:+12818990250',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@theaceservices.com',
    href: 'mailto:info@theaceservices.com',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon – Fri: 9:00 AM – 6:00 PM\nSat: By Appointment',
  },
];

export default function ContactPageClient() {
  return (
    <section className="min-h-screen bg-background pt-20">
      {/* ── Breadcrumb ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] pt-8 pb-4">
        <nav className="font-mono text-xs text-on-surface-variant tracking-wider">
          <span className="hover:text-primary cursor-pointer transition-colors">HOME</span>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-primary font-bold">CONTACT</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] py-10 md:py-20">
        <Reveal type="fadeUp">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-sm text-primary font-bold tracking-wider">[GET_IN_TOUCH]</span>
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Let&apos;s Build Something Great Together
            </h1>
            <p className="font-sans text-base md:text-lg text-[#374151] leading-relaxed">
              Have a project in mind? Need a precise estimate? Reach out to us and
              we&apos;ll get back to you within 24 hours with a detailed response.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ── Contact Form ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] pb-12 md:pb-16">
        <Reveal type="fadeUp">
          <div className="border border-[#E5E7EB] bg-white bracket-corners overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12 border-b border-[#E5E7EB]">
              <span className="font-mono text-sm text-[#FF6B00] font-bold tracking-wider">[SUBMIT_REQUEST]</span>
              <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] mt-2">
                Send Us Your Project Details
              </h2>
              <p className="font-sans text-sm text-[#6B7280] mt-2">
                Fill out the form below and we&apos;ll prepare a detailed estimate for you.
              </p>
            </div>
            <ContactRequest />
          </div>
        </Reveal>
      </div>

      {/* ── Quick CTA ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] pb-12 md:pb-16">
        <Reveal type="fadeUp">
          <div className="p-6 md:p-8 lg:p-12 border border-[#E5E7EB] bg-[#F9FAFB] bracket-corners flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h2 className="font-sans text-lg md:text-xl font-bold text-[#111827] mb-1">
                Need a quick estimate?
              </h2>
              <p className="font-sans text-sm text-[#6B7280]">
                Use our instant estimator for residential, commercial, and industrial projects.
              </p>
            </div>
            <a
              href="/calculator"
              className="inline-flex items-center gap-2 bg-[#FF6B00] text-white font-bold px-6 md:px-8 py-3 rounded-lg text-sm md:text-base hover:bg-[#FF6B00]/90 transition-colors shrink-0"
            >
              Try Calculator <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* ── Contact Info Cards ── */}
      <div className="px-5 md:px-10 lg:px-[12.5%] pb-20 md:pb-24">
        <Reveal type="fadeUp">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              const Content = (
                <div className="p-5 md:p-6 border border-[#E5E7EB] bg-white bracket-corners h-full space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#6B7280] tracking-wider uppercase mb-1">
                      {item.label}
                    </p>
                    <p className="font-sans text-sm font-semibold text-[#111827] whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </div>
              );

              return item.href ? (
                <a key={item.label} href={item.href} className="block hover:shadow-md transition-shadow">
                  {Content}
                </a>
              ) : (
                <div key={item.label}>{Content}</div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
