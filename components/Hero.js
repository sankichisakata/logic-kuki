'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import WarehouseDots, { warehouseDotsCamera } from './demo/WarehouseDots';

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Hero occupies this many viewport-heights of scroll distance before it
// releases — long enough that the push-in + 3D reveal reads as a
// deliberate, slow move rather than a quick flourish. Shorter on mobile
// so the same beats don't demand an excessive amount of thumb-scrolling.
const HERO_VH_DESKTOP = 460;
const HERO_VH_MOBILE = 300;

export default function Hero() {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const bracketsRef = useRef(null);
  const copyRef = useRef(null);
  const cueRef = useRef(null);
  const scrollRef = useRef(0);
  const [heroVh, setHeroVh] = useState(HERO_VH_DESKTOP);

  useEffect(() => {
    let ticking = false;

    function applyHeroVh() {
      setHeroVh(window.innerWidth <= 760 ? HERO_VH_MOBILE : HERO_VH_DESKTOP);
    }

    function update() {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const top = section.offsetTop;
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? clamp((scrollY - top) / scrollable, 0, 1) : 0;
      scrollRef.current = p;

      const e = easeOutCubic(p);

      if (photoRef.current) {
        // The photo starts as a slightly pulled-back establishing shot
        // (a sliver of the 3D scene visible at the edges, corner brackets
        // framing it like a viewfinder finding the subject) and pushes
        // into a full-bleed close-up ("アップ") as the user scrolls —
        // ending the hero on the real building rather than the abstract
        // data underneath it.
        const scale = lerp(0.94, 1.62, e);
        const radius = lerp(14, 0, e);
        photoRef.current.style.transform = `scale(${scale})`;
        photoRef.current.style.borderRadius = `${radius}px`;
        photoRef.current.style.opacity = String(lerp(0.97, 1, e));
      }
      if (bracketsRef.current) {
        // Corner marks appear early while the shot is still wide (framing
        // the subject) and fade out as the camera pushes into the close-up.
        const bracketFade = clamp(p / 0.18, 0, 1) * (1 - clamp((p - 0.32) / 0.18, 0, 1));
        bracketsRef.current.style.opacity = String(bracketFade);
      }
      if (copyRef.current) {
        const fade = 1 - clamp(p / 0.18, 0, 1);
        copyRef.current.style.opacity = String(fade);
        copyRef.current.style.transform = `translateY(${-p * 60}px)`;
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - clamp(p / 0.05, 0, 1));
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      applyHeroVh();
      onScroll();
    }

    applyHeroVh();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll" style={{ height: `${heroVh}vh` }}>
      <div className="hero-sticky">
        <div className="hero-canvas">
          <Canvas camera={warehouseDotsCamera} dpr={[1, 2]}>
            <ambientLight intensity={0.6} />
            <WarehouseDots scrollRef={scrollRef} />
          </Canvas>
        </div>

        <div className="hero-photo-frame">
          <div ref={photoRef} className="hero-photo">
            <img src="/assets/processed/hero_aerial.webp" alt="久喜LOGIC 外観" />
          </div>
        </div>

        <div ref={bracketsRef} className="hero-brackets">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div ref={copyRef} className="hero-copy">
          <div className="hero-eyebrow">埼玉県久喜市 ／ 物流施設</div>
          <h1 className="hero-title">久喜LOGIC</h1>
          <p className="hero-sub">梁下5.5m、無柱の倉庫棟3,590坪。首都圏と東北をつなぐ新しい物流拠点が、久喜に竣工します。</p>
          <div className="hero-meta">
            <span><b>延床</b> 7,078.67㎡</span>
            <span><b>構造</b> S造 地上2階</span>
            <span><b>竣工前内覧会</b> 受付中</span>
          </div>
        </div>

        <div ref={cueRef} className="hero-scrollcue">
          <span>スクロール</span>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
