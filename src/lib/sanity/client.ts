import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

export const sanityClient = createClient(config);

/**
 * Server-side client with write access.
 * Only use for migration scripts and API routes — never expose the token.
 */
export const sanityWriteClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder(config);

export function urlForImage(source: any) {
  return builder.image(source);
}
