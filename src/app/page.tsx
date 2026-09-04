import HomePage from './home-page';
// Server-rendered SEO content block. Kept in this server component (outside the
// client HomePage tree) so it renders as plain, visible, crawlable HTML with no
// client Suspense boundary. Sits above the footer.
import ServicesOverviewSection from '@/src/components/Home/sections/ServicesOverviewSection';
import { serviceSchema } from '@/src/lib/schema';

// Statically render + revalidate hourly so Cloudflare can cache the homepage
// (marketing content changes rarely) instead of serving it dynamically.
export const revalidate = 3600;

const HOME_TITLE = 'Construction and Estimation Services | The ACE Services';
const HOME_DESCRIPTION =
  'Get AACE Class 3 construction cost estimates and material takeoffs nationwide in 24-48 hours. Request your free quote today and start winning more bids.';

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
