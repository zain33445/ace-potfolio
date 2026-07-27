'use client';

import dynamic from 'next/dynamic';

const ClarityAnalytics = dynamic(
  () => import('@/src/components/ClarityAnalytics'),
  { ssr: false },
);
const BotpressChat = dynamic(
  () => import('@/src/components/BotpressChat'),
  { ssr: false },
);

export default function ThirdPartyScripts() {
  return (
    <>
      {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
        <ClarityAnalytics projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID} />
      )}
      <BotpressChat />
    </>
  );
}
