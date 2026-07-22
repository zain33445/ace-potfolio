import HomePage from './home-page';
import { getSamples } from '@/src/services/wordpress/content';
import { samplesToHeroCards } from '@/src/lib/map-projects-to-hero';

export const metadata = {
  title: 'The ACE Services — Top Construction and Estimation Company',
  description:
    'The ACE Services is a top construction and estimation company delivering AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide.',
};

export default async function Page() {
  /* ── Fetch real projects from CMS for the hero parallax ── */
  const samples = await getSamples();
  const heroProducts = samplesToHeroCards(samples);

  return <HomePage products={heroProducts ?? undefined} />;
}
