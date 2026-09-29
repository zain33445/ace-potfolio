'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* Page-level rules for the Botpress hosts. Max z-index so the chat sits above
   the nav, menus and overlays; `bp-hide-fab` is toggled on <html> while the
   homepage hero is on screen. */
const PAGE_CSS = `
  #fab-root {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    z-index: 2147483647 !important;
    transition: opacity .3s ease, visibility .3s ease !important;
  }
  #webchat-root, #message-preview-root { z-index: 2147483647 !important; }
  html.bp-hide-fab #fab-root,
  html.bp-hide-fab #message-preview-root {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

/* Styles injected into the fab's shadow root — survive Botpress re-rendering
   the button, unlike inline styles on a single element. */
const FAB_CSS = `
  .bpFab {
    background: #fff !important;
    box-shadow: 0 8px 24px -8px rgba(0,0,0,.25) !important;
    border: 1px solid #FF6B00 !important;
    padding: 1px !important;
    width: 4rem !important;
    height: 4rem !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .bpFab img, .bpFab svg {
    width: 3rem !important;
    height: 3rem !important;
    object-fit: contain !important;
    margin: auto !important;
  }
`;

export default function BotpressChat() {
  const isHome = usePathname() === '/';

  /* Inject Botpress scripts — only after first user interaction */
  useEffect(() => {
    let loaded = false;
    function injectBotpress() {
      if (loaded) return;
      loaded = true;
      cleanupListeners();

      const injectScript = document.createElement('script');
      injectScript.src = 'https://cdn.botpress.cloud/desk/webchat/v4.1/inject.js';
      injectScript.async = false;

      const configScript = document.createElement('script');
      configScript.src =
        'https://files.bpcontent.cloud/2026/07/27/18/20260727181229-5AG6OT30.js';
      configScript.async = false;

      document.body.appendChild(injectScript);
      document.body.appendChild(configScript);
    }

    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.5) injectBotpress();
    }
    function cleanupListeners() {
      window.removeEventListener('click', injectBotpress);
      window.removeEventListener('touchstart', injectBotpress);
      window.removeEventListener('scroll', onScroll);
    }

    window.addEventListener('click', injectBotpress, { once: true });
    window.addEventListener('touchstart', injectBotpress, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cleanupListeners();
      document
        .querySelectorAll('script[src*="botpress"], script[src*="bpcontent"]')
        .forEach((el) => el.remove());
      document.getElementById('fab-root')?.remove();
      document.getElementById('webchat-root')?.remove();
      document.getElementById('message-preview-root')?.remove();
    };
  }, []);

  /* Page stylesheet + white fab styling, on every page */
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'chatbot-page-styles';
    style.textContent = PAGE_CSS;
    document.head.appendChild(style);

    /* Botpress attaches its shadow root after the script loads — poll until then. */
    const interval = setInterval(() => {
      const shadow = document.getElementById('fab-root')?.shadowRoot;
      if (!shadow) return;
      clearInterval(interval);
      if (!shadow.getElementById('ace-fab-styles')) {
        const fabStyle = document.createElement('style');
        fabStyle.id = 'ace-fab-styles';
        fabStyle.textContent = FAB_CSS;
        shadow.appendChild(fabStyle);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      style.remove();
    };
  }, []);

  /* Hide the fab while the homepage hero is visible. The hero is dynamically
     imported, so retry until #hero-top mounts (same approach as Nav). */
  useEffect(() => {
    const root = document.documentElement;
    if (!isHome) {
      root.classList.remove('bp-hide-fab');
      return;
    }

    root.classList.add('bp-hide-fab');
    let observer: IntersectionObserver | null = null;
    let raf = 0;
    const observe = () => {
      const hero = document.getElementById('hero-top');
      if (!hero) {
        raf = requestAnimationFrame(observe);
        return;
      }
      observer = new IntersectionObserver(([entry]) =>
        root.classList.toggle('bp-hide-fab', entry.isIntersecting),
      );
      observer.observe(hero);
    };
    observe();

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      root.classList.remove('bp-hide-fab');
    };
  }, [isHome]);

  return null;
}
