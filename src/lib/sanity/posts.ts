import { sanityClient } from './client';

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: any[];
  bodyHtml?: string;
  publishedAt?: string;
  category?: { title: string };
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const POST_PROJECTION = `
  _id,
  title,
  slug,
  excerpt,
  body,
  bodyHtml,
  publishedAt,
  "category": category->{title},
  "imageUrl": coalesce(featuredImage.asset->url, featuredImage->url),
  seoTitle,
  seoDescription
`;

export async function getBlogPosts(
  page: number = 1,
  limit: number = 10,
): Promise<SanityPost[]> {
  const start = (page - 1) * limit;
  return sanityClient.fetch<SanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc)[${start}...${start + limit}] { ${POST_PROJECTION} }`,
  );
}

export async function getBlogPost(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch<SanityPost | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${POST_PROJECTION} }`,
    { slug },
  );
}

export async function getTotalPostCount(): Promise<number> {
  return sanityClient.fetch<number>(`count(*[_type == "post"])`);
}
