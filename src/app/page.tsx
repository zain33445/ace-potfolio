import HomePage from './home-page';
import { getSamples } from '@/src/services/wordpress/content';
import { samplesToHeroCards } from '@/src/lib/map-projects-to-hero';

export const metadata = {
  title: 'Construction Estimating Services | Cost Estimation & Material Takeoffs — ACE Services',
  description:
    'ACE Services delivers professional construction estimating services including AACE Class 3 cost estimates, material takeoffs, and permit sets for general contractors across 35 US states. Get accurate bids in 24-48 hours.',
};

export default async function Page() {
  /* ── Fetch real projects from CMS for the hero parallax ── */
  const samples = await getSamples();
  const heroProducts = samplesToHeroCards(samples);

  return <HomePage products={heroProducts ?? undefined} />;
}
