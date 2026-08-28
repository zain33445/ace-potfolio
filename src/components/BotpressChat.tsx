'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BotpressChat() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const bgRef = useRef<'white' | 'transparent'>('transparent');
  const loadedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const styleRef = useRef<HTMLStyleElement | null>(null);

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

      const logo = fab.querySelector<HTMLElement>('img, svg');
      if (logo) {
        logo.style.setProperty('width', `3rem`, 'important');
        logo.style.setProperty('height', `3rem`, 'important');
        logo.style.setProperty('object-fit', `contain`, 'important');
        logo.style.setProperty('margin', `auto`, `important`);
      }
    }
  }

  /* Inject a stylesheet rule to enforce fab positioning
     as a baseline that cannot be easily overwritten by JS */
  function injectPositionStyles() {
    if (styleRef.current) return;
    const style = document.createElement('style');
    style.id = 'chatbit-position-styles';
    style.textContent = `
      #fab-root {
        position: fixed !important;
        transition: bottom 0.4s cubic-bezier(0.33, 1, 0.68, 1), right 0.4s cubic-bezier(0.33, 1, 0.68, 1) !important;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
  }

  /* Update the stylesheet content based on scroll */
  function updatePositionCSS(pastHero: boolean) {
    if (!styleRef.current) return;
    const bottom = pastHero ? '20px' : '100px';
    styleRef.current.textContent = `
      #fab-root {
        position: fixed !important;
        bottom: ${bottom} !important;
        right: 20px !important;
        transition: bottom 0.4s cubic-bezier(0.33, 1, 0.68, 1), right 0.4s cubic-bezier(0.33, 1, 0.68, 1) !important;
      }
    `;
  }

  /* Inject Botpress scripts — only after first user interaction */
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

  /* Inject position stylesheet on mount */
  useEffect(() => {
    injectPositionStyles();
    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, []);

  /* Continuously enforce chatbit position via rAF loop + setInterval fallback */
  useEffect(() => {
    if (!isHome) {
      /* Not on home page — set normal position */
      const fabRoot = document.getElementById('fab-root');
      if (fabRoot) {
        fabRoot.style.setProperty('position', 'fixed', 'important');
        fabRoot.style.setProperty('bottom', '20px', 'important');
        fabRoot.style.setProperty('right', '20px', 'important');
      }
      updatePositionCSS(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;

    function setPosition() {
      const fabRoot = document.getElementById('fab-root');
      if (!fabRoot) return;

      const pastHero = window.scrollY > window.innerHeight * 0.6;

      fabRoot.style.setProperty('position', 'fixed', 'important');
      fabRoot.style.setProperty('transition', 'bottom 0.4s cubic-bezier(0.33, 1, 0.68, 1), right 0.4s cubic-bezier(0.33, 1, 0.68, 1)', 'important');

      if (pastHero) {
        fabRoot.style.setProperty('bottom', '20px', 'important');
        fabRoot.style.setProperty('right', '20px', 'important');
      } else {
        fabRoot.style.setProperty('bottom', '100px', 'important');
        fabRoot.style.setProperty('right', '20px', 'important');
      }

      updatePositionCSS(pastHero);
    }

    function loop() {
      const fabRoot = document.getElementById('fab-root');
      if (!fabRoot) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      setPosition();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    intervalId = setInterval(setPosition, 100);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearInterval(intervalId);
    };
  }, [isHome]);

  /* Watch for the Botpress shadow root to appear */
  useEffect(() => {
    if (!isHome) return;

    let interval: ReturnType<typeof setInterval>;

    function onShadowReady() {
      const host = document.getElementById('fab-root');
      if (host?.shadowRoot) {
        clearInterval(interval);
        applyFabBg(bgRef.current);
        const mo = new MutationObserver(() => applyFabBg(bgRef.current));
        mo.observe(host.shadowRoot, { childList: true, subtree: true });
        return true;
      }
      return false;
    }

    interval = setInterval(onShadowReady, 500);
    return () => clearInterval(interval);
  }, [isHome]);

  /* Observe document.body for when #fab-root is injected */
  useEffect(() => {
    if (!isHome) return;

    const observer = new MutationObserver(() => {
      /* #fab-root detected — position enforcement loop handles the rest */
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isHome]);

  return null;
}