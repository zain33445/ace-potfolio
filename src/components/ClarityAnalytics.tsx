'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityAnalytics({ projectId }: { projectId: string }) {
  useEffect(() => {
    /* Defer Clarity init until the browser is idle to reduce main-thread work */
    const init = () => Clarity.init(projectId);
    if ('requestIdleCallback' in window) {
      requestIdleCallback(init, { timeout: 10000 });
    } else {
      setTimeout(init, 5000);
    }
  }, [projectId]);

  return null;
}
