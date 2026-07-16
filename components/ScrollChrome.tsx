'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

/**
 * 固定ナビ・スクロール進捗レール・トップに戻るボタン。
 * スクロール量に応じてナビの見た目と進捗を更新する。
 */
export default function ScrollChrome() {
  const navRef = useRef<HTMLElement | null>(null);
  const railFillRef = useRef<HTMLDivElement | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

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
      setShowTopBtn(scrollY > window.innerHeight * 0.8);
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

  /** ロゴ・トップに戻るボタン押下時にページ最上部へスムーズスクロールする。 */
  function scrollToTop(e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="rail">
        <div className="rail-fill" ref={railFillRef} />
        <div className="rail-label">スクロール</div>
      </div>
      <nav className="nav" ref={navRef}>
        <a className="nav-logo" href="#top" onClick={scrollToTop}>
          <span className="dot" />
          久喜LOGIC
        </a>
        <div className="nav-actions">
          {/* 内覧会資料PDFのダウンロード（セカンダリ）。PC/SPでラベルをCSS切替 */}
          <a
            className="nav-cta nav-cta--ghost"
            href="/docs/kuki-logic-viewing-guide.pdf"
            download
          >
            <span className="label-pc">内覧会資料ダウンロード</span>
            <span className="label-sp">資料DL</span>
          </a>
          {/* 申込CTA（主役）。PC/SPでラベルをCSS切替 */}
          <a className="nav-cta" href="#viewing">
            <span className="label-pc">内覧会に申し込む →</span>
            <span className="label-sp">申し込む</span>
          </a>
        </div>
      </nav>
      <button
        type="button"
        className={`back-to-top${showTopBtn ? ' is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="トップに戻る"
      >
        ↑
      </button>
    </>
  );
}
