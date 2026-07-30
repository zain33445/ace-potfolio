'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BotpressChat() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const bgRef = useRef<'white' | 'transparent'>('transparent');

  /* Apply background to any existing or future botpress button elements */
  function applyBg(color: 'white' | 'transparent') {
    bgRef.current = color;
    document
      .querySelectorAll<HTMLElement>(
        '[class*="bpw-floating"], [class*="bpw-widget-btn"], [class*="botpress-chat"], [id*="botpress-webchat"]',
      )
      .forEach((el) => {
        el.style.setProperty('background', color, 'important');
        el.style.setProperty('background-color', color, 'important');
      });
  }

  /* Track scroll to detect when past hero section */
  useEffect(() => {
    function onScroll() {
      const pastHero = !isHome || window.scrollY > window.innerHeight * 0.6;
      applyBg(pastHero ? 'white' : 'transparent');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* Watch for Botpress elements being injected into the DOM */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      applyBg(bgRef.current);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
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

      /* Re-apply background after botpress has had time to render */
      setTimeout(() => applyBg(bgRef.current), 2000);
    }, 4000);

    return () => {
      clearTimeout(readyTimeout);
      document
        .querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]')
        .forEach((el) => el.remove());
      document
        .querySelectorAll('[class*="botpress"], [id*="botpress"], [class*="bpw-"]')
        .forEach((el) => el.remove());
    };
  }, []);

  return null;
}
