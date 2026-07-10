import HomePage from './home-page';
import { getSamples } from '@/src/services/wordpress/content';
import { samplesToHeroCards } from '@/src/lib/map-projects-to-hero';

export const metadata = {
  title: 'ACE SERVICES — Pre-Construction Estimation',
  description:
    'Precision construction estimation and rapid quantity surveying platform. AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling.',
};

export default async function Page() {
  /* ── Fetch real projects from CMS for the hero parallax ── */
  const samples = await getSamples();
  const heroProducts = samplesToHeroCards(samples);

  return <HomePage products={heroProducts ?? undefined} />;
}
