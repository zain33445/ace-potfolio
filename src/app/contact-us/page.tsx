import type { Metadata } from 'next';
import ContactPageClient from '@/src/components/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with The ACE Services for pre-construction estimation, material takeoffs, and cost estimation services. We respond within 24 hours.',
  alternates: {
    canonical: 'https://theaceservices.com/contact-us',
  },
  openGraph: {
  title: 'Contact Us',
    description:
      'Get in touch with The ACE Services for pre-construction estimation, material takeoffs, and cost estimation services.',
    url: 'https://theaceservices.com/contact-us',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
