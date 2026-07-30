'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BotpressChat() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const bgRef = useRef<'white' | 'transparent'>('transparent');

  /* Apply background directly to the fab button inside Botpress's shadow root */
  function applyFabBg(color: 'white' | 'transparent') {
    const host = document.getElementById('fab-root');
    const fab = host?.shadowRoot?.querySelector<HTMLElement>('.bpFab');
    if (fab) {
      fab.style.setProperty('background', color, 'important');
    }
  }

  /* Track scroll to detect when past hero section */
  useEffect(() => {
    function onScroll() {
      const pastHero = !isHome || window.scrollY > window.innerHeight * 0.6;
      const color = pastHero ? 'white' : 'transparent';
      bgRef.current = color;
      applyFabBg(color);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* Watch for the Botpress shadow root to appear, then apply fab background */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const waitForShadow = () => {
      const host = document.getElementById('fab-root');
      if (host?.shadowRoot) {
        clearInterval(interval);
        applyFabBg(bgRef.current);
        /* also observe the shadow root for any re-renders */
        const mo = new MutationObserver(() => applyFabBg(bgRef.current));
        mo.observe(host.shadowRoot, { childList: true, subtree: true });
        return true;
      }
      return false;
    };
    /* Retry until the shadow root appears */
    interval = setInterval(() => {
      if (waitForShadow()) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  /* Inject Botpress scripts after a short delay */
  useEffect(() => {
    const readyTimeout = setTimeout(() => {
      const injectScript = document.createElement('script');
      injectScript.src =
        'https://cdn.botpress.cloud/desk/webchat/v4.1/inject.js';
      injectScript.async = false;

      const configScript = document.createElement('script');
      configScript.src =
        'https://files.bpcontent.cloud/2026/07/27/18/20260727181229-5AG6OT30.js';
      configScript.async = false;

      document.body.appendChild(injectScript);
      document.body.appendChild(configScript);
    }, 4000);

    return () => {
      clearTimeout(readyTimeout);
      document
        .querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]')
        .forEach((el) => el.remove());
      document.getElementById('fab-root')?.remove();
      document.getElementById('webchat-root')?.remove();
      document.getElementById('message-preview-root')?.remove();
    };
  }, []);

  return null;
}
