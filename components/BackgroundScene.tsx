'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import WarehouseDots, { warehouseDotsCamera, type ScrollState } from './demo/WarehouseDots';

/**
 * A single fixed, full-viewport 3D scene that sits behind the entire
 * page (z-index below all content). The hero section's photo/copy float
 * above it with a transparent backdrop so the dot field reads through;
 * further down the page, sections with a translucent white background
 * let the same field show through faintly as an ambient parallax layer,
 * while the solid blue-tinted sections simply cover it.
 */
export default function BackgroundScene() {
  const scrollRef = useRef<ScrollState>({ p: 0, extra: 0 });

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      // offsetHeight参照のため型引数が必要
      const hero = document.querySelector<HTMLElement>('.hero-scroll');
      const scrollY = window.scrollY || window.pageYOffset;
      const heroPx = hero ? hero.offsetHeight - window.innerHeight : 0;
      const p = heroPx > 0 ? Math.max(0, Math.min(1, scrollY / heroPx)) : 0;
      const extra = heroPx > 0 ? Math.max(0, scrollY - heroPx) : scrollY;
      scrollRef.current.p = p;
      scrollRef.current.extra = extra;
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
    <div className="bg-scene" aria-hidden="true">
      <Canvas camera={warehouseDotsCamera} dpr={[1, 1.6]}>
        <ambientLight intensity={0.6} />
        <WarehouseDots scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
