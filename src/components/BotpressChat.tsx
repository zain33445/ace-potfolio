'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BotpressChat() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const bgRef = useRef<'white' | 'transparent'>('transparent');
  const loadedRef = useRef(false);

  /* Apply background directly to the fab button inside Botpress's shadow root */
  function applyFabBg(color: 'white' | 'transparent') {
    const host = document.getElementById('fab-root');
    const fab = host?.shadowRoot?.querySelector<HTMLElement>('.bpFab');
    if (fab) {
      fab.style.setProperty('background', color, 'important');
      fab.style.setProperty('box-shadow', `0 0 0 0`, 'important');
      fab.style.setProperty('padding', `1px`, 'important');
      fab.style.setProperty('height', `4rem`, 'important');
      fab.style.setProperty('width', `4rem`, 'important');
      fab.style.setProperty('border', `1px solid #FF6B00`, 'important');
      fab.style.setProperty('display', `flex`, 'important');
      fab.style.setProperty('align-items', `center`, 'important');
      fab.style.setProperty('justify-content', `center`, `important`);

      /* Shrink the logo image inside the fab so it fits the smaller button */
      const logo = fab.querySelector<HTMLElement>('img, svg');
      if (logo) {
        logo.style.setProperty('width', `3rem`, 'important');
        logo.style.setProperty('height', `3rem`, 'important');
        logo.style.setProperty('object-fit', `contain`, 'important');
        logo.style.setProperty('margin', `auto`, `important`);
      }
    }
  }

  /* Inject Botpress scripts — only after first user interaction to avoid
     blocking bfcache (WebSocket) and reducing main-thread work on load */
  useEffect(() => {
    function injectBotpress() {
      if (loadedRef.current) return;
      loadedRef.current = true;

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
    }

    /* Load on first user interaction (click, touch, or scroll past 50% of viewport) */
    function onInteraction() {
      injectBotpress();
      window.removeEventListener('click', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('scroll', onScroll);
    }

    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.5) {
        injectBotpress();
        window.removeEventListener('click', onInteraction);
        window.removeEventListener('touchstart', onInteraction);
        window.removeEventListener('scroll', onScroll);
      }
    }

    window.addEventListener('click', onInteraction, { once: true });
    window.addEventListener('touchstart', onInteraction, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('click', onInteraction);
      window.removeEventListener('touchstart', onInteraction);
      window.removeEventListener('scroll', onScroll);
      document
        .querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]')
        .forEach((el) => el.remove());
      document.getElementById('fab-root')?.remove();
      document.getElementById('webchat-root')?.remove();
      document.getElementById('message-preview-root')?.remove();
    };
  }, []);

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
    /* Retry until the shadow root appears (poll every 2s to reduce main-thread work) */
    interval = setInterval(() => {
      if (waitForShadow()) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
