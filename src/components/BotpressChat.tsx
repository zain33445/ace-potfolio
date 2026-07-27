'use client';

import { useEffect, useState } from 'react';

export default function BotpressChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/desk/webchat/v4.1/inject.js';
    injectScript.async = false;

    const configScript = document.createElement('script');
    configScript.src =
      'https://files.bpcontent.cloud/2026/07/27/18/20260727181229-5AG6OT30.js';
    configScript.async = false;

    document.body.appendChild(injectScript);
    document.body.appendChild(configScript);

    return () => {
      if (injectScript.parentNode) injectScript.parentNode.removeChild(injectScript);
      if (configScript.parentNode) configScript.parentNode.removeChild(configScript);
      document.querySelectorAll('[class*="botpress"], [id*="botpress"]').forEach((el) => el.remove());
    };
  }, [ready]);

  return null;
}
