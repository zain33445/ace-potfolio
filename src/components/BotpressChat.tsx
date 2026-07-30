'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function BotpressChat() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  /* Track scroll to detect when we're past the hero section */
  useEffect(() => {
    function onScroll() {
      const pastHero = !isHome || window.scrollY > window.innerHeight * 0.6;
      document.documentElement.setAttribute(
        'data-botpress-bg',
        pastHero ? 'white' : 'transparent',
      );
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* Inject Botpress scripts after a short delay + custom styles */
  useEffect(() => {
    const readyTimeout = setTimeout(() => {
      /* Inject CSS for the botpress floating button */
      const style = document.createElement('style');
      style.id = 'botpress-custom-style';
      style.textContent = `
        [data-botpress-bg="white"] .bpw-floating-button,
        [data-botpress-bg="white"] [class*="bpw-floating"] {
          background: white !important;
        }
      `;
      document.head.appendChild(style);

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
      const style = document.getElementById('botpress-custom-style');
      if (style) style.remove();
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
