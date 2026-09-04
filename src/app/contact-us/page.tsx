import type { Metadata } from 'next';
import ContactPageClient from '@/src/components/ContactPageClient';

export const metadata: Metadata = {
  title: { absolute: 'Contact The ACE Services | Get a Free Estimate Quote' },
  description:
    'Ready to bid smarter? Submit your blueprints and get a free construction estimate quote back in 24-48 hours. Contact our team and get started today.',
  alternates: {
    canonical: 'https://theaceservices.com/contact-us/',
  },
  openGraph: {
    title: 'Contact The ACE Services | Get a Free Estimate Quote',
    description:
      'Ready to bid smarter? Submit your blueprints and get a free construction estimate quote back in 24-48 hours. Contact our team and get started today.',
    url: 'https://theaceservices.com/contact-us/',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
