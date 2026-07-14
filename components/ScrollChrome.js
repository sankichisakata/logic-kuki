'use client';

import { useEffect, useRef } from 'react';

export default function ScrollChrome() {
  const navRef = useRef(null);
  const railFillRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset;
      if (navRef.current) {
        navRef.current.classList.toggle('is-scrolled', scrollY > 40);
      }
      if (railFillRef.current) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.max(0, Math.min(1, scrollY / docHeight)) : 0;
        railFillRef.current.style.height = `${progress * 100}%`;
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div className="rail">
        <div className="rail-fill" ref={railFillRef} />
        <div className="rail-label">スクロール</div>
      </div>
      <nav className="nav" ref={navRef}>
        <div className="nav-logo">
          <span className="dot" />
          久喜LOGIC
        </div>
        <a className="nav-cta" href="#viewing">
          内覧会に申し込む →
        </a>
      </nav>
    </>
  );
}
