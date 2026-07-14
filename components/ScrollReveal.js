'use client';

import { useEffect } from 'react';

/**
 * Observes every [data-reveal] element on the page and adds
 * .is-revealed the first time it scrolls into view. One-shot (elements
 * don't hide again on scroll-up) so re-reading a section isn't
 * interrupted by a re-play of the animation.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll('[data-reveal]'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
