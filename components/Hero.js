'use client';

import { useEffect, useRef, useState } from 'react';

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function rangeProgress(v, start, end) {
  if (end === start) return v >= end ? 1 : 0;
  return clamp((v - start) / (end - start), 0, 1);
}
function fadeWindow(p, inStart, inEnd, outStart, outEnd) {
  const fadeIn = rangeProgress(p, inStart, inEnd);
  const fadeOut = 1 - rangeProgress(p, outStart, outEnd);
  return Math.min(fadeIn, fadeOut);
}

// Hero occupies this many viewport-heights of scroll distance before it
// releases — long enough for three copy beats plus the photo's push-in
// to read as a deliberate, slow move. Shorter on mobile so the same
// beats don't demand an excessive amount of thumb-scrolling.
const HERO_VH_DESKTOP = 460;
const HERO_VH_MOBILE = 320;

// Scroll progress (0..1) at which each new copy beat has just finished
// fading in (matches the fadeWindow inEnd values below) — pausing right
// there holds the fully-visible text still for a beat instead of letting
// the user blow past it mid-fade.
const PAUSE_POINTS = [0.42, 0.76];
const PAUSE_MS = 550;

export default function Hero() {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const bracketsRef = useRef(null);
  const copy1Ref = useRef(null);
  const copy2Ref = useRef(null);
  const copy3Ref = useRef(null);
  const cueRef = useRef(null);
  const [heroVh, setHeroVh] = useState(HERO_VH_DESKTOP);
  const pauseRef = useRef({ locked: false, lastP: 0, triggered: PAUSE_POINTS.map(() => false), timer: null });

  useEffect(() => {
    let ticking = false;

    function applyHeroVh() {
      setHeroVh(window.innerWidth <= 760 ? HERO_VH_MOBILE : HERO_VH_DESKTOP);
    }

    function lockScrollAt(targetY) {
      const state = pauseRef.current;
      state.locked = true;
      window.scrollTo({ top: targetY, behavior: 'auto' });
      // preventDefault on wheel/touchmove alone is unreliable once Chrome
      // has already committed a gesture to the compositor's fast scroll
      // path — toggling overflow-y on the root element forces the page to
      // genuinely stop, regardless of input device or gesture timing.
      document.documentElement.style.overflowY = 'hidden';
      clearTimeout(state.timer);
      state.timer = setTimeout(() => {
        state.locked = false;
        document.documentElement.style.overflowY = '';
      }, PAUSE_MS);
    }

    function update() {
      ticking = false;
      const section = sectionRef.current;
      if (!section) return;
      const scrollY = window.scrollY || window.pageYOffset;
      const top = section.offsetTop;
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? clamp((scrollY - top) / scrollable, 0, 1) : 0;

      if (scrollable > 0) {
        const state = pauseRef.current;
        // Only arm the pause for continuous, small-step scrolling (wheel/
        // touch). A big jump in one frame means this is a programmatic
        // scroll (back-to-top, an anchor link, initial hash) — those
        // should land where requested, not get caught by a pause point.
        const deltaP = Math.abs(p - state.lastP);
        PAUSE_POINTS.forEach((pt, idx) => {
          const crossed = (state.lastP < pt && p >= pt) || (state.lastP > pt && p <= pt);
          if (!state.locked && !state.triggered[idx] && crossed && deltaP < 0.15) {
            state.triggered[idx] = true;
            lockScrollAt(top + pt * scrollable);
          }
          if (Math.abs(p - pt) > 0.08) {
            state.triggered[idx] = false;
          }
        });
        state.lastP = p;
      }

      const e = easeOutCubic(p);

      if (photoRef.current) {
        // The photo starts as a slightly pulled-back establishing shot
        // and pushes gently toward a close-up ("アップ") as the user
        // scrolls — but the source photo is a modest 1090x614, so the
        // zoom is kept mild to avoid the upscale turning visibly soft.
        const scale = lerp(0.94, 1.2, e);
        const radius = lerp(14, 0, e);
        photoRef.current.style.transform = `scale(${scale})`;
        photoRef.current.style.borderRadius = `${radius}px`;
      }
      if (bracketsRef.current) {
        // Corner marks appear early while the shot is still wide (framing
        // the subject) and fade out as the camera eases toward the close-up.
        const bracketFade = clamp(p / 0.18, 0, 1) * (1 - clamp((p - 0.32) / 0.18, 0, 1));
        bracketsRef.current.style.opacity = String(bracketFade);
      }

      // Three copy beats crossfade in sequence as the photo journeys from
      // wide shot to close-up, so there's always something to read.
      if (copy1Ref.current) {
        const op = fadeWindow(p, -1, 0, 0.22, 0.3);
        copy1Ref.current.style.opacity = String(op);
        copy1Ref.current.style.transform = `translateY(${-p * 40}px)`;
      }
      if (copy2Ref.current) {
        const op = fadeWindow(p, 0.34, 0.42, 0.56, 0.64);
        copy2Ref.current.style.opacity = String(op);
        copy2Ref.current.style.transform = `translateY(${(0.48 - p) * 40}px)`;
      }
      if (copy3Ref.current) {
        const op = fadeWindow(p, 0.68, 0.76, 1.5, 1.6);
        copy3Ref.current.style.opacity = String(op);
        copy3Ref.current.style.transform = `translateY(${(0.82 - p) * 40}px)`;
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

    // While a pause is active, swallow the scroll input that's driving it
    // (wheel/trackpad + touch) so the page genuinely holds still for a
    // beat instead of just snapping back after drifting further.
    function blockIfLocked(e) {
      if (pauseRef.current.locked) {
        e.preventDefault();
      }
    }

    applyHeroVh();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', blockIfLocked, { passive: false });
    window.addEventListener('touchmove', blockIfLocked, { passive: false });
    update();
    const pauseState = pauseRef.current;
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', blockIfLocked);
      window.removeEventListener('touchmove', blockIfLocked);
      clearTimeout(pauseState.timer);
      document.documentElement.style.overflowY = '';
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll" style={{ height: `${heroVh}vh` }}>
      <div className="hero-sticky">
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

        <div ref={copy1Ref} className="hero-copy">
          <div className="hero-eyebrow">埼玉県久喜市 ／ 物流施設</div>
          <h1 className="hero-title">久喜LOGIC</h1>
          <p className="hero-sub">梁下5.5m、無柱の倉庫棟3,590坪が、久喜に竣工します。</p>
          <div className="hero-meta">
            <span><b>延床</b> 7,078.67㎡</span>
            <span><b>構造</b> S造 地上2階</span>
            <span><b>竣工前内覧会</b> 受付中</span>
          </div>
        </div>

        <div ref={copy2Ref} className="hero-copy" style={{ opacity: 0 }}>
          <div className="hero-eyebrow">FACILITY</div>
          <p className="hero-copy-line">
            梁下5.5m、床荷重1.5t/㎡。
            <br />
            荷を止めない、無柱の倉庫。
          </p>
        </div>

        <div ref={copy3Ref} className="hero-copy" style={{ opacity: 0 }}>
          <div className="hero-eyebrow">PRE-COMPLETION VIEWING</div>
          <p className="hero-copy-line">
            竣工前内覧会、受付中。
            <br />
            今だから見られる、無柱の広さを。
          </p>
        </div>

        <div ref={cueRef} className="hero-scrollcue">
          <span>スクロール</span>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
