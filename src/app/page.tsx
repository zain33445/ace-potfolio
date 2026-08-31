import HomePage from './home-page';
// Server-rendered SEO content block. Kept in this server component (outside the
// client HomePage tree) so it renders as plain, visible, crawlable HTML with no
// client Suspense boundary. Sits above the footer.
import ServicesOverviewSection from '@/src/components/Home/sections/ServicesOverviewSection';
import { serviceSchema } from '@/src/lib/schema';

// Statically render + revalidate hourly so Cloudflare can cache the homepage
// (marketing content changes rarely) instead of serving it dynamically.
export const revalidate = 3600;

const HOME_TITLE = 'Construction Estimating, Shop Drawings & 3D Rendering | The ACE Services';
const HOME_DESCRIPTION =
  'Construction estimating services, material takeoffs, MEP shop drawings, 3D architectural renderings, and stamped permit sets for general contractors nationwide.';

export const metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  openGraph: { title: HOME_TITLE, description: HOME_DESCRIPTION },
  twitter: { title: HOME_TITLE, description: HOME_DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...serviceSchema }) }}
      />
      <HomePage />
      <ServicesOverviewSection />
    </>
  );
}
