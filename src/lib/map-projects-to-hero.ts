/**
 * Maps SampleProject (from WordPress /projects data) to HeroParallaxProduct
 * (the card format used by the HeroParallax component).
 */

import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';
import type { SampleProject } from '@/src/services/wordpress/content';

/**
 * Convert a WordPress SampleProject into a HeroParallaxProduct card.
 *
 * - The project's imageUrl becomes the parallax card thumbnail.
 * - The project's category becomes the subtitle badge.
 * - Links to /projects (the portfolio index page).
 */
export function sampleToHeroCard(project: SampleProject): HeroParallaxProduct {
  return {
    title: project.title,
    subtitle: project.category,
    link: '/projects',
    thumbnail: project.imageUrl,
  };
}

/**
 * Convert an array of SampleProjects into HeroParallaxProduct cards.
 *
 * If the array is empty, returns null so the caller can fall back to
 * its default hardcoded data.
 */
export function samplesToHeroCards(
  projects: SampleProject[],
): HeroParallaxProduct[] | null {
  if (!projects || projects.length === 0) return null;
  return projects.map(sampleToHeroCard);
}
